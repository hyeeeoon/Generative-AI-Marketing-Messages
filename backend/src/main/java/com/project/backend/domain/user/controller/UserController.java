package com.project.backend.domain.user.controller;

import com.project.backend.global.common.ApiResponse;
import com.project.backend.domain.user.dto.LoginRequestDto;
import com.project.backend.domain.user.dto.SignupRequestDto;
import com.project.backend.domain.user.dto.UserInfoDto; 
import com.project.backend.domain.user.service.UserService;  
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;  

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<UserInfoDto.Response>> signup(@RequestBody SignupRequestDto request) {
        UserInfoDto.Response response = userService.signup(request); 
        return ResponseEntity.ok(
                ApiResponse.success("회원가입 완료", response)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserInfoDto.Response>> login(
            @RequestBody LoginRequestDto request, HttpSession session) {

        UserInfoDto.Response response = userService.login(request); 

        // 세션 저장
        session.setAttribute("LOGIN_USER", response);

        // SecurityContext에 권한 세팅 (Role 접두사 포함)
        List<GrantedAuthority> authorities = List.of(
            new SimpleGrantedAuthority("ROLE_" + response.getRole())  // ex: ROLE_admin
        );

        Authentication auth = new UsernamePasswordAuthenticationToken(
            response.getUserId(), null, authorities
        );

        SecurityContextHolder.getContext().setAuthentication(auth);

        return ResponseEntity.ok(
                ApiResponse.success("로그인 성공", response)
        );
    }

    @GetMapping("/me")
    public ResponseEntity<?> getSessionUser(HttpSession session) {

        UserInfoDto.Response user = (UserInfoDto.Response) session.getAttribute("LOGIN_USER");

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.failure("로그인 필요"));
        }

        return ResponseEntity.ok(ApiResponse.success("세션 유지", user));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpSession session) {

        session.invalidate();

        return ResponseEntity.ok(
                ApiResponse.success("로그아웃 완료", null)
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserInfoDto.Response>>> getAllUsers() {
        List<UserInfoDto.Response> responseList = userService.getAllUsers();
        return ResponseEntity.ok(
                ApiResponse.success("전체 유저 조회 완료", responseList)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserInfoDto.Response>> getUser(@PathVariable Long id) {
        UserInfoDto.Response response = userService.getUser(id);
        return ResponseEntity.ok(
                ApiResponse.success("유저 조회 완료", response)
        );
    }

}
