/* [1. 이메일 셀렉트 드롭다운 변경 연동 자바스크립트 제어 코드] */
const emailDomainSelect = document.getElementById('emailDomain'); // select 박스 객체 획득
const emailDomainTxt = document.getElementById('emailDomainTxt'); // 직접 입력 인풋창 객체 획득

// 셀렉트 박스의 상태가 바뀔 때(change)마다 감지하여 특정 익명 함수를 호출하는 이벤트 리스너 작동
emailDomainSelect.addEventListener('change', function() {
    // 사용자가 선택한 드롭다운의 실제 데이터 값이 '직접 입력' 텍스트 문구 형태라면 조건문 실행
    if(this.value === '직접 입력') {
        emailDomainTxt.style.display = 'inline-block'; // 숨겨져 있던 텍스트 상자를 화면에 노출 처리
        emailDomainTxt.style.width = '130px'; // 가로 길이를 셀렉트박스와 균형 맞춤
    } else {
        // 직접 입력 모드가 아닐 경우 일반 자동완성 도메인을 픽업한 것이므로 조건문 탈출 제어
        emailDomainTxt.style.display = 'none'; // 직접 입력 텍스트 입력창을 화면에서 다시 투명하게 숨김
        emailDomainTxt.value = ''; // 적혀있던 불필요 가짜 도메인 글자 밸류는 초기화 청소
    }
});

/* [2. 약관 전체 동의 마스터 체크박스 연동 자바스크립트 제어 코드] */
const agreeAll = document.getElementById('agreeAll'); // 마스터 체크박스 DOM 탐색
// 밑에 하위 종속되어 연동될 개별 항목 체크박스 4개를 묶어 순수 배열 리스트 자료 구조형으로 캐싱
const allChecks = [
    document.getElementById('agree1'),
    document.getElementById('agree2'),
    document.getElementById('agree3'),
    document.getElementById('agree5')
];

// 2-A. 마스터 체크박스를 클릭해서 상태를 변조시켰을 때 하위 요소들 일체 동기화 연동
agreeAll.addEventListener('change', function() {
    // 하위 체크박스 배열을 순회(forEach)하며 마스터의 상태(true/false)와 똑같이 동기화 주입
    allChecks.forEach(chk => chk.checked = agreeAll.checked);
});

// 2-B. 반대로 하위 낱개 체크박스 중 하나라도 손대었을 때 마스터 체크박스의 체크 상태 자동 온/오프 계산
allChecks.forEach(chk => {
    chk.addEventListener('change', function() {
        // every() 함수는 배열 내부의 "모든 요소가 조건식을 만족(true)"해야만 최종 true를 뱉는 자바스크립트 고급 내장 메서드
        // 즉, 하위 4개가 전부 체크된 상태라면 마스터 박스도 true가 되고, 하나라도 누락되면 즉시 false로 소멸 연동
        agreeAll.checked = allChecks.every(c => c.checked);
    });
});

