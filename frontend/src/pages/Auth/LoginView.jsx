// src/pages/Auth/LoginView.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import KT_LOGO from "../../assets/kt_logo.png";
import LoginPage from "./LoginPage";
import LoginForm from "./LoginForm";
import SignupPage from "./SignupPage";

function LoginView({ setUser }) {
  const [step, setStep] = useState("select");   // "select" | "login" | "signup"
  const [selectedRole, setSelectedRole] = useState(null); // "일반 사용자" | "관리자" | "포털 관리자"
  const navigate = useNavigate();

  // 한글 역할명 → 백엔드 코드
  const mapRoleToCode = (roleLabel) => {
    switch (roleLabel) {
      case "관리자":
        return "admin";
      case "포털 관리자":
        return "portal_admin";
      case "일반 사용자":
      default:
        return "ktcs_user";
    }
  };

  const handleRoleSelect = (role) => {
    // role: "일반 사용자" | "관리자" | "포털 관리자"
    setSelectedRole(role);
    setStep("login");          // 선택 후 로그인 폼으로
  };

  const handleGoSignup = () => {
    // 현재 선택된 역할 유지한 채 회원가입으로 이동 (일반 사용자, 관리자 등)
    setStep("signup");
  };

  const handleBack = () => {
    // 회원가입/로그인 폼 둘 다 뒤로가기 → 권한 선택으로
    setStep("select");
  };

  const handleLoginSuccess = (userInfo) => {
    console.log("LOGIN SUCCESS IN VIEW >>>", userInfo);
    setUser({
      name: userInfo.name,
      role: selectedRole,                // 화면에서 쓸 표시용(한글)
      roleCode: mapRoleToCode(selectedRole), // 필요하면 코드도 저장
    });
    navigate("/home");
  };

  const handleSignupSuccess = (userInfo) => {
    alert("회원가입이 완료되었습니다. 로그인 화면으로 이동합니다.");
    setStep("login");
  };

  return (
    <div className={styles.loginLayout}>
      {/* 왼쪽 공통 UI */}
      <div className={styles.loginLeft}>
        <img src={KT_LOGO} alt="KT Logo" className={styles.loginLogo} />
        <h1 className={styles.loginTitle}>TalkOnz</h1>
        <p className={styles.loginDesc}>
          고객과 마음을 잇는<br />스마트한 시작.
        </p>
        <div className={styles.loginStatus}>
          <span className={styles.statusDot} /> System Online
        </div>
      </div>

      {/* 오른쪽: 단계별로 다른 컴포넌트 렌더 */}
      <div className={styles.loginRight}>
        {step === "select" && (
          <LoginPage
            onSelect={handleRoleSelect}
            onGoSignup={handleGoSignup}
          />
        )}

        {step === "login" && (
          <LoginForm
            role={selectedRole}                // 한글 역할명
            onBack={handleBack}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {step === "signup" && (
          <SignupPage
            role={selectedRole}                // ★ 선택한 역할 전달
            roleCode={mapRoleToCode(selectedRole)} // ★ 백엔드용 코드도 전달
            onBack={handleBack}
            onSignupSuccess={handleSignupSuccess}
          />
        )}

        <footer className={styles.loginFooterWrapper}>
          <p className={styles.loginFooter}>
            © 2025 KT CS Corp. Secure Access.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default LoginView;
