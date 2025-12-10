package com.project.backend.domain.history.service;

import com.project.backend.domain.history.dto.HistoryResponse;
import com.project.backend.domain.history.dto.HistorySendRequest;
import com.project.backend.domain.history.entity.History;
import com.project.backend.domain.history.repository.HistoryRepository;
import com.project.backend.domain.user.dto.UserInfoDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HistoryService {

    private final HistoryRepository historyRepository;

    public HistoryResponse record(HistorySendRequest request, UserInfoDto.Response sender) {
        
        // 1. History Entity 생성
        History newHistory = History.create(
            request.getCustomerId(),
            request.getCustomerName(),
            request.getMessageContent(),
            request.getChannel(),
            request.getEvent(),
            request.getPurpose(),
            sender.getId().toString() // User ID가 Long일 경우를 대비해 String으로 변환
        );
        
        // 2. DB에 저장
        History savedHistory = historyRepository.save(newHistory);
        
        // 3. 응답 DTO로 변환하여 반환
        return convertToResponse(savedHistory);
    }

    public List<HistoryResponse> getFilteredHistory(UserInfoDto.Response currentUser) {
        
        // **오류 수정:** currentUser.getId()를 String으로 변환하여 Repository 메서드에 전달
        // (이전 오류: incompatible types: Long cannot be converted to String)
        List<History> historyList = historyRepository.findBySenderIdOrderBySentAtDesc(currentUser.getId().toString());
        
        // 응답 DTO 리스트로 변환하여 반환
        return historyList.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
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
            .build();
    }
}