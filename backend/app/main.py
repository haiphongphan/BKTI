"""Entry FastAPI: giới hạn body, CORS whitelist, ẩn docs, header, ban, proxy.

Lỗ hổng đã vá (tóm tắt):
- Body cap 32 KiB kể cả khi thiếu ``Content-Length`` (đọc từng chunk ASGI).
- CORS chỉ origin env; method/header hẹp; ``credentials=False``.
- ``/docs`` ``/redoc`` ``/openapi.json`` tắt trên production.
- ``/test-db`` chỉ mount khi không production (tránh lộ health DB).
- Header chống clickjacking/MIME sniff; HSTS khi production.
- 500 không leak traceback ra client.
- ``ProxyHeadersMiddleware`` chỉ khi ``TRUST_PROXY`` — không tin XFF mặc định.
"""

import logging

from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlmodel.ext.asyncio.session import AsyncSession
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import get_db, async_engine
from app.models import SQLModel
from app.routers import quiz, questions
from app.limiter import limiter, get_client_ip
from app.ban import ban_store

logger = logging.getLogger("uvicorn.error")

MAX_BODY_BYTES = 32 * 1024  # chặn POST khổng lồ làm đầy RAM worker


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: chỉ ``create_all`` khi ``should_create_tables`` (không prod mặc định)."""
    if settings.should_create_tables:
        async with async_engine.begin() as conn:
            await conn.run_sync(SQLModel.metadata.create_all)
    try:
        async with async_engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        logger.info("Database connection OK")
    except Exception:
        logger.exception(
            "Database connection failed. Dùng URI pooler Supabase "
            "(*.pooler.supabase.com:6543), không dùng Direct IPv6."
        )
    yield

# Khởi tạo backend

app = FastAPI(
    title="BKTI API",
    lifespan=lifespan,
    # Ẩn Swagger/ReDoc/OpenAPI trên production — tránh lộ schema + thử endpoint.
    docs_url=None if settings.is_production else "/docs",
    redoc_url=None if settings.is_production else "/redoc",
    openapi_url=None if settings.is_production else "/openapi.json",
)

app.include_router(questions.router)
app.include_router(quiz.router)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


def _apply_security_headers(response):
    """Gắn header chống clickjack / MIME sniff / HSTS. Gọi cả trên response lỗi sớm."""
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    response.headers["X-DNS-Prefetch-Control"] = "off"
    if settings.is_production:
        response.headers["Strict-Transport-Security"] = (
            "max-age=31536000; includeSubDomains"
        )
    return response


async def _read_body_capped(request: Request) -> bytes | None:
    """Đọc body theo chunk, cắt ở ``MAX_BODY_BYTES``.

    ``Content-Length`` có thể thiếu hoặc giả. Nếu chỉ check header rồi
    ``await request.body()``, attacker gửi stream không giới hạn → OOM.
    Trả ``None`` khi vượt cap.
    """
    chunks: list[bytes] = []
    total = 0
    while True:
        message = await request.receive()
        if message["type"] != "http.request":
            break
        chunk = message.get("body", b"")
        total += len(chunk)
        if total > MAX_BODY_BYTES:
            return None
        if chunk:
            chunks.append(chunk)
        if not message.get("more_body"):
            break
    return b"".join(chunks)


@app.middleware("http")
async def security_and_ban_middleware(request: Request, call_next):
    """Cap body → chặn IP đang ban → ghi 429 vào BanStore → luôn gắn security header.

    Phải ``return`` mọi nhánh (413/403/response). Middleware thiếu return từng
    làm response rơi và NameError khi gọi helper chưa định nghĩa.
    """
    if request.method in {"POST", "PUT", "PATCH"}:
        content_length = request.headers.get("content-length")
        # kiểm tra để ban
        if content_length:
            try:
                if int(content_length) > MAX_BODY_BYTES:
                    return _apply_security_headers(
                        JSONResponse(status_code=413, content={"detail": "Payload quá lớn."})
                    )
            except ValueError:
                return _apply_security_headers(
                    JSONResponse(status_code=400, content={"detail": "Content-Length không hợp lệ."})
                )

        body = await _read_body_capped(request)
        if body is None:
            return _apply_security_headers(
                JSONResponse(status_code=413, content={"detail": "Payload quá lớn."})
            )
        #log 
        async def receive():
            return {"type": "http.request", "body": body, "more_body": False}
        
        # Lấy real IP
        request._receive = receive
        request._body = body

    # Kiểm tra nếu IP đang bị cấm
    client_ip = get_client_ip(request)
    remaining = ban_store.remaining_ban_seconds(client_ip)
    if remaining is not None:
        return _apply_security_headers(
            JSONResponse(
                status_code=403,
                content={
                    "detail": (
                        f"Bạn đã bị tạm khóa do spam request. "
                        f"Vui lòng thử lại sau {remaining} giây."
                    )
                },
            )
        )

    # 3.2. Thực thi request
    response = await call_next(request)

    #3. Nếu route trả về mã 429 (SlowAPI chặn), ghi nhận vi phạm
    if request.method == "POST" or response.status_code == 429:
        logger.info(
            "client_ip=%s method=%s path=%s status=%s",
            client_ip,
            request.method,
            request.url.path,
            response.status_code,
        )

    if response.status_code == 429:
        # Lọc bỏ các mốc thời gian vi phạm đã quá 60 giây
        ban_store.record_violation(client_ip)

    # Nếu vi phạm đủ 5 lần trong 60 giây -> Ban 10 phút
    return _apply_security_headers(response)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """500 generic cho client; traceback chỉ ghi log. Không lộ stack/SQL."""
    logger.exception("Unhandled error at %s", request.url.path)
    return _apply_security_headers(
        JSONResponse(
            status_code=500,
            content={"detail": "Máy chủ đang bận hoặc có lỗi xảy ra. Vui lòng thử lại sau!"},
        )
    )


@app.get("/")
@app.head("/")
async def read_root():
    return {"message": "Chào mừng đến với BKTI"}


@app.get("/health")
@limiter.exempt
async def health():
    """Probe Render/load balancer. Exempt limiter để health check không tự 429."""
    return {"status": "ok"}


if not settings.is_production:
    @app.get("/test-db")
    async def test_db(db: AsyncSession = Depends(get_db)):
        """Chỉ dev: ping DB. Production không mount — tránh lộ trạng thái nội bộ."""
        return {"status": "ok"}

# CORS whitelist từ env. ``X-Client-ID`` chỉ để frontend gửi UUID localStorage;
# limiter KHÔNG dùng header này làm key (tránh xoay ID né quota).
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=False,
    allow_methods=["GET", "POST", "HEAD", "OPTIONS"],
    allow_headers=["Content-Type", "Accept", "X-Client-ID"],
    max_age=600,
)
app.add_middleware(SlowAPIMiddleware)
if settings.TRUST_PROXY:
    # Chỉ tin X-Forwarded-* khi đứng sau Render. Không bật trên origin lộ thẳng.
    app.add_middleware(
        ProxyHeadersMiddleware,
        trusted_hosts=settings.FORWARDED_ALLOW_IPS,
    )
