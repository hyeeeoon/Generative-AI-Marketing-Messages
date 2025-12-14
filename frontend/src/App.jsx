import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// === 기존 페이지 컴포넌트들 import ===
import LoginView from './pages/Auth/LoginView';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';

// 일반 사용자 & 관리자 공통/마케팅 메뉴
import MessageCreatePage from './pages/Messages/MessageCreatePage';
import History from './pages/History'; // 일반 사용자: 전송 이력 / 관리자: 전송 이력 및 상태
import Performance from './pages/Performance'; // 나의 성과
import NoticeBoard from './pages/NoticeBoard'; // 모든 역할 (라벨만 다름)

// 관리자 (admin) 전용 메뉴
import Manager from './pages/Manager'; // 비용/효율 관리 (ManagerDashboardPage)
import TeamPerformance from './pages/TeamPerformance'; // 팀 성과 분석 (새로 추가)

// 포털 관리자 (portal_admin) 전용 메뉴
import AdminUsers from './pages/Admin/AdminUsers'; // 사용자 관리 (새로 추가)
import AdminSettings from './pages/Admin/AdminSettingsPage'; // 시스템 설정 (새로 추가)


function App() {
  // user 정보 (로그인 한 사용자)
  const [user, setUser] = useState(null);

  // 서버에서 "현재 로그인된 사용자"를 가져오는 동안 보여줄 로딩 상태
  const [loading, setLoading] = useState(true);

  /**
   * ✔ 페이지가 처음 열릴 때 실행됨 (새로고침 포함)
   */
  useEffect(() => {
    fetch("http://localhost:8080/api/users/me", {
      method: "GET",
      credentials: "include", // 세션 쿠키 포함해서 보내기
    })
      .then(res => {
        if (!res.ok) throw new Error("not logged in");
        return res.json();
      })
      .then(data => {
        setUser(data.result);
      })
      .catch(() => {
        // 로그인 안 되어있거나 에러 → user 없음
        setUser(null);
      })
      .finally(() => {
        // 로딩 화면을 끝냄
        setLoading(false);
      });
  }, []);

  /**
   * ✔ 서버에서 "현재 로그인 상태" 확인할 때까지는 Loading... 보여주기
   */
  if (loading) {
    return <div>Loading...</div>;
  }

  // 로그인 상태가 아닐 때, LoginView가 아닌 모든 페이지 접속 시도 시 로그인 페이지로 리다이렉트
  // Layout을 보호하기 위한 추가적인 가드 로직
  if (!user && location.pathname !== '/login') {
    return <BrowserRouter><Navigate to="/login" replace /></BrowserRouter>;
  }


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginView setUser={setUser} />} />

        {/* Layout을 감싸는 구조 (Sidebar + Header + Outlet)
          user가 null이 아니면 이 경로들로 접근 가능
        */}
        <Route path="/" element={<Layout user={user} setUser={setUser} />}>
          <Route index element={<Navigate to="/home" replace />} />

          {/* === 공통/일반 사용자/관리자 메뉴 === */}
          <Route path="home" element={<HomePage />} />
          <Route path="messager" element={<MessageCreatePage />} />
          <Route path="history" element={<History />} />
          <Route path="notice_board" element={<NoticeBoard />} /> {/* 공통 경로 (라벨만 다름) */}
          
          {/* 성과 분석 관련 */}
          <Route path="my_performance" element={<Performance />} />      {/* 일반 사용자: 나의 성과 */}
          <Route path="team_performance" element={<TeamPerformance />} /> {/* 관리자: 팀 성과 분석 */}

          {/* 관리자 (admin) 전용 */}
          <Route path="manager_dashboard" element={<Manager />} />

          {/* 포털 관리자 (portal_admin) 전용 */}
          <Route path="admin_users" element={<AdminUsers />} />
          <Route path="admin_settings" element={<AdminSettings />} />
        </Route>
        
        {/*
          404 Not Found 처리를 위한 라우트 (옵션)
          <Route path="*" element={<div>404 Not Found</div>} />
        */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;