package com.project.backend.domain.performance;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class TeamPerformanceResponse {

    // 1. 팀 전체 평균 지표
    private Long totalTeamMessagesSent;
    private Long totalTeamSuccess;
    private Long totalTeamClicks;
    private Long totalTeamConversions;
    
    private double teamSuccessRate;     
    private double teamClickRate;       
    private double teamConversionRate;  
    
    // 2. 팀원별 성과 및 순위 목록
    private List<MemberPerformance> memberRankings;
    
    // 3. 기간별 팀 평균 데이터 (그래프용)
    private List<DataPoint> chartData;  


    // --- 내부 클래스 1: 팀원별 성과 및 순위 정보 ---
    @Getter
    @Setter
    @Builder
    public static class MemberPerformance {
        private Long userId;
        private String userName;
        private int rank; // 순위 (1위, 2위 등)

        // 개인별 성과 지표
        private Long messagesSent;
        private Long messagesSuccess;
        private Long clicks;
        private Long conversions;
        
        private double successRate;
        private double clickRate;
        private double conversionRate;
    }
    
    // --- 내부 클래스 2: 기간별 데이터 (팀 성과 그래프용) ---
    @Getter
    @Setter
    @Builder
    public static class DataPoint {
        private String label;
        private double successRate;
        private double clickRate;
        private double conversionRate;
    }
}