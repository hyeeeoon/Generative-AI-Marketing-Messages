package com.project.backend.domain.login.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "loginLogs")
public class LoginLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "userId", nullable = false)
    private Long userId;  // userInfo.id 참조

    @Column(name = "loginTime", nullable = false)
    private LocalDateTime loginTime;

    @Column(name = "success", nullable = false)
    private Boolean success;

    @Column(name = "ipAddress")
    private String ipAddress;

    @PrePersist
    protected void onCreate() {
        loginTime = LocalDateTime.now();
    }
}
