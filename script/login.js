/* [1. BOM 브라우저 생명주기 API: 최초 웹 화면 로딩 시 자동 가동 스크립트] */
// 브라우저가 HTML 문서 구조와 CSS 파일을 내부 가상 메모리 트리에 안착(onload)시킨 직후 자동 호출되는 콜백 함수 정의
window.onload = function() {
    // 브라우저 하드웨어 비휘발성 로컬 저장소(localStorage) 공간에서 'savedId'라는 키값 데이터 조회 시도
    const savedId = localStorage.getItem('savedId');
    
    // 만약 이전에 아이디 저장 체크박스를 켜고 로그인에 무사 성공하여 데이터 파편이 남아있다면 조건문 실행
    if(savedId) {
        // 아이디 텍스트 입력창 객체를 찾아와 저장되어 있던 아이디 문자열 값을 강제 미리 채우기 주입
        document.getElementById('user-id').value = savedId;
        // 사용자 인지를 돕기 위해 아이디 저장 체크박스 엘리먼트 엘리먼트 논리 상태를 true(체크 활성화)로 자동 변경
        document.getElementById('save-id').checked = true;
    }
}

/* [2. 로그인 버튼 마우스 클릭 시 가동되는 비즈니스 인증 프로세스 총괄 리스너] */
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

    // 2-D. [로컬 데이터베이스 매칭 검증 코어 처리 블록]
    // 회원가입 페이지(20263520.html)에서 회원가입 시 영구 박제했던 로컬스토리지 'member_고유아이디' 정규 명명법 키를 조회합니다.
    const memberDataStr = localStorage.getItem('member_' + idVal);
    
    // 만약 조회해 온 문자열 데이터 데이터 결과값이 존재하지 않는다면(null/undefined 포맷 상황)?
    if(!memberDataStr) {
        alert('존재하지 않는 아이디입니다.'); // 경고 안내 팝업 전개
        return; // 가동 중단 탈출
    }

    // 로컬스토리지에서 가져온 순수 통 문자열(JSON) 텍스트를 다시 자바스크립트용 다차원 객체 오브젝트로 디코딩 원복 복원 역직렬화
    const memberData = JSON.parse(memberDataStr);
    
    // 객체 내부에 동적 내장되어 있던 가입 패스워드 원본 문자열 수치값(`userPw`)과 방금 로그인 폼창에 유저가 기입한 문자열 타이핑값 대조 연산
    if(memberData.userPw !== pwVal) {
        alert('비밀번호가 일치하지 않습니다.'); // 다르면 일치하지 않는다는 보안 에러 경고 띄움
        return; // 가동 중단 탈출
    }

    // 2-E. [로그인 성공 확정 이후 보조 서브 루틴 프로세스 기동]
    // 가입 검증이 완벽하게 끝난 합격 상황이므로, [아이디 저장] 체크박스가 가동되어 있는 상태인지 삼항 혹은 이프 검증문으로 체크
    if(isSaveId) {
        // 사용자가 아이디 저장을 켠 상태이므로 영구 저장소 로컬스토리지 전용 키 명명('savedId') 자리에 기입 아이디 기록 누적 박제
        localStorage.setItem('savedId', idVal);
    } else {
        // 아이디 저장을 해제한 상황이라면 다음 번에 뜨면 안 되므로 기존에 저장되어 잔류 중이던 'savedId' 키 레코드를 완전히 소멸 삭제 처리
        localStorage.removeItem('savedId');
    }

    // 2-F. [브라우저 임시 보안 세션에 현 로그인 인증 유저 정보 전달 바인딩]
    // 영구 저장하는 로컬과 달리 '탭 창을 끄면 자동으로 파기되는' 안전한 브라우저 세션 스토리지(sessionStorage) 저장 기법 가동
    // 'loginUser'라는 전용 공통 식별 키명을 정의하여, 현 로그인 통과자의 회원 객체 정보 묶음 데이터셋을 문자열화 처리하여 임시 메모리에 전역 박제 처리
    // 이를 통해 추후 메인 인덱스 및 게임 화면 등 다른 서브 html 페이지들이 언제든 로그인 유저 정보를 즉시 꺼내 쓸 수 있는 통합 통로가 열림!
    sessionStorage.setItem('loginUser', JSON.stringify(memberData));
    
    // 성공 축하 개인화 알림 안내 전개
    alert(memberData.userName + '님, 환영합니다!');
    
    // 브라우저 BOM 주소 제어 권한 명령어를 통해 드디어 최종 메인 홈 화면인 대시보드 `index.html`로 유저를 강제 주소 이전 링크 처리함
    location.href = 'index.html';
});