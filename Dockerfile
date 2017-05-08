FROM ubuntu:16.04

WORKDIR /app/

COPY ./build/florence .

ENTRYPOINT ./florence
