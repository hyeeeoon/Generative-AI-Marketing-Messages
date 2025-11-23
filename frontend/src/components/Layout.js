import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import Header from "./Header/Header";
import './Layout.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Layout({ user, setUser }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        setUser(null);           // 여기서 props로 받은 setUser로 상태 초기화
        navigate('/login');      // 로그인 페이지로 이동
    };

    const [currentLabel, setCurrentLabel] = useState('워크스페이스');

    // user 없으면 로그인 페이지로 리디렉션!
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="layout-container">
            <Sidebar
                user={user}
                onLogout={handleLogout}
                setCurrentLabel={setCurrentLabel}
            />
            <div className="content-wrapper">
                <Header label={currentLabel} />
                <main className="main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Layout;
