#! /usr/bin/env bash
# cap quyen de chay
chmod +x "$0" 2>/dev/null || true

# cd về root
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

clean() {
    kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
    wait "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
}
trap clean INT TERM EXIT

(
    cd backend
    export PYTHONIOENCODING=utf-8
    .venv/bin/python -m uvicorn app.main:app --reload
) & BACKEND_PID=$!

(
    cd frontend
    npm run dev
) & FRONTEND_PID=$!

wait