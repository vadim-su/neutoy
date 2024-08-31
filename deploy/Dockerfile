# Use an official Python runtime as a parent image
FROM python:3.12

ENV PORT=8080

RUN pip install --upgrade pip
RUN pip install pdm

EXPOSE $PORT

CMD pdm run python -m toyserver
