from onsdigital/java-node-component

# Consul
WORKDIR /etc/consul.d
RUN echo '{"service": {"name": "florence", "tags": ["blue"], "port": 8080, "check": {"script": "curl http://localhost:8080 >/dev/null 2>&1", "interval": "10s"}}}' > florence.json

# Add the built artifact
WORKDIR /usr/src
ADD git_commit_id /usr/src/
ADD ./target/*-jar-with-dependencies.jar /usr/src/target/
ADD ./target/web /usr/src/target/web

# Update the entry point script
RUN mv /usr/entrypoint/container.sh /usr/src/
ENV PACKAGE_PREFIX com.github.onsdigital.florence.api
RUN echo "java -Xmx2048m -Drestolino.files="target/web" -Drestolino.packageprefix=$PACKAGE_PREFIX -jar target/*-jar-with-dependencies.jar" >> container.sh
