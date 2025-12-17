import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import LoginView from './pages/Auth/LoginView';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import HistoryTracker from './pages/HistoryTrackerPage'; 
import MessageCreatePage from './pages/Messages/MessageCreatePage';
import History from './pages/History'; 
import Performance from './pages/Performance'; 
import NoticeBoard from './pages/NoticeBoard'; 

import Manager from './pages/Manager'; 
import TeamPerformance from './pages/TeamPerformance'; 

import AdminUsers from './pages/Admin/AdminUsers'; 
import AdminSettings from './pages/Admin/AdminSettingsPage'; 


function App() {
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/me`, {
      method: "GET",
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error("not logged in");
        return res.json();
      })
      .then(data => {
        setUser(data.result);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        
        {/* 로그인 없이 접근 가능한 경로 */}
        <Route path="/login" element={<LoginView setUser={setUser} />} />
        
        {/* 로그인 필수 경로 보호 로직 */}
        {user ? (
          <Route path="/" element={<Layout user={user} setUser={setUser} />}>
            <Route index element={<Navigate to="/home" replace />} />
            {/* 공통/일반 사용자/관리자 메뉴 */}
            <Route path="home" element={<HomePage />} />
            <Route path="messager" element={<MessageCreatePage />} />
            <Route path="history" element={<History />} />
            <Route path="notice_board" element={<NoticeBoard />} /> 
            
            {/* 성과 분석 관련 */}
            <Route path="my_performance" element={<Performance />} />      
            <Route path="team_performance" element={<TeamPerformance />} /> 

            {/* 관리자 (admin) 전용 */}
            <Route path="manager_dashboard" element={<Manager />} />

            {/* 포털 관리자 (portal_admin) 전용 */}
            <Route path="admin_users" element={<AdminUsers />} />
            <Route path="admin_settings" element={<AdminSettings />} />
            <Route path="tracker" element={<HistoryTracker />} /> 
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}

      </Routes>
    </BrowserRouter>
  );
}

export default App;