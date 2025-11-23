import React, { useState, useEffect, useRef } from 'react';                 // React는 패키지 이름
import Chart from 'chart.js/auto';                                          // chart.js 모듈명
import KT_LOGO from './logo.svg';                                 // 이미지 파일 경로

function Sidebar() {
    const ChartComponent = ({ type, data, options }) => {
        const chartRef = useRef(null);
        const chartInstance = useRef(null);
        useEffect(() => {
            if (chartInstance.current) chartInstance.current.destroy();
            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = new Chart(ctx, { type, data, options });
            return () => { if(chartInstance.current) chartInstance.current.destroy(); }
        }, [data, type]);
        return <canvas ref={chartRef} />;
    };

    // 2. Sidebar
    const Sidebar = ({ currentView, setCurrentView, user, onLogout }) => {
        const MenuItem = ({ id, icon, label }) => (
            <button onClick={() => setCurrentView(id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${currentView === id ? 'bg-[#E60012] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
                <i className={`fas fa-${icon} w-5 text-center`}></i> <span>{label}</span>
            </button>
        );

        return (
            <aside className="w-[260px] bg-white border-r border-gray-200 flex flex-col fixed h-full z-40 shadow-sm">
                <div className="p-6 flex items-center justify-center border-b border-gray-100">
                    <img src={KT_LOGO} alt="KT Logo" className="h-10 object-contain" />
                </div>
                <nav className="p-4 space-y-1 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="text-[10px] font-bold text-gray-400 px-3 mb-2 mt-2">WORKSPACE</div>
                    <MenuItem id="home" icon="home" label="워크스페이스" />

                    {(user.role === '일반 사용자' || user.role === '관리자') && (
                        <>
                            <div className="text-[10px] font-bold text-gray-400 px-3 mb-2 mt-6">MARKETING</div>
                            <MenuItem id="generator" icon="wand-magic-sparkles" label="AI 메시지 생성" />
                            <MenuItem id="history" icon="clock-rotate-left" label="전송 이력" />
                            <MenuItem id="my_performance" icon="chart-line" label={user.role === '관리자' ? '팀 성과 분석' : '나의 성과'} />
                        </>
                    )}
                    {user.role === '관리자' && (
                        <>
                            <div className="text-[10px] font-bold text-gray-400 px-3 mb-2 mt-6">MANAGEMENT</div>
                            <MenuItem id="manager_dashboard" icon="chart-pie" label="비용/효율 관리" />
                        </>
                    )}
                    {user.role === '포털 관리자' && (
                        <>
                            <div className="text-[10px] font-bold text-gray-400 px-3 mb-2 mt-6">ADMIN</div>
                            <MenuItem id="admin_users" icon="users-gear" label="사용자 관리" />
                            <MenuItem id="admin_notices" icon="bullhorn" label="공지사항 관리" />
                            <MenuItem id="admin_logs" icon="file-code" label="시스템 로그" />
                            <MenuItem id="admin_settings" icon="gears" label="시스템 설정" />
                        </>
                    )}
                </nav>
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                        <div className="w-9 h-9 rounded-full bg-white border flex items-center justify-center text-gray-600"><i className="fas fa-user"></i></div>
                        <div className="flex-1 overflow-hidden">
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
                                <button onClick={()=>setCurrentView('my_info')} className="text-[10px] text-blue-600 hover:underline font-bold">내 정보</button>
                            </div>
                            <p className="text-[10px] text-gray-500 truncate">{user.role}</p>
                        </div>
                        <button onClick={onLogout} className="text-gray-400 hover:text-red-500"><i className="fas fa-sign-out-alt"></i></button>
                    </div>
                </div>
            </aside>
        );
    };
}

export default Sidebar;
