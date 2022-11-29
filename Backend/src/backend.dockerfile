FROM python:3.9-slim
ARG CACHEBUST=1
RUN echo "$CACHEBUST"
WORKDIR /mlapp
RUN echo "$PWD"
COPY . .
RUN echo "$ls"