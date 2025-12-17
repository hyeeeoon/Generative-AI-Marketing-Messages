import React, { useState, useEffect, useMemo } from 'react';
import './History.css';

// 날짜 포맷팅 함수 (이전과 동일)
const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    try {
        const dateToFormat = new Date(isoString);
        if (isNaN(dateToFormat.getTime())) {
            return '날짜 오류';
        }
        return dateToFormat.toLocaleString('ko-KR', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    } catch (e) {
        return isoString;
    }
};

// 필터링 기간 정의 (단위: 일)
const PERIOD_OPTIONS = [
    { label: '전체 기간', days: 0 },
    { label: '오늘', days: 1 },
    { label: '일주일 이내', days: 7 },
    { label: '한 달 이내', days: 30 },
    { label: '3개월 이내', days: 90 },
    { label: '반년 이내', days: 180 },
];

const History = () => {
    const [allHistory, setAllHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // ⭐ 필터링 상태 추가 (선택된 기간의 days 값, 기본값 0)
    const [selectedPeriodDays, setSelectedPeriodDays] = useState(0); 
    // ⭐ 메시지 전문 보기 토글 상태
    const [expandedRows, setExpandedRows] = useState({}); 

    // 필터링 로직: 선택된 기간에 따라 데이터를 재계산
    const filteredHistory = useMemo(() => {
        if (selectedPeriodDays === 0) {
            return allHistory;
        }
        
        const cutoffDate = new Date();
        // 현재 날짜에서 선택된 기간(days)만큼 뺌
        cutoffDate.setDate(cutoffDate.getDate() - selectedPeriodDays);
        
        return allHistory.filter(record => {
            const sentDate = new Date(record.sentAt);
            // 발송 시간이 필터링 시작일(cutoffDate) 이후인지 확인
            return sentDate >= cutoffDate;
        });
    }, [allHistory, selectedPeriodDays]);


    const toggleExpand = (id) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };
    
    // ⭐ 핸들러: 셀렉트 박스 값이 바뀔 때 호출
    const handlePeriodChange = (e) => {
        // value를 정수(number)로 변환하여 상태에 저장
        setSelectedPeriodDays(parseInt(e.target.value)); 
    };

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/history`, {
                    method: "GET",
                    credentials: "include"
                });
                
                const data = await res.json(); 

                if (!res.ok) {
                    throw new Error(data.message || `이력 조회 실패: ${res.status}`);
                }
                
                const historyData = data.result;
                
                if (data.success && Array.isArray(historyData)) {
                    // 원본 데이터 상태에 저장
                    setAllHistory(historyData);
                } else {
                    throw new Error(data.message || "이력 조회 응답 형식이 올바르지 않습니다.");
                }
            } catch (e) {
                console.error("이력 로딩 에러:", e);
                setError(`데이터 로딩 중 오류 발생: ${e.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return <div className="history-container"><h2>전송 이력</h2><p>로딩 중...</p></div>;
    if (error) return <div className="history-container"><h2 style={{color: 'red'}}>❌ 전송 이력 로딩 오류</h2><p>{error}</p></div>;

    return (
        <div className="history-container">
            <h1>전송 이력 ({filteredHistory.length}건)</h1>
            
            {/* ⭐ 기간 선택 셀렉트 박스 영역 */}
            <div className="filter-controls">
                <label htmlFor="period-select">기간 필터:</label>
                <select 
                    id="period-select"
                    value={selectedPeriodDays}
                    onChange={handlePeriodChange}
                    className="period-select-box"
                >
                    {PERIOD_OPTIONS.map(option => (
                        <option 
                            key={option.days} 
                            value={option.days}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            {/* ⭐ 현재 필터링된 결과 수 표시 */}
            <p className="filter-summary">
                총 {allHistory.length}건 중 현재 {filteredHistory.length}건 표시 중
            </p>
            
            <div className="history-table-wrapper">
                {filteredHistory.length === 0 ? (
                    <p className="no-history">선택된 기간에 전송된 이력이 없습니다.</p>
                ) : (
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>발송 시간</th>
                                <th>고객명 (ID)</th>
                                <th>채널</th>
                                <th>이벤트/목적</th>
                                <th>메시지 내용 (클릭)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHistory.map((record, index) => {
                                const isExpanded = expandedRows[record.id];
                                return (
                                    <tr 
                                        key={record.id || index} 
                                        onClick={() => toggleExpand(record.id)}
                                        className={isExpanded ? "expanded" : ""}
                                    >
                                        <td>{formatDateTime(record.sentAt)}</td>
                                        <td>{record.customerName} ({record.customerId})</td>
                                        <td><span className={`channel-tag ${record.channel.toLowerCase()}`}>{record.channel}</span></td>
                                        <td>{record.event} / {record.purpose}</td>
                                        <td className={`content-cell ${isExpanded ? 'content-expanded' : ''}`}>
                                            {record.messageContent}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default History;