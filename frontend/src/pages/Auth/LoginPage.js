// src/pages/Auth/LoginPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";  // CSS Module 사용
import KT_LOGO from '../../assets/kt_logo.png';

const roles = [
    {
        key: '일반 사용자',
        icon: 'fa-users',
        title: '일반 사용자',
        desc: '메시지 생성 및 고객 상담',
    },
    {
        key: '관리자',
        icon: 'fa-chart-pie',
        title: '관리자',
        desc: '팀 성과 관리 및 분석',
    },
    {
        key: '포털 관리자',
        icon: 'fa-user-gear',
        title: '포털 관리자',
        desc: '시스템 설정 및 사용자 관리',
    }
];


function LoginPage({ setUser }) {
    const navigate = useNavigate();

    const onSelect = (role) => {
        setUser({ name: '홍길동', role });
        navigate('/home');
    };

    return (
        <div className={styles.loginLayout}>
            <div className={styles.loginLeft}>
                <img src={KT_LOGO} alt="KT Logo" className={styles.loginLogo} />
                <h1 className={styles.loginTitle}>TalkOnz</h1>
                <p className={styles.loginDesc}>고객과 마음을 잇는<br />스마트한 시작.</p>
                <div className={styles.loginStatus}>
                    <span className={styles.statusDot} /> System Online
                </div>
            </div>
            <div className={styles.loginRight}>
                <h2 className={styles.loginSelectTitle}>로그인 권한 선택</h2>
                <div className={styles.roleSelectList}>
                    {roles.map(r => (
                        <button
                            key={r.key}
                            className={styles.roleSelectCard}
                            onClick={() => onSelect(r.key)}
                            type="button"
                        >
                            <div className={styles.roleIcon}><i className={`fas ${r.icon}`} /></div>
                            <div>
                                <div className={styles.roleTitle}>{r.title}</div>
                                <div className={styles.roleDesc}>{r.desc}</div>
                            </div>
                            <div className={styles.roleArrow}>{'>'}</div>
                        </button>
                    ))}
                </div>
                <div className={styles.loginFooter}>
                    © 2025 KT CS Corp. Secure Access.
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
