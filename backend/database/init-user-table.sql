-- database/init-user-table.sql
CREATE DATABASE IF NOT EXISTS user_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE user_db;

CREATE TABLE IF NOT EXISTS user_info (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  userId VARCHAR(50) UNIQUE NOT NULL,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('ktcs_user', 'admin', 'portal_admin') DEFAULT 'ktcs_user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_userId (userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 테스트용 계정 (배포 시 삭제)
INSERT IGNORE INTO user_info (userId, username, password, role) VALUES
('2025', '김상담', '$2b$10$xxxxxxxxxxxxxxxxxxxxxx', 'ktcs_user'),  -- 비번 1234
('admin', '관리자', '$2b$10$yyyyyyyyyyyyyyyyyyyyyy', 'admin'),
('portal', '포털관리자', '$2b$10$zzzzzzzzzzzzzzzzzzzzzz', 'portal_admin');