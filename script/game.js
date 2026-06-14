/* [전역 상태 변수 선언 코드 정의] */
// 브라우저 세션스토리지에서 현재 로그인한 유저의 정보 객체를 가져옵니다.
const loginUser = JSON.parse(sessionStorage.getItem('loginUser'));
let currentHighScore = 0; // 유저의 최고 레벨 점수를 저장할 임시 공간

/* 1. 비회원 접속 통제 및 초기 스코어 셋팅 */
if (!loginUser) {
    // 로그인 데이터가 유실되었거나 로그인을 안 한 상태라면 강제로 거부 처리
    alert('로그인을 해야 하는데. 로그인 페이지로 이동합니다.');
    location.href = 'login.html';
} else {
    // 로그인 상태가 정상이면 우측 상단에 유저의 이름을 매핑해줍니다.
    document.getElementById('authArea').innerHTML = `<span><strong>${loginUser.userName}</strong>님 플레이 중</span>`;
    
    // 로컬스토리지에서 해당 유저의 원본 데이터 키를 조회해 최신 하이스코어를 가져옵니다.
    const localData = JSON.parse(localStorage.getItem('member_' + loginUser.userId));
    currentHighScore = localData.highScore || 0; // 점수 데이터가 아예 없다면 0으로 기본 셋팅
    // 화면 상단 우측 스코어 텍스트 레이블 즉시 갱신
    document.getElementById('lblHighScore').textContent = '최고기록: Lv.' + currentHighScore;
}

/* 2. 인게임 상태 관리 제어 변수 모음 */
let level = 1;              // 현재 플레이어가 머물고 있는 라운드 레벨 (1부터 시작)
let generatedNumbers = "";  // 컴퓨터가 출제한 랜덤 숫자 문자열 결합본 (예: "054")
let isPlaying = false;      // 현재 유저가 정답 입력 제출 모드 상태인지 판별해주는 플래그 변수

// DOM 제어를 위해 미리 HTML 요소를 변수로 획득
const gameScreen = document.getElementById('gameScreen');
const gameBtn = document.getElementById('gameBtn');
const userInput = document.getElementById('userInput');

/* 3. 통합 제어 메인 버튼 이벤트 리스너 연동 */
gameBtn.addEventListener('click', function() {
    if (!isPlaying) {
        // 게임 진행 상태가 아니라면 [게임 시작] 혹은 [다음 레벨 시작] 목적이므로 라운드 가동
        startLevel();
    } else {
        // 게임 진행 중일 때는 입력 완료 후 [제출하기] 동작이므로 정답 판정 스크립트로 점프
        checkAnswer();
    }
});

/* 4. [핵심 로직] 숫자를 순차적으로 0.5초 보여주고 0.2초 숨기는 재귀 타이머 함수 */
function startLevel() {
    userInput.value = "";       // 이전 레벨에서 입력했던 텍스트 창 리셋 깨끗하게 초기화
    userInput.disabled = true;  // 숫자가 화면에 연달아 나오는 도중에는 타이핑 불가능하게 락 걸기
    gameBtn.disabled = true;    // 숫자가 연출되는 도중에는 제출/시작 버튼 연타 방지 락 걸기
    
    // 레벨이 올라갈수록 맞추어야 할 자릿수가 동적으로 늘어납니다. (1레벨=3자리, 2레벨=4자리, 3레벨=5자리...)
    let totalDigits = level + 2; 
    generatedNumbers = ""; // 기존 난수 누적값 청소
    
    // 루프를 돌며 필요한 자릿수만큼 0~9 사이의 무작위 난수를 생성하여 문자열로 병합
    for (let i = 0; i < totalDigits; i++) {
        generatedNumbers += Math.floor(Math.random() * 10);
    }

    // 시퀀스 인덱스 카운터 (몇 번째 숫자를 뿌려주고 있는지 추적)
    let currentIndex = 0;

    // 순차적 화면 연출을 담당하는 핵심 내부 재귀 함수 정의
    function flashNextNumber() {
        // 아직 보여줄 숫자가 남아 있다면 계속 수행
        if (currentIndex < generatedNumbers.length) {
            
            // A 단계: 전광판에 현재 순번의 숫자 한 개만 명확하게 출력
            gameScreen.textContent = generatedNumbers[currentIndex];
            gameScreen.style.color = "#00ffcc"; // 정상 출력용 민트 청록색 지정
            
            currentIndex++; // 다음 번환 조회를 위해 인덱스 1 증가

            // 지정 조건 1: 0.5초(500ms) 동안 숫자를 화면에 온전히 유지시킨 뒤 소거 작업 시작
            setTimeout(function() {
                
                // B 단계: 숫자를 화면에서 완전히 숨김 (공백 상태로 전환)
                gameScreen.textContent = ""; 
                
                // 지정 조건 2: 0.2초(200ms) 동안 완벽하게 숨겨진 상태를 유지한 후 다음 숫자로 토스
                setTimeout(function() {
                    flashNextNumber(); // 자기 자신을 다시 호출하여 다음 글자 연출 (재귀 루프)
                }, 200); // 0.2초간 사라짐 대기 타이머 끝
                
            }, 300); // 0.5초간 노출 유지 타이머 끝

        } else {
            // C 단계: 모든 랜덤 숫자가 순차 제어 노출 완료되었을 때 실행되는 마감 처리 구역
            gameScreen.textContent = "???"; // 힌트 소멸, 알아맞추라는 의미의 물음표 출력
            gameScreen.style.color = "#e94560"; // 붉은색 경고 느낌으로 테마 변경
            
            userInput.disabled = false; // 이제 사용자가 정답을 쓸 수 있도록 입력창 잠금 해제
            userInput.focus();          // 편의성을 위해 마우스 포커스를 자동으로 입력창에 매핑
            
            gameBtn.disabled = false;   // 제출 처리할 수 있도록 메인 제어 버튼 활성화
            gameBtn.textContent = "제출"; // 버튼 글자를 제출하기 모드로 전환
            isPlaying = true;           // 인게임 진행 플래그 상태를 참(True)으로 스위칭
        }
    }

    // 준비 완료 후 최초 1회차 연출 사이클 가동 개시
    flashNextNumber();
}

