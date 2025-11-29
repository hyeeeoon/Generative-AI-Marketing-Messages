// Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';
import MenuItem from '../MenuItem';
import KT_LOGO from '../../assets/kt_logo.png';
import LOGOUT from '../../assets/logout.png';

function Sidebar({ user, onLogout, setCurrentLabel }) {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname.replace('/', '');

    const goTo = (path, label) => () => {
        setCurrentLabel(label);         // 클릭시 라벨 업데이트
        navigate(`/${path}`);
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoWrap}>
                <img src={KT_LOGO} alt="KT Logo" style={{ height: 40 }} />
            </div>

            <nav className={styles.menuWrap}>
                <div className={styles.menuSection}>WORKSPACE</div>
                <MenuItem
                    id="home"
                    icon="home"
                    label="워크스페이스"
                    isActive={currentPath === 'home'}
                    onClick={goTo('home', "워크스페이스")}
                />

                {(user.role === '일반 사용자' || user.role === '관리자') && (
                    <>
                        <div className={styles.menuSection}>MARKETING</div>
                        <MenuItem
                            id="generator"
                            icon="wand-magic-sparkles"
                            label="AI 메시지 생성"
                            isActive={currentPath === 'generator'}
                            onClick={goTo('generator',"AI 메시지 생성")}
                        />
                        <MenuItem
                            id="history"
                            icon="clock-rotate-left"
                            label="전송 이력"
                            isActive={currentPath === 'history'}
                            onClick={goTo('history',"전송 이력")}
                        />
                        <MenuItem
                            id="my_performance"
                            icon="chart-line"
                            label={user.role === '관리자' ? '팀 성과 분석' : '나의 성과'}
                            isActive={currentPath === 'my_performance'}
                            onClick={goTo('my_performance', user.role === '관리자' ? '팀 성과 분석' : '나의 성과')}
                        />
                    </>
                )}

                {user.role === '관리자' && (
                    <>
                        <div className={styles.menuSection}>MANAGEMENT</div>
                        <MenuItem
                            id="manager_dashboard"
                            icon="chart-pie"
                            label="비용/효율 관리"
                            isActive={currentPath === 'manager_dashboard'}
                            onClick={goTo('manager_dashboard',"비용/효율관리")}
                        />
                    </>
                )}

                {user.role === '포털 관리자' && (
                    <>
                        <div className={styles.menuSection}>ADMIN</div>
                        <MenuItem
                            id="admin_users"
                            icon="users-gear"
                            label="사용자 관리"
                            isActive={currentPath === 'admin_users'}
                            onClick={goTo('admin_users',"사용자 관리")}
                        />
                        <MenuItem
                            id="admin_notices"
                            icon="bullhorn"
                            label="공지사항 관리"
                            isActive={currentPath === 'admin_notices'}
                            onClick={goTo('admin_notices',"공지사항 관리")}
                        />
                        <MenuItem
                            id="admin_logs"
                            icon="file-code"
                            label="시스템 로그"
                            isActive={currentPath === 'admin_logs'}
                            onClick={goTo('admin_logs',"시스템 로그")}
                        />
                        <MenuItem
                            id="admin_settings"
                            icon="gears"
                            label="시스템 설정"
                            isActive={currentPath === 'admin_settings'}
                            onClick={goTo('admin_settings',"시스템 설정")}
                        />
                    </>
                )}
            </nav>

            <div className={styles.profileBlock}>
                <div className={styles.profileItem}>
                    <div className={styles.profileIcon}>
                        <i className="fas fa-user"></i>
                    </div>
                    <div className={styles.profileInfo}>
                        <div className={styles.profileInfoTop}>
                            <span className={styles.profileName}>{user.name}</span>
                            <button onClick={goTo('my_info')} className={styles.infoBtn}>
                                내 정보
                            </button>
                            <button onClick={onLogout} className={styles.logoutIconBtn}>
                                <img src={LOGOUT} alt="로그아웃" className={styles.logoutImg} />
                            </button>
                        </div>
                        <span className={styles.profileRole}>{user.role}</span>
                    </div>
                    <button onClick={onLogout} className={styles.logoutBtn}>
                        <i className="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
