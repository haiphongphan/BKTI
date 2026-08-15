from pydantic import BaseModel
from typing import Dict

class QuizSubmit(BaseModel):
    # answer co dang ["id cau hoi", "dap an"]
    answers: Dict[str, str] 