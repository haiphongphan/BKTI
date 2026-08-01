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
    dimension_1_A = dimension_1_C = dimension_2_A = dimension_2_C = dimension_3_A = dimension_3_C = 0
    for str_q_id, user_ans in submission.answers.items():
        q_id = int(str_q_id)
        ans_id = int(user_ans)
        if q_id <= 6:
            if ans_id % 3 == 1:
                dimension_1_A += 1
            elif ans_id % 3 == 0:
                dimension_1_C += 1
        elif q_id <= 12:
            if ans_id % 3 == 1:
                dimension_2_A += 1
            elif ans_id % 3 == 0:
                dimension_2_C += 1
        else:
            if ans_id % 3 == 1:
                dimension_3_A += 1
            elif ans_id % 3 == 0:
                dimension_3_C += 1
    

    # F_G la nam giua
    # Tinh phase 1
    state_1 = "F_G"
    if dimension_1_A > 2:
        state_1 = "G"
    elif dimension_1_C > 2:
        state_1 = "F"
    elif dimension_1_A + dimension_1_C == 4: 
        state_1 = random.choice(['F', 'G', 'F_G'])

    # Tinh phase 2
    state_2 = "V_H"
    if dimension_2_A > 2:
        state_2 = "V"
    elif dimension_2_C > 2:
        state_2 = "H"
    elif dimension_2_A + dimension_2_C == 4: 
        state_2 = random.choice(['V', 'H', 'V_H'])   

    # Tinh phase 3
    state_3 = "C_M"
    if dimension_3_A > 2:
        state_3 = "C"
    elif dimension_3_C > 2:
        state_3 = "M"
    elif dimension_3_A + dimension_3_C == 4: 
        state_3 = random.choice(['C', 'M', 'C_M'])    

    personality: str
    if state_1 == "F_G" and state_2 == "V_H" and state_3 == "C_M":
        personality = "LMAO"
    else:
        if state_1 == "F_G":
            state_1 = random.choice(['F', 'G'])
        if state_2 == "V_H":
            state_2 = random.choice(['V', 'H'])
        if state_3 == "C_M":
            state_3 = random.choice(['C', 'M'])

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
        "dimension1_nguoi_im_lang": dimension_1_A / 6 * 100,
        "dimension1_nguoi_hay_noi": dimension_1_C / 6 * 100,
        "dimension2_vibecoder": dimension_2_A / 6 * 100,
        "dimension2_handmade": dimension_2_C / 6 * 100,
        "dimension3_chua_lanh": dimension_3_A / 6 * 100,
        "dimension3_mutant": dimension_3_C / 6 * 100
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