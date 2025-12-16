import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import Header from "./Header/Header";
import AIsecretary from "./AI_secretary";
import './Layout.css';
import RobotIcon from '../assets/AI.png';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Layout({ user, setUser }) {
    const navigate = useNavigate();

    const [isChatOpen, setIsChatOpen] = useState(false);
    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

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
            <div className="ai-secretary-container">
                <button
                    className="chatbot-icon"
                    onClick={toggleChat}
                    style={{ backgroundColor: 'red', borderRadius: '50%' }} // 빨간 동그라미 스타일
                >
                    <img 
                        src={RobotIcon} 
                        alt={"챗봇 아이콘"} 
                        style={{ width: '30px', height: '30px' }} // 이미지 크기 조정
                    />
                </button>

                {isChatOpen && (
                    <div className="chatbot-window">
                        <AIsecretary onClose={toggleChat} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Layout;
