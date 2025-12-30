FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    poppler-utils \
    libmagic1 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY app/ app/

# IMPORTANT: No brackets [] for CMD to allow shell expansion of $PORT
# This is the "shell form" of CMD
CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT
