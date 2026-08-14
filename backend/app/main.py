import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel.ext.asyncio.session import AsyncSession

# Import async_engine và get_db từ database đã nâng cấp async
from app.database import get_db, async_engine
from app.models import SQLModel
from app.routers import quiz, questions
from app.limiter import limiter, get_real_ip
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
    # Tái sử dụng hàm lấy IP chuẩn
    client_ip = get_real_ip(request)
    
    response = await call_next(request)
    
    # In ra log nổi bật nếu có request POST hoặc bị 429
    if request.method == "POST" or response.status_code == 429:
        logger.info(f"🌐 [CLIENT IP]: {client_ip} | {request.method} {request.url.path} | Status: {response.status_code}")
        
    return response

# Cấu hình Auto Ban
BAN_DURATION = 600       # Thời gian cấm: 10 phút (600 giây)
MAX_VIOLATIONS = 5       # Số lần 429 tối đa trước khi bị cấm
VIOLATION_WINDOW = 60    # Chỉ tính các lần 429 diễn ra trong vòng 60 giây

# Lưu lịch sử vi phạm: { ip: [timestamp_1, timestamp_2, ...] }
IP_VIOLATION_TIMESTAMPS = defaultdict(list)
TEMP_BANNED_IPS = {}

@app.middleware("http")
async def auto_ban_middleware(request: Request, call_next):
    # Lấy IP an toàn bằng hàm get_real_ip đã có
    client_ip = get_real_ip(request)
    now = time.time()

    # 1. Kiểm tra nếu IP đang trong thời gian bị cấm
    if client_ip in TEMP_BANNED_IPS:
        ban_until = TEMP_BANNED_IPS[client_ip]
        if now < ban_until:
            remaining = int(ban_until - now)
            return JSONResponse(
                status_code=403,
                content={
                    "detail": f"Bạn đã bị tạm khóa do spam request. Vui lòng thử lại sau {remaining} giây."
                }
            )
        else:
            # Hết hạn cấm -> xóa khỏi danh sách cấm và reset lịch sử vi phạm
            del TEMP_BANNED_IPS[client_ip]
            IP_VIOLATION_TIMESTAMPS.pop(client_ip, None)

    # 2. Cho request đi tiếp vào route
    response = await call_next(request)

    # 3. Nếu route trả về mã 429 (SlowAPI chặn), ghi nhận vi phạm
    if response.status_code == 429:
        # Lọc bỏ các mốc thời gian vi phạm đã quá 60 giây
        valid_timestamps = [
            t for t in IP_VIOLATION_TIMESTAMPS[client_ip] 
            if now - t < VIOLATION_WINDOW
        ]
        valid_timestamps.append(now)
        IP_VIOLATION_TIMESTAMPS[client_ip] = valid_timestamps

        # Nếu vi phạm đủ 5 lần trong 60 giây -> Ban 10 phút
        if len(valid_timestamps) >= MAX_VIOLATIONS:
            TEMP_BANNED_IPS[client_ip] = now + BAN_DURATION
            IP_VIOLATION_TIMESTAMPS.pop(client_ip, None)

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