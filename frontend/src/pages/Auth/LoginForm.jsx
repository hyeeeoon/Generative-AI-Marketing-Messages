import React, { useState } from "react";
import "./LoginForm.css";

function LoginForm({ role, onBack, onLoginSuccess }) {
  const [userId, setUserId] = useState("2025");
  const [password, setPassword] = useState("");

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
  
      console.log("LoginForm fetch result:", data.result); // 여기에 콘솔 추가
  
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
        <span className="kt-user-name">김상담</span>
        <span className="kt-user-role">
          {role ? `${role} 접속` : "로그인"}
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
