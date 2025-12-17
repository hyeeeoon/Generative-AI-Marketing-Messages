# 1. 빌드 단계 (Gradle을 사용하여 jar 파일 생성)
FROM gradle:8.5-jdk17 AS build
WORKDIR /app
# 권한 문제 방지를 위해 소유자 설정하며 복사
COPY --chown=gradle:gradle . .
# 실행 권한 부여 및 빌드
RUN chmod +x gradlew
RUN ./gradlew build -x test --no-daemon

# 2. 실행 단계 (경량화된 자바 환경)
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
EXPOSE 8080
# 빌드 단계에서 생성된 jar 파일만 가져옴
COPY --from=build /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]