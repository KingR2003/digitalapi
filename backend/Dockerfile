# Multi-stage Docker build for GCP Cloud Run and production containerization
FROM maven:3.9-eclipse-temurin-17-alpine AS builder

WORKDIR /app
COPY pom.xml .
COPY src ./src

# Build production JAR without running tests during image build
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine AS runner

WORKDIR /app

# Add unprivileged user for security best practices
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=builder /app/target/quiz-credit-api-1.0.0.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]

