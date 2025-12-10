import React from 'react';
import './UserInfoModal.css';

function UserInfoModal({ user, onClose }) {
    return (
        <div className="modalOverlay" onClick={onClose}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                <h2>내 정보</h2>
                <div className="userField">
                    <strong>이름:</strong> {user.name}
                </div>
                <div className="userField">
                    <strong>사번:</strong> {user.userId}
                </div>
                <div className="userField">
                    <strong>역할:</strong> {user.role}
                </div>
                <button className="closeBtn" onClick={onClose}>닫기</button>
            </div>
        </div>
    );
}

export default UserInfoModal;
