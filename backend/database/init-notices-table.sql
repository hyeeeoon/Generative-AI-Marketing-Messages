-- 공지사항 테이블 완전 정리본
-- 실행 전: user_db 선택돼 있어야 함
-- 실행 방법: mysql -u root -p1234 user_db < database/init-notices-table.sql

USE user_db;

-- 기존 notices 테이블 있으면 삭제 (주의: 데이터 날아감!)
DROP TABLE IF EXISTS notices;

-- 완전히 새로 만들기
CREATE TABLE notices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    title VARCHAR(200) NOT NULL COMMENT '공지사항 제목',
    content TEXT NOT NULL COMMENT '공지사항 내용',
    
    author VARCHAR(50) DEFAULT '관리자' COMMENT '작성자',
    
    -- 필독 여부 (1 = 필독, 0 = 일반)
    is_important TINYINT(1) DEFAULT 0 COMMENT '필독 공지사항 여부',
    
    -- JPA랑 딱 맞는 camelCase 컬럼명
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '작성일',
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
    
    -- 인덱스 (성능 + 필독 먼저 정렬)
    INDEX idx_important_created (is_important DESC, createdAt DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='사내 공지사항';

-- 샘플 데이터 넣기 (테스트용)
INSERT INTO notices (title, content, author, is_important, createdAt) VALUES
('개인정보보호 가이드라인 개정 안내', '2025년도 개인정보보호 규정이 강화됩니다.\n모든 직원은 반드시 숙지하시기 바랍니다.', '관리자', 1, '2025-12-03 10:00:00'),
('신규 AI 템플릿 배포 완료', '고객 맞춤형 AI 메시지 템플릿 12종이 배포되었습니다.\n마케팅팀은 오늘부터 사용 가능합니다.', '관리자', 0, '2025-12-02 14:30:00'),
('11월 시스템 정기 점검 안내', '11월 28일(목) 23:00 ~ 01:00 시스템 점검이 있습니다.\n이용에 참고하시기 바랍니다.', '관리자', 0, '2025-11-25 09:00:00'),
('연말연시 근무 일정 안내', '12월 30일 ~ 1월 2일 재택근무 가능합니다.\n필요 시 사전에 팀장과 협의 바랍니다.', '관리자', 1, '2025-12-01 11:00:00');

-- 확인용 쿼리 (이거 실행하면 잘 들어갔는지 바로 확인됨)
SELECT 
    id,
    title,
    LEFT(content, 50) AS 미리보기,
    author,
    CASE WHEN is_important = 1 THEN '필독' ELSE '일반' END AS 중요도,
    DATE_FORMAT(createdAt, '%m월 %d일') AS 작성일
FROM notices 
ORDER BY is_important DESC, createdAt DESC;