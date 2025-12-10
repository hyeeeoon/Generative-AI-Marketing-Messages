// 전송 이력 목록을 조회할 때 클라이언트에게 반환할 데이터 구조
package com.project.backend.domain.history.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class HistoryResponse {
    private Long id;
    private String customerId;
    private String customerName;
    private String messageContent;
    private String channel;
    private String event;
    private String purpose;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime sentAt;   // 실제 발송 시간 (서버에서 기록)
    
    private String senderId;        // 발송자 ID (세션에서 가져옴)
}