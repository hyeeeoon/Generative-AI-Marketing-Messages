package com.project.backend.domain.notice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notices")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(length = 50)
    private String author = "관리자";

    // 필독 여부 추가 (true = 필독)
    @Column(name = "is_important", nullable = false)
    private boolean important = false;

    // 작성일, 수정일 (DB 컬럼명과 정확히 매핑)
    @Column(name = "createdAt", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updatedAt")
    private LocalDateTime updatedAt;

    // 논리적 삭제를 위한 soft delete (선택 사항, 나중에 필요하면)
    // @Column(name = "deleted_at")
    // private LocalDateTime deletedAt;
}