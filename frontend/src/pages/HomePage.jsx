// HomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NoticeBoard from './NoticeBoard'; // 미리보기용으로 사용
import './HomePage.css';

function HomePage() {
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('user'));

    const handleCreateClick = () => {
        navigate('/generator');
    };

    const goToNoticeBoard = () => {
        navigate('/notice_board'); // 너가 원하는 경로
    };

    const links = [
        { label: 'KT 공식몰', color: '#4776fa', url: 'https://shop.kt.com' },
        { label: 'KT 멤버십', color: '#9a55f5', url: 'https://membership.kt.com' },
        { label: '요금제 조회', color: '#e95d58', url: 'https://my.kt.com' }
    ];

    return (
        <div className="home-wrap">
            <h2 className="home-title">
                안녕하세요, {userData?.name || '사용자'}님
            </h2>
            <div className="home-subtitle">오늘도 TalkOnz와 함께 최고의 성과를 만들어보세요.</div>

            <div className="home-main-row">
                <div className="home-main-card">
                    <span className="badge-hot">HOT</span>
                    <span className="event-title">수능 끝! Y덤 2배 페스티벌</span>
                    <div className="event-desc">수험생 타겟 AI 템플릿 업데이트.</div>
                    <button onClick={handleCreateClick} className="event-btn">
                        바로 생성하기
                    </button>
                </div>

                <div className="quicklinks-card">
                    <div className="quicklinks-title">Quick Links</div>
                    <ul className="quicklinks-list">
                        {links.map((link, idx) => (
                            <li key={idx} className="quicklinks-item">
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: link.color }}
                                    className="quicklinks-link"
                                >
                                    ● {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="home-bottom-row">
                {/* 사내 공지사항 - 완벽한 미리보기 */}
                <div className="notices-card">
                    <div className="notices-title">
                        사내 공지사항
                        <button onClick={goToNoticeBoard} className="notice-more-btn">
                            더보기 →
                        </button>
                    </div>
                    <br></br>
                    <NoticeBoard previewOnly recentCount={3} showDate />
                </div>

                {/* 오늘의 실적 */}
                <div className="result-card">
                    <div className="result-title">오늘의 실적</div>
                    <div className="result-row">
                        전송 완료 <span className="result-value">1,240</span>
                    </div>
                    <div className="result-row">
                        읽음 확인 <span className="result-value">892</span>
                    </div>
                    <div className="result-row">
                        클릭률 <span className="result-value">12.5%</span>
                    </div>
                    <button className="result-analyze-btn">상세 분석 보기</button>
                </div>
            </div>
        </div>
    );
}

export default HomePage;