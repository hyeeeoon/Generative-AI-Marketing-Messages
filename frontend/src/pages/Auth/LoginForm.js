import styles from './Login.module.css';
export default function LoginForm() {
    return (
        <form className={styles.loginForm}>
            <input type="text" placeholder="아이디" />
            <input type="password" placeholder="비밀번호" />
            <button type="submit">로그인</button>
        </form>
    );
}
