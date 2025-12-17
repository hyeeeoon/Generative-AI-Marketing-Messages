package com.project.backend.domain.performance;

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
    public ResponseEntity<ApiResponse<?>> getPerformanceData( 
            HttpSession session,
            @RequestParam(defaultValue = "INDIVIDUAL") String scope, 
            @RequestParam(defaultValue = "MONTHLY") String timeUnit 
    ) {
        UserInfoDto.Response currentUser = getSessionUser(session);

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.failure("로그인 필요"));
        }
        
        // PerformanceService 호출하여 데이터 분석 (scope와 timeUnit 전달)
        // Service 메서드는 scope에 따라 적절한 DTO(Object)를 반환합니다.
        Object responseData = performanceService.analyzePerformance(currentUser, scope, timeUnit);
        
        if ("TEAM".equalsIgnoreCase(scope)) {
            // TeamPerformanceResponse 반환 시
            return ResponseEntity.ok(
                    ApiResponse.success("팀 성과 분석 데이터 조회 완료", responseData)
            );
        } else { // INDIVIDUAL
            // PerformanceResponse 반환 시
            return ResponseEntity.ok(
                    ApiResponse.success("개인 성과 분석 데이터 조회 완료", responseData)
            );
        }
    }
    
    /**
     * 2. [GET /api/performance/ai-analysis] Gemini 기반 AI 분석 코멘트 조회
     */
    @GetMapping("/ai-analysis")
    public ResponseEntity<ApiResponse<String>> getAIAnalysis(
            HttpSession session,
            @RequestParam(defaultValue = "INDIVIDUAL") String scope,
            @RequestParam(defaultValue = "MONTHLY") String timeUnit 
    ) {
        UserInfoDto.Response currentUser = getSessionUser(session);
        
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.failure("로그인 필요"));
        }
        
        PerformanceResponse individualPerformanceData;
        
        // AI 분석은 PerformanceResponse 구조를 요구하므로 INDIVIDUAL만 허용합니다.
        if ("TEAM".equalsIgnoreCase(scope)) {
             return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("AI 분석은 현재 개인(INDIVIDUAL) 성과만 지원합니다."));
        } else {
             // 개인 분석 로직 호출 (PerformanceResponse 반환)
             // analyzeIndividualPerformance 메서드는 PerformanceResponse를 반환합니다.
             individualPerformanceData = performanceService.analyzeIndividualPerformance(currentUser, timeUnit);
        }
        
        // 2. AI Service를 통해 분석 코멘트 생성
        String analysisResult = performanceService.getAIAnalysisComment(individualPerformanceData);
        
        return ResponseEntity.ok(
                ApiResponse.success("AI 성과 분석 코멘트 생성 완료", analysisResult)
        );
    }
}