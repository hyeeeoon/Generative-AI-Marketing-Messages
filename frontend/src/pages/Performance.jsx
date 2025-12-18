// src/pages/PerformancePage.jsx (개인 성과 현황)

import React, { useState, useEffect, useCallback } from 'react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, 
    Tooltip, Legend, ResponsiveContainer 
} from 'recharts'; 
import './Performance.css';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

/**
 * ChartComponent: 기간별 추이 데이터를 LineChart로 시각화합니다.
 * @param {string} dataKey - 차트에 사용할 데이터 키 (conversionRate 또는 clickRate)
 */
const ChartComponent = ({ title, timeUnit, dataKey, chartData }) => {
    // chartData의 비율(0~1) 데이터를 백분율(0~100)로 변환합니다.
    const formattedData = chartData.map(item => ({
        ...item,
        value: ( (item[dataKey] || 0) * 100).toFixed(1) * 1, // 백분율로 변환
    }));

    if (!formattedData || formattedData.length === 0) {
        return (
            <div className="chart-area-content">
                <h3>{title} ({timeUnit} 기준)</h3>
                <p>기간별 데이터가 존재하지 않습니다. (기준: {timeUnit})</p>
            </div>
        );
    }
    
    const percentFormatter = (value) => `${value}%`;

    return (
        <div className="chart-area-content">
            <h3>{title} ({timeUnit} 기준)</h3>
            <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={formattedData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                    > 
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="label" />
                        <YAxis domain={[0, 100]} tickFormatter={percentFormatter} />
                        <Tooltip formatter={percentFormatter} />
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#007bff" // 개인 성과는 블루 계열 사용
                            name={title} 
                            activeDot={{ r: 8 }} 
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

function PerformancePage() {
    const [performanceData, setPerformanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeUnit, setTimeUnit] = useState('MONTHLY');
    
    // 데이터 패칭 로직 (scope=INDIVIDUAL 사용)
    const fetchPerformanceData = useCallback(async () => {
        setLoading(true);
        setError(null); 
        setPerformanceData(null);
        
        try {
            const scope = 'INDIVIDUAL';
            const url = `${API_BASE_URL}/performance?timeUnit=${timeUnit}&scope=${scope}`;
            
            const response = await fetch(url, {
                credentials: 'include',
            });
            
            if (response.status === 401) {
                throw new Error("로그인이 필요합니다.");
            }
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: '서버 오류 (JSON 없음)' }));
                throw new Error(errorData.message || `HTTP 오류: ${response.status}`);
            }

            const data = await response.json();
            setPerformanceData(data.result);
        
        } catch (err) {
            console.error(`❌ [GET] 성과 데이터 (${timeUnit}) 조회 실패:`, err);
            setError(err.message || "성과 데이터 조회 중 알 수 없는 오류 발생.");
        } finally {
            setLoading(false);
        }
    }, [timeUnit]);

    useEffect(() => {
        fetchPerformanceData();
    }, [fetchPerformanceData]); 

    // --- 조건부 렌더링 ---
    if (loading && !performanceData) return <div className="performance-container">데이터를 불러오는 중입니다...</div>;
    if (error) return <div className="performance-container error-box">오류: {error}</div>;
    if (!performanceData) return <div className="performance-container">개인 성과 데이터를 찾을 수 없습니다.</div>;
    
    // --- 데이터 비구조화 ---
    const {
        totalMessagesSent = 0,
        totalClicks = 0,
        conversionRate = 0,
        clickRate = 0,
        userName, 
        chartData = [], 
    } = performanceData;

    const displayUserName = userName || '사용자';

    // --- 메인 렌더링 ---
    return (
        <div className="performance-container">
            <div className="performance-header">
                <h1>{displayUserName}님의 성과 현황</h1>
                <div className="time-selector">
                    <button 
                        className={timeUnit === 'YEARLY' ? 'active' : ''} 
                        onClick={() => setTimeUnit('YEARLY')}
                        disabled={loading}
                    >년별</button>
                    <button 
                        className={timeUnit === 'MONTHLY' ? 'active' : ''} 
                        onClick={() => setTimeUnit('MONTHLY')}
                        disabled={loading}
                    >월별</button>
                    <button 
                        className={timeUnit === 'DAILY' ? 'active' : ''} 
                        onClick={() => setTimeUnit('DAILY')}
                        disabled={loading}
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
                    <h3>총 클릭 수</h3>
                    <p>{totalClicks.toLocaleString()}</p>
                </div>
                <div className="metric-card">
                    <h3>클릭률</h3>
                    <p style={{ color: clickRate > 0.05 ? '#28a745' : '#ffc107' }}>
                        {(clickRate * 100).toFixed(1)}%
                    </p>
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
                    title="가입 전환율 추이"
                    timeUnit={timeUnit}
                    dataKey="conversionRate"
                    chartData={chartData}
                />
            </div>

            <div className="chart-area" style={{ marginTop: '20px' }}>
                <ChartComponent
                    title="클릭률 추이"
                    timeUnit={timeUnit}
                    dataKey="clickRate"
                    chartData={chartData}
                />
            </div>

        </div>
    );
}

export default PerformancePage;