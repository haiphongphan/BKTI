@echo off
echo ===================================================
echo [BKTI] DANG KHOI DONG BACKEND VA FRONTEND SONG SONG
echo ===================================================
echo.
echo Khoi dong Backend (Uvicorn tren port 8000)...
start "BKTI Backend" cmd /k "cd backend && set PYTHONIOENCODING=utf-8 && .\env\bin\python -m uvicorn app.main:app --reload"

echo Khoi dong Frontend (Vite tren port 5173)...
start "BKTI Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Ca hai server dang duoc khoi dong trong cac cua so CMD moi.
echo Chuc ban trai nghiem vui ve!
echo ===================================================
pause
