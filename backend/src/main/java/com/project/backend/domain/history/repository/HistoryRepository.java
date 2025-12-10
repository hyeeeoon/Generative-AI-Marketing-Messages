package com.project.backend.domain.history.repository;

import com.project.backend.domain.history.entity.History;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
// History 엔티티를 관리하는 Repository 인터페이스 정의
public interface HistoryRepository extends JpaRepository<History, Long> {

    // 1. 전체 이력을 발송 시간 내림차순으로 조회 (관리자용)
    List<History> findAllByOrderBySentAtDesc();

    // 2. 특정 발송자 ID의 이력을 발송 시간 내림차순으로 조회 (일반 사용자용)
    List<History> findBySenderIdOrderBySentAtDesc(String senderId);
}