package com.project.backend.domain.history.controller;

import com.project.backend.domain.history.dto.HistoryResponse;
import com.project.backend.domain.history.dto.HistorySendRequest;
import com.project.backend.domain.history.service.HistoryService;
import com.project.backend.domain.user.dto.UserInfoDto;
import com.project.backend.global.common.ApiResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/history")
public class HistoryController {

    private final HistoryService historyService;

    // 세션에서 사용자 정보 가져오는 유틸리티 (UserController와 동일)
    private UserInfoDto.Response getSessionUser(HttpSession session) {
        return (UserInfoDto.Response) session.getAttribute("LOGIN_USER");
    }

    // 1. [POST /api/history/send] 전송 이력 저장
    @PostMapping("/send")
    public ResponseEntity<ApiResponse<HistoryResponse>> recordSendHistory(
            @RequestBody HistorySendRequest request, 
            HttpSession session
    ) {
        UserInfoDto.Response sender = getSessionUser(session);

        if (sender == null) {
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.failure("로그인 필요"));
        }

        HistoryResponse response = historyService.record(request, sender); 
        
        return ResponseEntity.ok(
                ApiResponse.success("메시지 전송 및 이력 저장 완료", response)
        );
    }

    // 2. [GET /api/history] 전송 이력 전체 조회
    @GetMapping
    public ResponseEntity<ApiResponse<List<HistoryResponse>>> getAllHistory(HttpSession session) {
        UserInfoDto.Response currentUser = getSessionUser(session);
        
        if (currentUser == null) {
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.failure("로그인 필요"));
        }
        
        List<HistoryResponse> historyList = historyService.getFilteredHistory(currentUser);
        
        return ResponseEntity.ok(
                ApiResponse.success("전송 이력 조회 완료", historyList)
        );
    }
}