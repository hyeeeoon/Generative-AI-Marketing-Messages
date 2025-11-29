// components/header/Header.js
import React, { useState } from 'react';
import './Header.css';
import NotificationButton from './NotificationButton';
import NotificationList from './NotificationList';

// label}을 props로 받아 타이틀로 사용!
const Header = ({ label }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, text: '새로운 댓글이 달렸습니다.', read: false, time: '5분 전' },
        { id: 2, text: '서버 점검 일정 안내.', read: true, time: '1시간 전' },
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const toggleNotifications = () => {
        setShowNotifications(prev => !prev);
    };

    return (
        <header className="header">
            <div className="header-title">{label}</div>
            <NotificationButton
                unreadCount={unreadCount}
                onClick={toggleNotifications}
                hasUnread={unreadCount > 0}
            />
            {showNotifications && (
                <NotificationList
                    notifications={notifications}
                    unreadCount={unreadCount}
                />
            )}
        </header>
    );
};

export default Header;
