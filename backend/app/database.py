import os
from dotenv import load_dotenv
from sqlmodel import create_engine, Session

# Quét file .env
load_dotenv()

# Lấy đường dẫn trong file .env
DATABASE_URL = os.getenv("DATABASE_URL")

# Tạo engine
engine = create_engine(DATABASE_URL, echo=True)

def get_db(): 
    with Session(engine) as session:
        yield session