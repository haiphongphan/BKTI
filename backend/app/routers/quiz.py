from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.database import get_db
from app.models import User_ans
from app.schemas import QuizSubmit
import random

router = APIRouter(prefix="/quiz", tags=["Quiz"])

@router.post("/submit", status_code=status.HTTP_201_CREATED)
def submit(submission: QuizSubmit, db: Session = Depends(get_db)):
    # A là nghiêng trái, C là nghiêng phải, B là ở giữa (Dựa vào sheet câu hỏi)
    dimension_1_A = dimension_1_C = dimension_2_A = dimension_2_C = dimension_3_A = dimension_3_C = 0
    for str_q_id, user_ans in submission.answers.items():
        q_id = int(str_q_id)
        if q_id <= 6:
            if user_ans == 'A':
                dimension_1_A += 1
            elif user_ans == 'C':
                dimension_1_C += 1
        elif q_id <= 12:
            if user_ans == 'A':
                dimension_2_A += 1
            elif user_ans == 'C':
                dimension_2_C += 1
        else:
            if user_ans == 'A':
                dimension_3_A += 1
            elif user_ans == 'C':
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

    result_db = User_ans(session_id=submission.session_id, p_code=personality)
    db.add(result_db)
    db.commit()
    db.refresh(result_db)

    return {
        "message": "Nộp bài thành công!",
        "personality": personality,
    }
     
