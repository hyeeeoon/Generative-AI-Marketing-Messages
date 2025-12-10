-- 전송 이력 테이블 완전 정리본 (History Table DDL)
-- 실행 전: user_db 선택돼 있어야 함
-- 실행 방법: mysql -u root -p1234 user_db < database/init-history-table.sql

USE user_db;

-- 기존 history 테이블 있으면 삭제 (주의: 데이터 날아감!)
DROP TABLE IF EXISTS history;

-- 완전히 새로 만들기
CREATE TABLE history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- 고객 정보
    customer_id VARCHAR(255) NOT NULL COMMENT '고객 ID (예: C-1234)',
    customer_name VARCHAR(255) NOT NULL COMMENT '고객 이름',
    
    -- 메시지 정보
    message_content TEXT NOT NULL COMMENT '전송된 메시지 본문',
    channel VARCHAR(50) NOT NULL COMMENT '전송 채널 (SMS, 알림톡)',
    
    -- 마케팅 정보
    event VARCHAR(255) COMMENT '마케팅 이벤트명',
    purpose VARCHAR(255) COMMENT '마케팅 목적',
    
    -- 발송자 및 시간 정보
    sender_id VARCHAR(255) NOT NULL COMMENT '발송자 ID (로그인 유저 ID)',
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '발송 시간',
    
    -- 인덱스 (성능 향상 목적)
    INDEX idx_sent_at (sent_at DESC),              -- 최신순 조회
    INDEX idx_sender_id (sender_id),              -- 발송자별 조회
    INDEX idx_customer_id (customer_id)           -- 고객별 조회
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI 메시지 전송 이력';

-- 샘플 데이터 넣기 (테스트용)
INSERT INTO history (customer_id, customer_name, message_content, channel, event, purpose, sender_id, sent_at) VALUES
(
    'C-001', 
    '김철수', 
    '김철수 고객님, 놓치지 마세요! 수능 끝! Y틴 데이터 2배 혜택이 기다리고 있습니다. 친구들과 함께 즐거운 연말 보내세요!', 
    'SMS', 
    '수능 끝! Y틴 데이터 2배', 
    '혜택 알림', 
    '2025', 
    '2025-12-10 18:00:00'
),
(
    'C-005', 
    '이영희', 
    '안녕하세요 이영희 고객님. 리얼 5G 사전 예약이 오늘 마감됩니다. 프리미엄 요금제에만 드리는 특별 사은품을 받아가세요.', 
    '알림톡', 
    '리얼5G 사전 예약', 
    '신상품 안내', 
    '2025', 
    '2025-12-10 18:05:00'
),
(
    'C-010', 
    '박민지', 
    '박민지님, 6개월 약정 만료가 곧 다가옵니다. 이번 달 재약정 시 월 5천원 추가 할인 프로모션에 참여해 보세요!', 
    'SMS', 
    '재약정 프로모션', 
    '프로모션 안내', 
    'admin', 
    '2025-12-10 18:10:00'
),
(
    'C-001', 
    '김철수', 
    '김철수 고객님, 지난번 메시지의 추가 안내입니다. Y틴 데이터 2배 혜택은 다음 달부터 자동 적용됩니다.', 
    'SMS', 
    '수능 끝! Y틴 데이터 2배', 
    '혜택 알림', 
    '2025', 
    '2025-12-10 18:15:00'
);


-- 확인용 쿼리 (이거 실행하면 잘 들어갔는지 바로 확인됨)
SELECT 
    id,
    customer_name,
    channel,
    event,
    sender_id,
    DATE_FORMAT(sent_at, '%Y-%m-%d %H:%i') AS 발송시간,
    LEFT(message_content, 30) AS 메시지_미리보기
FROM history 
ORDER BY sent_at DESC;