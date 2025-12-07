// NoticeBoard.jsx
import React, { useState, useEffect } from "react";
import "./NoticeBoard.css";

export default function NoticeBoard({ previewOnly, recentCount = 3 }) {
    const [notices, setNotices] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({
        title: "",
        content: "",
        isImportant: false,
        author: "관리자"
    });
    const [userRole, setUserRole] = useState(""); // 로그인한 사용자 role

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
                if (result && result.data && result.data.role) {
                    setUserRole(result.data.role);
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
                if (result && result.data) {
                    const sorted = result.data.sort((a, b) => {
                        // 필독 공지 먼저
                        if (a.isImportant !== b.isImportant) {
                            return a.isImportant ? -1 : 1;
                        }
                        // 생성일 기준 내림차순
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    });
                    setNotices(previewOnly ? sorted.slice(0, recentCount) : sorted);
                } else {
                    setNotices([]);
                }
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
                    isImportant: form.isImportant,
                    author: form.author
                })
            });

            if (response.ok) {
                alert(editingId ? "수정되었습니다." : "등록되었습니다.");
                setForm({ title: "", content: "", isImportant: false, author: "관리자" });
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

    // 미리보기 모드
    if (previewOnly) {
        return (
            <div className="notice-preview">
                {notices.length === 0 ? (
                    <div className="notice-empty">등록된 공지사항이 없습니다.</div>
                ) : (
                    notices.map((n) => (
                        <div key={n.id} className={`notice-preview-item ${n.isImportant ? 'important' : ''}`}>
                            <span className="notice-prefix">{n.isImportant ? '[필독]' : '·'}</span>
                            <span className="notice-text">{n.title}</span>
                        </div>
                    ))
                )}
            </div>
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
                                    setForm({ title: "", content: "", isImportant: false, author: "관리자" });
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
                        <div key={n.id} className={`notice-item ${n.isImportant ? 'important-notice' : ''}`}>
                            <div className="notice-content">
                                {n.isImportant && <div className="important-badge">필독</div>}
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
                                            isImportant: n.isImportant || false,
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
