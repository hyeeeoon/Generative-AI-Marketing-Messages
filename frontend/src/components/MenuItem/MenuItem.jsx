import React from "react";
import styles from "./MenuItem.module.css"; // ← 반드시 이 파일

function MenuItem({ id, icon, label, isActive, onClick }) {
    return (
        <button
            className={`${styles.menuBtn} ${isActive ? styles.active : ""}`}
            onClick={onClick}
        >
            <i className={`fas fa-${icon} ${styles.icon}`}></i>
            {label}
        </button>
    );
}

export default MenuItem;
