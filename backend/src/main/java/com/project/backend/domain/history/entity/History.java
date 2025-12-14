package com.project.backend.domain.history.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.Builder.Default; // ⭐ 1. Lombok Default import 추가
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
    
    // =========================================================
    // ⭐ 성과 분석 및 전환율 측정을 위해 추가/수정된 필드
    // =========================================================

    // ⭐ 2. isSuccess 필드 추가 (PerformanceService 오류 해결)
    @Default
    @Column(name = "is_success", nullable = false)
    private boolean isSuccess = true; // 기본값: 성공했다고 가정

    // ⭐ 1. Lombok 경고 해결: @Default 추가
    @Default
    @Column(name = "is_clicked", nullable = false)
    private boolean isClicked = false; // 기본값: 클릭 안됨

    // ⭐ 1. Lombok 경고 해결: @Default 추가
    @Default
    @Column(name = "is_converted", nullable = false)
    private boolean isConverted = false; // 기본값: 전환 안됨

    // =========================================================
    // 상태 업데이트를 위한 Setter (Service에서 사용)
    // =========================================================
    public void updateStatus(String statusType, boolean value) {
        if ("isClicked".equalsIgnoreCase(statusType)) {
            this.isClicked = value;
        } else if ("isConverted".equalsIgnoreCase(statusType)) {
            // 전환이 기록되면, 클릭도 함께 기록되었다고 가정하는 것이 일반적입니다.
            this.isConverted = value;
            if (value && !this.isClicked) {
                 this.isClicked = true; // 전환 발생 시 클릭은 필수 전제 조건
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
            // isSuccess, isClicked, isConverted는 @Default에 의해 false/true 기본값 적용
            .build();
    }
}