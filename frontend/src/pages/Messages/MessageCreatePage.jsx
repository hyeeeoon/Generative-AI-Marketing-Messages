import { callGeminiAPI } from "../../gemini";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ⭐ useNavigate import 추가
import "./MessageCreatePage.css"; 

// 임시 API 함수: 데이터 가져오기 (기존 코드 유지)
async function fetchRecipients(userFilters, showRiskOnly) {
    try {
        const res = await fetch("http://localhost:5001/api/target-customers-full");
        if (!res.ok) throw new Error("Failed to fetch customer data");

        const response = await res.json();
        if (!response.success || !Array.isArray(response.data)) { 
            return [];
        }

        const data = response.data.map(item => {
            let period = "전체";
            if (item.Contract === "One year" || item.Contract === "Two year") period = "1년 이상";
            else if (item.Contract === "Month-to-month") period = "1개월";
            else if (item.Contract === "Six months") period = "6개월";

            const gender = item.gender === "Female" ? "여성" : "남성";

            // 임시 plan 및 age 로직 추가 (실제 API 응답에 필드가 없다면 필터가 작동하도록)
            let plan = "기본";
            if (item.MonthlyCharges > 90) plan = "프리미엄";
            else if (item.MonthlyCharges > 50) plan = "스페셜";

            let months_left = null;
            if (item.Churn === "Yes") {
                months_left = 1;
            } else if (item.tenure <= 3) {
                months_left = 2;
            } else {
                months_left = Math.max(1, 12 - Math.floor(item.tenure / 2));
            }

            const risk = months_left <= 3; // Risk 기준을 3개월 이하로 변경 (이전 요청의 논의 참고)
            const age = item.SeniorCitizen === 1 ? "40대 이상" : (item.tenure < 12 ? "10대" : "20대"); // 임시 연령대 설정

            return {
                id: item.customerID,
                name: item.customerID,
                plan,
                price: item.MonthlyCharges,
                age,
                gender,
                period,
                network: item.InternetService,
                risk,
                months_left,
            };
        });

        // 필터링 로직은 기존 코드 유지
        let filtered = data.filter(user =>
            (userFilters.age === "전체" || user.age === userFilters.age) &&
            (userFilters.gender === "전체" || user.gender === userFilters.gender) &&
            (userFilters.period === "전체" || user.period === userFilters.period) &&
            (userFilters.plan === "전체" || user.plan === userFilters.plan)
        );

        if (showRiskOnly) filtered = filtered.filter(user => user.risk);

        return filtered;
    } catch (error) {
        console.error("데이터 불러오기 실패:", error);
        return [];
    }
}

//전송 이력 서버 저장 API 호출
const sendToServer = async (payload) => {
    try {
        const res = await fetch("http://localhost:8080/api/history/send", {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`전송 기록 저장 실패: ${res.status}. ${errorText.substring(0, 50)}...`);
        }
        return true;
    } catch (error) {
        console.error("전송 API 호출 에러:", error);
        alert(`[전송 실패] 서버에 기록을 저장하지 못했습니다: ${error.message}`);
        return false;
    }
};

