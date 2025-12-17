// components/header/NotificationList.js
import React from 'react';
const NotificationList = ({ notifications, unreadCount }) => {
    return (
        <div className="notification-list">
            <div className="notification-header">
                <span>알림</span>
                {unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}
            </div>
            <ul>
                {notifications.map(notification => (
                    <li key={notification.id} className="notification-item">
            <span
                className={`status-indicator ${notification.read ? 'read' : 'unread'}`}
            ></span>
                        <span className="notification-text">{notification.text}</span>
                        <span className="notification-time">{notification.time}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationList;
