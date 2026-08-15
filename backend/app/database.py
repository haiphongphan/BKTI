"""Engine Postgres async. Timeout + SSL để DoS/pooler không giữ connection chết.

Lỗ hổng đã vá:
- ``timeout`` / ``command_timeout`` / ``statement_timeout``: query treo không
  chiếm pool mãi (DoS gián tiếp khi saturating DB).
- TLS khi host Supabase/Render hoặc ``sslmode=require``. Pooler là
  ``*.pooler.supabase.com`` (không phải ``supabase.co``) — thiếu SSL thì
  asyncpg không kết nối được.
- Gỡ query libpq (`sslmode`, `channel_binding`, ...) vì asyncpg không nhận.
- ``statement_cache_size=0``: tương thích PgBouncer/Supabase transaction pooler
  (prepared statement lệch cache gây lỗi hoặc hành vi lạ).
- Pool nhỏ + ``pool_timeout``: không mở hàng trăm connection khi bị flood.
"""

from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession

from .config import settings

LIBPQ_ONLY_QUERY_KEYS = {
    "sslmode",
    "channel_binding",
    "sslrootcert",
    "sslcert",
    "sslkey",
    "sslcrl",
    "gssencmode",
}


def _to_asyncpg_url(url: str) -> str:
    if url.startswith("postgresql+asyncpg://"):
        return url
    if url.startswith("postgresql://"):
        return "postgresql+asyncpg://" + url[len("postgresql://") :]
    if url.startswith("postgres://"):
        return "postgresql+asyncpg://" + url[len("postgres://") :]
    return url


def _prepare_async_database_url(url: str) -> tuple[str, bool]:
    """Bỏ param libpq (asyncpg reject ``sslmode``) và quyết định có bật TLS."""
    async_url = _to_asyncpg_url(url)
    parts = urlsplit(async_url)
    sslmode: str | None = None
    kept: list[tuple[str, str]] = []
    for key, value in parse_qsl(parts.query, keep_blank_values=True):
        lowered = key.lower()
        if lowered == "sslmode":
            sslmode = value.lower()
            continue
        if lowered in LIBPQ_ONLY_QUERY_KEYS:
            continue
        kept.append((key, value))

    cleaned = urlunsplit(
        (parts.scheme, parts.netloc, parts.path, urlencode(kept), parts.fragment)
    )
    host = (parts.hostname or "").lower()
    needs_ssl = sslmode in {"require", "verify-ca", "verify-full"} or any(
        marker in host for marker in ("supabase.co", "supabase.com", "render.com")
    )
    if sslmode == "disable":
        needs_ssl = False
    return cleaned, needs_ssl


# Lấy đường dẫn trong file .env
DATABASE_URL = settings.DATABASE_URL
ASYNC_DATABASE_URL, use_ssl = _prepare_async_database_url(DATABASE_URL)

connect_args = {
    "statement_cache_size": 0,
    "prepared_statement_cache_size": 0,
    "timeout": 10,
    "command_timeout": 10,
    "server_settings": {"statement_timeout": "5000"},
}
if use_ssl:
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
