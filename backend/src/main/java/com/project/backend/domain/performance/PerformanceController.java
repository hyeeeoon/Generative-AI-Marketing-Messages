package com.project.backend.domain.performance;

import com.project.backend.domain.performance.PerformanceResponse;
import com.project.backend.domain.performance.PerformanceService;
import com.project.backend.domain.user.dto.UserInfoDto;
import com.project.backend.global.common.ApiResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/performance")
public class PerformanceController {

    private final PerformanceService performanceService;

    // 세션에서 사용자 정보 가져오는 유틸리티
    private UserInfoDto.Response getSessionUser(HttpSession session) {
        return (UserInfoDto.Response) session.getAttribute("LOGIN_USER");
    }

    /**
     * 1. [GET /api/performance] 개인 또는 팀 성과 분석 데이터 조회
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PerformanceResponse>> getPerformanceData(
            HttpSession session,
            @RequestParam(defaultValue = "INDIVIDUAL") String scope // INDIVIDUAL 또는 TEAM
    ) {
        UserInfoDto.Response currentUser = getSessionUser(session);

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.failure("로그인 필요"));
        }
        
        // 권한 검증 로직 (예: scope=TEAM 일 경우, 사용자의 role이 TEAM_LEAD인지 확인)
        // ...
        
        // PerformanceService 호출하여 데이터 분석
        PerformanceResponse response = performanceService.analyzePerformance(currentUser, scope);

        return ResponseEntity.ok(
                ApiResponse.success("성과 분석 데이터 조회 완료", response)
        );
    }
    
    /**
     * 2. [GET /api/performance/ai-analysis] Gemini 기반 AI 분석 코멘트 조회 (3단계와 연결)
     */
    @GetMapping("/ai-analysis")
    public ResponseEntity<ApiResponse<String>> getAIAnalysis(
            HttpSession session,
            @RequestParam(defaultValue = "INDIVIDUAL") String scope
    ) {
        UserInfoDto.Response currentUser = getSessionUser(session);
        
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.failure("로그인 필요"));
        }
        
        // 1. 성과 데이터를 먼저 계산
        PerformanceResponse performanceData = performanceService.analyzePerformance(currentUser, scope);

        // 2. AI Service를 통해 분석 코멘트 생성
        String analysisResult = performanceService.getAIAnalysisComment(performanceData);
        
        return ResponseEntity.ok(
                ApiResponse.success("AI 성과 분석 코멘트 생성 완료", analysisResult)
        );
    }
}