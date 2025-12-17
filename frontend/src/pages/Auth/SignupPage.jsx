// src/pages/Auth/SignupPage.jsx
import React, { useState } from "react";
import "./SignupPage.css";

function SignupPage({ onBack, onSignupSuccess }) {
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState(""); // = userId
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [roleCodeInput, setRoleCodeInput] = useState(""); // 사용자가 입력하는 코드 (AAAA, BBBB 등)

  // 코드 → 백엔드 role 값 매핑
  const mapCodeToRole = (code) => {
    const trimmed = code.trim().toUpperCase();

    if (trimmed === "AAAA") return "admin";          // 관리자
    if (trimmed === "BBBB") return "portal_admin";   // 포털 관리자
    return "ktcs_user";                              // 기본: 일반 사용자
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordCheck) {
      alert("비밀번호와 확인이 일치하지 않습니다.");
      return;
    }

    const roleCode = mapCodeToRole(roleCodeInput);

    const signupBody = {
      username: name,
      userId: employeeId,
      password: password,
      role: roleCode,          // ★ 여기로 최종 role 저장
      organization: "KT CS",
    };

    try {
      const response = await fetch("${import.meta.env.VITE_API_BASE_URL}/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupBody),
      });

      const data = await response.json();
      console.log("SIGNUP RESPONSE >>>", data);

      if (!response.ok || !data.success) {
        alert(data.message || "회원가입 실패");
        return;
      }

      const user = data.result;

      onSignupSuccess?.({
        name: user.username,
        employeeId: user.userId,
        role: roleCode,
      });
    } catch (err) {
      console.error(err);
      alert("회원가입 요청 중 오류가 발생했습니다.");
    }
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

        <div className="kt-field">
          <label className="kt-label">권한 코드 (선택)</label>
          <input
            className="kt-input"
            type="text"
            placeholder="일반: 비워둠, 관리자: AAAA, 포털관리자: BBBB"
            value={roleCodeInput}
            onChange={(e) => setRoleCodeInput(e.target.value)}
          />
        </div>

        <button type="submit" className="kt-signup-btn">
          회원가입
        </button>
      </form>

      <div className="kt-helper-text">
        권한 코드 미입력 시 일반 사용자로 가입됩니다.
      </div>
    </div>
  );
}

export default SignupPage;
