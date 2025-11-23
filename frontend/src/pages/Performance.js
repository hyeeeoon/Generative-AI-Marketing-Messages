// 간단한 예시용 페이지 컴포넌트
function Performance(user) {
    return (
        <h1>{user.role === '관리자' ? '팀 성과 분석' : '나의 성과'}</h1>
    );
}

export default Performance;
