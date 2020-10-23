FROM python:3.7.9-alpine3.12

WORKDIR /app 
COPY src/. /app/

RUN pip install -r requirements.txt

ENTRYPOINT ["python", "device.main.py"]