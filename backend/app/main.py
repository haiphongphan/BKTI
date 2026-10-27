import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel.ext.asyncio.session import AsyncSession

# Import async_engine và get_db từ database đã nâng cấp async
from app.database import get_db, async_engine
from app.models import SQLModel
from app.routers import quiz, questions
from app.limiter import limiter, get_identifier
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

import logging
from fastapi.responses import JSONResponse
import time
from collections import defaultdict


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Tạo bảng bất đồng bộ khi ứng dụng vừa khởi động (chỉ chạy 1 lần)
    async with async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    yield

# Khởi tạo backend

IS_PRODUCTION = os.getenv("ENVIRONMENT") == "production"
app = FastAPI(title="BKTI API", lifespan=lifespan,
    docs_url=None if IS_PRODUCTION else "/docs",
    redoc_url=None if IS_PRODUCTION else "/redoc",
    openapi_url=None if IS_PRODUCTION else "/openapi.json",
)

# Khai báo danh sách các địa chỉ fe được phép gọi vào be
origins = [
    "http://localhost:5173",
    "https://bkti-flax.vercel.app",
    "https://bkti.id.vn",
    "https://bkti-test-deploy.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Cho phép tất cả các lệnh GET, POST, PUT, DELETE...
    allow_headers=["*"], # Cho phép tất cả các loại dữ liệu truyền lên
)

app.include_router(questions.router)
app.include_router(quiz.router)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Ghi log ra màn hình console của Render để bạn đọc debug
logger = logging.getLogger("uvicorn.error")

# Cấu hình Auto Ban
BAN_DURATION = 600       # Thời gian cấm: 10 phút (600 giây)
MAX_VIOLATIONS = 5       # Số lần 429 tối đa trước khi bị cấm
VIOLATION_WINDOW = 60    # Chỉ tính các lần 429 diễn ra trong vòng 60 giây

# Lưu lịch sử vi phạm: { ip: [timestamp_1, timestamp_2, ...] }
IP_VIOLATION_TIMESTAMPS = defaultdict(list)
TEMP_BANNED_IPS = {}


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

@app.middleware("http")
async def auto_ban_and_log_middleware(request: Request, call_next):
    client_id = get_identifier(request)
    now = time.time()

    # 3.1. Kiểm tra nếu client đang bị tạm cấm
    if client_id in TEMP_BANNED_IPS:
        ban_until = TEMP_BANNED_IPS[client_id]
        if now < ban_until:
            remaining = int(ban_until - now)
            return JSONResponse(
                status_code=403,
                content={
                    "detail": f"Thiết bị của bạn đã bị tạm khóa do thao tác quá nhanh. Vui lòng thử lại sau {remaining} giây."
                }
            )
        else:
            del TEMP_BANNED_IPS[client_id]
            IP_VIOLATION_TIMESTAMPS.pop(client_id, None)

    # 3.2. Thực thi request
    response = await call_next(request)

    # 3.3. Ghi log nếu là POST hoặc bị dính 429
    if request.method == "POST" or response.status_code == 429:
        logger.info(f"🌐 [CLIENT]: {client_id} | {request.method} {request.url.path} | Status: {response.status_code}")

    # 3.4. Xử lý vi phạm rate limit
    if response.status_code == 429:
        valid_timestamps = [
            t for t in IP_VIOLATION_TIMESTAMPS[client_id] 
            if now - t < VIOLATION_WINDOW
        ]
        valid_timestamps.append(now)
        IP_VIOLATION_TIMESTAMPS[client_id] = valid_timestamps

        if len(valid_timestamps) >= MAX_VIOLATIONS:
            TEMP_BANNED_IPS[client_id] = now + BAN_DURATION
            IP_VIOLATION_TIMESTAMPS.pop(client_id, None)
            logger.warning(f"🚫 [BANNED]: {client_id} bị khóa trong {BAN_DURATION} giây.")

    return response

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Lỗi không xác định tại {request.url.path}: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Máy chủ đang bận hoặc có lỗi xảy ra. Vui lòng thử lại sau!"},
    )

@app.get("/")
@app.head("/")
async def read_root():
    return {"message": "Chào mừng đến với BKTI"}

@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.get("/test-db")
async def test_db(db: AsyncSession = Depends(get_db)):
    return {"status": "Kết nối PostgreSQL bằng Async SQLModel thành công!"}

