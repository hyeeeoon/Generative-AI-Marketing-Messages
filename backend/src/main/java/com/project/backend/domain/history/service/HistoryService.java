package com.project.backend.domain.history.service;

import com.project.backend.domain.history.dto.HistoryResponse;
import com.project.backend.domain.history.dto.HistorySendRequest;
import com.project.backend.domain.history.dto.HistoryStatusUpdateRequest;
import com.project.backend.domain.history.entity.History;
import com.project.backend.domain.history.repository.HistoryRepository;
import com.project.backend.domain.user.dto.UserInfoDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HistoryService {

    private final HistoryRepository historyRepository;

    // [POST] 메시지 전송 및 이력 저장 (로그인 필수)
    @Transactional
    public HistoryResponse record(HistorySendRequest request, UserInfoDto.Response sender) {
        
        History newHistory = History.create(
            request.getCustomerId(),
            request.getCustomerName(),
            request.getMessageContent(),
            request.getChannel(),
            request.getEvent(),
            request.getPurpose(),
            sender.getId().toString() 
        );
        
        History savedHistory = historyRepository.save(newHistory);
        
        return convertToResponse(savedHistory);
    }

    // [GET] 전송 이력 조회 (RBAC 로직 적용: portal_admin은 전체 조회)
    public List<HistoryResponse> getFilteredHistory(UserInfoDto.Response currentUser) {
        
        List<History> historyList;
        
        // App.jsx에서 /tracker를 인증 필수 경로로 옮기지 않았다면 이 코드는 유효합니다.
        if (currentUser == null) {
            // 비인증 사용자에게는 빈 목록 반환 또는 전체 공개 데이터 반환 (현재는 빈 목록 반환)
             return List.of(); 
        } 
        
        // RBAC: portal_admin은 전체 조회, 나머지는 자기 것만 조회
        boolean isPortalAdmin = "portal_admin".equalsIgnoreCase(currentUser.getRole());

        if (isPortalAdmin) {
            historyList = historyRepository.findAll();
        } else {
            historyList = historyRepository.findBySenderIdOrderBySentAtDesc(currentUser.getId().toString());
        }
        
        return historyList.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    // [PUT] 특정 이력의 클릭 또는 전환 상태를 수동으로 업데이트합니다. (RBAC 로직 적용)
    @Transactional
    public HistoryResponse updateStatus(
            Long historyId, 
            HistoryStatusUpdateRequest request, 
            UserInfoDto.Response currentUser
    ) {
        Optional<History> historyOptional = historyRepository.findById(historyId);
        
        if (historyOptional.isEmpty()) {
            return null; // 이력 ID를 찾을 수 없음
        }

        History history = historyOptional.get();

        // 1. RBAC 검증: portal_admin은 모든 이력 수정 가능하도록 예외 처리
        boolean isPortalAdmin = "portal_admin".equalsIgnoreCase(currentUser.getRole());

        if (!isPortalAdmin && !history.getSenderId().equals(currentUser.getId().toString())) {
            return null; // 권한 없음
        }

        // 2. 상태 타입 검증 및 엔티티 업데이트 (로직 간소화)
        String statusType = request.getStatusType();
        boolean value = request.isValue();
        // History 엔티티의 updateStatus 메서드가 로직을 처리하도록 위임합니다.
        history.updateStatus(statusType, value); 
        
        // 3. 업데이트된 DTO 반환
        return convertToResponse(history);
    }

    private HistoryResponse convertToResponse(History history) {
        return HistoryResponse.builder()
            .id(history.getId())
            .customerId(history.getCustomerId())
            .customerName(history.getCustomerName())
            .messageContent(history.getMessageContent())
            .channel(history.getChannel())
            .event(history.getEvent())
            .purpose(history.getPurpose())
            .senderId(history.getSenderId())
            .sentAt(history.getSentAt())
            .isClicked(history.isClicked())
            .isConverted(history.isConverted())
            .build();
    }
}