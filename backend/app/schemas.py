from pydantic import BaseModel
from typing import List, Dict

class QuizSubmit(BaseModel):
    session_id: int

    # answer co dang ["id cau hoi", "dap an"]
    answers: Dict[str, str] 