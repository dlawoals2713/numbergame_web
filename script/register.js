const emailDomainSelect = document.getElementById('emailDomain');   // 이메일 도메인 선택 드롭박스
const emailDomainTxt = document.getElementById('emailDomainTxt');   // 이메일 직접 입력 칸

emailDomainSelect.addEventListener('change', function() {   // 드롭박스 선택이 변경되었을 때
    if(this.value === '직접 입력') {    // '직접 입력'을 선택 했다면
        emailDomainTxt.style.display = 'inline-block';  // 도메인 입력칸 보여주기
        emailDomainTxt.style.width = '130px';   // 130px 너비로
    } else {    // 아니라면
        emailDomainTxt.style.display = 'none';  // 도메인 입력칸 숨기기 
        emailDomainTxt.value = '';  // 도메인 입력칸 비우기
    }
});

const agreeAll = document.getElementById('agreeAll');   // 전체 동의합니다 체크박스 불러오기
const allChecks = [
    document.getElementById('agree1'),  // 4개의 체크박스를 한 변수에 리스트로 저장
    document.getElementById('agree2'),
    document.getElementById('agree3'),
    document.getElementById('agree5')
];

agreeAll.addEventListener('change', function() {    // 전체 동의합니다 체크를 했을 경우
    allChecks.forEach(chk => chk.checked = agreeAll.checked);   // 체크박스들을 모두 체크됨으로 설정
});

allChecks.forEach(chk => {  // 정의된 모든 체크박스에 대해
    chk.addEventListener('change', function() {     // 체크가 감지 될 때
        agreeAll.checked = allChecks.every(c => c.checked);     // 모든 체크박스가 체크되어 있다면 전체 동의합니다도 자동으로 체크
    });
});

// 입력값 유효성 검사 함수
function validate() {
    let valid = true;   // 유효한가?의 기본값을 참으로 설정
    
    // 정의된 모든 텍스트에 대해
    ['userId', 'userPw', 'userPwChk', 'userName', 'email', 'userPhone', 'agree'].forEach(key => {
        document.getElementById('err-' + key).textContent = ''; // 텍스트를 비워두도록 설정
    });

    const userId = document.getElementById('userId').value.trim();  // 공백을 제거한 아이디 불러오기
    const userPw = document.getElementById('userPw').value; // 패스워드 불러오기
    const userPwChk = document.getElementById('userPwChk').value;   // 패스워드 확인 불러오기
    const userName = document.getElementById('userName').value.trim();  // 공백을 제거한 사용자 이름 불러오기 
    const emailLocal = document.getElementById('emailLocal').value.trim();  // 이메일 (@ 앞에만) 불러오기
    const emailDomain = emailDomainSelect.value === '직접 입력' ? emailDomainTxt.value.trim() : emailDomainSelect.value;    // '직접 입력' 상태라면 도메인 입력칸 불러오기 : 아니라면 선택한 도메인 불러오기
    const userPhone = document.getElementById('userPhone').value.trim();    // 전화번호 불러오기

    // 아이디 길이가 4자 미만이라면
    if (userId.length < 4) {
        document.getElementById('err-userId').textContent = '아이디는 4자 이상 입력해주세요.';  // 오류 메시지 출력
        valid = false;  // 유효한가?를 거짓으로 설정
    }
    // 비밀번호 길이가 6자 미만이라면
    if (userPw.length < 6) {
        document.getElementById('err-userPw').textContent = '비밀번호는 6자 이상 입력해주세요.';    // 오류 메시지 출력
        valid = false;  // 유효한가?를 거짓으로 설정
    }
    // 비밀번호가 비밀번호 확인과 일치하지 않다면
    if (userPw !== userPwChk) {
        document.getElementById('err-userPwChk').textContent = '비밀번호가 일치하지 않습니다.';     // 오류 메시지 출력
        valid = false;  // 유효한가?를 거짓으로 설정
    }
    // 사용자 이름이 비어있다면
    if (userName === '') {
        document.getElementById('err-userName').textContent = '이름을 입력해주세요.';   // 오류 메시지 출력
        valid = false;  // 유효한가?를 거짓으로 설정
    }
    // 이메일 아이디가 비어있거나, '선택하기'로 설정되어 있거나, 이메일 도메인이 비어 있다면
    if (emailLocal === '' || emailDomain === '선택하기' || emailDomain === '') {
        document.getElementById('err-email').textContent = '이메일을 올바르게 입력해주세요.';   // 오류 메시지 출력
        valid = false;  // 유효한가?를 거짓으로 설정
    }
    // 사용자 전화번호에서 대쉬(-)를 모두 지우고, 10~11자로 이루어진 숫자가 아니라면
    if (!/^\d{10,11}$/.test(userPhone.replace(/-/g, ''))) {
        document.getElementById('err-userPhone').textContent = '올바른 휴대폰 번호를 입력해주세요. (숫자만)';   // 오류 메시지 출력
        valid = false;  // 유효한가?를 거짓으로 설정
    }
    // 필수 체크 사항이 모두 체크 되어 있지 않다면
    if (!document.getElementById('agree1').checked || !document.getElementById('agree2').checked || !document.getElementById('agree5').checked) {
        document.getElementById('err-agree').textContent = '필수 이용약관에 모두 동의해주세요.';    // 오류 메시지 출력
        valid = false;  // 유효한가?를 거짓으로 설정
    }

    return valid;   // 유효한가? 를 반환
}

// 가입하기 버튼을 눌렀을 때
document.getElementById('submitBtn').addEventListener('click', function() {
    if (!validate()) return;    // 유효성 검사 함수 호출하여 반환값이 거짓이라면, 함수 종료(반환)

    alert('회원가입이 완료되었습니다!\n로그인 페이지로 이동합니다.');   // 회원가입 완료 다이얼로그 표시
    location.href = 'login.html';   // 로그인 페이지로 내보내기
});