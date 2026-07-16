from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Khai báo các biến muốn đọc từ file .env và kiểu dữ liệu bắt buộc của nó
    DATABASE_URL: str
    
    # Cấu hình để Pydantic biết phải tìm file .env ở đâu
    model_config = SettingsConfigDict(
        env_file="app/.env", # gọi file .env tại thư mục đang chạy
        env_file_encoding="utf-8",
        extra="ignore" # Bỏ qua nếu trong file .env có các biến thừa khác
    )

settings = Settings()