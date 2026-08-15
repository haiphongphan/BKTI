from slowapi import Limiter
from starlette.requests import Request

def get_identifier(request: Request) -> str:
    """
    Tạo khóa định danh duy nhất cho từng thiết bị:
    - Nếu Frontend gửi header 'X-Client-ID' -> ghép 'IP:client_id'
    - Nếu không có -> fallback về IP gốc
    """
    forwarded = request.headers.get("X-Forwarded-For")
    ip = forwarded.split(",")[0].strip() if forwarded else (request.client.host if request.client else "127.0.0.1")
    
    client_id = request.headers.get("X-Client-ID")
    if client_id:
        return f"{ip}:{client_id}"
    
    return ip

# Khởi tạo limiter dùng hàm định danh mới
limiter = Limiter(key_func=get_identifier)