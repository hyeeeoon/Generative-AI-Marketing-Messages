// src/pages/Auth/SignupPage.jsx
import React, { useState } from "react";
import "./SignupPage.css";

function SignupForm({ onBack, onSignupSuccess }) {
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");      // 아이디(사번 or 이메일)
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== passwordCheck) {
      alert("비밀번호와 확인이 일치하지 않습니다.");
      return;
    }

    // TODO: 실제 회원가입 API 연동
    onSignupSuccess?.({ name, employeeId });
  };

  return (
    <div className="kt-signup-right">
      <button
        type="button"
        className="kt-back-btn"
        onClick={onBack}
      >
        ← 뒤로가기
      </button>

      <div className="kt-user-info">
        <span className="kt-user-name">회원가입</span>
        <span className="kt-user-role">새 계정 생성</span>
      </div>

      <form className="kt-signup-form" onSubmit={handleSubmit}>
        <div className="kt-field">
          <label className="kt-label">이름</label>
          <input
            className="kt-input"
            type="text"
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="kt-field">
          <label className="kt-label">아이디 (이메일 또는 사번)</label>
          <input
            className="kt-input"
            type="text"
            placeholder="아이디를 입력하세요"
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

        <div className="kt-field">
          <label className="kt-label">비밀번호 확인</label>
          <input
            className="kt-input"
            type="password"
            placeholder="비밀번호 다시 입력"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
          />
        </div>

        <button type="submit" className="kt-signup-btn">
          회원가입
        </button>
      </form>

      <div className="kt-helper-text">
        이미 계정이 있으신가요? 로그인 화면으로 돌아가세요.
      </div>
    </div>
  );
}

export default SignupForm;
