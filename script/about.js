/* [1. 글로벌 변수 및 DOM 객체 바인딩] */
// 세션 스토리지 대신, 화면에 표시할 가상의 유저 정보를 상수로 고정합니다.
const loginUser = { userName: '홍길동' };

const authArea = document.getElementById('authArea'); // 우측 상단 인증단 박스
const startActionBtn = document.getElementById('startActionBtn'); // 본문 중앙 행동 유도 버튼

/* [2. 무조건 로그인 완료 상태로 UI 제어] */
// 상단 인증 영역에 사용자 이름과 로그아웃 버튼 표시
authArea.innerHTML = `
    <span><strong>${loginUser.userName}</strong>님 환영합니다!</span>
    <button class="btn-logout" onclick="logout()">로그아웃</button>
`;

// 내비게이션 바의 로그인/회원가입 버튼 숨기기
document.getElementById('navLogin').style.display = 'none';
document.getElementById('navSignup').style.display = 'none';

// 중앙 버튼 클릭 시 곧바로 게임 화면으로 이동
startActionBtn.addEventListener('click', function() {
    location.href = 'game.html';
});

function logout() {
    alert('로그아웃 되었습니다.');  // 로그아웃 다이얼로그 보여주기
    location.href = 'login.html';   // 로그인 페이지로 이동
}