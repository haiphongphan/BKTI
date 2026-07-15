from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.database import get_db, engine
from app.models import Question, SQLModel

router = APIRouter(prefix = "/questions", tags = ["questions"])

@router.get("")
def get_questions(db: Session = Depends(get_db)):
    questions = select(Question)
    return db.exec(questions).all()