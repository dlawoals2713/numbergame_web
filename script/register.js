/* [1. 이메일 셀렉트 드롭다운 변경 연동 코드] */
const emailDomainSelect = document.getElementById('emailDomain'); 
const emailDomainTxt = document.getElementById('emailDomainTxt'); 

emailDomainSelect.addEventListener('change', function() {
    if(this.value === '직접 입력') {
        emailDomainTxt.style.display = 'inline-block'; 
        emailDomainTxt.style.width = '130px'; 
    } else {
        emailDomainTxt.style.display = 'none'; 
        emailDomainTxt.value = ''; 
    }
});

/* [2. 약관 전체 동의 체크박스 연동 코드] */
const agreeAll = document.getElementById('agreeAll'); 
const allChecks = [
    document.getElementById('agree1'),
    document.getElementById('agree2'),
    document.getElementById('agree3'),
    document.getElementById('agree5')
];

agreeAll.addEventListener('change', function() {
    allChecks.forEach(chk => chk.checked = agreeAll.checked);
});

allChecks.forEach(chk => {
    chk.addEventListener('change', function() {
        agreeAll.checked = allChecks.every(c => c.checked);
    });
});

/* [3. 입력값 형식 검사 함수] */
function validate() {
    let valid = true; 
    
    // 에러 메시지 초기화
    ['userId', 'userPw', 'userPwChk', 'userName', 'email', 'userPhone', 'agree'].forEach(key => {
        document.getElementById('err-' + key).textContent = '';
    });

    const userId = document.getElementById('userId').value.trim();
    const userPw = document.getElementById('userPw').value;
    const userPwChk = document.getElementById('userPwChk').value;
    const userName = document.getElementById('userName').value.trim();
    const emailLocal = document.getElementById('emailLocal').value.trim();
    const emailDomain = emailDomainSelect.value === '직접 입력' ? emailDomainTxt.value.trim() : emailDomainSelect.value;
    const userPhone = document.getElementById('userPhone').value.trim();

    // 3-A. 아이디 길이 검사 (로컬 스토리지 중복 체크 삭제 완료)
    if (userId.length < 4) {
        document.getElementById('err-userId').textContent = '아이디는 4자 이상 입력해주세요.'; 
        valid = false; 
    }

    // 3-B. 비밀번호 글자수 검사
    if (userPw.length < 6) {
        document.getElementById('err-userPw').textContent = '비밀번호는 6자 이상 입력해주세요.';
        valid = false;
    }
    // 3-C. 비밀번호 확인 일치 검사
    if (userPw !== userPwChk) {
        document.getElementById('err-userPwChk').textContent = '비밀번호가 일치하지 않습니다.';
        valid = false;
    }
    // 3-D. 이름 입력 검사
    if (userName === '') {
        document.getElementById('err-userName').textContent = '이름을 입력해주세요.';
        valid = false;
    }
    // 3-E. 이메일 주소 검사
    if (emailLocal === '' || emailDomain === '선택하기' || emailDomain === '') {
        document.getElementById('err-email').textContent = '이메일을 올바르게 입력해주세요.';
        valid = false;
    }
    // 3-F. 휴대폰 번호 자릿수 검사
    if (!/^\d{10,11}$/.test(userPhone.replace(/-/g, ''))) {
        document.getElementById('err-userPhone').textContent = '올바른 휴대폰 번호를 입력해주세요. (숫자만)';
        valid = false;
    }
    // 3-G. 필수 약관 동의 검사
    if (!document.getElementById('agree1').checked || !document.getElementById('agree2').checked || !document.getElementById('agree5').checked) {
        document.getElementById('err-agree').textContent = '필수 이용약관에 모두 동의해주세요.';
        valid = false;
    }

    return valid; 
}

/* [4. 최종 가입 폼 제출 이벤트 핸들러] */
document.getElementById('submitBtn').addEventListener('click', function() {
    // 유효성 검사에서 통과하지 못하면 중단
    if (!validate()) return;

    // ==========================================
    // 로컬 스토리지 저장 로직을 완전히 빼고 성공 처리만 진행
    // ==========================================
    
    alert('회원가입이 완료되었습니다!\n로그인 페이지로 이동합니다.');
    
    // 로그인 창으로 이동
    location.href = 'login.html';
});