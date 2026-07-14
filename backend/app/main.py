from fastapi import FastAPI, Depends
from sqlmodel import Session
from app.database import get_db, engine
from app.models import SQLModel
# from app.routers import users

# Khởi tạo backend
app = FastAPI(title="bkti")


@app.get("/")
def read_root():
    return {"message:" "Chào mừng đến với BKTI"}

@app.get("/test-db")
def test_db(db: Session = Depends(get_db)):
    return {"status:" "Kết nối PostgreSQL bằng SQLModel thành công!"}

# Khởi tạo database
SQLModel.metadata.create_all(engine)