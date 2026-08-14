import logging

from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
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

MAX_BODY_BYTES = 32 * 1024


@asynccontextmanager
async def lifespan(app: FastAPI):
    if settings.should_create_tables:
        async with async_engine.begin() as conn:
            await conn.run_sync(SQLModel.metadata.create_all)
    yield

# Khởi tạo backend

app = FastAPI(
    title="BKTI API",
    lifespan=lifespan,
    docs_url=None if settings.is_production else "/docs",
    redoc_url=None if settings.is_production else "/redoc",
    openapi_url=None if settings.is_production else "/openapi.json",
)
app.include_router(questions.router)
app.include_router(quiz.router)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


def _apply_security_headers(response):
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
    """Consume the ASGI body with a hard cap so missing Content-Length cannot fill RAM."""
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

    # 2. Cho request đi tiếp vào route
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
    return {"status": "ok"}


if not settings.is_production:
    @app.get("/test-db")
    async def test_db(db: AsyncSession = Depends(get_db)):
        return {"status": "ok"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=False,
    allow_methods=["GET", "POST", "HEAD", "OPTIONS"],
    allow_headers=["Content-Type", "Accept"],
    max_age=600,
)
app.add_middleware(SlowAPIMiddleware)
if settings.TRUST_PROXY:
    app.add_middleware(
        ProxyHeadersMiddleware,
        trusted_hosts=settings.FORWARDED_ALLOW_IPS,
    )
