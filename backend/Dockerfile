FROM python:3.12-slim

WORKDIR /src

ENV PYTHONDONTWRITEBYTECODE=1 \ PYTHONUNBUFFERED=1 \ PYTHONIOENCODING=utf-8

COPY requirement.txt .
RUN pip install --no-cache-dir -r requirement.txt

COPY app ./app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--reload"]
