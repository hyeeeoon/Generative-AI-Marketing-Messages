// src/pages/TeamPerformancePage.jsx (팀 성과 현황)

import React, { useState, useEffect, useCallback } from 'react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, 
    Tooltip, Legend, ResponsiveContainer 
} from 'recharts'; 
import './Performance.css'; 

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

const ChartComponent = ({ title, timeUnit, dataKey, chartData }) => {
    const formattedData = chartData.map(item => ({
        ...item,
        value: ( (item[dataKey] || 0) * 100).toFixed(1) * 1, 
    }));

    if (!formattedData || formattedData.length === 0) {
        return (
            <div className="chart-area-content">
                <h3>{title} ({timeUnit}별)</h3>
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
                            stroke="#ff4d4d" // 팀 성과 그래프는 레드 포인트 컬러 사용
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

function TeamPerformancePage() {
    const [teamPerformanceData, setTeamPerformanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 
    const [timeUnit, setTimeUnit] = useState('MONTHLY');
    
    const fetchTeamPerformanceData = useCallback(async () => {
        setLoading(true);
        setError(null); 
        setTeamPerformanceData(null);
        
        try {
            const scope = 'TEAM';
            const url = `${API_BASE_URL}/performance?timeUnit=${timeUnit}&scope=${scope}`;
            
            const response = await fetch(url, {
                credentials: 'include',
            });
            
            if (response.status === 401) {
                throw new Error("로그인이 필요합니다.");
            }
            if (response.status === 403) {
                 throw new Error("팀 성과를 조회할 권한이 없습니다. (403 Forbidden)");
            }
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: '서버 오류 (JSON 없음)' }));
                throw new Error(errorData.message || `HTTP 오류: ${response.status}`);
            }
            
            const data = await response.json();
            setTeamPerformanceData(data.result);

        } catch (err) {
            console.error(`❌ [GET] 팀 성과 데이터 (${timeUnit}) 조회 실패:`, err);
            setError(err.message || "팀 성과 데이터 조회 중 알 수 없는 오류 발생.");
        } finally {
            setLoading(false);
        }
    }, [timeUnit]);

    useEffect(() => {
        fetchTeamPerformanceData();
    }, [fetchTeamPerformanceData]); 

    // --- 조건부 렌더링 ---
    if (loading && !teamPerformanceData) return <div className="performance-container">팀 데이터를 불러오는 중입니다...</div>;
    if (error) return <div className="performance-container error-box">오류: {error}</div>; 
    if (!teamPerformanceData) return <div className="performance-container">팀 성과 데이터를 찾을 수 없습니다.</div>;
    
    // --- 데이터 비구조화 ---
    const { 
        totalTeamMessagesSent = 0,
        totalTeamClicks = 0,
        teamConversionRate = 0,
        teamClickRate = 0,
        memberRankings = [],
        chartData = [], 
    } = teamPerformanceData;

    // --- 메인 렌더링 ---
    return (
        <div className="performance-container">
            <div className="performance-header">
                <h1>팀 전체 성과 현황</h1>
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

            {/* --- 팀원별 순위 테이블 (강조 및 상단 배치) --- */}
            <h2 className="ranking-header">팀원별 성과 순위 (전환율 기준)</h2>
            <div className="ranking-table-container highlighted">
                <table className="ranking-table large-text">
                    <thead>
                        <tr>
                            <th>순위</th>
                            <th>팀원 이름</th>
                            <th>전송 건수</th>
                            <th>총 클릭 수</th>
                            <th>클릭률</th>
                            <th>가입 전환율</th>
                        </tr>
                    </thead>
                    <tbody>
                        {memberRankings.length > 0 ? (
                            memberRankings.map((member) => (
                                <tr key={member.userId}>
                                    <td className={`rank ${member.rank <= 3 ? 'top-rank' : ''}`}>{member.rank}</td>
                                    <td>{member.userName}</td> 
                                    <td>{member.messagesSent.toLocaleString()}</td>
                                    <td>{member.clicks.toLocaleString()}</td>
                                    <td>{(member.clickRate * 100).toFixed(1)}%</td>
                                    <td style={{ color: member.conversionRate > 0.08 ? '#28a745' : '#ff4d4d', fontWeight: 'bold' }}>
                                        {(member.conversionRate * 100).toFixed(1)}%
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', color: '#888' }}>팀원별 성과 데이터가 없습니다.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>


            {/* --- 팀 요약 지표 --- */}
            <h2>핵심 지표 요약 (팀 평균 / {timeUnit} 기준)</h2>
            <div className="metric-cards">
                <div className="metric-card">
                    <h3>총 전송 건수</h3>
                    <p>{totalTeamMessagesSent.toLocaleString()}</p>
                </div>
                <div className="metric-card">
                    <h3>총 클릭 수</h3>
                    <p>{totalTeamClicks.toLocaleString()}</p>
                </div>
                <div className="metric-card">
                    <h3>평균 클릭률</h3>
                    <p style={{ color: teamClickRate > 0.05 ? '#28a745' : '#ff4d4d' }}> 
                        {(teamClickRate * 100).toFixed(1)}%
                    </p>
                </div>
                <div className="metric-card">
                    <h3>평균 가입 전환율</h3>
                    <p style={{ color: teamConversionRate > 0.08 ? '#28a745' : '#ff4d4d' }}> 
                        {(teamConversionRate * 100).toFixed(1)}%
                    </p>
                </div>
            </div>

            {/* --- 팀 평균 추이 그래프 --- */}
            <div className="chart-area">
                <ChartComponent
                    title="팀 평균 가입 전환율 추이"
                    timeUnit={timeUnit}
                    dataKey="conversionRate"
                    chartData={chartData}
                />
            </div>
            <div className="chart-area" style={{ marginTop: '20px' }}>
                <ChartComponent
                    title="팀 평균 클릭률 추이"
                    timeUnit={timeUnit}
                    dataKey="clickRate"
                    chartData={chartData}
                />
            </div>

        </div>
    );
}

export default TeamPerformancePage;