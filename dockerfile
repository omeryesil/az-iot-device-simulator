FROM python:3.7.9-alpine3.12

WORKDIR /app 
COPY src/. /app/

RUN pip install -r requirements.txt
RUN chmod +x /app/device.py

ENTRYPOINT ["python", "/app/device.py"]