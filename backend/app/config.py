"""Cấu hình runtime. Các flag bảo mật đọc từ env, không hard-code origin/proxy.

Lỗ hổng đã vá:
- CORS lấy từ ``CORS_ORIGINS`` (whitelist), không ``allow_origins=["*"]``.
- ``TRUST_PROXY`` mặc định tắt: không tin ``X-Forwarded-*`` trừ khi deploy sau
  Render/proxy và bật tường minh. Tránh spoof IP khi app lộ thẳng internet.
- ``AUTO_CREATE_TABLES`` mặc định tắt trên production: không ``create_all``
  lúc startup (tránh đụng schema production).
- ``extra="ignore"``: env lạ không làm crash, cũng không lọt vào Settings.
"""

# pyrefly: ignore [missing-import]
from pathlib import Path
# pyrefly: ignore [missing-import]
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent
ENV_FILE_PATH = BASE_DIR / ".env"


class Settings(BaseSettings):
    DATABASE_URL: str

    ENVIRONMENT: str = "development"
    CORS_ORIGINS: str = "http://localhost:5173"
    TRUST_PROXY: bool = False
    FORWARDED_ALLOW_IPS: str = "127.0.0.1"
    ENABLE_SECRET_SUBMIT: bool = True
    AUTO_CREATE_TABLES: bool | None = None

    model_config = SettingsConfigDict(
        env_file=ENV_FILE_PATH if ENV_FILE_PATH.exists() else None,
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def is_production(self) -> bool:
        """``ENVIRONMENT=production``: tắt /docs, /test-db, HSTS, không tự tạo bảng."""
        return self.ENVIRONMENT.lower() == "production"

    @property
    def cors_origin_list(self) -> list[str]:
        """Danh sách origin được phép. Origin không nằm đây bị CORS chặn."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def should_create_tables(self) -> bool:
        """Chỉ ``create_all`` khi dev hoặc khi ``AUTO_CREATE_TABLES=true``."""
        if self.AUTO_CREATE_TABLES is not None:
            return self.AUTO_CREATE_TABLES
        return not self.is_production


settings = Settings()
