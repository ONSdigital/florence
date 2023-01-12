FROM onsdigital/dp-concourse-tools-ubuntu-20:ubuntu20.4-rc.1

WORKDIR /app/

COPY ./build/florence .

ENTRYPOINT ./florence
