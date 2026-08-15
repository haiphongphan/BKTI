FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONIOENCODING=utf-8

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

RUN adduser --system --no-create-home appuser && chown -R appuser /app

USER appuser

EXPOSE 8000

# Keep-alive ngắn + cap concurrency: slowloris / flood không giữ worker mãi.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2", "--timeout-keep-alive", "5", "--limit-concurrency", "40"]
