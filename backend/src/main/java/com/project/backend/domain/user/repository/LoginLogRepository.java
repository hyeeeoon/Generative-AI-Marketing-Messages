// LoginLogRepository.java
package com.project.backend.domain.login.repository;

import com.project.backend.domain.login.entity.LoginLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LoginLogRepository extends JpaRepository<LoginLog, Long> {
    List<LoginLog> findByUserIdOrderByLoginTimeDesc(Long userId);
}
