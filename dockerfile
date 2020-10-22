FROM python:3.7.9-alpine3.12

WORKDIR /app 
COPY . . 


RUN pip install -r requirement.txt



