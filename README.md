# BKTI

## Cài đặt

### venv

`python3 -m venv env`  
`source backend/env/bin/activate`

### Thư viện

`pip3 install -r requirement.txt`

### PostgreSQL

Cài postgre trước ((gemini đi t quên r :))  
Cài xong chạy các lệnh dưới:  
`psql -d postgres`  
`CREATE DATABASE bkti_db;`

## Chạy backend

`cd backend`  

### Nạp data

`python3 app/seed_data.py`  

### Khởi tạo

Chạy lệnh `uvicorn app.main:app --reload`  

## Chạy frontend

`cd frontend`  

### Tải thư viện

`npm install`

### Chạy frontend

`npm run dev`  
Mở đường dẫn và khen: `http://localhost:5173/`
