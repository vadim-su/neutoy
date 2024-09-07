# Use an official Python runtime as a parent image
FROM python:3.12

ENV PORT=8081

SHELL ["/bin/bash", "-c"]

RUN pip install --upgrade pip
RUN pip install pdm

RUN useradd -m service -s /bin/bash
USER service

WORKDIR /app
COPY --chown=service:service pyproject.toml /app
COPY --chown=service:service pdm.lock /app
COPY --chown=service:service README.md /app
RUN pdm install --prod

COPY --chown=service:service . /app
RUN pdm install --prod

EXPOSE $PORT

CMD pdm run python -m toyserver
