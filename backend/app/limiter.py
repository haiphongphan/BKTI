from slowapi import Limiter
from starlette.requests import Request

# Hàm bóc tách IP thật của người dùng đứng sau Render Proxy
def get_real_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        # Lấy IP đầu tiên trong chuỗi (IP gốc của client)
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "127.0.0.1"

# Khởi tạo limiter với hàm get_real_ip chuẩn
limiter = Limiter(key_func=get_real_ip)