package com.project.backend.domain.user.dto;

import com.project.backend.domain.user.entity.UserInfo;
import lombok.*;

public class UserInfoDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String userId;
        private String username;
        private String role;

        public static Response from(UserInfo userInfo) {
            return Response.builder()
                    .id(userInfo.getId())
                    .userId(userInfo.getUserId())
                    .username(userInfo.getUsername())
                    .role(userInfo.getRole())
                    .build();
        }
    }
}
