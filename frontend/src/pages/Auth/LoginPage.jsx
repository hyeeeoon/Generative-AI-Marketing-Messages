// src/pages/Auth/LoginPage.js
import React from "react";
import styles from "./Login.module.css";

const roles = [
  { key: "ktcs_user", icon: "fa-users", title: "일반 사용자", desc: "메시지 생성 및 고객 상담" },
  { key: "admin", icon: "fa-chart-pie", title: "관리자", desc: "팀 성과 관리 및 분석" },
  { key: "portal_admin", icon: "fa-user-gear", title: "포털 관리자", desc: "시스템 설정 및 사용자 관리" },
];

function LoginPage({ onSelect, onGoSignup }) {
  return (
    <article>
      <h2 className={styles.loginSelectTitle}>로그인 권한 선택</h2>
      <div className={styles.roleSelectList}>
        {roles.map((r) => (
          <button
            key={r.key}
            className={styles.roleSelectCard}
            onClick={() => onSelect(r.key)}
            type="button"
          >
            <div className={styles.roleIcon}>
              <i className={`fas ${r.icon}`} />
            </div>
            <div>
              <div className={styles.roleTitle}>{r.title}</div>
              <div className={styles.roleDesc}>{r.desc}</div>
            </div>
            <div className={styles.roleArrow}>{">"}</div>
          </button>
        ))}
      </div>

      <button
        type="button"
        className={styles.signupLinkButton}
        onClick={onGoSignup}
      >
        아직 계정이 없으신가요? 회원가입
      </button>
    </article>
  );
}

export default LoginPage;
