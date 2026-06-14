/* [전역 상태 변수 선언 코드 정의] */
let currentHighScore = 0; // 새로고침 전까지만 유지되는 최고 레벨 점수 저장 공간

/* 1. 로그인 없이 기본 UI 셋팅 */
// 비회원 접속 통제를 없애고 가상의 이름만 띄워줍니다.
document.getElementById('authArea').innerHTML = `<span><strong>홍길동</strong>님 플레이 중</span>`;
document.getElementById('lblHighScore').textContent = '최고기록: Lv.' + currentHighScore;

/* 2. 인게임 상태 관리 제어 변수 모음 */
let level = 1;              // 현재 플레이어가 머물고 있는 라운드 레벨
let generatedNumbers = "";  // 컴퓨터가 출제한 랜덤 숫자 문자열
let isPlaying = false;      // 현재 유저가 정답 입력 제출 모드 상태인지 판별

const gameScreen = document.getElementById('gameScreen');
const gameBtn = document.getElementById('gameBtn');
const userInput = document.getElementById('userInput');

/* 3. 통합 제어 메인 버튼 이벤트 리스너 연동 */
gameBtn.addEventListener('click', function() {
    if (!isPlaying) {
        startLevel();
    } else {
        checkAnswer();
    }
});

/* 4. 숫자를 순차적으로 보여주고 숨기는 타이머 함수 */
function startLevel() {
    userInput.value = "";       
    userInput.disabled = true;  
    gameBtn.disabled = true;    
    
    let totalDigits = level + 2; 
    generatedNumbers = ""; 
    
    for (let i = 0; i < totalDigits; i++) {
        generatedNumbers += Math.floor(Math.random() * 10);
    }

    let currentIndex = 0;

    function flashNextNumber() {
        if (currentIndex < generatedNumbers.length) {
            gameScreen.textContent = generatedNumbers[currentIndex];
            gameScreen.style.color = "#00ffcc"; 
            currentIndex++; 

            setTimeout(function() {
                gameScreen.textContent = ""; 
                setTimeout(function() {
                    flashNextNumber(); 
                }, 200); 
            }, 300); 

        } else {
            gameScreen.textContent = "???"; 
            gameScreen.style.color = "#e94560"; 
            
            userInput.disabled = false; 
            userInput.focus();          
            
            gameBtn.disabled = false;   
            gameBtn.textContent = "제출"; 
            isPlaying = true;           
        }
    }
    flashNextNumber();
}

/* 5. 정답 유무 최종 판정 (로컬 스토리지 코드 제거 버전) */
function checkAnswer() {
    const userAns = userInput.value.trim();
    
    if (userAns === "") {
        alert("기억하신 숫자를 입력하세요");
        userInput.focus();
        return;
    }

    if (userAns === generatedNumbers) {
        // 정답을 맞춘 경우
        alert("정답. 다음 레벨로 이동합니다.");
        level++; 
        document.getElementById('lblLevel').textContent = "현재 레벨: " + level; 
        
        // 신기록 달성 시 브라우저 변수에만 실시간 업데이트 (스토리지 저장 X)
        if (level > currentHighScore) {
            currentHighScore = level; 
            document.getElementById('lblHighScore').textContent = '최고기록: Lv.' + currentHighScore;
        }

        gameScreen.textContent = "PASS";
        gameScreen.style.color = "#00ffcc";
        gameBtn.textContent = "다음 레벨 시작";
        isPlaying = false; 
        userInput.disabled = true; 
    } else {
        // 오답인 경우
        alert("아쉽게도 오답입니다!\n정답은 [" + generatedNumbers + "] 이었습니다.\n처음부터 다시 재도전하세요");
        
        level = 1; 
        document.getElementById('lblLevel').textContent = "현재 레벨: " + level;
        
        gameScreen.textContent = "GAME OVER";
        gameScreen.style.color = "#aaa"; 
        gameBtn.textContent = "다시 시작하기";
        isPlaying = false; 
        userInput.disabled = true; 
        userInput.value = ""; 
    }
}