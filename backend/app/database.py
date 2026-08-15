"""Engine Postgres async. Timeout + SSL để DoS/pooler không giữ connection chết.

Lỗ hổng đã vá:
- ``timeout`` / ``command_timeout`` / ``statement_timeout``: query treo không
  chiếm pool mãi (DoS gián tiếp khi saturating DB).
- ``ssl=True`` khi URL chứa ``supabase.co``: bắt buộc TLS tới pooler, không
  gửi password/query plaintext.
- ``statement_cache_size=0``: tương thích PgBouncer/Supabase transaction pooler
  (prepared statement lệch cache gây lỗi hoặc hành vi lạ).
- Pool nhỏ + ``pool_timeout``: không mở hàng trăm connection khi bị flood.
"""

# pyrefly: ignore [missing-import]
# pyrefly: ignore [missing-import]
from .config import settings
from sqlalchemy.ext.asyncio import create_async_engine
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.orm import sessionmaker


# Lấy đường dẫn trong file .env
DATABASE_URL = settings.DATABASE_URL
ASYNC_DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")

connect_args = {
    "statement_cache_size": 0,
    "prepared_statement_cache_size": 0,
    "timeout": 5,
    "command_timeout": 5,
    "server_settings": {"statement_timeout": "5000"},
}
if "supabase.co" in DATABASE_URL:
    connect_args["ssl"] = True

async_engine = create_async_engine(
    ASYNC_DATABASE_URL,
    pool_size=5,
    max_overflow=5,
    pool_timeout=5,
    pool_recycle=1800,
    connect_args=connect_args,
)

async def get_db():
    """Session ngắn; đóng khi request xong để không giữ connection khi bị flood."""
    async_session = sessionmaker(
        bind=async_engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        yield session
