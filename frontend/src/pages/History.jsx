import React, { useState, useEffect } from 'react';
import './History.css';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 날짜/시간 포맷팅
    const formatDateTime = (isoString) => {
        if (!isoString) return 'N/A';
        // 서버에서 LocalDateTime을 보낼 경우 ISO 문자열이 아닌 배열 형태로 올 수 있으나, 
        // 여기서는 ToLocalString으로 안전하게 처리
        try {
            return new Date(isoString).toLocaleString('ko-KR', { 
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

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch("http://localhost:8080/api/history", {
                    method: "GET",
                    credentials: "include"
                });
                
                const data = await res.json(); // 응답 본문을 JSON으로 파싱

                // 1. HTTP 상태 코드 검사 (res.ok = false 일 때)
                if (!res.ok) {
                    throw new Error(data.message || `이력 조회 실패: ${res.status}`);
                }
                
                console.log(data);

                // 2. API 응답의 성공/실패 필드 검사 (res.ok = true 일 때)
                if (data.success && Array.isArray(data.data)) {
                    setHistory(data.data);
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
            <h1>전송 이력 ({history.length}건)</h1>
            
            <div className="history-table-wrapper">
                {history.length === 0 ? (
                    <p className="no-history">아직 전송된 마케팅 메시지 이력이 없습니다.</p>
                ) : (
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>발송 시간</th>
                                <th>발송자 ID</th>
                                <th>고객명 (ID)</th>
                                <th>채널</th>
                                <th>이벤트/목적</th>
                                <th>메시지 내용</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((record, index) => (
                                <tr key={record.id || index}>
                                    <td>{formatDateTime(record.sentAt)}</td>
                                    <td>{record.senderId}</td>
                                    <td>{record.customerName} ({record.customerId})</td>
                                    <td><span className={`channel-tag ${record.channel.toLowerCase()}`}>{record.channel}</span></td>
                                    <td>{record.event} / {record.purpose}</td>
                                    <td className="content-cell">{record.messageContent}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default History;