package com.project.backend.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpMethod;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // ----------------- 비밀번호 인코더 -----------------
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ----------------- 시큐리티 필터 체인 -----------------
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            // ----------------- CSRF 비활성화 -----------------
            .csrf(csrf -> csrf.disable())
            
            // ----------------- CORS 설정 -----------------
            .cors(cors -> {}) // CorsConfig에서 설정한 필터 적용
            
            // ----------------- URL별 접근 권한 -----------------
            .authorizeHttpRequests(auth -> auth
                
                // ===== 사용자 인증 관련 =====
                .requestMatchers("/api/users/login").permitAll()
                .requestMatchers("/api/users/signup").permitAll()
                .requestMatchers("/api/users/me").permitAll() 

                // ===== 공지사항 =====
                .requestMatchers(HttpMethod.GET, "/api/notices/**").permitAll() // 조회는 누구나 가능
                // 작성, 수정, 삭제는 관리자만
                .requestMatchers(HttpMethod.POST, "/api/notices/**").hasAnyAuthority("admin", "portal_admin")
                .requestMatchers(HttpMethod.PUT, "/api/notices/**").hasAnyAuthority("admin", "portal_admin")
                .requestMatchers(HttpMethod.DELETE, "/api/notices/**").hasAnyAuthority("admin", "portal_admin")


                // ===== 관리자 =====
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                
                // ===== 포털 관리자 =====
                .requestMatchers("/api/portal/**").hasRole("PORTAL_ADMIN")
                
                // ===== 그 외 =====
                .anyRequest().authenticated()
            )
            
            // ----------------- 세션 관리 -----------------
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            )
            
            // ----------------- 로그아웃 설정 -----------------
            .logout(logout -> logout
                .logoutUrl("/api/users/logout")
                .deleteCookies("JSESSIONID")
            );

        return http.build();
    }
}
