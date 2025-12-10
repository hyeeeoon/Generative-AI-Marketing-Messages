import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminUsers.css';

const mapRoleToKorean = (role) => {
    switch (role) {
        case 'admin': return '관리자';
        case 'portal_admin': return '포털 관리자';
        case 'ktcs_user': return '일반 사용자';
        default: return '미정';
    }
};

const formatDateTime = (isoString) => {
    if (!isoString) return '';
    try {
        // ISO 형식 날짜 문자열을 YYYY-MM-DD 형태로 변환
        return new Date(isoString).toISOString().split('T')[0];
    } catch (e) {
        return '날짜 오류';
    }
};


function AdminUsers() {
    const navigate = useNavigate();

    /** @type {[User[], React.Dispatch<React.SetStateAction<User[]>>]} */
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // [⭐ 검색어 상태 추가]

    // 데이터 로딩 함수
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch("http://localhost:8080/api/users", {
                    method: "GET",
                    credentials: "include", 
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    // 서버가 JSON 대신 빈 본문이나 HTML을 보냈을 경우 대비
                    const text = await response.text();
                    const errorMessage = text || `서버 에러 (${response.status} ${response.statusText}). 권한 부족 또는 서버 오류.`;
                    throw new Error(errorMessage);
                }

                // 응답이 OK일 경우 JSON 파싱
                const json = await response.json();
                
                if (json.result && Array.isArray(json.result)) {
                    setUsers(json.result);
                } else {
                    throw new Error("API 응답 형식이 올바르지 않습니다.");
                }

            } catch (err) {
                console.error("Fetch Error:", err.message);
                setError(`데이터 로딩 오류: ${err.message}. (403 Forbidden 에러가 의심됩니다.)`);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // [⭐ 검색어 기반 필터링]
    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // [⭐ '새 사용자 등록' 버튼 클릭 핸들러]
    const handleRegisterClick = () => {
        // 예시: 새 등록 페이지로 이동 (라우팅 설정 필요)
        navigate('/admin_users/register'); 
    };

    if (loading) {
        return <div className="admin-users-container"><h2>사용자 관리</h2><p>로딩 중...</p></div>;
    }

    if (error) {
        return <div className="admin-users-container"><h2>사용자 관리</h2><p style={{ color: 'red' }}>❌ {error}</p></div>;
    }
    
    return (
        <div className="admin-users-container">
            <h1>사용자 관리 ({users.length}명)</h1>
            
            <div className="controls-top">
                {/* 검색 입력 필드 */}
                <input
                    type="text"
                    placeholder="이름으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                {/* 새 사용자 등록 버튼 */}
                <button 
                    className="add-user-btn"
                    onClick={handleRegisterClick}
                >
                    새 사용자 등록
                </button>
            </div>

            <div className="user-table-wrapper">
                {filteredUsers.length === 0 && users.length > 0 ? (
                    <p className="no-result">'{searchTerm}'에 해당하는 사용자가 없습니다.</p>
                ) : filteredUsers.length === 0 && users.length === 0 ? (
                    <p className="no-result">등록된 사용자가 없습니다.</p>
                ) : (
                    <table className="user-list-table">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>이름</th>
                                <th>사용자 ID</th>
                                <th>역할</th>
                                <th>생성일</th>
                                <th>관리</th> 
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, index) => (
                                <tr key={user.id}>
                                    <td>{index + 1}</td>
                                    <td>{user.username}</td>
                                    <td>{user.userId}</td>
                                    <td>{mapRoleToKorean(user.role)}</td>
                                    <td>{formatDateTime(user.createdAt)}</td>
                                    <td>
                                        <button className="action-btn edit-btn">수정</button>
                                        <button className="action-btn delete-btn">삭제</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default AdminUsers;