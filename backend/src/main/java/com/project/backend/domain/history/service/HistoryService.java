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

    // [POST] 메시지 전송 및 이력 저장
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

    // [GET] 전송 이력 전체 조회 (Sender ID 기준)
    
    public List<HistoryResponse> getFilteredHistory(UserInfoDto.Response currentUser) {
        
        List<History> historyList = historyRepository.findBySenderIdOrderBySentAtDesc(currentUser.getId().toString());
        
        return historyList.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    // [PUT] 특정 이력의 클릭 또는 전환 상태를 수동으로 업데이트합니다.
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

        // 1. 권한 검증: 이력의 Sender와 현재 사용자가 일치하는지 확인
        if (!history.getSenderId().equals(currentUser.getId().toString())) {
            return null; // 권한 없음
        }

        // 2. 상태 타입 검증 및 엔티티 업데이트
        String statusType = request.getStatusType();
        boolean value = request.isValue();

        if ("CLICKED".equalsIgnoreCase(statusType)) {
            history.updateStatus("isClicked", value);
        } else if ("CONVERTED".equalsIgnoreCase(statusType)) {
            history.updateStatus("isConverted", value);
        } else {
            throw new IllegalArgumentException("지원하지 않는 상태 타입입니다: " + statusType);
        }

        // 3. 업데이트된 DTO 반환
        return convertToResponse(history);
    }

    /**
     * Entity를 Response DTO로 변환
     */
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