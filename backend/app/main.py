from fastapi import FastAPI, Depends, APIRouter
from sqlmodel import Session, select
from app.database import get_db, engine
from app.models import SQLModel, Question
from app.routers import quiz, questions

# Khởi tạo backend
app = FastAPI(title="bkti")
app.include_router(questions.router)

@app.get("/")
def read_root():
    return {"message:" "Chào mừng đến với BKTI"}

@app.get("/test-db")
def test_db(db: Session = Depends(get_db)):
    return {"status:" "Kết nối PostgreSQL bằng SQLModel thành công!"}

# Khởi tạo database
SQLModel.metadata.create_all(engine)

app.include_router(quiz.router)