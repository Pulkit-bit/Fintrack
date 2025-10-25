# Use an OpenJDK image
FROM eclipse-temurin:21-jdk

# Set the working directory in the container
WORKDIR /app

# Copy the Maven wrapper and pom.xml
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies (leverages cache)
RUN ./mvnw dependency:go-offline

# Copy the entire source
COPY . .

# Build the application
RUN ./mvnw clean package -DskipTests

# Run the app
CMD ["java", "-jar", "target/fintrack-0.0.1-SNAPSHOT.jar"]

