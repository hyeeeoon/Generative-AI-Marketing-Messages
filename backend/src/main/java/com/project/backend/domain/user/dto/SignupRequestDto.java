package com.project.backend.domain.user.dto;

import com.project.backend.domain.user.entity.UserInfo;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignupRequestDto {
    private String userId; 
    private String password;
    private String username; 
    private String role;

    public UserInfo toEntity(String encodedPassword) { 
        return UserInfo.builder()
                .userId(userId) 
                .password(encodedPassword)
                .username(username) 
                .role(role != null && !role.isBlank() ? role : "ktcs_user") 
                .build();
    }
}