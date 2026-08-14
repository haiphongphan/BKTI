from slowapi import Limiter
from starlette.requests import Request


def get_client_ip(request: Request) -> str:
    """Peer IP only. Real client IP is applied by ProxyHeadersMiddleware when TRUST_PROXY is on."""
    if request.client and request.client.host:
        return request.client.host
    return "127.0.0.1"


limiter = Limiter(
    key_func=get_client_ip,
    default_limits=["90/minute"],
    headers_enabled=True,
)
