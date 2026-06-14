/* [1. BOM 세션 스토리지 연동형 글로벌 변수 바인딩 파트] */
// login.html 성공 단락에서 직렬화(JSON.stringify)해서 통째로 심어놓은 로그인 통과자의 원본 인증 객체를 세션 메모리에서 획득 시도
const loginUser = JSON.parse(sessionStorage.getItem('loginUser'));

// 동적 컴포넌트 변조를 위해 제어할 3대 타겟 DOM 객체 노드 바인딩
const authArea = document.getElementById('authArea'); // 우측 상단 인증단 박스
const startActionBtn = document.getElementById('startActionBtn'); // 본문 중앙 행동 유도 버튼

/* [2. 인증 상태 분기에 따른 실시간 UI 상태 머신 제어 처리] */
if(loginUser) {
    // 2-A. [상태 1: 이미 세션 로그인이 입증된 정규 유저 유입 상황]
    // 백틱(``) 기법 템플릿 리터럴 문법을 사용해 순수 자바스크립트 변수를 HTML 구문 사이에 다이렉트 바인딩 연산 처리
    authArea.innerHTML = `
        <span><strong>${loginUser.userName}</strong>님 환영합니다!</span>
        <button class="btn-logout" onclick="logout()">로그아웃</button>
    `;
    
    // 이미 로그인을 완료했으므로 상단 서브 내비게이션 바에 투박하게 잔류하고 있던 로그인/회원가입 탭을 안전하게 시각적 소멸(숨김) 처리
    document.getElementById('navLogin').style.display = 'none';
    document.getElementById('navSignup').style.display = 'none';
    
    // 정규 로그인 유저이므로 중앙 버튼 클릭 시 경고창 없이 곧바로 실전 게임 플레이 보드(`game.html`)로 논스톱 다이렉트 이동 바인딩
    startActionBtn.addEventListener('click', function() {
        location.href = 'game.html';
    });
} else {
    // 2-B. [상태 2: 로그인이 안 된 단순 비회원 및 게스트 유입 상황]
    // 게스트가 게임 시작 버튼을 무단 난타할 경우 데이터 유실 방지를 위한 락(Lock) 매커니즘 콜백 함수 작동
    startActionBtn.addEventListener('click', function() {
        alert('게임을 기록하려면 로그인이 필요합니다.'); // 예외 안내 경고창 전개
        location.href = 'login.html'; // 곧바로 로그인 입력창 페이지로 유저 가이드 강제 전환 시킴
    });
}

function logout() {
    // 임시 세션 스토리지 메모리에 적재되어 상단 상태를 추적하던 'loginUser' 키 레코드를 완전히 무효화 파괴 소멸 처리
    sessionStorage.removeItem('loginUser');
    // 사용자에게 보안 안전 로그아웃 안내 서브 팝업 전개
    alert('로그아웃 되었습니다.');
    // 현재 BOM 윈도우 인스턴스를 강제 새로고침(Reload)하여, 갱신된 비로그인 UI 상태로 화면 전면 전향 유도
    location.reload();
}