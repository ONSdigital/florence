#!/bin/bash

# Remote debug:
export JAVA_OPTS="-Xdebug -Xrunjdwp:transport=dt_socket,address=8001,server=y,suspend=n"
export PORT="8081"

# File reloading:
export RESTOLINO_STATIC="src/main/web"

# Class reloading
export RESTOLINO_CLASSES="target/classes"
# Optional package prefix:
# export RESTOLINO_PACKAGEPREFIX=com.mycompany.myapp

# Basic authentication
#export USERNAME=java
#export PASSWORD=fortheweb
# Optional: Practically speaking, any value you like that describes your app.
#           see also: http://stackoverflow.com/questions/9311353/java-ee-security-realms
#export REALM=niceapp

mvn clean package && \

# Development: reloadable
java $JAVA_OPTS -Drestolino.files=$RESTOLINO_STATIC -Drestolino.classes=$RESTOLINO_CLASSES -Drestolino.packageprefix=$RESTOLINO_PACKAGEPREFIX -cp "target/dependency/*" com.github.davidcarboni.restolino.Main

# Deployment: non-reloadable
#java $JAVA_OPTS -jar target/*-jar-with-dependencies.jar