const loginUser = { userName: '홍길동', userId: 'hong123' };    // 사용자 이름 설정

// 가상 플레이어 리스트
let players = [
    { userId: 'player1', highScore: 15 },
    { userId: 'hong123', highScore: 12 },
    { userId: 'lucky7', highScore: 9 },
    { userId: 'gamer3', highScore: 5 },
    { userId: 'test유저', highScore: 2 }
];

const authArea = document.getElementById('authArea'); // 우측 상단 레이아웃
const startActionBtn = document.getElementById('startActionBtn'); // 게임 시작 버튼

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

// 랭킹 불러오기 (샘플 데이터)
function loadRanking() {
    const rankList = document.getElementById('rankList');   // 랭킹 리스트 레이아웃 불러오기
    
    if (players.length > 0) {   // 플레이어 수가 0명 초과라면
        rankList.innerHTML = ''; // 랭킹 리스트 텍스트 비우기
        
        const viewCount = Math.min(players.length, 5);  // 상위 5명만 화면에 표시하기 위한 한계선 설정
        
        
        for(let i = 0; i < viewCount; i++) {    // 반복문을 돌며 화면에 순위 데이터 동적 주입
            rankList.innerHTML += `<li><strong>${players[i].userId}</strong> - Lv.${players[i].highScore}</li>`;
        }
    }
}

loadRanking();  // 랭킹 불러오기 함수 호출