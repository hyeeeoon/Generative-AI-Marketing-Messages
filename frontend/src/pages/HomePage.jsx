// HomePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import NoticeBoard from './NoticeBoard'; 
import './HomePage.css';

const API_BASE_URL = '${import.meta.env.VITE_API_BASE_URL}/api'; 

import image1 from '../assets/수능.png';
import image2 from '../assets/신년.png';
//import image3 from '../assets/아이폰.png';

const campaignImageUrls = [
    `url(${image1})`, 
    `url(${image2})`, 
    //`url(${image3})`, 
];

const campaignData = [
    {
        id: 1,
        tag: 'HOT',
        title: '수능 끝! Y덤 2배 페스티벌',
        desc: '수험생 타겟 AI 템플릿 업데이트.',
        backgroundImageUrl: campaignImageUrls[0],
        bgColor: '#4776fa' 
    },
    {
        id: 2,
        tag: 'NEW',
        title: '신년 맞이 요금제 프로모션',
        desc: '2026년 신규 요금제 캠페인 준비.',
        backgroundImageUrl: campaignImageUrls[1],
        bgColor: '#9a55f5'
    },
];

function HomePage() {
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('user'));
    
    const [todayPerformance, setTodayPerformance] = useState(null);
    const [loadingPerformance, setLoadingPerformance] = useState(true);
    const [errorPerformance, setErrorPerformance] = useState(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    const handleNextSlide = () => {
        setCurrentSlideIndex((prevIndex) => 
            (prevIndex + 1) % campaignData.length
        );
    };

    const handlePrevSlide = () => {
        setCurrentSlideIndex((prevIndex) => 
            (prevIndex - 1 + campaignData.length) % campaignData.length
        );
    };

    const handleCreateClick = () => {
        navigate('/messager');
    };

    const goToNoticeBoard = () => {
        navigate('/notice_board');
    };

    const goToPerformanceAnalysis = () => {
        navigate('/my_performance'); 
    };

    const links = [
        { label: 'KT 공식몰', color: '#4776fa', url: 'https://shop.kt.com' },
        { label: 'KT 멤버십', color: '#9a55f5', url: 'https://membership.kt.com' },
        { label: '요금제 조회', color: '#e95d58', url: 'https://my.kt.com' }
    ];

    const fetchTodayPerformance = useCallback(async () => {
        setLoadingPerformance(true);
        setErrorPerformance(null); 
        
        try {
            const scope = 'INDIVIDUAL';
            const timeUnit = 'DAILY'; 
            const url = `${API_BASE_URL}/performance?timeUnit=${timeUnit}&scope=${scope}`;
            
            const response = await fetch(url, { credentials: 'include' });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: '서버 오류' }));
                throw new Error(errorData.message || `HTTP 오류: ${response.status}`);
            }
            const data = await response.json();
            const latestData = data.result.chartData[data.result.chartData.length - 1] || {};
            
            setTodayPerformance({
                messagesSent: latestData.messagesSent || 0,
                clicks: latestData.clicks || 0,
                clickRate: latestData.clickRate || 0,
                conversionRate: latestData.conversionRate || 0,
            });
        
        } catch (err) {
            console.error(`❌ [GET] 오늘의 성과 데이터 조회 실패:`, err);
            setErrorPerformance(err.message || "오늘의 성과 데이터 조회 중 오류 발생.");
        } finally {
            setLoadingPerformance(false);
        }
    }, []);

    useEffect(() => {
        fetchTodayPerformance();
    }, [fetchTodayPerformance]); 

    const renderPerformanceCard = () => {
        const sentCount = todayPerformance?.messagesSent || 0;
        const readCount = todayPerformance?.clicks || 0;
        const clickRate = (todayPerformance?.clickRate || 0);

        if (loadingPerformance) {
            return (
                <div className="result-card loading">
                    <div className="result-title">오늘의 실적</div>
                    <p>데이터를 불러오는 중...</p>
                </div>
            );
        }

        if (errorPerformance) {
            return (
                <div className="result-card error">
                    <div className="result-title">오늘의 실적</div>
                    <p className="error-message">오류: 데이터를 불러올 수 없습니다.</p>
                </div>
            );
        }

        return (
            <div className="result-card">
                <div className="result-title">오늘의 실적</div>
                <div className="result-row">
                    전송 완료 <span className="result-value">{sentCount.toLocaleString()}</span>
                </div>
                <div className="result-row">
                    클릭 수 <span className="result-value">{readCount.toLocaleString()}</span>
                </div>
                <div className="result-row">
                    클릭률 <span 
                        className="result-value" 
                        style={{ color: clickRate > 0.05 ? '#28a745' : '#ffc107' }}
                    >
                        {(clickRate * 100).toFixed(1)}%
                    </span>
                </div>
                <button 
                    className="result-analyze-btn" 
                    onClick={goToPerformanceAnalysis}
                >
                    상세 분석 보기
                </button>
            </div>
        );
    };

    const activeCampaign = campaignData[currentSlideIndex];


    return (
        <div className="home-wrap">
            <h2 className="home-title">
                안녕하세요, {userData?.name || '사용자'}님
            </h2>
            <div className="home-subtitle">오늘도 TalkOnz와 함께 최고의 성과를 만들어보세요.</div>

            <div className="home-main-row">
                <div className="campaign-slider-container">
                    <div 
                        className="home-main-card" 
                        key={activeCampaign.id}
                        style={{ 
                            backgroundImage: activeCampaign.backgroundImageUrl || 'none', 
                            backgroundColor: activeCampaign.bgColor || '#4776fa', 
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <span className="badge-hot">{activeCampaign.tag}</span>
                        <span className="event-title">{activeCampaign.title}</span>
                        <div className="event-desc">{activeCampaign.desc}</div>
                        <button onClick={handleCreateClick} className="event-btn">
                            바로 생성하기
                        </button>
                    </div>

                    <div className="slider-controls">
                        <button onClick={handlePrevSlide} className="slider-nav-btn">
                            &lt;
                        </button>
                        <div className="slider-pagination">
                            {campaignData.map((_, index) => (
                                <span
                                    key={index}
                                    className={`pagination-dot ${index === currentSlideIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentSlideIndex(index)}
                                ></span>
                            ))}
                        </div>
                        <button onClick={handleNextSlide} className="slider-nav-btn">
                            &gt;
                        </button>
                    </div>
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
                <div className="notices-card">
                    <div className="notices-title">
                        사내 공지사항
                        <button onClick={goToNoticeBoard} className="notice-more-btn">
                            더보기 →
                        </button>
                    </div>
                    <NoticeBoard previewOnly recentCount={3} showDate />
                </div>

                {renderPerformanceCard()}
            </div>
        </div>
    );
}

export default HomePage;