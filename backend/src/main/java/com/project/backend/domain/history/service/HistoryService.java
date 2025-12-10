package com.project.backend.domain.history.service;

import com.project.backend.domain.history.dto.HistoryResponse;
import com.project.backend.domain.history.dto.HistorySendRequest;
import com.project.backend.domain.history.entity.History;
import com.project.backend.domain.history.repository.HistoryRepository; 
import com.project.backend.domain.user.dto.UserInfoDto;
import lombok.RequiredArgsConstructor; 
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; 

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor 
public class HistoryService {
    
    private final HistoryRepository historyRepository; 

    // 1. 메시지 전송 기록 저장 (DB 저장으로 변경)
    @Transactional
    public HistoryResponse record(HistorySendRequest request, UserInfoDto.Response sender) {
        
        // DTO -> Entity 변환 및 Builder 패턴 사용
        History newRecord = History.builder()
                .customerId(request.getCustomerId())
                .customerName(request.getCustomerName())
                .messageContent(request.getMessageContent())
                .channel(request.getChannel())
                .event(request.getEvent())
                .purpose(request.getPurpose())
                .sentAt(LocalDateTime.now())
                .senderId(sender.getUserId()) 
                .build();
        
        // DB에 저장
        History savedRecord = historyRepository.save(newRecord);
        
        return toResponse(savedRecord);
    }

    // 2. 전송 이력 조회 ( 역할(Role) 기반 필터링 적용)
    @Transactional(readOnly = true)
    public List<HistoryResponse> getFilteredHistory(UserInfoDto.Response currentUser) {
        
        String role = currentUser.getRole();
        List<History> historyList;

        // 권한에 따른 조회 범위 분기
        if ("portal_admin".equalsIgnoreCase(role) || "admin".equalsIgnoreCase(role)) {
            // 관리자는 전체 발송 이력 조회 (최신순)
            historyList = historyRepository.findAllByOrderBySentAtDesc();
        } else { // ktcs_user (일반 사용자) 및 기타 역할
            // 일반 사용자는 자신의 senderId와 일치하는 이력만 조회
            historyList = historyRepository.findBySenderIdOrderBySentAtDesc(currentUser.getUserId());
        }
        
        // Entity를 Response DTO로 변환
        return historyList.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    // Entity -> Response 변환 유틸리티
    private HistoryResponse toResponse(History history) {
        // DTO가 @Builder를 사용한다고 가정하고 코드를 수정했습니다.
        return HistoryResponse.builder()
                .id(history.getId())
                .customerId(history.getCustomerId())
                .customerName(history.getCustomerName())
                .messageContent(history.getMessageContent())
                .channel(history.getChannel())
                .event(history.getEvent())
                .purpose(history.getPurpose())
                .sentAt(history.getSentAt())
                .senderId(history.getSenderId())
                .build();
    }
}