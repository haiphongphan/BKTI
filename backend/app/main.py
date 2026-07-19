from fastapi import FastAPI, Depends, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from app.database import get_db, engine
from app.models import SQLModel, Question
from app.routers import quiz, questions

# Khởi tạo backend
app = FastAPI(title="bkti")
app.include_router(questions.router)

@app.get("/")
def read_root():
    return {"message": "Chào mừng đến với BKTI"}

@app.get("/test-db")
def test_db(db: Session = Depends(get_db)):
    return {"status": "Kết nối PostgreSQL bằng SQLModel thành công!"}

# Khởi tạo database
SQLModel.metadata.create_all(engine)

app.include_router(quiz.router)

# Khai báo danh sách các địa chỉ fe được phép gọi vào be
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5500",
    "*", # Để test, xóa khi public
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Cho phép tất cả các lệnh GET, POST, PUT, DELETE...
    allow_headers=["*"], # Cho phép tất cả các loại dữ liệu truyền lên
)