// TeamPerformance.jsx (팀 성과 분석 페이지)
import React, { useState, useEffect } from 'react';
// import { useUserContext } from '../context/UserContext'; // 사용자 정보 Context 가정
import './Performance.css';

// 팀원별 상세 데이터 (백엔드에서 팀 성과 응답에 포함되어야 함)
const DUMMY_TEAM_MEMBERS = [
    { name: "김팀원A", sent: 1500, success: 0.95, clicks: 800, conversion: 0.12 },
    { name: "이팀원B", sent: 1200, success: 0.92, clicks: 550, conversion: 0.08 },
    { name: "박팀원C", sent: 1800, success: 0.98, clicks: 900, conversion: 0.15 },
    { name: "최팀원D", sent: 1000, success: 0.90, clicks: 450, conversion: 0.06 },
];

function TeamPerformance({ user }) {
    // const { user } = useUserContext(); // 팀장 권한 검증은 라우터에서 선행되었다고 가정
    const [performanceData, setPerformanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeUnit, setTimeUnit] = useState('MONTHLY');

    // API 호출 시뮬레이션
    useEffect(() => {
        setLoading(true);
        // 실제: fetch(`/api/performance/team?timeUnit=${timeUnit}`)

        // --- 더미 데이터 설정 ---
        const DUMMY_TEAM_DATA = {
            userName: '팀 전체',
            totalMessagesSent: 5500, // 더미 멤버 합계보다 적절하게 설정
            successRate: 0.95,
            totalClicks: 2650,
            conversionRate: 0.10, // 10%
            successRateByTime: { "2025-11": 0.93, "2025-12": 0.95 },
            conversionRateByTime: { "2025-11": 0.09, "2025-12": 0.10 }
        };

        setTimeout(() => {
            setPerformanceData(DUMMY_TEAM_DATA);
            setLoading(false);
        }, 500);
        // -------------------------

    }, [timeUnit]);

    if (loading) return <div className="performance-container">팀 성과 데이터를 불러오는 중입니다...</div>;
    if (!performanceData) return <div className="performance-container">팀 성과 데이터를 찾을 수 없습니다.</div>;

    const {
        totalMessagesSent,
        successRate,
        totalClicks,
        conversionRate
    } = performanceData;

    return (
        <div className="performance-container">
            <div className="performance-header">
                <h1>🏆 팀 성과 분석 현황</h1>
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

            <h2>팀 전체 요약 ({timeUnit} 기준)</h2>
            <div className="metric-cards">
                <div className="metric-card">
                    <h3>총 전송 건수</h3>
                    <p>{totalMessagesSent.toLocaleString()}</p>
                </div>
                <div className="metric-card">
                    <h3>평균 성공률</h3>
                    <p style={{ color: successRate > 0.94 ? '#28a745' : '#ffc107' }}>
                        {(successRate * 100).toFixed(1)}%
                    </p>
                </div>
                <div className="metric-card">
                    <h3>총 클릭 수</h3>
                    <p>{totalClicks.toLocaleString()}</p>
                </div>
                <div className="metric-card">
                    <h3>팀 평균 전환율</h3>
                    <p style={{ color: conversionRate > 0.09 ? '#28a745' : '#dc3545' }}>
                        {(conversionRate * 100).toFixed(1)}%
                    </p>
                </div>
            </div>

            <div className="chart-area" style={{ marginTop: '20px' }}>
                <h2>🤖 AI 성과 분석 및 코멘트</h2>
                <blockquote style={{ borderLeft: '5px solid #ffc107', paddingLeft: '15px', margin: '15px 0', backgroundColor: '#fffbe6', borderRadius: '4px' }}>
                    <p>
                        "금월 팀의 총 메시지 전송량은 지난달 대비 **10% 증가**했으며, **팀 평균 가입 전환율(${(conversionRate * 100).toFixed(1)}\%$)**은 목표치($8\%$)를 초과 달성했습니다. 
                        **박팀원C**의 전환율이 팀 내에서 가장 우수하며, **최팀원D**의 성공률 개선을 위한 맞춤형 교육이 필요합니다."
                    </p>
                </blockquote>
            </div>

            <div className="chart-area" style={{ marginTop: '20px' }}>
                <h2>팀원별 상세 성과 비교</h2>
                <table className="team-table">
                    <thead>
                        <tr>
                            <th>팀원</th>
                            <th>총 전송 건수</th>
                            <th>성공률</th>
                            <th>총 클릭 수</th>
                            <th>가입 전환율</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DUMMY_TEAM_MEMBERS.map((member, index) => (
                            <tr key={index}>
                                <td>{member.name}</td>
                                <td>{member.sent.toLocaleString()}</td>
                                <td style={{ color: member.success < successRate ? '#dc3545' : '#28a745' }}>{(member.success * 100).toFixed(1)}%</td>
                                <td>{member.clicks.toLocaleString()}</td>
                                <td style={{ fontWeight: member.conversion > conversionRate ? 'bold' : 'normal', color: member.conversion > conversionRate ? '#007bff' : 'inherit' }}>{(member.conversion * 100).toFixed(1)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TeamPerformance;