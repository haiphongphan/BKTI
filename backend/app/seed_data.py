import csv
from sqlmodel import Session, create_engine, SQLModel, text
# Import các Model từ file models.py của bạn
from models import Trait, Personality, Dimension, Question, Answer
from config import settings

# Lấy đường dẫn trong file .env
DATABASE_URL = settings.DATABASE_URL

# Tạo engine
engine = create_engine(DATABASE_URL)

BATCH_SIZE = 5000  # Cứ 5000 dòng thì commit 1 lần để tránh tràn RAM

def import_personality_csv(file_path: str):
    """Import Personality data"""
    print("--- Đang import bảng Personality ---")
    with open(file_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        with Session(engine) as session:
            personalities = []
            for row in reader:
                personality = Personality(
                    code=row["code"].strip(),
                    name=row["name"].strip(),
                    description=row["description"].strip()
                )
                personalities.append(personality)
            session.add_all(personalities)
            session.commit()
    print(" Đã import thành công bảng Personality!")

def import_dimension_csv(file_path: str):
    print("--- Đang import bảng Dimension ---")
    with open(file_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        with Session(engine) as session:
            dimensions = []
            for row in reader:
                dimension = Dimension(
                    id=row["id"].strip(),
                    name=row["name"].strip()
                )
                dimensions.append(dimension)
            session.add_all(dimensions)
            session.commit()
    print(" Đã import thành công bảng Dimension!")

def import_question_csv(file_path: str):
    print("--- Đang import bảng Question ---")
    with open(file_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        with Session(engine) as session:
            questions = []
            for row in reader:
                question = Question(
                    id=row["id"].strip(),
                    content=row["content"].strip(),
                    dimension_id=int(row["dimension_id"])
                )
                questions.append(question)
            session.add_all(questions)
            session.commit()
    print(" Đã import thành công bảng Question!")

def import_answer_csv(file_path: str):
    print("--- Đang import bảng Answer ---")
    with open(file_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        with Session(engine) as session:
            answers = []
            for row in reader:
                answer = Answer(
                    id=row["id"].strip(),
                    content=row["content"].strip(),
                    trait_code=row["trait_code"].strip(),
                    question_id=int(row["question_id"])
                )
                answers.append(answer)
            session.add_all(answers)
            session.commit()
    print(" Đã import thành công bảng Dimension!")

def import_traits_csv(file_path: str):
    """Import dữ liệu vào bảng Trait trước"""
    print("--- Đang import bảng Trait ---")
    with open(file_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        with Session(engine) as session:
            traits = []
            for row in reader:
                trait = Trait(
                    code=row["code"].strip(),
                    name=row["name"].strip(),
                    description=row["description"].strip(),
                    dimension_id=int(row["dimension_id"])
                )
                traits.append(trait)
            session.add_all(traits)
            session.commit()
    print(" Đã import thành công bảng Trait!")

def clear_all_tables():
    """Xóa sạch toàn bộ dữ liệu của tất cả các bảng trong database"""
    print("--- 🧹 Đang dọn dẹp toàn bộ dữ liệu cũ trong Database ---")
    
    tables = [
        "answer", 
        "trait", 
        "question", 
        "dimension", 
        "personality"
    ]
    
    with Session(engine) as session:
        for table in tables:
            try:
                # RESTART IDENTITY giúp reset các khóa tự tăng (ID) về lại số 1
                session.exec(text(f"TRUNCATE TABLE {table} RESTART IDENTITY CASCADE;"))
            except Exception as e:
                # Thay vì dùng 'pass', hãy in ra để xem nếu có lỗi thật sự xảy ra
                # (Ví dụ: bảng chưa được khởi tạo thì in ra để biết)
                print(f"⚠️ Lưu ý: Không thể dọn dẹp bảng {table} (Có thể bảng chưa tồn tại)")
        session.commit()
    print(" Đã dọn dẹp database sạch sẽ!")

if __name__ == "__main__":
    # Tạo bảng trong Postgres nếu chưa tồn tại
    SQLModel.metadata.create_all(engine)
    clear_all_tables()
    
    import_personality_csv("app/data/personality.csv")
    import_dimension_csv("app/data/dimension.csv")
    import_question_csv("app/data/question.csv")
    import_traits_csv("app/data/traits.csv")
    import_answer_csv("app/data/answer.csv")