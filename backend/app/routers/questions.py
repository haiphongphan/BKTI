from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.database import get_db, engine
from app.models import Question, Answer
from pydantic import BaseModel
from typing import List
import random

router = APIRouter(prefix = "/questions", tags = ["questions"])

# Khuôn để return answer
class AnswerResponse(BaseModel):
    id: int
    content: str
    
class QuestionResponse(BaseModel):
    id: int
    content: str
    answers: List[AnswerResponse] = []

@router.get("", response_model=List[QuestionResponse])
def get_questions(db: Session = Depends(get_db)):
    # all_questions = db.exec(select(Question)).all()
    # all_answers = db.exec(select(Answer)).all()

    # result = []
    # for q in all_questions:
    #     q_answer = [AnswerResponse(id=a.id, content=a.content) for a in all_answers if a.question_id == q.id]
    #     result.append(QuestionResponse(id=q.id, content=q.content, answers=q_answer))
    
    # return result
    questions = db.exec(select(Question)).all()
    questions_list = list(questions)
    random.shuffle(questions_list)

    result = []
    for q in questions_list:
        answers = db.exec(select(Answer).where(Answer.question_id == q.id)).all()
        answers_list = list(answers)
        random.shuffle(answers_list)
        q_answer = [AnswerResponse(id=a.id, content=a.content) for a in answers_list]

        result.append(QuestionResponse(id=q.id, content=q.content, answers=q_answer))
    return result