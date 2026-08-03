# BKTI

## Cài đặt

## Chạy backend

`cd backend`  

### venv

`python3 -m venv .venv`  
`source backend/.venv/bin/activate`

### Thư viện

`pip3 install -r requirement.txt`

### PostgreSQL

Cài postgre trước ((gemini đi t quên r :))  
Cài xong chạy các lệnh dưới:  
`psql -d postgres`  
`DROP DATABASE bkti_db;`
`CREATE DATABASE bkti_db;`

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


## Cách chạy mới
mở thư mục gốc và `./run.sh`
