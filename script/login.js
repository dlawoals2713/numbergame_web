// 로그인 버튼을 눌렀을 때
document.getElementById('loginBtn').addEventListener('click', function() {  
    // 오류 메시지들 삭제
    document.getElementById('err-loginId').textContent = '';
    document.getElementById('err-loginPw').textContent = '';
    document.getElementById('err-captcha').textContent = '';

    const idVal = document.getElementById('user-id').value.trim(); // 공백 문자를 제외한 아이디 불러오기
    const pwVal = document.getElementById('user-pw').value; // 비밀번호 불러오기
    const isRobotChecked = document.getElementById('not-robot').checked; // 로봇이 아닙니까? 여부 불러오기
    const isSaveId = document.getElementById('save-id').checked; // 아이디 저장 체크 여부 불러오기

    let valid = true;   // 유효한가? 의 기본값을 참으로 설정

    if(!idVal) {    // 아이디가 비었다면
        document.getElementById('err-loginId').textContent = '아이디를 입력해주세요.';  // 오류 메시지 설정
        valid = false; // 유효한가? 를 거짓으로 설정
    }
    if(!pwVal) {    // 패스워드가 비었다면
        document.getElementById('err-loginPw').textContent = '비밀번호를 입력해주세요.';    // 오류 메시지 설정
        valid = false; // 유효한가? 를 거짓으로 설정
    }
    if(!isRobotChecked) {   // 로봇이 아닙니다가 아니라면
        document.getElementById('err-captcha').textContent = '로봇이 아닙니다에 체크해주세요.'; // 오류 메시지 설정
        valid = false; // 유효한가? 를 거짓으로 설정
    }

    if(!valid) return; // 유효한가? 가 거짓이라면 함수 종료(반환)

    alert(idVal + '님, 환영합니다!');   // 로그인 성공 다이얼로그 표시
    location.href = 'index.html';   // 홈 화면으로 내보내기
});