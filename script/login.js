
document.getElementById('loginBtn').addEventListener('click', function() {
    
    // 2-A. 유효성 체크 개시에 앞서 기존 화면단에 잔류하고 있던 붉은색 에러 메시지 텍스트를 공백으로 일제 초기화 청소
    document.getElementById('err-loginId').textContent = '';
    document.getElementById('err-loginPw').textContent = '';
    document.getElementById('err-captcha').textContent = '';

    // 2-B. 실시간으로 폼에 입력된 요소들의 값(Value) 및 상태 데이터를 개별 임시 상수에 할당 바인딩
    const idVal = document.getElementById('user-id').value.trim(); // .trim() 공백문자 노이즈 1차 차단 제거
    const pwVal = document.getElementById('user-pw').value; // 비밀번호는 특수 공백 비밀번호가 존재할 수 있으므로 그대로 획득
    const isRobotChecked = document.getElementById('not-robot').checked; // 로봇 아님 체크박스의 true/false 논리형 값 획득
    const isSaveId = document.getElementById('save-id').checked; // 아이디 저장 체크 여부 판별값 획득

    // 필수 필수 입력값 누락 유무 판정용 불리언(Boolean) 검증 토글 변수 선언
    let valid = true;

    // 2-C. [기초 공백 필터 가이드 라인 검사 제어 블록]
    // 아이디 칸이 완전히 비어있거나 화이트 스페이스 공백으로만 기입되었는가 연산
    if(!idVal) {
        document.getElementById('err-loginId').textContent = '아이디를 입력해주세요.'; // 전용 에러 레이블에 긴급 문구 할당
        valid = false; // 플래그를 불합격 격하 처리
    }
    // 패스워드 미입력 유무 판정
    if(!pwVal) {
        document.getElementById('err-loginPw').textContent = '비밀번호를 입력해주세요.';
        valid = false;
    }
    // 매크로 해킹 프로그램을 막기 위한 캡차 모조 체크박스 누락 판정
    if(!isRobotChecked) {
        document.getElementById('err-captcha').textContent = '로봇이 아닙니다에 체크해주세요.';
        valid = false;
    }

    // 만약 위 3가지 기초 무결성 검증 필터 중 단 하나라도 true 스위치가 꺼졌다면(false) 가입 로직을 강제 폭파 및 자바스크립트 중단 유턴 처리
    if(!valid) return;

    alert(idVal + '님, 환영합니다!');
    
    // 브라우저 BOM 주소 제어 권한 명령어를 통해 드디어 최종 메인 홈 화면인 대시보드 `index.html`로 유저를 강제 주소 이전 링크 처리함
    location.href = 'index.html';
});