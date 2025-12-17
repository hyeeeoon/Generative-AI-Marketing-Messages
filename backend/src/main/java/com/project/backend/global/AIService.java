package com.project.backend.global;

import com.project.backend.domain.performance.PerformanceResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.Collections;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AIService {

    @Value("${GEMINI_API_KEY}")
    private String geminiApiKey; 

    // 성능 분석에는 비교적 빠른 gemini-2.5-flash 모델 사용을 가정
    private static final String ANALYSIS_MODEL = "gemini-2.5-flash"; 
    private static final String GEMINI_BASE_URL = 
        "https://generativelanguage.googleapis.com/v1beta/models/";

    // 성과 데이터를 기반으로 Gemini 모델에 분석을 요청하고 코멘트를 반환합니다.
    public String getPerformanceAnalysis(PerformanceResponse data) {
        
        // 1. 분석 요청을 위한 프롬프트 구성
        String prompt = buildAnalysisPrompt(data);

        // 2. WebClient를 사용하여 실제 API 호출
        try {
            // ⭐ 재시도 없이 단순 호출
            String responseBody = callApiWithWebClient(prompt, ANALYSIS_MODEL);
            
            // ⭐ 응답 JSON에서 텍스트 결과만 파싱 (구현 필요)
            return parseGeminiResponse(responseBody); 
            
        } catch (Exception e) {
            System.err.println("Gemini API 호출 중 오류 발생: " + e.getMessage());
            if (geminiApiKey == null || geminiApiKey.isEmpty()) {
                 return "AI 분석 실패: GEMINI_API_KEY가 로드되지 않았습니다. 환경 변수 설정을 확인하세요.";
            }
            // 오류 시 더미 분석 반환 (WebClient가 작동한다고 가정)
            return generateDummyAnalysis(data); 
        }
    }

    // 마케팅 메시지 생성 기능 (이전 답변의 WebClient 로직 유지)
    // public String generateMarketingMessage(Map<String, Object> customer, Map<String, String> formFilters) { ... }


    // =========================================================
    // 공통 API 통신 유틸리티
    // =========================================================

    /**
     * WebClient를 사용하여 Gemini API에 POST 요청을 보냅니다.
     */
    private String callApiWithWebClient(String prompt, String modelName) {
        
        String url = GEMINI_BASE_URL + modelName + ":generateContent?key=" + geminiApiKey;

        WebClient webClient = WebClient.builder()
            .baseUrl(url)
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .build();
        
        // Gemini API 요청 본문 (JSON 구조)
        Map<String, Object> requestBody = Map.of(
            "contents", Collections.singletonList(Map.of("parts", Collections.singletonList(Map.of("text", prompt))))
        );
        
        // API 호출 및 응답
        return webClient.post()
            .bodyValue(requestBody)
            .retrieve()
            .bodyToMono(String.class)
            .block(); // 동기 호출 (WebClientResponseException 발생 가능)
    }
    
    // =========================================================
    // 프롬프트 및 파싱 로직 (간소화)
    // =========================================================

    // Gemini 응답 JSON에서 최종 텍스트만 추출합니다. (실제 JSON 파싱 필요)
    private String parseGeminiResponse(String jsonResponse) {
        // 실제로는 Jackson 또는 Gson을 사용해 JSON의 candidates[0].content.parts[0].text를 추출해야 합니다.
        if (jsonResponse != null && jsonResponse.contains("candidates")) {
             // JSON 파싱에 성공했다고 가정하고 더미 텍스트를 반환
             return "실제 AI 분석 코멘트 (JSON 파싱 성공 가정)"; 
        }
        return "AI 분석 코멘트 파싱 실패";
    }

    private String buildAnalysisPrompt(PerformanceResponse data) {
        // ... (이전과 동일한 프롬프트 구성 로직)
        return "당신은 마케팅 성과 분석 전문가입니다. ...";
    }
    
    private String generateDummyAnalysis(PerformanceResponse data) {
        // ... (이전과 동일한 더미 분석 로직)
        return "⚠️ **[AI 진단: 주의 필요]**...";
    }
}