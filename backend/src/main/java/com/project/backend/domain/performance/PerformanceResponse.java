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
    
    private String userName; 
    
    private Long totalMessagesSent;
    private Long totalMessagesSuccess;
    private double successRate; 

    private Long totalClicks;       
    private Long totalConversions;  
    private double clickRate;       
    private double conversionRate;  

    private List<DataPoint> chartData;

    // --- 내부 클래스 ---
    @Getter
    @Setter
    @Builder
    public static class DataPoint {
        private String label; // YYYY-MM 또는 YYYY-MM-DD
        private LocalDateTime dateTime;
        private double successRate;
        
        private double clickRate;
        private double conversionRate;
    }
}