FROM onsdigital/java-node-component

# Add the build artifacts
WORKDIR /usr/src
ADD ./target/*-jar-with-dependencies.jar /usr/src/target/
ADD ./target/web /usr/src/target/web

# Set the entry point
ENTRYPOINT java -Xmx2048m \
          -Drestolino.files="target/web" \
          -Drestolino.packageprefix=com.github.onsdigital.florence.api \
          -jar target/*-jar-with-dependencies.jar
