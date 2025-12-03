// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LoginView from './pages/Auth/LoginView';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import Generator from './pages/Generator/Generator';
import History from './pages/History';
import Performance from './pages/Performance';
import Manager from './pages/Manager';
import NoticeBoard from './pages/NoticeBoard';

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginView setUser={setUser} />} />

        <Route path="/" element={<Layout user={user} setUser={setUser} />}>
          <Route index element={<Navigate to="/home" replace />} />
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
