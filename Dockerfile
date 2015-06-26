from onsdigital/java-node-component

# Consul

WORKDIR /etc/consul.d
RUN echo '{"service": {"name": "florence", "tags": ["blue"], "port": 8080, "check": {"script": "curl http://localhost:8080 >/dev/null 2>&1", "interval": "10s"}}}' > florence.json

# Check out from Github

WORKDIR /usr/src
RUN git clone -b develop --single-branch --depth 1 https://github.com/ONSdigital/florence.git .

# Build web
RUN npm install --prefix ./src/main/web/florence  --unsafe-perm

# Build jar-with-dependencies

RUN mvn install -DskipTests

# Update the entry point script

RUN mv /usr/entrypoint/container.sh /usr/src/
ENV PACKAGE_PREFIX com.github.onsdigital.florence.api
RUN echo "java -Drestolino.files="target/web" -Drestolino.packageprefix=$PACKAGE_PREFIX -jar target/*-jar-with-dependencies.jar" >> container.sh