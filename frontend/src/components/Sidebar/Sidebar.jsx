import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';
import MenuItem from '../MenuItem';
import UserInfoModal from '../UserInfoModal/UserInfoModal';
import KT_LOGO from '../../assets/kt_logo.png';
import LOGOUT from '../../assets/logout.png';

function Sidebar({ user, onLogout, setCurrentLabel }) {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname.replace('/', '');

    const [openModal, setOpenModal] = useState(false);

    // 영어 role → 한글로 변환
    const mapRoleToLabel = (role) => {
        switch (role) {
            case 'admin': return '관리자';
            case 'portal_admin': return '포털 관리자';
            case 'ktcs_user': 
            default: return '일반 사용자';
        }
    };

    const koreanRole = mapRoleToLabel(user.role);

    const goTo = (path, label) => () => {
        setCurrentLabel(label);
        navigate(`/${path}`);
    };
    
    // --- 역할별 공지사항 라벨 설정 ---
    let noticeLabel = '공지 사항';
    if (user.role === 'portal_admin') {
        noticeLabel = '공지사항 관리';
    }
    
    // --- 역할별 메뉴 렌더링 함수 ---

    // 일반 사용자 (ktcs_user) 메뉴
    const renderUserMenus = () => (
        <>
            <div className={styles.menuSection}>MARKETING</div>
            <MenuItem
                id="messager"
                icon="wand-magic-sparkles"
                label="AI 메시지 생성"
                isActive={currentPath === 'messager'}
                onClick={goTo('messager', 'AI 메시지 생성')}
            />
            <MenuItem
                id="history"
                icon="clock-rotate-left"
                label="전송 이력"
                isActive={currentPath === 'history'}
                onClick={goTo('history', '전송 이력')}
            />
            <MenuItem
                id="my_performance"
                icon="chart-line"
                label="나의 성과"
                isActive={currentPath === 'my_performance'}
                onClick={goTo('my_performance', '나의 성과')}
            />
        </>
    );

    // 관리자 (admin) 메뉴
    const renderAdminMenus = () => (
        <>
            <div className={styles.menuSection}>MARKETING</div>
            <MenuItem
                id="messager"
                icon="wand-magic-sparkles"
                label="AI 메시지 생성"
                isActive={currentPath === 'messager'}
                onClick={goTo('messager', 'AI 메시지 생성')}
            />
            <MenuItem
                id="history"
                icon="clock-rotate-left"
                label="전송 이력 및 상태"
                isActive={currentPath === 'history'}
                onClick={goTo('history', '전송 이력 및 상태')}
            />
            <MenuItem
                id="my_performance"
                icon="chart-line"
                label="나의 성과"
                isActive={currentPath === 'my_performance'}
                onClick={goTo('my_performance', '나의 성과')}
            />
            <MenuItem
                id="team_performance"
                icon="chart-line"
                label="팀 성과 분석"
                isActive={currentPath === 'team_performance'}
                onClick={goTo('team_performance', '팀 성과 분석')}
            />
        </>
    );

    // 포털 관리자 (portal_admin) 메뉴
    const renderPortalAdminMenus = () => (
        <>
            <div className={styles.menuSection}>ADMIN</div>
            <MenuItem
                id="admin_users"
                icon="users-gear"
                label="사용자 관리"
                isActive={currentPath === 'admin_users'}
                onClick={goTo('admin_users', '사용자 관리')}
            />
            {/* 공지사항 메뉴는 아래 통합 섹션으로 이동 */}
            <MenuItem
                id="tracker"
                icon="gears"
                label="시스템 설정"
                isActive={currentPath === 'tracker'}
                onClick={goTo('tracker', '시스템 설정')}
            />
        </>
    );

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoWrap}>
                <img src={KT_LOGO} alt="KT Logo" style={{ height: 40 }} />
            </div>

            <nav className={styles.menuWrap}>
                {/* 1. 공통 메뉴: 워크스페이스 */}
                <div className={styles.menuSection}>WORKSPACE</div>
                <MenuItem
                    id="home"
                    icon="home"
                    label="워크스페이스"
                    isActive={currentPath === 'home'}
                    onClick={goTo('home', "워크스페이스")}
                />
                
                {/* 2. 역할별 메뉴 그룹 */}
                {user.role === 'ktcs_user' && renderUserMenus()}
                {user.role === 'admin' && renderAdminMenus()}
                {user.role === 'portal_admin' && renderPortalAdminMenus()}

                {/* 3. 공통/조건부 공지사항 메뉴 (통합 페이지) */}
                <div className={styles.menuSection}>OTHERS</div> 
                <MenuItem
                    id="notice_board"
                    icon="scroll" 
                    // 역할에 따라 라벨만 다르게 설정
                    label={noticeLabel} 
                    // 모든 역할이 이 페이지를 사용
                    isActive={currentPath === 'notice_board'}
                    onClick={goTo('notice_board', noticeLabel)}
                />
            </nav>

            <div className={styles.profileBlock}>
                {/* ... (프로필 정보 코드) ... */}
                <div className={styles.profileItem}>
                    <div className={styles.profileIcon}>
                        <i className="fas fa-user"></i>
                    </div>
                    <div className={styles.profileInfo}>
                        <div className={styles.profileInfoTop}>
                            <span className={styles.profileName}>{user.name}</span>
                            <button
                                onClick={() => setOpenModal(true)}
                                className={styles.infoBtn}
                            >
                                내 정보
                            </button>
                            <button onClick={onLogout} className={styles.logoutIconBtn}>
                                <img src={LOGOUT} alt="로그아웃" className={styles.logoutImg} />
                            </button>
                        </div>
                        <span className={styles.profileRole}>{koreanRole}</span>
                    </div>
                </div>
            </div>

            {/* 모달 */}
            {openModal && (
                <UserInfoModal
                    user={user}
                    onClose={() => setOpenModal(false)}
                />
            )}
        </aside>
    );
}

export default Sidebar;