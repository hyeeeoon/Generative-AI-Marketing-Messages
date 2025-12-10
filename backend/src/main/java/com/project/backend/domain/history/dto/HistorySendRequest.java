//메시지 생성 페이지(Generator.jsx)에서 전송 시 서버로 보낼 데이터 구조입니다.
package com.project.backend.domain.history.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor; // 기본 생성자 추가
import lombok.AllArgsConstructor; // 모든 필드를 포함하는 생성자 추가

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistorySendRequest {
    private String customerId;      // 고객 ID (예: 'C-1234')
    private String customerName;    // 고객 이름
    private String messageContent;  // 전송된 메시지 본문
    private String channel;         // 전송 채널 (SMS, 알림톡)
    private String event;           // 마케팅 이벤트 (예: '수능 끝!')
    private String purpose;         // 마케팅 목적 (예: '혜택 알림')
}