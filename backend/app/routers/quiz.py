from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, func
from app.database import get_db
from app.models import User_ans, Personality
from app.schemas import QuizSubmit
import random

router = APIRouter(prefix="/quiz", tags=["Quiz"])

@router.post("/submit", status_code=status.HTTP_201_CREATED)
def submit(submission: QuizSubmit, db: Session = Depends(get_db)):
    # A là nghiêng trái, C là nghiêng phải, B là ở giữa (Dựa vào sheet câu hỏi)
    dimension_1_A = dimension_1_B = dimension_2_A = dimension_2_B = dimension_3_A = dimension_3_B = 0
    personality = "NOT"
    for str_q_id, user_ans in submission.answers.items():
        q_id = int(str_q_id)
        ans_id = int(user_ans)
        if q_id == 13 and ans_id == 99:
            personality = "LMAO"
        elif q_id <= 7:
            if ans_id % 2 == 1:
                dimension_1_A += 1
            elif ans_id % 2 == 0:
                dimension_1_B += 1
        elif q_id <= 14:
            if ans_id % 2 == 1:
                dimension_2_A += 1
            elif ans_id % 2 == 0:
                dimension_2_B += 1
        else:
            if ans_id % 2 == 1:
                dimension_3_A += 1
            elif ans_id % 2 == 0:
                dimension_3_B += 1
    

    # F_G la nam giua
    # Tinh phase 1
    state_1 = "G" if dimension_1_A > dimension_1_B else "F"

    # Tinh phase 2
    state_2 = "V" if dimension_2_A > dimension_2_B else "H"

    # Tinh phase 3
    state_3 = "C" if dimension_3_A > dimension_3_B else "M"

    if personality == "NOT":
        personality = state_1 + state_2 + state_3

    result_db = User_ans(p_code=personality)
    db.add(result_db)
    db.commit()
    db.refresh(result_db)

    # Tìm thông tin của personality đó
    statement = select(Personality).where(Personality.code == personality)
    existing_personality = db.exec(statement=statement).first()


    return {
        "message": "Nộp bài thành công!",
        "code": existing_personality.code,
        "name": existing_personality.name,
        "description": existing_personality.description,
        "image_url": existing_personality.img_url,
        "dimension1_nguoi_im_lang": dimension_1_A / 6 * 100,
        "dimension1_nguoi_hay_noi": dimension_1_B / 6 * 100,
        "dimension2_vibecoder": dimension_2_A / 6 * 100,
        "dimension2_handmade": dimension_2_B / 6 * 100,
        "dimension3_chua_lanh": dimension_3_A / 6 * 100,
        "dimension3_mutant": dimension_3_B / 6 * 100
    }


@router.get("/ranking")
def ranking(db: Session = Depends(get_db)):
    rank = (
        select(User_ans.p_code, Personality.name, Personality.description, func.count())
        .join(Personality, User_ans.p_code == Personality.code)
        .group_by(User_ans.p_code, Personality.name, Personality.description)
        .order_by(func.count().desc())
    )

    result = db.exec(rank).all()

    total_count = sum(res[3] for res in result)

    return {
        "message": "Ranking hiện tại",
        "ranking": [
            {
                "code": res[0], 
                "name": res[1],
                "description": res[2],
                "count": res[3], 
                "percentage": round((res[3] / total_count) * 100, 2) if total_count > 0 else 0,
                "rank": i   
            } for i, res in enumerate(result, start = 1)
        ]
    }   