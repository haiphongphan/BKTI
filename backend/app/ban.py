from __future__ import annotations

import time
from collections import defaultdict

BAN_DURATION = 600
MAX_VIOLATIONS = 5
VIOLATION_WINDOW = 60


class BanStore:
    def __init__(self) -> None:
        self._violations: dict[str, list[float]] = defaultdict(list)
        self._bans: dict[str, float] = {}

    def remaining_ban_seconds(self, ip: str) -> int | None:
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
        now = time.time()
        valid = [stamp for stamp in self._violations[ip] if now - stamp < VIOLATION_WINDOW]
        valid.append(now)
        self._violations[ip] = valid
        if len(valid) >= MAX_VIOLATIONS:
            self._bans[ip] = now + BAN_DURATION
            self._violations.pop(ip, None)


ban_store = BanStore()
