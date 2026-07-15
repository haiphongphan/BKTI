import csv
from sqlmodel import Session, create_engine, SQLModel
# Import các Model từ file models.py của bạn
from models import Trait, Session as UserSession, User_ans 
from .config import settings

# Lấy đường dẫn trong file .env
DATABASE_URL = settings.DATABASE_URL

# Tạo engine
engine = create_engine(DATABASE_URL, echo=True)

BATCH_SIZE = 5000  # Cứ 5000 dòng thì commit 1 lần để tránh tràn RAM

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



if __name__ == "__main__":
    # Tạo bảng trong Postgres nếu chưa tồn tại
    SQLModel.metadata.create_all(engine)
    
    import_traits_csv("traits.csv")