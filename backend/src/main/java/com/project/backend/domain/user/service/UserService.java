package com.project.backend.domain.user.service;

import com.project.backend.domain.user.dto.LoginRequestDto;
import com.project.backend.domain.user.dto.SignupRequestDto;
import com.project.backend.domain.user.dto.UserDto;
import com.project.backend.domain.user.entity.User;
import com.project.backend.domain.user.exception.UserExistsException;
import com.project.backend.domain.user.exception.UserNotFoundException;
import com.project.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserDto.Response signup(SignupRequestDto request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserExistsException("이미 존재하는 이메일입니다.");
        }

        String encodedPw = passwordEncoder.encode(request.getPassword());
        User user = request.toEntity(encodedPw);
        User saved = userRepository.save(user);
        return UserDto.Response.from(saved);
    }

    public UserDto.Response login(LoginRequestDto request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException("유저를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 여기서는 단순히 유저 정보만 반환 (토큰 발급은 추후 global.auth 쪽에서)
        return UserDto.Response.from(user);
    }

    public UserDto.Response getUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("유저를 찾을 수 없습니다."));
        return UserDto.Response.from(user);
    }
}
