import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel.ext.asyncio.session import AsyncSession

# Import async_engine và get_db từ database đã nâng cấp async
from app.database import get_db, async_engine
from app.models import SQLModel
from app.routers import quiz, questions
from app.limiter import limiter
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
app.include_router(questions.router)
app.include_router(quiz.router)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Ghi log ra màn hình console của Render để bạn đọc debug
logger = logging.getLogger("uvicorn.error")

@app.middleware("http")
async def log_real_client_ip(request: Request, call_next):
    # Lấy IP thật
    forwarded = request.headers.get("X-Forwarded-For")
    client_ip = forwarded.split(",")[0].strip() if forwarded else (request.client.host if request.client else "unknown")
    
    response = await call_next(request)
    
    # In ra log nổi bật nếu có request POST hoặc bị 429
    if request.method == "POST" or response.status_code == 429:
        logger.info(f"🌐 [CLIENT IP]: {client_ip} | {request.method} {request.url.path} | Status: {response.status_code}")
        
    return response

IP_VIOLATIONS = defaultdict(int)
TEMP_BANNED_IPS = {}

@app.middleware("http")
async def auto_ban_middleware(request: Request, call_next):
    client_ip = request.headers.get("X-Forwarded-For", "").split(",")[0].strip() or request.client.host
    now = time.time()

    # Kiểm tra xem IP có đang trong thời gian bị phạt cấm không (10 phút)
    if client_ip in TEMP_BANNED_IPS:
        if now < TEMP_BANNED_IPS[client_ip]:
            return JSONResponse(
                status_code=403,
                content={"detail": "Bạn đã bị tạm khóa do gửi quá nhiều request. Vui lòng thử lại sau 10 phút."}
            )
        else:
            del TEMP_BANNED_IPS[client_ip]
            IP_VIOLATIONS[client_ip] = 0

    response = await call_next(request)

    # Nếu request trả về 429 (vượt rate limit), tăng điểm vi phạm
    if response.status_code == 429:
        IP_VIOLATIONS[client_ip] += 1
        # Nếu vượt rate limit quá 5 lần -> Khóa tạm thời 10 phút (600s)
        if IP_VIOLATIONS[client_ip] >= 5:
            TEMP_BANNED_IPS[client_ip] = now + 600

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


@app.get("/test-db")
async def test_db(db: AsyncSession = Depends(get_db)):
    return {"status": "Kết nối PostgreSQL bằng Async SQLModel thành công!"}

# Khai báo danh sách các địa chỉ fe được phép gọi vào be
origins = [
    "http://localhost:5173",
    "https://bkti-flax.vercel.app",
    "https://bkti.id.vn"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Cho phép tất cả các lệnh GET, POST, PUT, DELETE...
    allow_headers=["*"], # Cho phép tất cả các loại dữ liệu truyền lên
)