package com.project.backend.domain.history.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder; // <-- @Builder 필수
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder // <-- @Builder 필수
public class HistoryResponse {
    private Long id;
    private String customerId;
    private String customerName;
    private String messageContent;
    private String channel;
    private String event;
    private String purpose;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime sentAt;
    
    private String senderId;

    // 클릭 및 전환 상태
    private boolean isClicked;
    private boolean isConverted;
}