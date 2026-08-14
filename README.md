# BKTI

## Cài đặt

## Chạy bằng Docker

Cần Docker + Docker Compose.

Ở thư mục gốc:

```bash
cp .env.example .env
docker compose up --build -d
docker compose exec backend python -m app.seed_data
```

Mở: `http://localhost`  
Nếu port 80 bị chiếm, sửa `FRONTEND_PORT=8080` trong `.env` rồi `docker compose up -d`, mở `http://localhost:8080`.

### Đã có container rồi

Chỉ cần bật lại (không build lại):

```bash
docker compose up -d
```

Đổi code / Dockerfile / nginx thì build lại:

```bash
docker compose up --build -d
```

Seed chỉ cần lần đầu (hoặc khi muốn nạp lại data):

```bash
docker compose exec backend python -m app.seed_data
```

Lệnh hay dùng:

```bash
docker compose ps
docker compose logs -f
docker compose down          # dừng, giữ data DB
docker compose down -v       # dừng + xóa volume DB (mất data)
```

---

## Chạy backend (local)

`cd backend`

### venv

`python3 -m venv .venv`  
`source .venv/bin/activate`

### Thư viện

`pip3 install -r requirements.txt`

### PostgreSQL

Cài postgres trước.  
Cấu hình `backend/.env` (xem `backend/.env.example`).

```bash
psql -d postgres
DROP DATABASE bkti_db;
CREATE DATABASE bkti_db;
\q
```

### Nạp data

Từ thư mục `backend` (đã activate venv):

`python -m app.seed_data`

### Khởi tạo

`uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 5`

## Chạy frontend (local)

`cd frontend`

### Tải thư viện

`npm install`

### Chạy frontend

`npm run dev`  
Mở: `http://localhost:5173/`

## Cách chạy cả hai local

Ở thư mục gốc: `./run.sh`

## Convert image to webp
`npx sharp -i ./public/image/mochi/*.png -o ./public/image/mochi -f webp`

## Remove database
`TRUNCATE TABLE user_ans RESTART IDENTITY CASCADE;`