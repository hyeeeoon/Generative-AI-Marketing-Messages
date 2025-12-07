import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// 페이지 컴포넌트들 import
import LoginView from './pages/Auth/LoginView';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import Generator from './pages/Generator/Generator';
import History from './pages/History';
import Performance from './pages/Performance';
import Manager from './pages/Manager';
import NoticeBoard from './pages/NoticeBoard';

function App() {
  // user 정보 (로그인 한 사용자)
  const [user, setUser] = useState(null);

  // 서버에서 "현재 로그인된 사용자"를 가져오는 동안 보여줄 로딩 상태
  const [loading, setLoading] = useState(true);

  /**
   * ✔ 페이지가 처음 열릴 때 실행됨 (새로고침 포함)
   *
   * 이 로직이 필요한 이유:
   *  - React는 새로고침하면 메모리의 상태(state)가 모두 초기화됨.
   *  - 그래서 user가 null이 되어버림.
   *  - 하지만 서버는 세션을 기억하고 있음.
   *
   * 그래서 /api/users/me 를 호출해서
   *  "지금 로그인한 사용자가 누구인지" 를 다시 받아옴.
   * 
   * credentials: 'include' → 세션 쿠키(JSESSIONID)를 같이 보냄
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
   * ✔ 서버에서 "현재 로그인 상태" 확인할 때까지는
   *   전체 화면 대신 Loading... 보여주기
   * 
   * 만약 이걸 안 하면 user=null 상태로 먼저 렌더링 -> Sidebar가 깨져서 메뉴 안보임
   */
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginView setUser={setUser} />} />

        {/* 
          Layout을 감싸는 구조
          Sidebar + Header + Outlet 구조인 Layout 내부에서 user 사용함
        */}
        <Route path="/" element={<Layout user={user} setUser={setUser} />}>
          <Route index element={<Navigate to="/home" replace />} />

          {/* 메뉴들 */}
          <Route path="home" element={<HomePage />} />
          <Route path="generator" element={<Generator />} />
          <Route path="history" element={<History />} />
          <Route path="my_performance" element={<Performance />} />
          <Route path="manager_dashboard" element={<Manager />} />
          <Route path="notice_board" element={<NoticeBoard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
