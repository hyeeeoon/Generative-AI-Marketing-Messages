// Performance.jsx (나의 성과 페이지 - 최종 수정)
import React, { useState, useEffect } from 'react';
import './Performance.css';

// ChartComponent는 그대로 유지
const ChartComponent = ({ title, timeUnit, dataKey }) => (
    <div className="chart-area-content">
        <h3>{title} ({timeUnit}별)</h3>
        <div style={{ height: '300px', border: '1px dashed #007bff50', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9ff' }}>
            기간별 {dataKey} 데이터 시각화 영역
        </div>
    </div>
);

// Performance 컴포넌트는 오직 props로 'username'을 받습니다.
function Performance({ username }) {
    // username이 null/undefined인 경우를 대비하여 기본값 설정
    const userName = username || '사용자'; 
    
    const [performanceData, setPerformanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeUnit, setTimeUnit] = useState('MONTHLY');
    
    // API 호출 시뮬레이션
    useEffect(() => {
        setLoading(true);
        // 실제: fetch(`/api/performance/individual?timeUnit=${timeUnit}`)
        
        // --- 더미 데이터 설정 ---
        // totalClicks, conversionRate, 시간별 데이터 필드를 추가하여 누락 오류 방지
        const DUMMY_DATA = {
            userName: userName, 
            totalMessagesSent: 5420,
            successRate: 0.959,
            totalClicks: 2100, // 누락된 필드 추가
            conversionRate: 0.079, // 누락된 필드 추가
            successRateByTime: { "2025-11": 0.94, "2025-12": 0.959 },
            conversionRateByTime: { "2025-11": 0.07, "2025-12": 0.079 }
        };
        
        setTimeout(() => {
            setPerformanceData(DUMMY_DATA);
            setLoading(false);
        }, 500); 
        
        // 의존성 배열 수정: username 대신 userName 사용
    }, [userName, timeUnit]); 

    if (loading) return <div className="performance-container">데이터를 불러오는 중입니다...</div>;
    // performanceData가 null이더라도 렌더링을 시도해야 할 경우, 아래 필터링을 제거하고
    // 지표 변수에 안전한 기본값을 설정하면 됩니다. 현재는 로딩 완료 후 체크합니다.
    if (!performanceData) return <div className="performance-container">개인 성과 데이터를 찾을 수 없습니다.</div>;
    
    // 안전한 비구조화 할당: 데이터가 없는 경우를 대비하여 모든 숫자 필드에 기본값 0 설정
    const { 
        totalMessagesSent = 0, 
        successRate = 0, 
        totalClicks = 0, 
        conversionRate = 0,
        // performanceData 내부의 userName을 사용합니다.
        // 이 변수는 DUMMY_DATA에서 설정되었으므로 충돌 방지 주석처리 제거
        userName: dataUserName
    } = performanceData;

    // 만약 props의 username이 더 확실하다면 이 변수를 사용
    const displayUserName = dataUserName || userName; 

    return (
        <div className="performance-container">
            <div className="performance-header">
                <h1>{displayUserName}님의 성과 현황</h1>
                <div className="time-selector">
                    <button 
                        className={timeUnit === 'YEARLY' ? 'active' : ''} 
                        onClick={() => setTimeUnit('YEARLY')}
                    >년별</button>
                    <button 
                        className={timeUnit === 'MONTHLY' ? 'active' : ''} 
                        onClick={() => setTimeUnit('MONTHLY')}
                    >월별</button>
                    <button 
                        className={timeUnit === 'DAILY' ? 'active' : ''} 
                        onClick={() => setTimeUnit('DAILY')}
                    >일별</button>
                </div>
            </div>

            <h2>핵심 지표 요약 ({timeUnit} 기준)</h2>
            <div className="metric-cards">
                <div className="metric-card">
                    <h3>총 전송 건수</h3>
                    <p>{totalMessagesSent.toLocaleString()}</p>
                </div>
                <div className="metric-card">
                    <h3>전송 성공률</h3>
                    <p style={{ color: successRate > 0.95 ? '#28a745' : '#ffc107' }}>
                        {(successRate * 100).toFixed(1)}%
                    </p>
                </div>
                <div className="metric-card">
                    <h3>총 클릭 수</h3>
                    <p>{totalClicks.toLocaleString()}</p>
                </div>
                <div className="metric-card">
                    <h3>가입 전환율</h3>
                    <p style={{ color: conversionRate > 0.08 ? '#28a745' : '#dc3545' }}>
                        {(conversionRate * 100).toFixed(1)}%
                    </p>
                </div>
            </div>

            <div className="chart-area">
                <ChartComponent 
                    title="전송 성공률 추이" 
                    timeUnit={timeUnit}
                    dataKey="successRateByTime"
                />
            </div>

            <div className="chart-area" style={{ marginTop: '20px' }}>
                <ChartComponent 
                    title="가입 전환율 추이" 
                    timeUnit={timeUnit}
                    dataKey="conversionRateByTime"
                />
            </div>
        </div>
    );
}

export default Performance;