import random
from typing import List
from fastapi import APIRouter, Depends, Request
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from pydantic import BaseModel
from app.database import get_db
from app.models import Question, Answer
from app.limiter import limiter

router = APIRouter(prefix="/questions", tags=["questions"])

# Khuôn để return answer
class AnswerResponse(BaseModel):
    id: int
    content: str
    
class QuestionResponse(BaseModel):
    id: int
    content: str
    answers: List[AnswerResponse] = []

# ── BIẾN CACHE LƯU CÂU HỎI TRÊN RAM ──
QUESTIONS_CACHE: List[QuestionResponse] = []


@router.get("", response_model=List[QuestionResponse])
@limiter.limit("30/minute")
async def get_questions(request: Request, db: AsyncSession = Depends(get_db)):
    global QUESTIONS_CACHE

    # 1. Nếu chưa có Cache, chỉ query DB đúng 2 câu lệnh duy nhất để gộp dữ liệu
    if not QUESTIONS_CACHE:
        # Query 1: Lấy toàn bộ Question
        q_stmt = select(Question)
        q_res = await db.exec(q_stmt)
        questions = q_res.all()

        # Query 2: Lấy toàn bộ Answer trong 1 câu lệnh (Giải quyết triệt để N+1)
        a_stmt = select(Answer)
        a_res = await db.exec(a_stmt)
        answers = a_res.all()

        # Nhóm Answer theo question_id trên RAM
        answers_by_q = {}
        for a in answers:
            answers_by_q.setdefault(a.question_id, []).append(
                AnswerResponse(id=a.id, content=a.content)
            )

        # Xây dựng danh sách Cache
        cached_list = []
        for q in questions:
            q_ans = answers_by_q.get(q.id, [])
            cached_list.append(
                QuestionResponse(id=q.id, content=q.content, answers=q_ans)
            )

        QUESTIONS_CACHE = cached_list

    # 2. Xáo trộn câu hỏi và đáp án hoàn toàn trên RAM (Tốc độ phản hồi ~1ms, KHÔNG tốn query DB)
    result = []
    shuffled_questions = list(QUESTIONS_CACHE)
    random.shuffle(shuffled_questions)

    for item in shuffled_questions:
        shuffled_answers = list(item.answers)
        random.shuffle(shuffled_answers)
        result.append(
            QuestionResponse(
                id=item.id,
                content=item.content,
                answers=shuffled_answers
            )
        )

    return result