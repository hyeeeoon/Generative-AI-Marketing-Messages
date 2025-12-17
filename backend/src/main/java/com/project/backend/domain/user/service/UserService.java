package com.project.backend.domain.user.service;

import com.project.backend.domain.user.dto.LoginRequestDto;
import com.project.backend.domain.user.dto.SignupRequestDto;
import com.project.backend.domain.user.dto.UserInfoDto;
import com.project.backend.domain.user.entity.UserInfo;  
import com.project.backend.domain.user.exception.UserExistsException;
import com.project.backend.domain.user.exception.UserNotFoundException;
import com.project.backend.domain.user.repository.UserInfoRepository; 
import lombok.RequiredArgsConstructor;
import java.util.Collections;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService implements UserDetailsService {

    private final UserInfoRepository userInfoRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserInfo user = userInfoRepository.findByUserId(username)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + username));
        
        GrantedAuthority authority = new SimpleGrantedAuthority(user.getRole());
        
        return new org.springframework.security.core.userdetails.User(
                user.getUserId(), 
                user.getPassword(),
                Collections.singletonList(authority)
        );
    }

    @Transactional
    public UserInfoDto.Response signup(SignupRequestDto request) {

        if (userInfoRepository.existsByUserId(request.getUserId())) {
            throw new UserExistsException("이미 존재하는 사용자 ID입니다.");
        }

        String encodedPw = passwordEncoder.encode(request.getPassword());
        UserInfo userInfo = request.toEntity(encodedPw);
        UserInfo saved = userInfoRepository.save(userInfo);

        return UserInfoDto.Response.from(saved);
    }

    public UserInfoDto.Response login(LoginRequestDto request) {

        UserInfo user = userInfoRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new UserNotFoundException("존재하지 않는 사용자입니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 권한 확인 (세션 로그인 시 사용)
        if (request.getRole() != null && !request.getRole().isBlank()) {
            if (!request.getRole().equals(user.getRole())) {
                throw new IllegalArgumentException("선택한 권한으로는 로그인할 수 없습니다.");
            }
        }

        return UserInfoDto.Response.from(user);
    }

    public UserInfoDto.Response getUser(Long id) {
        UserInfo userInfo = userInfoRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("유저를 찾을 수 없습니다."));
        return UserInfoDto.Response.from(userInfo);
    }

    public List<UserInfoDto.Response> getAllUsers() {
        return userInfoRepository.findAll().stream()
                .map(UserInfoDto.Response::from)
                .toList();
    }
}