package com.project.backend.global.common;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponse<T> {

    private boolean isSuccess;
    private String message;
    private T result;

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .isSuccess(true)
                .message(message)
                .result(data)
                .build();
    }

    public static <T> ApiResponse<T> failure(String message) {
        return ApiResponse.<T>builder()
                .isSuccess(false)
                .message(message)
                .result(null)
                .build();
    }
}
