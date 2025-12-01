import React, { useState, useEffect } from "react";
import "./Generator.css";

async function fetchRecipients(userFilters, showRiskOnly) {
    try {
        const res = await fetch("http://localhost:5001/api/target-customers");
        if (!res.ok) throw new Error("Failed to fetch customer data");

        const apiData = await res.json();

        console.log("API에서 받은 데이터:", apiData);

        const data = (apiData.data || []).map(item => {
            let period = "전체";
            if (item.Contract === "One year") period = "1년 이상";
            else if (item.Contract === "Month-to-month") period = "1개월";
            else if (item.Contract === "Six months") period = "6개월";

            const gender = item.gender === "Female" ? "여성" : "남성";

            // 요금제는 PaymentMethod, MonthlyCharges, 인터넷 종류 등을 활용해 추론 가능하나 명확치 않아 "전체"로 처리
            // 필요에 따라 plan 매핑 추가 가능
            let plan = "전체";

            // 위험군 판단: months_left가 1 이하일 때 true
            const risk = typeof item.months_left === "number" && item.months_left <= 1;

            // 나이 정보가 없어서 전체로 둠 (나중에 나이 데이터 있을 경우 처리 필요)
            const age = "전체";

            return {
                id: item.customerID,
                name: item.customerID,
                plan,
                price: item.MonthlyCharges,
                age,
                gender,
                period,
                network: item.InternetService, // 인터넷 종류 필드도 포함 가능
                risk,
            };
        });

        // 필터링
        let filtered = data.filter(user =>
            (userFilters.age === "전체" || user.age === userFilters.age) &&
            (userFilters.gender === "전체" || user.gender === userFilters.gender) &&
            (userFilters.period === "전체" || user.period === userFilters.period) &&
            (userFilters.plan === "전체" || user.plan === userFilters.plan)
        );

        if (showRiskOnly) filtered = filtered.filter(user => user.risk);

        return filtered;
    } catch (error) {
        console.error(error);
        return [];
    }
}

function Generator() {
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
    const handleGenerate = () => {
        const msgObj = {};
        selectedIds.forEach(id => {
            msgObj[id] =
                `안녕하세요!\n항상 KT를 아껴주셔서 감사합니다.\n'${formFilters.event}' 소식이 있어 안내드려요.\n\n${formFilters.extra}`;
        });
        setMessages(msgObj);
        setEditing({});
    };
    const toggleEditing = id => {
        setEditing(prev => ({ ...prev, [id]: !prev[id] }));
    };
    const handleSendMessage = id => {
        alert(`메시지 전송: ${recipients.find(r => r.id === id)?.name}\n\n${messages[id]}`);
    };
    const handleSendAll = () => {
        selectedIds.forEach(id => handleSendMessage(id));
    };
    const handleMessageChange = (id, newMsg) => {
        setMessages(msgs => ({ ...msgs, [id]: newMsg }));
    };

    return (
        <div className="container">
            <section className="topFilter largeFilter">
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
                <button onClick={handleGenerate} className="bigBtn">선택 메시지 생성</button>
                <button style={{ marginLeft: 12 }} onClick={handleSendAll} className="bigBtn">선택보내기</button>
            </section>
            <section className="extraSection">
                <input
                    type="text"
                    name="extra"
                    value={formFilters.extra}
                    onChange={handleFormFilterChange}
                    placeholder="추가 문구 입력"
                    className="extraInput"
                />
            </section>

            <section className="body">
                <aside className="sideFilter">
                    <div className="userFilter">
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
                        <button style={{ marginLeft: 8 }} onClick={handleSelectAll}>전체선택</button>
                        <button style={{ marginLeft: 8 }} onClick={handleDeselectAll}>전체해제</button>
                        <button style={{ marginLeft: 8 }} onClick={handleToggleRisk}>
                            {showRiskOnly ? "전체보기" : "위험군만 보기"}
                        </button>
                    </div>
                    <ul className="recipientList">
                        {recipients.map(r => (
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
                                    {r.risk && <span className="risk">Risk</span>}
                                </label>
                            </li>
                        ))}
                    </ul>
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
                                        {recipient.risk && <span className="risk">Risk</span>}
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

export default Generator;