function MessageCreatePage() { // 컴포넌트 이름 변경 반영
    const navigate = useNavigate(); // navigate 훅 사용

    const [formFilters, setFormFilters] = useState({
        event: "수능 끝! Y틴 데이터 2배",
        purpose: "혜택 알림",
        tone: "친근한",
        channel: "SMS",
        extra: "",
    });

    const [userFilters, setUserFilters] = useState({
        age: "전체",
        gender: "전체",
        period: "전체",
        plan: "전체",
    });

    const [recipients, setRecipients] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [messages, setMessages] = useState({});
    const [editing, setEditing] = useState({});
    const [showRiskOnly, setShowRiskOnly] = useState(false);

    useEffect(() => {
        fetchRecipients(userFilters, showRiskOnly).then(setRecipients);
    }, [userFilters, showRiskOnly]);

    const handleSelectAll = () => setSelectedIds(recipients.map(r => r.id));
    const handleDeselectAll = () => setSelectedIds([]);
    const handleFormFilterChange = (e) => {
        const { name, value } = e.target;
        setFormFilters(f => ({ ...f, [name]: value }));
    };
    const handleUserFilterChange = (e) => {
        const { name, value } = e.target;
        setUserFilters(f => ({ ...f, [name]: value }));
    };
    const handleSelect = (id) => {
        setSelectedIds(ids =>
            ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id]
        );
    };
    const handleToggleRisk = () => {
        setShowRiskOnly(risk => !risk);
        setSelectedIds([]);
    };

    const [loading, setLoading] = useState(false);

    // 메시지 생성 로직 (Promise.all을 사용하여 병렬 처리로 개선)
    const handleGenerate = async () => {
        if (selectedIds.length === 0) {
            alert("고객을 선택해주세요.");
            return;
        }
        setLoading(true);

        const targets = selectedIds.map(id => recipients.find(cust => cust.id === id)).filter(Boolean);
        const generationPromises = targets.map(async (customer) => {
            try {
                // API 호출
                const aiMsg = await callGeminiAPI(customer, formFilters);
                return { id: customer.id, message: aiMsg };
            } catch (e) {
                console.error(`AI 생성 실패 for ${customer.id}:`, e);
                return { 
                    id: customer.id, 
                    message: `안녕하세요!\n'${formFilters.event}' 안내 메시지 생성에 문제가 발생했습니다.\n\n${formFilters.extra}`
                };
            }
        });

        const results = await Promise.all(generationPromises);
        
        const newMessages = results.reduce((acc, result) => {
            if (result) acc[result.id] = result.message;
            return acc;
        }, {});

        setMessages(prev => ({ ...prev, ...newMessages }));
        setEditing({});
        setLoading(false);
        alert(`${results.length}건 생성 완료!`);
    };

    const toggleEditing = id => {
        setEditing(prev => ({ ...prev, [id]: !prev[id] }));
    };
    
    // ⭐ [수정된 함수] 전송 이력 저장 API 호출
    const handleSendMessage = async (id) => {
        const recipient = recipients.find(r => r.id === id);
        const messageContent = messages[id];
        
        if (!recipient || !messageContent) return;

        const payload = {
            customerId: recipient.id,
            customerName: recipient.name,
            messageContent: messageContent,
            channel: formFilters.channel,
            event: formFilters.event,
            purpose: formFilters.purpose,
        };
        
        const success = await sendToServer(payload);

        if (success) {
            alert(`${recipient.name}님에게 (${formFilters.channel}) 메시지 전송 및 기록 저장 완료!`);
            // 전송 후 선택 해제
            setSelectedIds(ids => ids.filter(i => i !== id));
            
            // History 페이지로 자동 이동
            navigate('/history'); 
        }
    };
    
    //  전체 전송 로직 (병렬 처리)
    const handleSendAll = async () => {
        if (selectedIds.length === 0) {
            alert("전송할 고객을 선택해주세요.");
            return;
        }
        
        // Promise.all을 사용하여 모든 메시지를 병렬로 전송 및 기록 저장
        const sendPromises = selectedIds.map(id => handleSendMessage(id));
        await Promise.all(sendPromises);
    };
    
    const handleMessageChange = (id, newMsg) => {
        setMessages(msgs => ({ ...msgs, [id]: newMsg }));
    };

    return (
        <div className="container">
            <section className="topBar">
                <div className="topControls">
                    <select name="event" value={formFilters.event} onChange={handleFormFilterChange} className="filterSelect">
                        <option>수능 끝! Y틴 데이터 2배</option>
                        <option>리얼5G 사전 예약</option>
                        <option>신학기 데이터 프로모션</option>
                    </select>
                    <select name="purpose" value={formFilters.purpose} onChange={handleFormFilterChange} className="filterSelect">
                        <option>혜택 알림</option>
                        <option>프로모션 안내</option>
                        <option>신상품 안내</option>
                    </select>
                    <select name="tone" value={formFilters.tone} onChange={handleFormFilterChange} className="filterSelect">
                        <option>친근한</option>
                        <option>격식있는</option>
                    </select>
                    <select name="channel" value={formFilters.channel} onChange={handleFormFilterChange} className="filterSelect">
                        <option>SMS</option>
                        <option>알림톡</option>
                    </select>
                    <button 
                        onClick={handleGenerate} 
                        className={`bigBtn generateBtn ${loading ? 'loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? '생성 중...' : `선택 메시지 생성 (${selectedIds.length}명)`}
                    </button>
                    <button style={{ marginLeft: 12 }} onClick={handleSendAll} className="bigBtn sendAllBtn">선택보내기</button>
                </div>
                <div className="extraSection">
                    <input
                        type="text"
                        name="extra"
                        value={formFilters.extra}
                        onChange={handleFormFilterChange}
                        placeholder="추가 문구 입력"
                        className="extraInput"
                    />
                </div>
            </section>

            <section className="body">
                <aside className="sideFilter">
                    <div className="userFilter">
                        {/* 필터 셀렉트 박스들 */}
                        <select name="age" value={userFilters.age} onChange={handleUserFilterChange}>
                            <option value="전체">나이 전체</option>
                            <option value="10대">10대</option>
                            <option value="20대">20대</option>
                            <option value="30대">30대</option>
                            <option value="40대 이상">40대 이상</option>
                        </select>
                        <select name="gender" value={userFilters.gender} onChange={handleUserFilterChange}>
                            <option value="전체">성별 전체</option>
                            <option value="남성">남성</option>
                            <option value="여성">여성</option>
                        </select>
                        <select name="period" value={userFilters.period} onChange={handleUserFilterChange}>
                            <option value="전체">기간 전체</option>
                            <option value="1개월">1개월</option>
                            <option value="6개월">6개월</option>
                            <option value="1년 이상">1년 이상</option>
                        </select>
                        <select name="plan" value={userFilters.plan} onChange={handleUserFilterChange}>
                            <option value="전체">요금제 전체</option>
                            <option value="프리미엄">프리미엄</option>
                            <option value="기본">기본</option>
                            <option value="스페셜">스페셜</option>
                        </select>
                        
                        {/* 액션 버튼들 */}
                        <button style={{ marginLeft: 8 }} onClick={handleSelectAll}>전체선택</button>
                        <button style={{ marginLeft: 8 }} onClick={handleDeselectAll}>전체해제</button>
                        <button 
                            style={{ marginLeft: 8 }} 
                            onClick={handleToggleRisk} 
                            className={showRiskOnly ? "riskToggleBtn active" : "riskToggleBtn"}
                        >
                            {showRiskOnly ? "전체보기" : "위험군만 보기"}
                        </button>
                    </div>
                    {/* ★★★ 고객 목록 스크롤 적용을 위해 스타일 수정 ★★★ */}
                    <div className="recipientListContainer"> 
                        <ul className="recipientList scrollable">
                            {recipients.length === 0 ? (
                                <li className="emptyRecipient">로딩 중이거나 데이터 없음...</li>
                            ) : (
                                recipients.map(r => (
                                    <li
                                        key={r.id}
                                        className={`recipientItem${r.risk ? " riskUser" : ""}${selectedIds.includes(r.id) ? " selectedUser" : ""}`}
                                    >
                                        <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(r.id)}
                                                onChange={() => handleSelect(r.id)}
                                            />
                                            <span className="name">{r.name}</span>
                                            <span className="plan">{r.plan}</span>
                                            {r.risk && <span className="riskTag">Risk</span>}
                                        </label>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </aside>
                <main className="messageArea">
                    {Object.keys(messages).length === 0 ? (
                        <div className="emptyMsg">
                            좌측에서 고객을 선택하고 메시지를 생성하세요.
                        </div>
                    ) : (
                        selectedIds.map(id => {
                            const recipient = recipients.find(r => r.id === id);
                            if (!recipient) return null;
                            return (
                                <div key={id} className="messageBox">
                                    <div className="msgMetaHeader">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(id)}
                                            onChange={() => handleSelect(id)}
                                            style={{ marginRight: 4 }}
                                        />
                                        <span className="msgName">{recipient.name}</span>
                                        <span className="msgTag">{formFilters.channel}</span>
                                        <span className="msgTone">{formFilters.tone}</span>
                                        {recipient.risk && <span className="riskTag">Risk</span>}
                                    </div>
                                    <div className="msgBoxContent">
                                        <textarea
                                            rows={5}
                                            value={messages[id] || ""}
                                            disabled={!editing[id]}
                                            onChange={e => handleMessageChange(id, e.target.value)}
                                            className="messageInput"
                                        />
                                    </div>
                                    <div className="msgActions">
                                        <button onClick={() => toggleEditing(id)} className="msgEditBtn">
                                            {editing[id] ? "수정완료" : "수정"}
                                        </button>
                                        <button onClick={() => handleSendMessage(id)} className="msgSendBtn">
                                            전송
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </main>
            </section>
        </div>
    );
}

export default MessageCreatePage;