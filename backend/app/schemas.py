"""Validate payload nộp bài — chặn dict khổng lồ / id không phải số.

Lỗ hổng đã vá:
- ``max_length`` trên dict: không nhận hàng nghìn key (CPU + RAM + ghi DB).
- Key/value phải là chữ số, độ dài giới hạn: tránh injection/chuỗi rác trước
  khi ``int()`` ở router.
"""

from pydantic import BaseModel, Field, field_validator

MAX_QUIZ_ANSWERS = 30


class QuizSubmit(BaseModel):
    """Body ``POST /quiz/submit``. Tối đa 30 cặp câu-trả lời, id chỉ gồm digit."""

    answers: dict[str, str] = Field(..., min_length=1, max_length=MAX_QUIZ_ANSWERS)

    @field_validator("answers")
    @classmethod
    def validate_answer_entries(cls, value: dict[str, str]) -> dict[str, str]:
        """Từ chối question/answer id không phải số hoặc quá dài."""
        for question_id, answer_id in value.items():
            if not question_id.isdigit() or len(question_id) > 4:
                raise ValueError("Invalid question id")
            if not answer_id.isdigit() or len(answer_id) > 6:
                raise ValueError("Invalid answer id")
        return value
