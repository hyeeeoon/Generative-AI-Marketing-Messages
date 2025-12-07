import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import KT_LOGO from "../../assets/kt_logo.png";
import LoginPage from "./LoginPage";
import LoginForm from "./LoginForm";
import SignupPage from "./SignupPage";

function LoginView({ setUser }) {
  const [step, setStep] = useState("select");
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  // 한글 → 백엔드 코드 변환
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
    setSelectedRole(role);
    setStep("login");
  };

  const handleGoSignup = () => {
    setStep("signup");
  };

  const handleBack = () => {
    setStep("select");
  };

  const handleLoginSuccess = (userInfo) => {
    setUser({
      name: userInfo.username,
      role: userInfo.role,
      userId: userInfo.userId,
    });
  
    navigate("/home");
  };
  

  const handleSignupSuccess = () => {
    alert("회원가입이 완료되었습니다. 로그인 화면으로 이동합니다.");
    setStep("login");
  };

  return (
    <div className={styles.loginLayout}>
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

      <div className={styles.loginRight}>
        {step === "select" && (
          <LoginPage onSelect={handleRoleSelect} onGoSignup={handleGoSignup} />
        )}

        {step === "login" && (
          <LoginForm
            role={selectedRole}
            roleCode={mapRoleToCode(selectedRole)}
            onBack={handleBack}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {step === "signup" && (
          <SignupPage
            role={selectedRole}
            roleCode={mapRoleToCode(selectedRole)}
            onBack={handleBack}
            onSignupSuccess={handleSignupSuccess}
          />
        )}

        <footer className={styles.loginFooterWrapper}>
          <p className={styles.loginFooter}>© 2025 KT CS Corp. Secure Access.</p>
        </footer>
      </div>
    </div>
  );
}

export default LoginView;