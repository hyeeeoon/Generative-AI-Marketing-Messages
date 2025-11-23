// components/header/NotificationButton.js
import React from 'react';
import './NotificationButton.css';

const NotificationButton = ({ unreadCount, onClick, hasUnread }) => {
    return (
        <button className="notification-button" onClick={onClick}>
            <div className="bell-icon">
                {/* 종 아이콘은 CSS background 또는 SVG로 구현 가능 */}
            </div>
            {hasUnread && <span className="red-dot"></span>}
        </button>
    );
};

export default NotificationButton;
