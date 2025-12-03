// src/main/java/com/project/backend/config/CorsConfig.java
package com.project.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        config.setAllowCredentials(true);                    // 쿠키 허용
        config.addAllowedOrigin("http://localhost:5173");   // 프론트 포트 정확히
        config.addAllowedOrigin("http://localhost:3000");   // 혹시 몰라서 추가
        config.addAllowedHeader("*");                       // 모든 헤더 허용
        config.addAllowedMethod("*");                       // GET, POST, PUT, DELETE 등 전부 허용
        
        source.registerCorsConfiguration("/api/**", config);
        return new CorsFilter(source);
    }
}