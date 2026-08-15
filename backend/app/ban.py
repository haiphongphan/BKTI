"""Cấm tạm IP sau khi spam 429 (in-memory, per worker).

Lỗ hổng đã vá:
- Ban theo IP từ ``get_client_ip`` (socket), không theo header giả mạo.
- Cửa sổ vi phạm có hạn (60s) rồi mới cộng dồn; đủ 5 lần 429 thì khóa 10 phút
  để SlowAPI không bị đập liên tục sau khi hết quota.

Giới hạn: store nằm trên RAM từng Uvicorn worker, mất khi Render sleep/restart.
Đây là lớp phụ; DDoS thật cần Cloudflare trước origin.
"""

from __future__ import annotations

import time
from collections import defaultdict

BAN_DURATION = 600  # 10 phút khóa sau khi đủ vi phạm
MAX_VIOLATIONS = 5  # số lần 429 trong cửa sổ trước khi ban
VIOLATION_WINDOW = 60  # giây; mốc cũ hơn cửa sổ bị bỏ


class BanStore:
    """Đếm 429 theo IP rồi khóa tạm. Không persist, không chia sẻ giữa worker."""

    def __init__(self) -> None:
        self._violations: dict[str, list[float]] = defaultdict(list)
        self._bans: dict[str, float] = {}

    def remaining_ban_seconds(self, ip: str) -> int | None:
        """Số giây còn bị khóa, hoặc ``None`` nếu IP được phép đi tiếp."""
        now = time.time()
        until = self._bans.get(ip)
        if until is None:
            return None
        if until > now:
            return int(until - now)
        self._bans.pop(ip, None)
        self._violations.pop(ip, None)
        return None

    def record_violation(self, ip: str) -> None:
        """Ghi một lần HTTP 429. Đủ ``MAX_VIOLATIONS`` trong cửa sổ thì ban."""
        now = time.time()
        valid = [stamp for stamp in self._violations[ip] if now - stamp < VIOLATION_WINDOW]
        valid.append(now)
        self._violations[ip] = valid
        if len(valid) >= MAX_VIOLATIONS:
            self._bans[ip] = now + BAN_DURATION
            self._violations.pop(ip, None)


ban_store = BanStore()
