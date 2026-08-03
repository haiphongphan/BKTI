# pyrefly: ignore [missing-import]
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent
ENV_FILE_PATH = BASE_DIR / ".env"

class Settings(BaseSettings):
    DATABASE_URL: str

    model_config = SettingsConfigDict(
        env_file=ENV_FILE_PATH, # gọi file .env tại thư mục đang chạy
        env_file_encoding="utf-8",
        extra="ignore" # Bỏ qua nếu trong file .env có các biến thừa khác
    )

settings = Settings()