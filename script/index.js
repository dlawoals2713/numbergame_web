/* [1. 글로벌 변수 및 더미 데이터 셋팅] */
// 세션 스토리지 대신 사용할 가상의 로그인 유저 정보
const loginUser = { userName: '홍길동', userId: 'hong123' };

// 가상 플레이어 리스트
let players = [
    { userId: 'player1', highScore: 15 },
    { userId: 'hong123', highScore: 12 },
    { userId: 'lucky7', highScore: 9 },
    { userId: 'gamer3', highScore: 5 },
    { userId: 'test유저', highScore: 2 }
];

const authArea = document.getElementById('authArea'); // 우측 상단 인증단 박스
const startActionBtn = document.getElementById('startActionBtn'); // 본문 중앙 행동 유도 버튼

authArea.innerHTML = `
    <span><strong>${loginUser.userName}</strong>님 환영합니다!</span>
    <button class="btn-logout" onclick="logout()">로그아웃</button>
`;

// 중앙 버튼 클릭 시 바로 게임 화면으로 이동
startActionBtn.addEventListener('click', function() {
    location.href = 'game.html';
});

/* [3. 로그아웃 함수] */
function logout() {
    alert('로그아웃 되었습니다.');
    location.href = 'login.html'; // 로그인 페이지로 튕겨내기
}

/* [4. 가짜 데이터를 활용한 랭킹 표시 함수] */
function loadRanking() {
    const rankList = document.getElementById('rankList');
    
    if(players.length > 0) {
        rankList.innerHTML = ''; // 기존 더미 메시지 초기화
        
        // 상위 5명만 화면에 표시하기 위한 한계선 설정
        const viewCount = Math.min(players.length, 5);
        
        // 반복문을 돌며 화면에 순위 데이터 동적 주입
        for(let i = 0; i < viewCount; i++) {
            rankList.innerHTML += `<li><strong>${players[i].userId}</strong> - Lv.${players[i].highScore}</li>`;
        }
    }
}

// 랭킹 화면 가동
loadRanking();