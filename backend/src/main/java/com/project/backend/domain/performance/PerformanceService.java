package com.project.backend.domain.performance;

import com.project.backend.domain.history.entity.History;
import com.project.backend.domain.history.repository.HistoryRepository;
import com.project.backend.domain.user.dto.UserInfoDto;
import com.project.backend.domain.user.repository.UserInfoRepository;
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
    private final AIService aiService;
    private final UserInfoRepository userInfoRepository;

    // PerformanceController가 호출하는 메서드 (AI 분석)
    public String getAIAnalysisComment(PerformanceResponse performanceData) {
        return aiService.getPerformanceAnalysis(performanceData);
    }
    
    // 통합된 성과 분석 메서드: analysisScope에 따라 분기합니다.
    public Object analyzePerformance(UserInfoDto.Response currentUser, String analysisScope, String timeUnit) {
        if ("TEAM".equalsIgnoreCase(analysisScope)) {
            return analyzeTeamPerformance(currentUser, timeUnit);
        } else { // "INDIVIDUAL"
            return analyzeIndividualPerformance(currentUser, timeUnit);
        }
    }
    
    //개인 성과 분석 로직

    public PerformanceResponse analyzeIndividualPerformance(UserInfoDto.Response currentUser, String timeUnit) {
        
        List<History> allHistories = historyRepository.findBySenderId(currentUser.getId().toString());

        long totalMessagesSent = allHistories.size();
        
        long totalSuccess = allHistories.stream().filter(History::isSuccess).count();
        long totalClicks = allHistories.stream().filter(History::isClicked).count();
        long totalConversions = allHistories.stream().filter(History::isConverted).count();

        double successRate = totalMessagesSent > 0 ? (double) totalSuccess / totalMessagesSent : 0.0;
        double clickRate = totalMessagesSent > 0 ? (double) totalClicks / totalMessagesSent : 0.0;
        double conversionRate = totalMessagesSent > 0 ? (double) totalConversions / totalMessagesSent : 0.0;

        List<PerformanceResponse.DataPoint> chartData = calculateIndividualChartData(allHistories, timeUnit); 
        
        return PerformanceResponse.builder()
                .totalMessagesSent(totalMessagesSent)
                .totalMessagesSuccess(totalSuccess)
                .successRate(successRate)
                .totalClicks(totalClicks)
                .totalConversions(totalConversions)
                .clickRate(clickRate)
                .conversionRate(conversionRate)
                .chartData(chartData)
                .userName(currentUser.getUsername())
                .build();
    }
    
    
    //팀 전체 성과 분석을 수행하고 TeamPerformanceResponse DTO를 반환합니다.
    public TeamPerformanceResponse analyzeTeamPerformance(UserInfoDto.Response currentUser, String timeUnit) {
        
        List<History> allTeamHistories = historyRepository.findAll(); 

        Map<String, List<History>> historiesByMember = allTeamHistories.stream()
            .collect(Collectors.groupingBy(History::getSenderId));
            
        // 이름 조회 및 매핑을 위한 Map 생성
        Map<String, String> userIdToUsernameMap = historiesByMember.keySet().stream()
            .collect(Collectors.toMap(
                id -> id,
                // String senderId를 Long ID로 변환하여 UserInfoRepository에서 실제 사용자 이름 조회
                senderId -> userInfoRepository.findById(Long.valueOf(senderId)) 
                    .map(userInfo -> userInfo.getUsername()) 
                    .orElse("탈퇴 사용자")
            ));
            
        List<TeamPerformanceResponse.MemberPerformance> memberPerformances = historiesByMember.entrySet().stream()
            .map(entry -> {
                String senderId = entry.getKey();
                List<History> memberHistories = entry.getValue();
                
                String userName = userIdToUsernameMap.getOrDefault(senderId, "알 수 없음"); 
                
                long sent = memberHistories.size();
                long success = memberHistories.stream().filter(History::isSuccess).count();
                long clicks = memberHistories.stream().filter(History::isClicked).count();
                long conversions = memberHistories.stream().filter(History::isConverted).count();
                
                return TeamPerformanceResponse.MemberPerformance.builder()
                    .userId(Long.valueOf(senderId)) 
                    .userName(userName) // 🚨 실제 이름 사용
                    .messagesSent(sent)
                    .messagesSuccess(success)
                    .clicks(clicks)
                    .conversions(conversions)
                    .successRate(sent > 0 ? (double) success / sent : 0.0)
                    .clickRate(sent > 0 ? (double) clicks / sent : 0.0)
                    .conversionRate(sent > 0 ? (double) conversions / sent : 0.0)
                    .build();
            })
            .collect(Collectors.toList());

        // 4. 순위 매기기 (전환율 기준 내림차순 정렬)
        memberPerformances.sort(Comparator
            .comparing(TeamPerformanceResponse.MemberPerformance::getConversionRate, Comparator.reverseOrder())
            .thenComparing(TeamPerformanceResponse.MemberPerformance::getClicks, Comparator.reverseOrder()));
            
        // 5. 순위 필드 업데이트
        for (int i = 0; i < memberPerformances.size(); i++) {
            memberPerformances.get(i).setRank(i + 1);
        }

        // 6. 팀 전체 총합 계산
        long totalSent = allTeamHistories.size();
        long totalSuccess = memberPerformances.stream().mapToLong(TeamPerformanceResponse.MemberPerformance::getMessagesSuccess).sum();
        long totalClicks = memberPerformances.stream().mapToLong(TeamPerformanceResponse.MemberPerformance::getClicks).sum();
        long totalConversions = memberPerformances.stream().mapToLong(TeamPerformanceResponse.MemberPerformance::getConversions).sum();

        // 7. 팀 전체 평균 비율 계산
        double teamAvgSuccessRate = totalSent > 0 ? (double) totalSuccess / totalSent : 0.0;
        double teamAvgClickRate = totalSent > 0 ? (double) totalClicks / totalSent : 0.0;
        double teamAvgConversionRate = totalSent > 0 ? (double) totalConversions / totalSent : 0.0;
        
        // 8. 기간별 팀 평균 데이터 계산
        List<TeamPerformanceResponse.DataPoint> chartData = calculateTeamChartData(allTeamHistories, timeUnit); 

        // 9. 최종 DTO 빌드 및 반환
        return TeamPerformanceResponse.builder()
            .totalTeamMessagesSent(totalSent)
            .totalTeamSuccess(totalSuccess)
            .totalTeamClicks(totalClicks)
            .totalTeamConversions(totalConversions)
            .teamSuccessRate(teamAvgSuccessRate)
            .teamClickRate(teamAvgClickRate)
            .teamConversionRate(teamAvgConversionRate)
            .memberRankings(memberPerformances)
            .chartData(chartData)
            .build();
    }
    
    // =========================================================
    // Chart Data 계산 로직 (개인 성과 - PerformanceResponse DTO 사용)
    // =========================================================
    private List<PerformanceResponse.DataPoint> calculateIndividualChartData(List<History> histories, String timeUnit) {
        if (histories.isEmpty()) { return List.of(); }
        
        String pattern;
        switch (timeUnit.toUpperCase()) {
            case "DAILY": pattern = "yyyy-MM-dd"; break;
            case "YEARLY": pattern = "yyyy"; break;
            case "MONTHLY": default: pattern = "yyyy-MM"; break;
        }
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);

        Map<String, List<History>> groupedByTime = histories.stream()
            .collect(Collectors.groupingBy(h -> h.getSentAt().format(formatter)));

        return groupedByTime.entrySet().stream()
            .map(entry -> {
                String label = entry.getKey();
                List<History> timeHistories = entry.getValue();
                
                long sentCount = timeHistories.size();
                long successCount = timeHistories.stream().filter(History::isSuccess).count();
                long clickCount = timeHistories.stream().filter(History::isClicked).count();
                long conversionCount = timeHistories.stream().filter(History::isConverted).count();

                double calculatedSuccessRate = sentCount > 0 ? (double) successCount / sentCount : 0.0;
                double calculatedClickRate = sentCount > 0 ? (double) clickCount / sentCount : 0.0;
                double calculatedConversionRate = sentCount > 0 ? (double) conversionCount / sentCount : 0.0;

                return PerformanceResponse.DataPoint.builder()
                    .label(label) 
                    .dateTime(timeHistories.get(0).getSentAt()) 
                    .successRate(calculatedSuccessRate)
                    .clickRate(calculatedClickRate)
                    .conversionRate(calculatedConversionRate)
                    .build();
            })
            .sorted(Comparator.comparing(PerformanceResponse.DataPoint::getLabel))
            .collect(Collectors.toList());
    }
    
    // =========================================================
    // Chart Data 계산 로직 (팀 성과 - TeamPerformanceResponse DTO 사용)
    // =========================================================
    private List<TeamPerformanceResponse.DataPoint> calculateTeamChartData(List<History> histories, String timeUnit) {
        if (histories.isEmpty()) { return List.of(); }
        
        String pattern;
        switch (timeUnit.toUpperCase()) {
            case "DAILY": pattern = "yyyy-MM-dd"; break;
            case "YEARLY": pattern = "yyyy"; break;
            case "MONTHLY": default: pattern = "yyyy-MM"; break;
        }
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);

        Map<String, List<History>> groupedByTime = histories.stream()
            .collect(Collectors.groupingBy(h -> h.getSentAt().format(formatter)));

        return groupedByTime.entrySet().stream()
            .map(entry -> {
                String label = entry.getKey();
                List<History> timeHistories = entry.getValue();
                
                long sentCount = timeHistories.size();
                long successCount = timeHistories.stream().filter(History::isSuccess).count();
                long clickCount = timeHistories.stream().filter(History::isClicked).count();
                long conversionCount = timeHistories.stream().filter(History::isConverted).count();

                double calculatedSuccessRate = sentCount > 0 ? (double) successCount / sentCount : 0.0;
                double calculatedClickRate = sentCount > 0 ? (double) clickCount / sentCount : 0.0;
                double calculatedConversionRate = sentCount > 0 ? (double) conversionCount / sentCount : 0.0;

                return TeamPerformanceResponse.DataPoint.builder() 
                    .label(label) 
                    .successRate(calculatedSuccessRate)
                    .clickRate(calculatedClickRate)
                    .conversionRate(calculatedConversionRate)
                    .build();
            })
            .sorted(Comparator.comparing(TeamPerformanceResponse.DataPoint::getLabel))
            .collect(Collectors.toList());
    }
}