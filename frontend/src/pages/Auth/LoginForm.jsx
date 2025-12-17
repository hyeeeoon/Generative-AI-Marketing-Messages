import React, { useState } from "react";
import "./LoginForm.css";

function LoginForm({ role, onBack, onLoginSuccess }) {
  
  const getInitialUserId = (currentRole) => {
    switch (currentRole) {
      case "admin":
        return "2025"; // 관리자 역할의 예시 ID
      case "portal_admin":
        return "2023"; // 포털 관리자 역할의 예시 ID
      case "ktcs_user":
      default:
        return "2024"; // 일반 사용자 또는 기본값은 비워둡니다.
    }
  };
  const [userId, setUserId] = useState(getInitialUserId(role));
  const [password, setPassword] = useState("");

  const mapCodeToRole = (code) => {
    switch (code) {
      case "admin":
        return "관리자";
      case "portal_admin":
        return "포털 관리자";
      case "ktcs_user":
      default:
        return "일반사용자";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId: userId,
          password: password,
          role: role, 
        }),
      });

      const data = await response.json();
  
      if (!response.ok || !data.success) {
        alert(data.message || "로그인 실패");
        return;
      }
  
      const user = data.result;
  
      console.log("Sending to App:", {
        username: user.username,
        userId: user.userId,
        role: user.role,
      }); // 여기서도 콘솔
  
      onLoginSuccess({
        username: user.username,
        userId: user.userId,
        role: user.role,
      });
    } catch (error) {
      console.error(error);
      alert("로그인 요청 중 오류가 발생했습니다.");
    }
  };  

  return (
    <div className="kt-right">
      <button type="button" className="kt-back-btn" onClick={onBack}>
        ← 뒤로가기
      </button>

      <div className="kt-user-info">
        <span className="kt-user-name">환영합니다</span>
        <span className="kt-user-role">
           {role ? `${mapCodeToRole(role)} 접속` : "로그인"}
        </span>
      </div>

      <form className="kt-form" onSubmit={handleSubmit}>
        <div className="kt-field">
          <label className="kt-label">아이디 (사번)</label>
          <input
            className="kt-input"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>

        <div className="kt-field">
          <label className="kt-label">비밀번호</label>
          <input
            className="kt-input"
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="kt-login-btn">
          로그인
        </button>
      </form>

      <div className="kt-helper-text">초기 비밀번호: 1234</div>
    </div>
  );
}

export default LoginForm;
