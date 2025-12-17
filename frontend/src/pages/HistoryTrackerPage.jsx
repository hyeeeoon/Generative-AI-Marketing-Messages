import React, { useState, useEffect, useCallback } from 'react';
import './HistoryTrackerPage.css';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

function HistoryTrackerPage() {
    const [histories, setHistories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // 이력 목록 조회
    const fetchHistories = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/history`, {
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: '서버 오류' }));
                throw new Error(errorData.message || `HTTP 오류: ${response.status}`);
            }
            
            const data = await response.json();
            const responseData = data.result || data; 
            
            setHistories(Array.isArray(responseData) ? responseData : []);

        } catch (err) {
            console.error("❌ 이력 조회 실패:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 상태 수동 업데이트
    const updateHistoryStatus = useCallback(async (historyId, statusType, value) => {
        // isLoading을 true로 하지만, 목록이 이미 있다면 전체 화면을 가리지는 않게 구성하는 것이 좋습니다.
        setIsLoading(true); 
        setError(null);
        
        const payload = { statusType, value }; 

        try {
            const response = await fetch(`${API_BASE_URL}/history/${historyId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });
            
            const data = await response.json();

            if (!response.ok || (data.hasOwnProperty('isSuccess') && !data.isSuccess)) {
                throw new Error(data.message || `상태 업데이트 실패 (HTTP ${response.status})`);
            }
            
            setHistories(prev => 
                prev.map(h => h.id === historyId ? data.result : h)
            );

            console.log(`✅ [PUT] 성공: ${historyId}번 업데이트 완료`);
            return true;

        } catch (err) {
            console.error("❌ [PUT] 업데이트 실패:", err.message);
            setError(err.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    useEffect(() => {
        fetchHistories();
    }, [fetchHistories]);
    
    const handleStatusUpdate = (historyId, statusType, currentValue) => {
        const newValue = !currentValue;
        const statusName = statusType === 'isClicked' ? '클릭' : '전환'; 
        const confirmMsg = `${historyId}번 이력의 [${statusName}] 상태를 ${newValue ? '기록(ON)' : '해제(OFF)'}하시겠습니까?`;
        
        if (window.confirm(confirmMsg)) {
            updateHistoryStatus(historyId, statusType, newValue);
        }
    };

    return (
        <div className="history-container">
            <header className="history-header">
                <h1>👀 전송 이력 추적 및 수동 전환 기록</h1>
                {/* <button onClick={fetchHistories} className="refresh-button" disabled={isLoading}>
                    {isLoading ? '새로고침 중...' : '데이터 새로고침'}
                </button> */}
            </header>

            <div className="status-messages">
                {error && <div className="error-box" onClick={() => setError(null)}>⚠️ {error} (닫으려면 클릭)</div>}
            </div>

            <section className="history-table-section">
                <h2>전체 전송 이력 ({histories.length}건)</h2>
                <div className="table-wrapper">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>수신자</th>
                                <th>내용 (요약)</th>
                                <th>전송일</th>
                                <th>클릭 상태</th>
                                <th>전환 상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {histories.length > 0 ? (
                                histories.map((h) => (
                                    <tr key={h.id}>
                                        <td>{h.id}</td>
                                        <td>{h.customerName} ({h.customerId})</td>
                                        <td className="content-truncate">{h.messageContent}</td>
                                        <td>{new Date(h.sentAt).toLocaleDateString()}</td>
                                        
                                        <td className="status-cell">
                                            <button 
                                                onClick={() => handleStatusUpdate(h.id, 'isClicked', h.clicked)}
                                                className={`status-button ${h.clicked ? 'status-clicked-on' : 'status-clicked-off'}`}
                                                disabled={isLoading}
                                            >
                                                {h.clicked ? '클릭됨' : '미클릭'}
                                            </button>
                                        </td>
                                        
                                        <td className="status-cell">
                                            <button 
                                                onClick={() => handleStatusUpdate(h.id, 'isConverted', h.converted)}
                                                className={`status-button ${h.converted ? 'status-converted-on' : 'status-converted-off'}`}
                                                disabled={isLoading}
                                            >
                                                {h.converted ? '전환 성공' : '미전환'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="no-data">
                                        {isLoading ? '데이터를 불러오는 중입니다...' : '전송 이력이 없습니다.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

export default HistoryTrackerPage;