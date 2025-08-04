# Dockerfile for App1

# Use an official Maven image as a base image for building App1
FROM maven:3.8.4-openjdk-17-slim AS build

# Set the working directory inside the container for App1
WORKDIR /app/open-api-specification

# Copy the pom.xml file to the container for App1
COPY ./open-api-specification/pom.xml .

# Copy the rest of the application code for App1
COPY ./open-api-specification/src ./src

# Run Maven install to build open-api-specification
RUN mvn install -DskipTests


# Set the working directory inside the container for App2
WORKDIR /app/api

# Copy the pom.xml file to the container for App2
COPY ./api/pom.xml .

# Copy the rest of the application code for App2
COPY ./api/src ./src

COPY ./api/application-docker.properties ./src/main/resources/application.properties

# Run Maven install to build App2
RUN mvn package -DskipTests

# Create a new image based on a lightweight JRE image for App1
FROM openjdk:17-jdk-slim

# Set the working directory inside the container for App1
WORKDIR /app/api

# Copy the built JAR file from the build image to the runtime image for App1
COPY --from=build /app/api/target/*.jar api.jar

# Expose the port your API application will run on
EXPOSE 8080
EXPOSE 8443

# Command to run the App1 application
# CMD ["java", "-jar", "api.jar"]
CMD ["sh", "-c", "java $JAVA_OPTS -Dserver.ssl.key-store=$SERVER_SSL_KEY_STORE -Dserver.ssl.key-store-password=$SERVER_SSL_KEY_STORE_PASSWORD -Dserver.ssl.key-store-type=$SERVER_SSL_KEY_STORE_TYPE -Dserver.ssl.key-alias=$SERVER_SSL_KEY_ALIAS -jar api.jar"]