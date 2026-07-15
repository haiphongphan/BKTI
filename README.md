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
Chạy lệnh `uvicorn app.main:app --reload`  
Mở đường dẫn `http://127.0.0.1:8000/`