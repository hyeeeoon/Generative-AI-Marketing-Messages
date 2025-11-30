package com.project.backend.domain.user.controller;

import com.project.backend.global.common.ApiResponse;
import com.project.backend.domain.user.dto.LoginRequestDto;
import com.project.backend.domain.user.dto.SignupRequestDto;
import com.project.backend.domain.user.dto.UserDto;
import com.project.backend.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<UserDto.Response>> signup(@RequestBody SignupRequestDto request) {
        UserDto.Response response = userService.signup(request);
        return ResponseEntity.ok(
                ApiResponse.success("회원가입 완료", response)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserDto.Response>> login(@RequestBody LoginRequestDto request) {
        UserDto.Response response = userService.login(request);
        return ResponseEntity.ok(
                ApiResponse.success("로그인 완료", response)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto.Response>> getUser(@PathVariable Long id) {
        UserDto.Response response = userService.getUser(id);
        return ResponseEntity.ok(
            ApiResponse.success("유저 조회 완료", response)
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        // JWT 쓰기 전까지는 그냥 프론트에서 토큰/세션 지우도록 안내만.
        // 나중에 실제 토큰 블랙리스트, 세션 무효화 로직 추가.
        return ResponseEntity.ok(
                ApiResponse.success("로그아웃 완료", null)
        );
    }
}
