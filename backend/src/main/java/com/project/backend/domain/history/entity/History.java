package com.project.backend.domain.history.entity;

import jakarta.persistence.*;
import lombok.*;
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
    
    // --- 비즈니스 로직에 필요한 생성 메서드 ---
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