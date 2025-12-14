package com.project.backend.domain.performance;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class PerformanceResponse {
    
    // 기존 지표 (예시)
    private Long totalMessagesSent;
    private Long totalMessagesSuccess;
    private double successRate; // 전송 성공률

    // ⭐ 새로 추가된 지표
    private Long totalClicks;       // 총 클릭 수 (isClicked = true)
    private Long totalConversions;  // 총 전환 수 (isConverted = true)
    private double clickRate;       // 클릭률 (totalClicks / totalMessagesSent)
    private double conversionRate;  // 전환율 (totalConversions / totalMessagesSent)

    // 기간별 데이터 구조 (그래프용)
    private List<DataPoint> chartData;

    // --- 내부 클래스 ---
    @Getter
    @Setter
    @Builder
    public static class DataPoint {
        private String label; // YYYY-MM 또는 YYYY-MM-DD
        private LocalDateTime dateTime;
        private double successRate;
        
        // ⭐ 새로 추가된 기간별 지표
        private double clickRate;
        private double conversionRate;
    }
}