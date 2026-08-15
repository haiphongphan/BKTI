import csv
from pathlib import Path
from sqlmodel import Session, create_engine, SQLModel, text
from app.models import Trait, Personality, Dimension, Question, Answer, User_ans
from app.config import settings

# Lấy đường dẫn trong file .env
DATABASE_URL = settings.DATABASE_URL

# Tạo engine
engine = create_engine(DATABASE_URL)
DATA_DIR = Path(__file__).resolve().parent / "data"

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
                    description=row["description"].strip(),
                    img_url=row["img_url"].strip(),
                    music_url=row["music_url"].strip() or None
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
    """TRUNCATE mọi bảng quiz. Nguy hiểm trên production — chỉ gọi từ ``__main__`` seed local."""
    print("--- Đang dọn dẹp toàn bộ dữ liệu cũ trong Database ---")

    with Session(engine) as session:
        # Một lệnh TRUNCATE: xóa hết + RESTART IDENTITY (sequence về 1)
        session.execute(
            text(
                "TRUNCATE TABLE answer, trait, question, dimension, personality, user_ans "
                "RESTART IDENTITY CASCADE;"
            )
        )
        session.commit()
    print(" Đã dọn dẹp database sạch sẽ!")


def sync_id_sequences():
    """Sau khi insert ID thủ công từ CSV, đồng bộ sequence = MAX(id)."""
    # Chỉ các bảng seed bằng ID tường minh trong CSV
    tables = ("dimension", "question", "answer")
    with Session(engine) as session:
        for table in tables:
            session.execute(
                text(
                    f"SELECT setval("
                    f"pg_get_serial_sequence('{table}', 'id'), "
                    f"COALESCE((SELECT MAX(id) FROM {table}), 1), "
                    f"(SELECT MAX(id) FROM {table}) IS NOT NULL)"
                )
            )
        session.commit()
    print(" Đã đồng bộ sequence ID!")
#Test 
def seed_mock_user_answers():
    """Tự động tạo một số kết quả khảo sát mẫu để bảng xếp hạng hoạt động ngay"""
    print("--- Đang tạo dữ liệu xếp hạng mẫu ---")
    import random
    
    # Danh sách các mã tính cách hợp lệ từ personality.csv
    personalities = ["FVC", "FHC", "FVM", "FHM", "GVC", "GHC", "GVM", "GHM", "LMAO", "NSFW"]
    
    with Session(engine) as session:
        mock_answers = []
        # Tạo 30 lượt làm bài trắc nghiệm ngẫu nhiên
        for _ in range(30):
            p_code = random.choice(personalities)
            mock_ans = User_ans(p_code=p_code)
            mock_answers.append(mock_ans)
        session.add_all(mock_answers)
        session.commit()
    print(" Đã tạo dữ liệu xếp hạng mẫu thành công!")

if __name__ == "__main__":
    # Tạo bảng trong Postgres nếu chưa tồn tại
    SQLModel.metadata.create_all(engine)
    clear_all_tables()
    
    import_personality_csv(DATA_DIR / "personality.csv")
    import_dimension_csv(DATA_DIR / "dimension.csv")
    import_question_csv(DATA_DIR / "question.csv")
    import_traits_csv(DATA_DIR / "traits.csv")
    import_answer_csv(DATA_DIR / "answer.csv")

    sync_id_sequences()

    # Tự động nạp dữ liệu xếp hạng mẫu
    seed_mock_user_answers()