# BKTI — Ops & Docker notes

Ghi chú vận hành (Phase 1 hardening). App quiz tính cách Bách Khoa: React/Vite + nginx, FastAPI, PostgreSQL.

## Request path (Docker Compose)

```text
Browser
  → http://localhost:${FRONTEND_PORT}   (mặc định 8080)
  → frontend container (nginx, user nginx, listen 8080)
       ├─ static SPA (/)
       └─ /api/*  proxy_pass → backend:8000
            → backend (uvicorn, user appuser)
                 → db:5432 (Postgres, volume postgres_data)
```

- **Docker / self-host:** frontend gọi API relative `/api` (build-time `VITE_API_BASE_URL=/api`), nginx proxy sang backend trong mạng Compose.
- **Cloud (Vercel + Render):** FE và BE tách domain — `VITE_API_BASE_URL` thường là URL tuyệt đối của backend (xem `frontend/.env.development`).

## Biến môi trường

### Root `.env` (Compose) — copy từ `.env.example`

| Biến | Ý nghĩa |
|------|---------|
| `POSTGRES_USER` | User Postgres |
| `POSTGRES_PASSWORD` | Password Postgres |
| `POSTGRES_DB` | Tên database |
| `FRONTEND_PORT` | Port trên **máy host** map vào nginx container `:8080` |

Compose tự ghép `DATABASE_URL` cho backend:

`postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}`

### Frontend (build-time Vite)

| Biến | Ý nghĩa |
|------|---------|
| `VITE_API_BASE_URL` | Base URL API lúc `npm run build`. Docker: `/api`. Dev cloud: URL Render. |

Truyền vào image qua `docker-compose.yml` → `build.args` và `ARG`/`ENV` trong `frontend/Dockerfile`.

### Backend (local không Compose)

Xem `backend/.env.example` — cần `DATABASE_URL` trỏ Postgres local.

**Cảnh báo:** password trong `.env.example` chỉ để demo. Không dùng trên production; không commit file `.env` thật.

## Chạy bằng Docker

Cần Docker + Docker Compose. Ở thư mục gốc repo:

```bash
cp .env.example .env
docker compose up --build -d
```

Mở: `http://localhost:8080` (hoặc đúng `FRONTEND_PORT` trong `.env`).

### Seed data (thủ công — chỉ khi cần test / reset)

Script `python -m app.seed_data` **xóa toàn bộ bảng rồi nạp CSV** (`clear_all_tables`). Không chạy tự động mỗi lần start. Chỉ dùng khi cố ý nạp lại data test:

```bash
docker compose exec backend python -m app.seed_data
```

Restart app **không** cần seed lại nếu volume DB còn.

### Lệnh hay dùng

```bash
docker compose ps
docker compose logs -f
docker compose logs -f backend
docker compose up -d              # bật lại, không build
docker compose up --build -d      # đổi code / Dockerfile / nginx → build lại
docker compose down               # dừng, giữ volume DB
docker compose down -v            # dừng + xóa volume DB (mất data)
```

### Non-root containers

| Service | User trong container | Port trong container |
|---------|----------------------|----------------------|
| backend | `appuser` | 8000 (không publish ra host; chỉ nội bộ + qua nginx `/api`) |
| frontend | `nginx` | 8080 (map `FRONTEND_PORT:8080`) |

Kiểm tra nhanh:

```bash
docker compose exec backend whoami
docker compose exec frontend whoami
```

## Troubleshooting

| Triệu chứng | Hướng xử lý |
|-------------|-------------|
| Port host bị chiếm | Đổi `FRONTEND_PORT` trong `.env`, `docker compose up -d` |
| Frontend lên nhưng API lỗi | `docker compose ps` — backend/db healthy chưa? `logs backend` |
| DB chưa ready / backend restart | Đợi healthcheck; xem `logs db` (`pg_isready`) |
| Đổi Dockerfile/nginx mà không thấy thay đổi | `docker compose up --build -d` |
| Sau `down -v` mất câu hỏi / ranking | Volume đã xóa — seed lại nếu cần test |
| Seed làm mất data vừa làm quiz | Đúng hành vi hiện tại của script — chỉ seed khi chấp nhận wipe |

## Chạy local (không Docker full stack)

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip3 install -r requirements.txt
# cấu hình backend/.env (DATABASE_URL)
python -m app.seed_data   # chỉ khi cần
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Mở `http://localhost:5173/`.

### Cả hai

Ở thư mục gốc: `./run.sh` (cần Postgres local + env đã cấu hình).
