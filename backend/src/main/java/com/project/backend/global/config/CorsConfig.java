package com.project.backend.global.config;

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
        
        config.setAllowCredentials(true);
        
        // 1. 로컬 환경 허용
        config.addAllowedOrigin("http://localhost:5173");
        config.addAllowedOrigin("http://localhost:3000");
        
        // 2. Vercel 실서버 및 모든 Preview 주소 허용 (패턴 사용)
        // 만약 특정 주소만 허용하고 싶다면 아래 주소를 추가하세요.
        config.addAllowedOrigin("https://generative-ai-marketing-messages.vercel.app");
        config.addAllowedOrigin("https://generative-ai-marketing-mess-git-578fd2-nagis-projects-9720831c.vercel.app");
        
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}