/* [3. 입력값 형식 검사 전용 유효성 벨리데이션(Validate) 메인 통제 제어 함수 정의] */
function validate() {
    let valid = true; // 유효성 최종 통과 상태 보관 판별 깃발 변수 (초기값은 무사통과 합격 상태로 셋팅)
    
    // 유효성 체크를 새로 돌릴 때마다 이전 실행 때 화면에 남아있던 구형 에러 메시지 텍스트를 깨끗하게 밀어버리는 초기화 반복 루프 선언
    ['userId', 'userPw', 'userPwChk', 'userName', 'email', 'userPhone', 'agree'].forEach(key => {
        document.getElementById('err-' + key).textContent = '';
    });

    // 각 입력폼의 실시간 유저 텍스트 입력값(Value)을 가져와 변수에 바인딩 처리 (.trim()은 양끝 의미없는 공백 문자 강제 커트)
    const userId = document.getElementById('userId').value.trim();
    const userPw = document.getElementById('userPw').value;
    const userPwChk = document.getElementById('userPwChk').value;
    const userName = document.getElementById('userName').value.trim();
    const emailLocal = document.getElementById('emailLocal').value.trim();
    // 삼항 연산자를 사용하여 이메일 도메인이 '직접 입력' 모드일 경우에는 텍스트창 글자를 도메인으로 취급하고, 아니면 셀렉트 박스 밸류를 도메인으로 채택
    const emailDomain = emailDomainSelect.value === '직접 입력' ? emailDomainTxt.value.trim() : emailDomainSelect.value;
    const userPhone = document.getElementById('userPhone').value.trim();

    // 3-A. 아이디 길이 검사 밸리데이션 규칙 정의
    if (userId.length < 4) {
        document.getElementById('err-userId').textContent = '아이디는 4자 이상 입력해주세요.'; // 화면 스팬에 경고 삽입
        valid = false; // 플래그를 불합격(false)으로 즉시 강등 조치
    } else if (localStorage.getItem('member_' + userId)) {
        // 브라우저 내부 하드웨어 세션 데이터베이스인 로컬스토리지에 동일 아이디 키가 이미 등록되어있는지 검색 (중복 가입 차단)
        document.getElementById('err-userId').textContent = '이미 존재하는 아이디입니다.';
        valid = false;
    }

    // 3-B. 패스워드 최소 보안 요구 사항 글자수 한계선 검증
    if (userPw.length < 6) {
        document.getElementById('err-userPw').textContent = '비밀번호는 6자 이상 입력해주세요.';
        valid = false;
    }
    // 3-C. 두 번 입력한 비밀번호가 서로 완벽하게 수치상 일치하는지 더블 체크
    if (userPw !== userPwChk) {
        document.getElementById('err-userPwChk').textContent = '비밀번호가 일치하지 않습니다.';
        valid = false;
    }
    // 3-D. 이름 필수 기입창 누락 무결성 공백 검사
    if (userName === '') {
        document.getElementById('err-userName').textContent = '이름을 입력해주세요.';
        valid = false;
    }
    // 3-E. 이메일 주소 결합 형식 미완성 조건 방어 체크
    if (emailLocal === '' || emailDomain === '선택하기' || emailDomain === '') {
        document.getElementById('err-email').textContent = '이메일을 올바르게 입력해주세요.';
        valid = false;
    }
    // 3-F. 정규표현식(Regular Expression)을 이용한 대한민국 표준 스마트폰 번호 자릿수 검사
    // replace(/-/g, '') 문법을 통해 사용자가 입력창에 대시 기호(-)를 넣더라도 전부 제거한 순수 숫자로 정밀 매칭 처리함
    // /^\d{10,11}$/ 의 의미 -> 숫자가 처음부터 끝까지 총 10자리 내지 11자리 포맷이어야만 통과한다는 정밀 필터링 서식 규칙
    if (!/^\d{10,11}$/.test(userPhone.replace(/-/g, ''))) {
        document.getElementById('err-userPhone').textContent = '올바른 휴대폰 번호를 입력해주세요. (숫자만)';
        valid = false;
    }
    // 3-G. 필수적인 약관 조항 1번, 2번 그리고 연령제한 5번에 체크가 누락되었는지 논리 반전 연산자(!)로 대조 확인 검사
    if (!document.getElementById('agree1').checked || !document.getElementById('agree2').checked || !document.getElementById('agree5').checked) {
        document.getElementById('err-agree').textContent = '필수 이용약관에 모두 동의해주세요.';
        valid = false;
    }

    return valid; // 유효성 검증의 총체적 결과(true/false)를 함수 호출문 자리로 반환시킴
}

/* [4. 최종 가입 폼 제출 이벤트 핸들러 스크립트 컨트롤 구역] */
document.getElementById('submitBtn').addEventListener('click', function() {
    // 위에서 고생해서 만든 유효성 검사 함수를 발동시켜 만약 리턴값이 false(형식 파괴 에러)라면 이후 저장 로직을 즉각 정지 및 반환 통제 시킴
    if (!validate()) return;

    // 통과에 무사 안착했다면 필드 데이터를 재수집
    const userId = document.getElementById('userId').value.trim();
    const userPw = document.getElementById('userPw').value;
    const userName = document.getElementById('userName').value.trim();
    const emailLocal = document.getElementById('emailLocal').value.trim();
    const emailDomain = emailDomainSelect.value === '직접 입력' ? emailDomainTxt.value.trim() : emailDomainSelect.value;
    const userPhone = document.getElementById('userPhone').value.trim();

    // 데이터 관리가 매우 용이하도록 자바스크립트 객체(Object) 리터럴 구조 형식에 커스텀 회원 레코드 형태로 하나로 데이터 묶음 패킹
    const memberInfo = {
        userId: userId,
        userPw: userPw, // 기존 소스코드에서 누락되어 로그인을 막았던 치명적인 버그를 수정해 패스워드 값 데이터 보존 추가 완료!
        userName: userName,
        email: emailLocal + '@' + emailDomain,
        phone: userPhone,
        highScore: 0, // 인게임과 실시간 연동 처리하기 위해 가입 즉시 초기 하이스코어 레벨 점수를 최하위 수치 0으로 인덱싱 초기화
        joinedAt: new Date().toLocaleString() // 가입 도장을 찍은 현지 국가 기준 날짜 및 시각 문자열 동적 자동 획득 주입
    };

    // [로컬스토리지 영구 데이터베이스 세이브 처리]
    // 자바스크립트 순수 객체 데이터 구조 형태 그대로는 문자열만 받는 로컬스토리지에 들어가서 파손되므로 JSON.stringify() 직렬화 함수를 이용해 통 문자열 텍스트 데이터 형식으로 인코딩 포맷을 변환시킨 뒤 가입 고유 회원 아이디 식별 키명으로 브라우저 공간에 영구 저장 박제함
    localStorage.setItem('member_' + userId, JSON.stringify(memberInfo));
    
    // 유저 친화적인 피드백 알림 팝업 전개
    alert('회원가입이 완료되었습니다!\n로그인 페이지로 이동합니다.');
    // 자바스크립트 BOM 브라우저 객체 모델 경로 제어 명령어로 로그인 창으로 화면 강제 주소 이전 점프 처리
    location.href = 'login.html';
});