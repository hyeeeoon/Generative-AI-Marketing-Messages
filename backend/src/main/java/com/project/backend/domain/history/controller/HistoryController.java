package com.project.backend.domain.history.controller;

import com.project.backend.domain.history.dto.HistoryResponse;
import com.project.backend.domain.history.dto.HistorySendRequest;
import com.project.backend.domain.history.dto.HistoryStatusUpdateRequest; // 새로 추가된 DTO
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

    /**
     * 세션에서 현재 로그인된 사용자 정보를 가져오는 유틸리티 메서드입니다.
     * @param session 현재 HTTP 세션
     * @return 로그인된 사용자 정보 (UserInfoDto.Response), 로그인되지 않았을 경우 null
     */
    private UserInfoDto.Response getSessionUser(HttpSession session) {
        // UserInfoDto.Response 클래스는 반드시 @Getter가 포함되어 있어야 합니다.
        return (UserInfoDto.Response) session.getAttribute("LOGIN_USER");
    }

    /**
     * 1. [POST /api/history/send] 메시지 전송 및 이력 저장
     *
     * @param request 전송할 메시지 내용 및 수신자 정보
     * @param session 현재 사용자의 세션
     * @return 성공 시 저장된 HistoryResponse 객체
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

        // HistoryService에서 메시지 전송 처리 및 이력 기록 (isClicked, isConverted는 기본값 False)
        HistoryResponse response = historyService.record(request, sender); 
        
        return ResponseEntity.ok(
                ApiResponse.success("메시지 전송 및 이력 저장 완료", response)
        );
    }

    /**
     * 2. [GET /api/history] 전송 이력 전체 조회
     * (향후 필터링, 페이징 기능이 추가될 수 있습니다.)
     *
     * @param session 현재 사용자의 세션
     * @return 현재 사용자가 접근 가능한 전송 이력 목록
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<HistoryResponse>>> getAllHistory(HttpSession session) {
        UserInfoDto.Response currentUser = getSessionUser(session);
        
        if (currentUser == null) {
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.failure("로그인 필요"));
        }
        
        // HistoryService에서 현재 사용자의 권한에 맞는 이력 목록을 조회합니다.
        List<HistoryResponse> historyList = historyService.getFilteredHistory(currentUser);
        
        return ResponseEntity.ok(
                ApiResponse.success("전송 이력 조회 완료", historyList)
        );
    }
    
    /**
     * 3. [PUT /api/history/{historyId}/status] 특정 이력 상태 수동 업데이트
     * 프로젝트 시뮬레이션을 위해 프론트엔드에서 '클릭됨' 또는 '가입 완료' 상태를 수동으로 기록합니다.
     *
     * @param historyId 업데이트할 전송 이력의 고유 ID
     * @param request 업데이트할 상태 정보 (statusType: "CLICKED" 또는 "CONVERTED", value: true/false)
     * @param session 현재 사용자의 세션
     * @return 업데이트된 HistoryResponse 객체
     */
    @PutMapping("/{historyId}/status")
    public ResponseEntity<ApiResponse<HistoryResponse>> updateHistoryStatus(
            @PathVariable Long historyId,
            @RequestBody HistoryStatusUpdateRequest request,
            HttpSession session
    ) {
        UserInfoDto.Response currentUser = getSessionUser(session);
        
        if (currentUser == null) {
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.failure("로그인 필요"));
        }

        // HistoryService를 통해 isClicked 또는 isConverted 필드를 업데이트합니다.
        HistoryResponse response = historyService.updateStatus(historyId, request, currentUser);
        
        if (response == null) {
             // 404 NOT_FOUND: 해당 ID의 이력이 없거나, 현재 사용자가 접근 권한이 없는 경우
             return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("이력 항목을 찾을 수 없거나 권한이 없습니다."));
        }
        
        return ResponseEntity.ok(
                ApiResponse.success("이력 상태 수동 업데이트 완료", response)
        );
    }
}