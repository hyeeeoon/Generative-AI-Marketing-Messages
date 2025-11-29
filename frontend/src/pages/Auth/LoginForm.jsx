// src/pages/Auth/LoginForm.jsx
import React, { useState } from "react";
import "./LoginForm.css";

function LoginForm({ role, onBack, onLoginSuccess }) {
  const [employeeId, setEmployeeId] = useState("2024001");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoginSuccess({ name: "김상담", employeeId });
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
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
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
