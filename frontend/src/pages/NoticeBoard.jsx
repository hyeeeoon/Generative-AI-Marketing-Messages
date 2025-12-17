// NoticeBoard.jsx
import React, { useState, useEffect } from "react";
import "./NoticeBoard.css";

export default function NoticeBoard({ previewOnly, recentCount = 3, showDate = true }) {
    const [notices, setNotices] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [userRole, setUserRole] = useState(""); // 로그인한 사용자 role
    const [username, setUsername] = useState(""); // 로그인한 사용자 이름

    const [form, setForm] = useState({
        title: "",
        content: "",
        isImportant: false,
        author: ""
    });

    useEffect(() => {
        fetchUserRole();
        fetchNotices();
    }, []);

    // 세션에서 role 가져오기 (안전하게)
    const fetchUserRole = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/users/me", {
                method: "GET",
                credentials: "include"
            });

            if (res.ok) {
                const result = await res.json();

                if (result && result.result && result.result.role) {
                    setUserRole(result.result.role); // role 저장 
                    setUsername(result.result.username); // 이름 저장
                } else {
                    setUserRole(""); // 로그인 안 된 경우
                }
            } else {
                console.warn("유저 정보 로드 실패", res.status);
                setUserRole(""); // 로그인 안 된 경우
            }
        } catch (err) {
            console.error("유저 정보 로드 실패", err);
            setUserRole(""); // 로그인 안 된 경우
        }
    };

    // 공지사항 불러오기
    const fetchNotices = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/notices", {
                method: "GET",
                credentials: "include"
            });
    
            if (res.ok) {
                const result = await res.json();
                // API 응답의 필드 이름에 맞춰서 정렬 로직 수정: 'important' 필드를 사용
                const sorted = result.sort((a, b) => {
                    if (a.important !== b.important) {
                        return a.important ? -1 : 1; // 필독 먼저
                    }
                    return new Date(b.createdAt) - new Date(a.createdAt); // 생성일 내림차순
                });
                setNotices(previewOnly ? sorted.slice(0, recentCount) : sorted);
            } else {
                console.error("공지사항 로드 실패", res.status, res.statusText);
                setNotices([]);
            }
        } catch (err) {
            console.error("공지사항 로드 실패", err);
            setNotices([]);
        }
    };


    // 공지사항 등록/수정
    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = editingId
            ? `http://localhost:8080/api/notices/${editingId}`
            : "http://localhost:8080/api/notices";
        const method = editingId ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    title: form.title,
                    content: form.content,
                    important: form.isImportant,
                    author: username
                })
            });

            if (response.ok) {
                alert(editingId ? "수정되었습니다." : "등록되었습니다.");
                setForm({ title: "", content: "", isImportant: false, author: username });
                setShowForm(false);
                setEditingId(null);
                fetchNotices();
            } else if (response.status === 403) {
                alert("권한이 없습니다.");
            } else {
                alert("저장에 실패했습니다.");
            }
        } catch (err) {
            console.error("공지사항 저장 실패", err);
            alert("저장에 실패했습니다.");
        }
    };

    // 공지사항 삭제
    const handleDelete = async (id) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            const response = await fetch(`http://localhost:8080/api/notices/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (response.ok) {
                alert("삭제되었습니다.");
                fetchNotices();
            } else if (response.status === 403) {
                alert("권한이 없습니다.");
            } else {
                alert("삭제에 실패했습니다.");
            }
        } catch (err) {
            console.error("공지사항 삭제 실패", err);
            alert("삭제에 실패했습니다.");
        }
    };

    // 미리보기 모드 (HomePage.css와 호환되도록 수정)
    if (previewOnly) {
        return (
            <ul className="notice-preview-list"> 
                {notices.length === 0 ? (
                    <li className="notice-preview-empty">등록된 공지사항이 없습니다.</li>
                ) : (
                    notices.map((n) => (
                        <li 
                            key={n.id} 
                            // API 필드 이름 'important' 사용
                            className={`notice-preview-row ${n.important ? 'important' : ''}`} 
                        >
                            <div className="notice-preview-title">
                                {/* 필독 태그 (CSS 클래스: important-tag) */}
                                {n.important && <span className="important-tag">필독</span>}
                                {n.title}
                            </div>
                            {/* 날짜 표시 (CSS 클래스: notice-preview-date) */}
                            {showDate && (
                                <span className="notice-preview-date">
                                    {/* 날짜 형식: YYYY. MM. DD. 에서 마침표 제거 */}
                                    {new Date(n.createdAt).toLocaleDateString("ko-KR").slice(0, -1)} 
                                </span>
                            )}
                        </li>
                    ))
                )}
            </ul>
        );
    }

    // 전체 페이지
    return (
        <div className="notice-board-container">
            <div className="notice-header">
                <h1 className="notice-page-title">공지사항</h1>
                {(userRole === "admin" || userRole === "portal_admin") && (
                    <button className="notice-write-btn" onClick={() => setShowForm(true)}>
                        새 글 쓰기
                    </button>
                )}
            </div>

            {showForm && (userRole === "admin" || userRole === "portal_admin") && (
                <div className="notice-form-card">
                    <h3>{editingId ? "공지사항 수정" : "새 공지사항 작성"}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="제목을 입력하세요"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <textarea
                                placeholder="내용을 입력하세요"
                                value={form.content}
                                onChange={(e) => setForm({ ...form, content: e.target.value })}
                                rows="8"
                                required
                            />
                        </div>
                        <div className="form-actions">
                            <label className="important-checkbox">
                                <input
                                    type="checkbox"
                                    checked={form.isImportant}
                                    onChange={(e) => setForm({ ...form, isImportant: e.target.checked })}
                                />
                                <span className="checkmark"></span>
                                필독 공지사항
                            </label>
                            <div>
                                <button type="submit" className="submit-btn">
                                    {editingId ? "수정 완료" : "등록하기"}
                                </button>
                                <button type="button" className="cancel-btn" onClick={() => {
                                    setShowForm(false);
                                    setEditingId(null);
                                    setForm({ title: "", content: "", isImportant: false, author: username }); // author를 username으로 초기화
                                }}>
                                    취소
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            <div className="notice-list">
                {notices.length === 0 ? (
                    <div className="notice-empty-full">아직 등록된 공지사항이 없습니다.</div>
                ) : (
                    notices.map((n) => (
                        // n.important를 사용하도록 수정
                        <div key={n.id} className={`notice-item ${n.important ? 'important-notice' : ''}`}>
                            <div className="notice-content">
                                {n.important && <div className="important-badge">필독</div>}
                                <h3 className="notice-title">{n.title}</h3>
                                <div className="notice-meta">
                                    작성자: {n.author} | 
                                    작성일: {new Date(n.createdAt).toLocaleDateString("ko-KR")}
                                    {n.updatedAt && n.updatedAt !== n.createdAt && 
                                        ` (수정: ${new Date(n.updatedAt).toLocaleDateString("ko-KR")})`
                                    }
                                </div>
                                <p className="notice-body">{n.content}</p>
                            </div>
                            {(userRole === "admin" || userRole === "portal_admin") && (
                                <div className="notice-actions">
                                    <button onClick={() => {
                                        setEditingId(n.id);
                                        setForm({ 
                                            title: n.title, 
                                            content: n.content, 
                                            // API 필드 이름 'important' 사용
                                            isImportant: n.important || false, 
                                            author: n.author || "관리자"
                                        });
                                        setShowForm(true);
                                    }} className="edit-btn">수정</button>
                                    <button onClick={() => handleDelete(n.id)} className="delete-btn">삭제</button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}