/* 5. 정답 유무 최종 판정 및 로컬 스토리지 랭킹 스코어 즉시 동적 갱신 */
function checkAnswer() {
    // 사용자가 폼에 입력한 데이터 값을 받아오고 양끝 공백 에러 차단 제거
    const userAns = userInput.value.trim();
    
    // 공백 빈칸인 상태로 제출 단추를 누르는 상황 원천 차단 벨리데이션 체크
    if (userAns === "") {
        alert("기억하신 숫자를 입력하세요");
        userInput.focus();
        return;
    }

    // 컴퓨터가 출제한 원본 난수 문자열 조합과 유저가 쓴 답안이 정밀 일치하는가 판정
    if (userAns === generatedNumbers) {
        // [CASE A : 정답을 정확히 맞춘 경우 환희의 레벨업 프로세스 가동]
        alert("정답. 다음 레벨로 도망갑니다.");
        level++; // 스코어 레벨 값을 1 상승시킴
        document.getElementById('lblLevel').textContent = "현재 레벨: " + level; // 화면단 글자 즉시 연동 반영
        
        // 만약 현재 갱신한 레벨이 기존 내 계정 최고 레벨을 넘어선 '신기록' 상황이라면?
        if (level > currentHighScore) {
            currentHighScore = level; // 실시간 최고 레벨 변수 동기화
            document.getElementById('lblHighScore').textContent = '최고기록: Lv.' + currentHighScore;
            
            // 로컬스토리지에 잠들어있던 해당 유저의 회원 원본 JSON 정보를 복원 호출
            const localData = JSON.parse(localStorage.getItem('member_' + loginUser.userId));
            localData.highScore = currentHighScore; // 최고 레벨 점수 프로퍼티 필드만 동적 수정
            // 수정된 최신 스코어 오브젝트를 다시 문자열화하여 로컬스토리지 영구 저장 매핑 시킴 (명예의전당 자동 연동)
            localStorage.setItem('member_' + loginUser.userId, JSON.stringify(localData));
        }

        // 다음 판 진행 준비 양식 셋팅
        gameScreen.textContent = "PASS";
        gameScreen.style.color = "#00ffcc";
        gameBtn.textContent = "다음 레벨 시작";
        isPlaying = false; // 진행 모드를 잠시 꺼서 다음 레벨 시작 버튼 누르도록 유도
        userInput.disabled = true; // 대기 중 강제 타이핑 잠금
    } else {
        // [CASE B : 오답이 나버려 패배한 게임오버 프로세스 가동]
        alert("다행히 오답입니다!\n정답은 [" + generatedNumbers + "] 이었습니다.\n태초부터 다시 재도전하세요");
        
        level = 1; // 가차없이 레벨 1단계 기초 스테이지로 강제 초기화 리셋
        document.getElementById('lblLevel').textContent = "현재 레벨: " + level;
        
        gameScreen.textContent = "GAME OVER";
        gameScreen.style.color = "#aaa"; // 전광판 회색 빛으로 변경
        gameBtn.textContent = "다시 시작하기";
        isPlaying = false; // 대기 상태로 초기화 전환
        userInput.disabled = true; // 입력창 잠금
        userInput.value = ""; // 오답 텍스트 지우기
    }
}