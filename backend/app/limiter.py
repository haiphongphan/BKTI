"""Rate limit theo IP thật của kết nối TCP, không theo header client gửi lên.

Lỗ hổng đã vá:
- Không đọc ``X-Forwarded-For`` / ``X-Client-ID`` trong ``key_func``.
  Attacker có thể xoay header đó để mỗi request là một “client” mới, né SlowAPI.
- IP thật chỉ được ghi vào ``request.client.host`` bởi ``ProxyHeadersMiddleware``
  khi ``TRUST_PROXY=true`` (Render đứng sau proxy). Nếu đọc XFF trực tiếp khi
  không tin proxy, client tự spoof IP và bypass limit/ban.
"""

from slowapi import Limiter
from starlette.requests import Request


def get_client_ip(request: Request) -> str:
    """Trả về IP peer của socket.

    Không đọc ``X-Forwarded-For``. Khi ``TRUST_PROXY`` bật, Uvicorn
    ``ProxyHeadersMiddleware`` đã ghi IP client vào ``request.client.host``
    trước khi middleware/limiter chạy.
    """
    if request.client and request.client.host:
        return request.client.host
    return "127.0.0.1"


limiter = Limiter(
    key_func=get_client_ip,
    default_limits=["90/minute"],
    headers_enabled=True,
)
