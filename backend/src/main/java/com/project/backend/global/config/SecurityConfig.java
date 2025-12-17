package com.project.backend.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider; 
import org.springframework.security.authentication.dao.DaoAuthenticationProvider; 
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.mapping.NullAuthoritiesMapper; 
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public AuthenticationProvider authenticationProvider(UserDetailsService userDetailsService) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        authProvider.setAuthoritiesMapper(new NullAuthoritiesMapper()); 
        return authProvider;
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, AuthenticationProvider authenticationProvider) throws Exception { 

        http
            // ----------------- CSRF 비활성화 & CORS 설정 -----------------
            .csrf(csrf -> csrf.disable())
            .cors(org.springframework.security.config.Customizer.withDefaults())
            
            // 1. 인증 제공자 설정 적용
            .authenticationProvider(authenticationProvider) 
            
            // 2. URL별 접근 권한
            .authorizeHttpRequests(auth -> auth
                
                // ===== 1. PUBLIC 경로 (로그인 없이 접근 가능) =====
                // 로그인, 회원가입 관련 기본 경로
                .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/users/login").permitAll()
                .requestMatchers("/api/users/signup").permitAll()
                .requestMatchers("/api/users/me").permitAll() 
                .requestMatchers("/api/users").permitAll()
                
                // 공지사항 조회 (GET)는 모두에게 공개
                .requestMatchers(HttpMethod.GET, "/api/notices/**").permitAll() 
                
                // ⚠️ 403 오류 회피 목적: Controller에서 로그인 검증하는 경로 (403 대신 401 반환 유도)
                .requestMatchers("/api/performance/**").permitAll() 
                .requestMatchers("/api/target-customers-full").permitAll() // 고객 목록
                .requestMatchers("/api/history/**").permitAll()
                // ===== 2. ADMIN/특정 권한 필수 경로 (가장 구체적인 권한) =====
                // 공지 수정, 삭제는 'admin' 또는 'portal_admin'만 허용
                .requestMatchers(HttpMethod.PUT, "/api/notices/**").hasAnyAuthority("admin", "portal_admin")
                .requestMatchers(HttpMethod.DELETE, "/api/notices/**").hasAnyAuthority("admin", "portal_admin")
                // PUT 요청 (수동 기록): 'portal_admin'만 허용해야 한다면 여기에 추가
                // .requestMatchers(HttpMethod.PUT, "/api/history/**").hasAnyAuthority("portal_admin") 
                
                // ===== 3. 그 외 모든 요청 (기본 보안 정책) =====
                // 위의 permitAll() 경로와, 특정 권한이 필요한 경로를 제외한 모든 요청은 로그인 필수
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