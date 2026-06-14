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

function loadRanking() {
    // 전역 스토리지 데이터를 필터 패킹해 담아낼 동적 임시 구조 배열(Array) 리터럴 초기화 선언
    let players = [];
    
    // 브라우저 로컬 데이터베이스(localStorage) 내부에 적재된 모든 물리 데이터 노드의 총 개수만큼 루프(Loop) 가동
    for(let i = 0; i < localStorage.length; i++) {
        // 현재 루프 인덱스 순번에 해당하는 키(Key) 명칭 문자열 획득
        const key = localStorage.key(i);
        
        // 만약 획득한 키명이 회원가입 및 로그인 모듈에서 정규 포맷으로 약속 명명한 'member_' 접두사로 시작하는지 유효성 매칭 연산
        if(key.startsWith('member_')) {
            // 필터 통과 시, 해당 키에 압착 박제되어 있던 JSON 통 문자열 데이터를 복원하여 자바스크립트 객체 오브젝트로 원복 복구
            const obj = JSON.parse(localStorage.getItem(key));
            
            // 해당 유저 객체 프로퍼티 내부에 실전 게임 처리 단락에서 꼽아준 최고 레벨 수치인 'highScore' 속성이 실재하는지 검증
            if(obj.highScore !== undefined) {
                // 모든 조건 무결성 통과 시, 정렬 타겟 후보군 배열인 `players` 인스턴스 내부에 push() 메소드로 가입 정보 객체 통째 인입 누적
                players.push(obj);
            }
        }
    }

    // 점수가 높은 사람을 1등부터 순차적으로 정렬해야 하므로 레코드 b의 스코어에서 a의 스코어를 빼는 '내림차순(Descending)' 정렬 알고리즘 수행
    players.sort((a, b) => b.highScore - a.highScore);

    // 데이터가 바인딩 인입될 타겟 OL 랭크 노드 바인딩
    const rankList = document.getElementById('rankList');
    
    // 4-C. [동적 DOM 주입 및 상위 5명 커트라인 제한 출력 처리 제어문]
    // 만약 상기 데이터 순회 루프 결과, 실제 단 1명이라도 게임 스코어를 보유한 랭커 데이터셋이 배열에 포착되었다면 처리 개시
    if(players.length > 0) {
        // 기존 화면에 더미로 박혀있던 "기록이 없습니다." 텍스트 노드를 한 번 깔끔하게 초기화 소멸 청소
        rankList.innerHTML = '';
        
        // 순위표가 너무 길어지면 디자인 레이아웃이 붕괴되므로, 내장 라이브러리 Math.min 기능을 기용해 전체 데이터 개수와 상위 한계선 5명 중 최솟값을 계산해 동적 커트라인 바운더리 한계 스케일 책정
        const viewCount = Math.min(players.length, 5);
        
        // 동적 산출된 최종 뷰 카운트 횟수만큼 포 루프를 기동하여 OL 내부에 순위별 랭커 데이터 컴포넌트 실시간 동적 HTML 주입
        for(let i = 0; i < viewCount; i++) {
            // 백틱 문자열 결합 연산자를 가동하여 고유 아이디 및 도달 최고 레벨 데이터를 텍스트로 정밀 조합 기입
            rankList.innerHTML += `<li><strong>${players[i].userId}</strong> - Lv.${players[i].highScore}</li>`;
        }
    }
}

// 브라우저 스크립트 인터프리터가 구동되면서, 최종 작성된 명예의 전당 실시간 빌드 함수 `loadRanking()`을 최종 명령 호출 가동합니다.
loadRanking();