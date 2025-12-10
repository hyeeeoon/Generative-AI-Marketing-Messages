package com.project.backend.domain.history.repository;

import com.project.backend.domain.history.entity.History;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HistoryRepository extends JpaRepository<History, Long> {
    List<History> findBySenderIdOrderBySentAtDesc(String senderId);
}
