package com.project.backend.domain.history.entity;

import jakarta.persistence.*; 
import lombok.Getter;
import lombok.Setter;
import lombok.Builder; 
import lombok.NoArgsConstructor; 
import lombok.AllArgsConstructor; 
import java.time.LocalDateTime;

@Entity
@Table(name = "history")

@Getter
@Setter
@Builder 
@NoArgsConstructor 
@AllArgsConstructor 
public class History {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "customer_id", nullable = false)
    private String customerId;
    
    @Column(name = "customer_name", nullable = false)
    private String customerName;
    
    @Column(name = "message_content", columnDefinition = "TEXT", nullable = false)
    private String messageContent;
    
    @Column(nullable = false)
    private String channel;
    
    private String event;
    private String purpose;
    
    @Column(name = "sent_at", nullable = false)
    private LocalDateTime sentAt;
    
    @Column(name = "sender_id", nullable = false)
    private String senderId; // 발송자 (사용자 ID)
}