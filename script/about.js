const loginUser = { userName: '홍길동' };   // 현재 닉네임 설정

const authArea = document.getElementById('authArea');   // 우측 상단 레이아웃
const startActionBtn = document.getElementById('startActionBtn');   // 게임 시작 버튼

// 유저네임 변수를 불러와 닉네임을 보여주어 환영문구 표시
// 로그아웃 텍스트를 누르면 logout 함수 실행
authArea.innerHTML = `
    <span><strong>${loginUser.userName}</strong>님 환영합니다!</span>
    <button class="btn-logout" onclick="logout()">로그아웃</button>
`;

startActionBtn.addEventListener('click', function() {   // 게임 시작하기 버튼을 눌렀을 때
    location.href = 'game.html';    // 게임 화면으로 이동
});

// 전설의 로그아웃 함수
function logout() {
    alert('로그아웃 되었습니다.');  // 로그아웃 다이얼로그 보여주기
    location.href = 'login.html';   // 로그인 페이지로 이동
}