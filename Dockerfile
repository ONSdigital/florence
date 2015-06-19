from onsdigital/java-component

# Consul

WORKDIR /etc/consul.d
RUN echo '{"service": {"name": "florence", "tags": ["blue"], "port": 8080, "check": {"script": "curl http://localhost:8080 >/dev/null 2>&1", "interval": "10s"}}}' > florence.json

# Check out from Github

WORKDIR /usr/src
RUN git clone https://github.com/ONSdigital/florence.git .
RUN git checkout develop

# Build jar-with-dependencies

RUN mvn install -DskipTests

# Update the entry point script

ENV PACKAGE_PREFIX com.github.onsdigital.florence.api
RUN echo "java -Drestolino.files="target/web" -Drestolino.packageprefix=$PACKAGE_PREFIX -jar target/*-jar-with-dependencies.jar" >> container.sh