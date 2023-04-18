// url parameter를 불러온 변수
const urlParams = new URLSearchParams(location.search);

// url parameter에서 받아온 값(status)으로 모달의 경고 메세지 표시
if(urlParams.get('status') != null && urlParams.get('status') == 'delete_wrong_pw') {
	$('#deleteWarningMsg').text('잘못된 비밀번호입니다!');
}

// url parameter에서 받아온 값(status)으로 모달의 경고 메세지 표시
if(urlParams.get('status') != null && urlParams.get('status') == 'edit_wrong_pw') {
	$('#editWarningMsg').text('잘못된 비밀번호입니다!');
}

// 모달의 버튼들 action
// 모달의 취소버튼을 누르면 status 파라미터 제거 (경고 메세지 표시 제거)
$('#delete_cancel-button').click(function() {
	urlParams.delete('status');
});
$('#edit_cancel-button').click(function() {
	urlParams.delete('status');
});

// 모달의 확인 버튼 action
$('#delete_submit-button').click(function() {
	const password = $('#deletePassword').val();
	console.log();
	if(password == null || password == "") {
		$('#deleteWarningMsg').text('영문, 숫자, 기호 포함 4~16자로 입력해 주세요!');
	} else {
		$('#deleteForm').submit();
	}
});

$('#edit_submit-button').click(function() {
	if($('#deletePassword').val() == null || $('#deletePassword').val() == "") {
		$('#editWarningMsg').text('영문, 숫자, 기호 포함 4~16자로 입력해 주세요!');
	} else {
		$('#editForm').submit();
	}
});

$('#home-button').click(function() {
	// 새롭게 board_main으로 넘어가기
	location.href = contextPath + '/board';
});


// comment
console.log(commentSize);
for(let i = 1; i < commentSize; i++) {
	// 수정 삭제 링크 action
	$('button[id=editComment' + i + ']').click(function() {
		$('dialog').removeAttr('open');
		$('dialog[id=commentPwCheck-dialog' + i + ']').attr('open', 'open');	
	});
	
	// dialog 취소 버튼 action
	$('button[id=commentPwCheckCancel-button' + i + ']').click(function(){
		$('dialog[id=commentPwCheck-dialog' + i + ']').removeAttr('open');
	});
}
 

// comment 페이지네이션 action
if(urlParams != null) {
	// 번호 링크
	for(let i = paginationStart; i <= paginationEnd; i++) {
		$('a[id=' + i + 'page]').attr('href', contextPath + '/board/read?board_seq=' + urlParams.get('board_seq') +
															'&page='+ pageNum[i-1]);
	}
}
