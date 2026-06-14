let currentHighScore = 0;   // 현재 최고 레벨

document.getElementById('authArea').innerHTML = `<span><strong>홍길동</strong>님 플레이 중</span>`;     // 누가 플레이 하고 있는지 오른쪽 상당에 표시
document.getElementById('lblHighScore').textContent = '최고기록: Lv.' + currentHighScore;   // 게임 최고 기록 표시

let level = 1;  // 현재 플레이어가 플레이 중인 레벨
let generatedNumbers = "";  // 랜덤 숫자 문자열 (정답 값)
let isPlaying = false;  // 정답 제출 모드인가

const gameScreen = document.getElementById('gameScreen');   // 숫자가 표시되는 화면
const gameBtn = document.getElementById('gameBtn');     // 게임 시작/정답 체출 버튼
const userInput = document.getElementById('userInput');     // 사용자 입력 칸

gameBtn.addEventListener('click', function() {  // 버튼이 눌렸을 때
    if (!isPlaying) {   // 정답 제출 모드가 아니라면
        startLevel();   // 게임 시작
    } else {
        checkAnswer();  // 정답 확인
    }
});

// 게임 시작 함수
function startLevel() {
    userInput.value = "";    // 사용자 입력값   
    userInput.disabled = true;      // 사용자 입력칸을 비활성화 상태로 변경
    gameBtn.disabled = true;        // 버튼을 비활성화 상태로 변경
    
    let totalDigits = level + 2;    // 표시되는 숫자는 현재 레벨 + 2개로 표시 (총 개수)
    generatedNumbers = "";  // 저장할 정답 값
    
    for (let i = 0; i < totalDigits; i++) {     // 총 개수만큼 랜덤값 생성하여 문자열 맨 뒤에 저장
        generatedNumbers += Math.floor(Math.random() * 10);     // 변수 맨 뒤에 랜덤값(소숫점 삭제) 저장
    }

    let currentIndex = 0;   // 숫자가 표시될 횟수

    function flashNextNumber() {    // 숫자 깜박이게 하는 함수
        if (currentIndex < generatedNumbers.length) {   // currentIndex의 값이 generatedNumbers의 숫자 개수보다 적다면
            gameScreen.textContent = generatedNumbers[currentIndex];    // generatedNumbers의 currentIndex번째 문자를 가져와서 표시
            gameScreen.style.color = "#00ffcc";     // 색깔은 민트색
            currentIndex++;     // 현재 위치값 +1

            setTimeout(function() {     // 지연 시간 0.3초
                gameScreen.textContent = "";    // 숫자 숨기기
                setTimeout(function() {     // 지연 시간 0.2초 이후
                    flashNextNumber();      // 이 함수(flashNextNumber) 다시 호출
                }, 200); 
            }, 300); 

        } else {    // 현재 위치값이 generatedNumber의 숫자 개수와 같거나 크다면
            gameScreen.textContent = "???";     // ??? 표시
            gameScreen.style.color = "#e94560";     // 색깔은 빨간색
            
            userInput.disabled = false;     // 사용자 입력칸을 활성화 상태로 변경
            userInput.focus();          // 자동으로 입력칸에 포커스가 들어오도록 설정, 이걸 하면 사용자가 마우스로 입력칸을 클릭하지 않아도 됨
            
            gameBtn.disabled = false;   // 버튼을 활성화 상태로 변경
            gameBtn.textContent = "제출";   // 버튼 텍스트를 '제출'로 변경
            isPlaying = true;   // 정답 제출 모드로 설정
        }
    }
    flashNextNumber();  // 숫자 깜박임 함수 최초 호출
}

function checkAnswer() {    // 정답 확인 함수
    const userAns = userInput.value.trim();     // 사용자가 입력한 값을 다듬어서(좌우 여백 삭제) 변수에 저장
    
    if (userAns === "") {   // 입력값이 비었다면
        alert("기억하신 숫자를 입력하세요");    // 다이얼로그 표시
        userInput.focus();  // 사용자 입력칸 포커스
        return; // 함수 종료(반환)
    }

    if (userAns === generatedNumbers) {     // 사용자가 입력한 값이 정답이라면
        alert("정답. 다음 레벨로 이동합니다.");     // 정답 다이얼로그 표시
        level++;    // 레벨 1 추가
        document.getElementById('lblLevel').textContent = "현재 레벨: " + level;    // 현재 레벨 업데이트
        
        if (level > currentHighScore) {     // 최고기록이라면
            currentHighScore = level;   // 최고기록을 현재 레벨로 설정
            document.getElementById('lblHighScore').textContent = '최고기록: Lv.' + currentHighScore;   // 최고기록 업데이트
        }

        gameScreen.textContent = "PASS";    // PASS 표시
        gameScreen.style.color = "#00ffcc";     // 색깔은 민트색
        gameBtn.textContent = "다음 레벨 시작";     // 버튼 텍스트를 '다음 레벨 시작'으로 변경
        isPlaying = false;  // 정답 제출 모드 종료
        userInput.disabled = true;  // 사용자 입력칸을 비활성화 상태로 변경
    } else {    // 오답인 경우
        alert("다행히 오답입니다!\n정답은 [" + generatedNumbers + "] 이었습니다.\n처음부터 다시 재도전하세요");     // 오답 다이얼로그 표시
        
        level = 1;  // 레벨을 1로 재설정
        document.getElementById('lblLevel').textContent = "현재 레벨: " + level;    // 현재 레벨 업데이트
        
        gameScreen.textContent = "GAME OVER";   // 텍스트를 'GAME OVER'로 설정
        gameScreen.style.color = "#aaa";    // 색깔은 회색
        gameBtn.textContent = "다시 시작하기";  // 버튼 텍스트를 '다시 시작하기'로 변경
        isPlaying = false;  // 정답 제출 모드 종료
        userInput.disabled = true;  // 사용자 입력칸을 비활성화 상태로 변경
        userInput.value = "";   // 사용자 입력칸을 비우기
    }
}