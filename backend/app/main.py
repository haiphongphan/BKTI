import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel.ext.asyncio.session import AsyncSession

# Import async_engine và get_db từ database đã nâng cấp async
from app.database import get_db, async_engine
from app.models import SQLModel
from app.routers import quiz, questions

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