package com.project.backend.domain.history.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.Builder.Default;
import java.time.LocalDateTime;

@Entity
@Table(name = "history")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class History {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_id", nullable = false)
    private String customerId;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "message_content", columnDefinition = "TEXT")
    private String messageContent;

    @Column(name = "channel")
    private String channel;

    @Column(name = "event")
    private String event;

    @Column(name = "purpose")
    private String purpose;

    @Column(name = "sender_id", nullable = false)
    private String senderId;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;
    
    //  성과 분석 및 전환율 측정을 위한 필드 - DB 컬럼명과 매핑

    @Default
    @Column(name = "is_clicked", nullable = false)
    private boolean isClicked = false; 

    @Default
    @Column(name = "converted", nullable = false) 
    private boolean isConverted = false; 

    @Default
    @Column(name = "is_success", nullable = false)
    private boolean isSuccess = true;
    
    // =========================================================
    
    public void updateStatus(String statusType, boolean value) {
        // Service에서 호출하는 상태 업데이트 로직
        if ("isClicked".equalsIgnoreCase(statusType)) {
            this.isClicked = value;
        } else if ("isConverted".equalsIgnoreCase(statusType)) {
            this.isConverted = value;
            if (value && !this.isClicked) {
                 this.isClicked = true; // 전환 시 클릭 자동 기록
            }
        }
    }
    
    // 비즈니스 로직에 필요한 생성 메서드 
    public static History create(
        String customerId, String customerName, String messageContent,
        String channel, String event, String purpose, String senderId) {
        
        return History.builder()
            .customerId(customerId)
            .customerName(customerName)
            .messageContent(messageContent)
            .channel(channel)
            .event(event)
            .purpose(purpose)
            .senderId(senderId)
            .sentAt(LocalDateTime.now())
            .build();
    }
}