from typing import Optional
from sqlmodel import SQLModel, Field


class Personality(SQLModel, table = True):
    __tablename__ = "personality"
    code: str = Field(primary_key=True)
    name: str = Field()
    description: str = Field()
    img_url: str = Field()
    music_url: Optional[str] = None

class User_ans(SQLModel, table = True):
    __tablename__ = "user_ans"
    p_code: str = Field(foreign_key="personality.code", ondelete="CASCADE")
    user_ans_id: Optional[int] = Field(default=None, primary_key=True)

class Dimension(SQLModel, table = True):
    __tablename__ = "dimension"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field()

class Question(SQLModel, table = True):
    __tablename__ = "question"
    id: Optional[int] = Field(default=None, primary_key=True)
    content: str = Field()
    dimension_id: int = Field(foreign_key="dimension.id", ondelete="CASCADE")

class Trait(SQLModel, table = True):
    __tablename__ = "trait"
    code: str = Field(primary_key=True)
    name: str = Field()
    description: str = Field()
    dimension_id: int = Field(foreign_key="dimension.id", ondelete="CASCADE")

class Answer(SQLModel, table = True):
    __tablename__ = "answer"
    id: Optional[int] = Field(default=None, primary_key=True)
    content: str = Field()
    trait_code: str = Field(foreign_key="trait.code", ondelete="CASCADE")
    question_id: int = Field(foreign_key="question.id", ondelete="CASCADE")
