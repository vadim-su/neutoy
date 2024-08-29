# Use an official Python runtime as a parent image
FROM python:3.12

ENV PORT=8001

SHELL ["/bin/bash", "-c"]

RUN pip3 install pdm
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    poppler-utils \
    libpoppler-cpp-dev \
    cmake \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

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


CMD pdm run fastapi run --port 8001 lc_search/__main__.py
