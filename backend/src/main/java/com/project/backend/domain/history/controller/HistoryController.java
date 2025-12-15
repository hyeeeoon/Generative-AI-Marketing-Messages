package com.project.backend.domain.history.controller;

import com.project.backend.domain.history.dto.HistoryResponse;
import com.project.backend.domain.history.dto.HistorySendRequest;
import com.project.backend.domain.history.dto.HistoryStatusUpdateRequest;
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

    // 세션에서 현재 로그인된 사용자 정보를 가져오는 유틸리티 메서드입니다.
    private UserInfoDto.Response getSessionUser(HttpSession session) {
        return (UserInfoDto.Response) session.getAttribute("LOGIN_USER");
    }

    /**
     * 1. [POST /api/history/send] 메시지 전송 및 이력 저장 (로그인 필수)
     */
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

        // HistoryService에서 메시지 전송 처리 및 이력 기록
        HistoryResponse response = historyService.record(request, sender); 
        
        return ResponseEntity.ok(
                ApiResponse.success("메시지 전송 및 이력 저장 완료", response)
        );
    }

    /**
     * 2. [GET /api/history] 전송 이력 전체 조회
     * ⭐ 수정: 로그인 여부와 관계없이 조회 허용 (HistoryTrackerPage 지원)
     *
     * @param session 현재 사용자의 세션
     * @return 현재 사용자가 접근 가능한 전송 이력 목록 (로그인 시 개인, 미로그인 시 전체)
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<HistoryResponse>>> getAllHistory(HttpSession session) {
        UserInfoDto.Response currentUser = getSessionUser(session);
        
        // ⭐ 핵심 수정: currentUser가 null이어도 401을 반환하지 않고,
        // Service로 null을 전달하여 Service가 전체 조회를 판단하도록 위임합니다.
        
        // HistoryService에서 현재 사용자의 권한에 맞는 이력 목록을 조회합니다.
        List<HistoryResponse> historyList = historyService.getFilteredHistory(currentUser);
        
        return ResponseEntity.ok(
                ApiResponse.success("전송 이력 조회 완료", historyList)
        );
    }
    
    /**
     * 3. [PUT /api/history/{historyId}/status] 특정 이력 상태 수동 업데이트 (로그인 필수)
     */
    @PutMapping("/{historyId}/status")
    public ResponseEntity<ApiResponse<HistoryResponse>> updateHistoryStatus(
            @PathVariable Long historyId,
            @RequestBody HistoryStatusUpdateRequest request,
            HttpSession session
    ) {
        UserInfoDto.Response currentUser = getSessionUser(session);
        
        // ⭐ PUT 요청은 데이터 변조이므로, 반드시 로그인되어 있어야 합니다. (인증 필수 유지)
        if (currentUser == null) {
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.failure("로그인 필요"));
        }

        // HistoryService를 통해 isClicked 또는 isConverted 필드를 업데이트합니다.
        HistoryResponse response = historyService.updateStatus(historyId, request, currentUser);
        
        if (response == null) {
             // 404 NOT_FOUND 또는 권한 없음
             return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("이력 항목을 찾을 수 없거나 권한이 없습니다."));
        }
        
        return ResponseEntity.ok(
                ApiResponse.success("이력 상태 수동 업데이트 완료", response)
        );
    }
}