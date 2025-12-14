package com.project.backend.domain.performance;

import com.project.backend.domain.history.entity.History;
import com.project.backend.domain.history.repository.HistoryRepository;
import com.project.backend.domain.performance.PerformanceResponse;
import com.project.backend.domain.user.dto.UserInfoDto;
import com.project.backend.global.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PerformanceService {

    private final HistoryRepository historyRepository;
    private final AIService aiService; // ⭐ AIService 주입 활성화

    // PerformanceController가 호출하는 메서드 (AI 분석)
    public String getAIAnalysisComment(PerformanceResponse performanceData) {
        // 3단계 완료: AIService의 getPerformanceAnalysis 호출
        return aiService.getPerformanceAnalysis(performanceData);
    }
    
    // 성과 분석을 수행하고 PerformanceResponse DTO를 반환합니다.
    public PerformanceResponse analyzePerformance(UserInfoDto.Response currentUser, String analysisScope) {
        
        List<History> allHistories;
        if ("TEAM".equalsIgnoreCase(analysisScope)) {
            // 팀 권한 로직: 모든 팀원의 이력을 조회
            allHistories = historyRepository.findAll();
        } else { // "INDIVIDUAL"
            // 개인 권한 로직
            allHistories = historyRepository.findBySenderId(currentUser.getId().toString());
        }

        long totalMessagesSent = allHistories.size();
        
        // 2. 핵심 총합 지표 계산
        long totalSuccess = allHistories.stream().filter(History::isSuccess).count();
        long totalClicks = allHistories.stream().filter(History::isClicked).count();
        long totalConversions = allHistories.stream().filter(History::isConverted).count();

        // 3. 비율 계산
        double successRate = totalMessagesSent > 0 ? (double) totalSuccess / totalMessagesSent : 0.0;
        double clickRate = totalMessagesSent > 0 ? (double) totalClicks / totalMessagesSent : 0.0;
        double conversionRate = totalMessagesSent > 0 ? (double) totalConversions / totalMessagesSent : 0.0;

        // 4. 기간별 데이터 계산: calculateChartData 호출
        List<PerformanceResponse.DataPoint> chartData = calculateChartData(allHistories); 
        
        // 5. 응답 DTO 빌드 및 반환
        return PerformanceResponse.builder()
                .totalMessagesSent(totalMessagesSent)
                .totalMessagesSuccess(totalSuccess)
                .successRate(successRate)
                .totalClicks(totalClicks)
                .totalConversions(totalConversions)
                .clickRate(clickRate)
                .conversionRate(conversionRate)
                .chartData(chartData)
                .build();
    }
    
    // =========================================================
    // Chart Data 계산 로직 (월별 그룹화 및 지표 계산)
    // =========================================================
    private List<PerformanceResponse.DataPoint> calculateChartData(List<History> histories) {
        if (histories.isEmpty()) {
            return List.of();
        }
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

        // 1. 월별로 History 리스트를 그룹화
        Map<String, List<History>> groupedByMonth = histories.stream()
            .collect(Collectors.groupingBy(
                h -> h.getSentAt().format(formatter)
            ));

        // 2. 그룹별로 지표를 계산하고 DataPoint로 변환
        return groupedByMonth.entrySet().stream()
            .map(entry -> {
                String monthLabel = entry.getKey();
                List<History> monthlyHistories = entry.getValue();
                
                long sentCount = monthlyHistories.size();
                long successCount = monthlyHistories.stream().filter(History::isSuccess).count();
                long clickCount = monthlyHistories.stream().filter(History::isClicked).count();
                long conversionCount = monthlyHistories.stream().filter(History::isConverted).count();

                // 월별 비율 계산
                double monthlySuccessRate = sentCount > 0 ? (double) successCount / sentCount : 0.0;
                double monthlyClickRate = sentCount > 0 ? (double) clickCount / sentCount : 0.0;
                double monthlyConversionRate = sentCount > 0 ? (double) conversionCount / sentCount : 0.0;

                return PerformanceResponse.DataPoint.builder()
                    .label(monthLabel) // 예: "2025-12"
                    .dateTime(monthlyHistories.get(0).getSentAt()) // 정렬을 위해 첫 번째 항목의 날짜 사용
                    .successRate(monthlySuccessRate)
                    .clickRate(monthlyClickRate)
                    .conversionRate(monthlyConversionRate)
                    .build();
            })
            // 3. 월별 라벨 기준으로 정렬 (최신 월이 마지막에 오도록)
            .sorted(Comparator.comparing(PerformanceResponse.DataPoint::getLabel))
            .collect(Collectors.toList());
    }

}