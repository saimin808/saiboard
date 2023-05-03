// 파일 업로드 cancel 버튼 action
//  - cancel 버튼을 누르면 업로드한 파일을 공백을 대입하여 지운다.
$('#uploadCancel-button1').click(function() {
	$('#boardUpload-file1').val('');
});
$('#uploadCancel-button2').click(function() {
	$('#boardUpload-file2').val('');
});
$('#uploadCancel-button3').click(function() {
	$('#boardUpload-file3').val('');
});

// 취소버튼 action
//  - 메인 화면으로 돌아간다
$('#boardCancel-button').click(function() {
	location.href = contextPath + '/board';
});

// 비밀번호 정규식 : 4 ~ 16자 영문, 숫자, 특수문자를 최소 한가지씩 조합
let pwRegExp = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{3,16}$/;

// 글쓴이 정규식 : 2 ~ 10자 한글, 영문 허용
let writerRegExp = /^[a-zA-Zㄱ-힣][a-zA-Zㄱ-힣 ]{1,10}$/;

// 작성 버튼 action
$('#boardSubmit-button').click(function() {

	// 입력 조건을 충족했는지 확인용 console.log
	console.log('writer : ' + writerRegExp.test($('#boardWriter-text').val()));
	console.log('pass : ' + pwRegExp.test($('#boardPassword-text').val()));
	
	// 1. 모든 입력 항목은 각자의 쓰기 조건을 충족하지 못했을 시 경고 팝오버를 출력하고 포커싱된다 popover('show').
	// 입력 조건 충족 시 팝오버를 제거한다 popover('dispose').
	
	//  - 작성자
	if($('#boardWriter-text').val() < 2 || writerRegExp.test($('#boardWriter-text').val()) == false) {
		$('#boardWriter-text').popover('show');
		$('#boardWriter-text').focus();
		return;
	} else {
		$('#boardWriter-text').popover('dispose');
	}
	
	// - 게시글 제목
	if($('#boardTitle-text').val() < 2) {
		$('#boardTitle-text').popover('show');
		$('#boardTitle-text').focus();
		return;
	} else {
		$('#boardTitle-text').popover('dispose');
	}
	
	// - 게시글 내용
	if($('#boardContent-text').val() < 2) {
		$('#boardContent-text').popover('show');
		$('#boardContent-text').focus();
		return;
	} else {
		$('#boardContent-text').popover('dispose');
	}
	
	// - 게시글 비밀번호
	if($('#boardPassword-text').val() < 2 || pwRegExp.test($('#boardPassword-text').val()) == false) {
		$('#boardPassword-text').popover('show');
		$('#boardPassword-text').focus();
		return;
	} else {
		$('#boardPassword-text').popover('dispose');
	}
	
	// 2. 모든 항목이 각자의 조건을 충족했다면 글 쓰기는 writeBoard(), 글 수정은 editBoard()를 실행한다.
	if(purpose == 'write') {
			
		writeBoard(); // 구현 위치 : main_function.js
		
	} else if (purpose == 'edit') {
		
		editBoard(); // 구현 위치 : main_function.js
	}
});