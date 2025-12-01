// UserInfoRepository.java
package com.project.backend.domain.user.repository;

import com.project.backend.domain.user.entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserInfoRepository extends JpaRepository<UserInfo, Long> {
    boolean existsByUserId(String userId);
    Optional<UserInfo> findByUserId(String userId);

}
