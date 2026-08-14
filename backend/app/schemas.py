from pydantic import BaseModel, Field, field_validator

MAX_QUIZ_ANSWERS = 30


class QuizSubmit(BaseModel):
    answers: dict[str, str] = Field(..., min_length=1, max_length=MAX_QUIZ_ANSWERS)

    @field_validator("answers")
    @classmethod
    def validate_answer_entries(cls, value: dict[str, str]) -> dict[str, str]:
        for question_id, answer_id in value.items():
            if not question_id.isdigit() or len(question_id) > 4:
                raise ValueError("Invalid question id")
            if not answer_id.isdigit() or len(answer_id) > 6:
                raise ValueError("Invalid answer id")
        return value
