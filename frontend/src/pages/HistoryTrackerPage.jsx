// src/pages/HistoryTrackerPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import './HistoryTrackerPage.css';

// 백엔드 API 기본 경로
const API_BASE_URL = 'http://localhost:8080/api';

function HistoryTrackerPage() {
    const [histories, setHistories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // 이력 목록 조회 (GET /api/history)
    const fetchHistories = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/history`, {
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: '서버 오류 (JSON 없음)' }));
                throw new Error(errorData.message || `HTTP 오류: ${response.status}`);
            }
            
            const data = await response.json();
            const responseData = data.result || data; 
            
            setHistories(Array.isArray(responseData) ? responseData : []);

        } catch (err) {
            console.error("❌ [GET] 이력 조회 실패:", err);
            setError(err.message || "이력 조회 중 알 수 없는 오류 발생.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 상태 수동 업데이트 (PUT /api/history/{historyId}/status)
    const updateHistoryStatus = useCallback(async (historyId, statusType, value) => {
        setIsLoading(true);
        setError(null);
        
        // 백엔드 DTO는 statusType, value를 받으므로 그대로 유지
        const payload = { statusType, value }; 

        try {
            const response = await fetch(`${API_BASE_URL}/history/${historyId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });
            
            if (!response.ok) {
                let errorData;
                try { errorData = await response.json(); } catch (e) {
                    throw new Error(`Forbidden: 해당 작업에 대한 권한이 없습니다. (HTTP ${response.status})`);
                }
                throw new Error(errorData.message || `상태 업데이트 실패 (HTTP ${response.status})`);
            }
            
            const data = await response.json();

            if (!data.isSuccess) {
                throw new Error(data.message || `상태 업데이트 실패 (응답 오류)`);
            }

            setHistories(prev => 
                prev.map(h => h.id === historyId ? data.result : h)
            );
            console.log(`✅ [PUT] 성공: ${historyId}번 이력 상태 업데이트 완료`);
            return true;

        } catch (err) {
            console.error("❌ [PUT] 상태 업데이트 실패:", err);
            setError(err.message || "상태 업데이트 중 알 수 없는 오류 발생.");
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    useEffect(() => {
        fetchHistories();
    }, [fetchHistories]);
    
    // 수동 전환 상태 업데이트 핸들러
    const handleStatusUpdate = (historyId, statusType, currentValue) => {
        const newValue = !currentValue;
        // PUT 요청 DTO에서는 여전히 'isClicked', 'isConverted' 문자열을 사용해야 함 (Service 로직에 맞춤)
        const statusName = statusType === 'isClicked' ? '클릭' : '전환'; 
        
        const confirmMsg = `${historyId}번 이력의 [${statusName}] 상태를 ${newValue ? '기록(ON)' : '해제(OFF)'}하시겠습니까?\n\n(참고: 전환(ON) 시 클릭도 자동으로 ON 됩니다.)`;
        
        if (window.confirm(confirmMsg)) {
            updateHistoryStatus(historyId, statusType, newValue);
        }
    };

    // 렌더링
    return (
        <div className="history-container">
            <header className="history-header">
                <h1>👀 전송 이력 추적 및 수동 전환 기록</h1>
                <p>발송된 메시지 이력을 조회하고, 오프라인 또는 외부 측정 결과를 바탕으로 고객의 '클릭' 및 '최종 전환' 상태를 기록할 수 있습니다.</p>
            </header>

            <div className="status-messages">
                {(isLoading && histories.length === 0) && <p className="loading-message">이력 목록을 로드 중입니다...</p>}
                {error && <div className="error-box">오류 발생: {error}</div>}
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
                                <th>클릭 상태 (수동 기록)</th>
                                <th>전환 상태 (수동 기록)</th>
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
                                        
                                        {/* 수동 기록 UI - 클릭 (isClicked) */}
                                        <td className="status-cell">
                                            <button 
                                                // ⭐⭐⭐ 최종 수정: JSON 응답에 맞게 h.clicked 참조 ⭐⭐⭐
                                                onClick={() => handleStatusUpdate(h.id, 'isClicked', h.clicked)}
                                                className={`status-button ${h.clicked ? 'status-clicked-on' : 'status-clicked-off'}`}
                                                disabled={isLoading}
                                            >
                                                {h.clicked ? '클릭 기록됨' : '미클릭 (기록하기)'}
                                            </button>
                                        </td>
                                        
                                        {/* 수동 기록 UI - 전환 (isConverted) */}
                                        <td className="status-cell">
                                            <button 
                                                // ⭐⭐⭐ 최종 수정: JSON 응답에 맞게 h.converted 참조 ⭐⭐⭐
                                                onClick={() => handleStatusUpdate(h.id, 'isConverted', h.converted)}
                                                className={`status-button ${h.converted ? 'status-converted-on' : 'status-converted-off'}`}
                                                disabled={isLoading}
                                            >
                                                {h.converted ? '전환 성공' : '미전환 (기록하기)'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="no-data">
                                        전송 이력이 없습니다. 메시지를 발송하여 이력을 만드세요.
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