// ------------------------------ 게시글 파트 ----------------------------
// 글 수정, 삭제 모달의 버튼들 action
//  - 모달의 취소버튼을 누르면 status 파라미터 제거 (경고 메세지 표시 제거)
$('#delete_cancel-button').click(function() {
	urlParams.delete('status');
});
$('#edit_cancel-button').click(function() {
	urlParams.delete('status');
});

// 글 수정 모달의 확인 버튼 action
//  - 입력 조건을 충족하지 못하면 경고 메세지 출력
//  - 충족하면 form submit
$('#edit_submit-button').click(function() {
	if($('#editPassword').val() == null || $('#editPassword').val() == "") {
		$('#editWarningMsg').text('영문, 숫자, 기호 포함 4~16자로 입력해 주세요!');
	} else {
		$('#editForm').submit();
	}
});

// 목록 버튼 action
$('#home-button').click(function() {
	// 새롭게 board_main으로 넘어가기
	location.href = contextPath + '/board';
});

// ----------------------------------------------------------------------------

// ------------------------------ 댓글 파트 -------------------------------------

// 댓글 '쓰기' 버튼 action (팝오버)

// 글쓴이 정규식 : 2 ~ 8자 한글, 영문 허용
const writerRegExp = /^[a-zA-Zㄱ-힣][a-zA-Zㄱ-힣 ]{2,8}$/;
// 비밀번호 정규식 : 4 ~ 6자 영문, 숫자, 특수문자 허용
const pwRegExp = /^[a-zA-z][0-9][$`~!@$!%*#^?&\\(\\)\-_=+]{4,6}$/;

$('#writeCommentSubmit-button').click(function() {
	if($('#commentId-text').val().length < 2 && writerRegExp.test($('#commentId-text')) == false) {
	
		$('input[id=commentId-text]').popover('show');
		$('input[id=commentId-text]').focus();
		
		return;
	}

	$('input[id=commentId-text]').popover('hide');
		
	if($('#commentPw-text').val().length < 4 && pwRegExp.test($('#commentPw-text')) == false) {
	
		$('input[id=commentPw-text]').popover('show');
		$('input[id=commentPw-text]').focus();
		
		return;
	}
	
	$('input[id=commentPw-text]').popover('hide');
	
	console.log($('#commentContent-text').val().length);
	if($('#commentContent-text').val().length < 4) {
	
		$('textarea[id=commentContent-text]').popover('show');
		$('textarea[id=commentContent-text]').focus();
		
		return;
	}
	
	$('input[id=commentContent-text]').popover('hide');
	
	let commentContent = $('#commentContent-text').val().replace(/(?:\r\n|\r|\n)/g,'<br/>');
	$('#commentContent-hidden').val(commentContent);
	
	$('#writeComment-form').submit();
});

for(let i = 1; i <= 5; i++) {
	// 수정 버튼 action
	$('button[id=editComment' + i + ']').click(function() {
		console.log('edit click');
		$('dialog').removeAttr('open');
		
		$('h5[id=commentPwCheck-title' + i + ']').text('댓글 수정');
		$('input[id=commentPwCheckPassword-text' + i + ']').val('');
		
		let seq = $('input[id=commentSeq' + i + ']').val();
		$('button[id=commentPwCheckSubmit-button' + i + ']').attr('onclick', 'editCommentPasswordCheck(' + seq + ', ' + i + ')');
		
		$('dialog[id=commentPwCheck-dialog' + i + ']').attr('open', 'open');	
	});
	// 삭제 버튼 action
	$('button[id=deleteComment' + i + ']').click(function() {
		console.log('delete click');
		$('dialog').removeAttr('open');
		
		$('h5[id=commentPwCheck-title' + i + ']').text('댓글 삭제');
		$('input[id=commentPwCheckPassword-text' + i + ']').val('');
		
		let seq = $('input[id=commentSeq' + i + ']').val();
		$('button[id=commentPwCheckSubmit-button' + i + ']').attr('onclick', 'deleteComment(' + seq + ', ' + i + ')');
		
		$('dialog[id=commentPwCheck-dialog' + i + ']').attr('open', 'open');	
	});
	
	// 댓글 수정, 삭제 비번 확인 dialog 취소 버튼 action
	$('button[id=commentPwCheckCancel-button' + i + ']').click(function(){
		$('dialog[id=commentPwCheck-dialog' + i + ']').removeAttr('open');
	});
	
	// 댓글 수정, 삭제 비번 확인 dialog 확인 버튼 action
	$('button[id=commentPwCheckSubmit-button' + i + ']').click(function(){
		if($('input[id=commentPwCheckPassword-text' + i + ']').val() > 0) {
			$('form[id=commentPwCheck-form' + i + ']').submit();			
		}
	});
	
	// 댓글 수정 dialog 켜기
	let hidden_value = 'edit_comment_pw_checked' + i;
	if($('input[id=editCommentStatus-hidden' + i +']').val() == hidden_value) {
		console.log(hidden_value);
		$('dialog[id=editComment-dialog' + i + ']').attr('open', 'open');
	}
	
	// 댓글 수정 dialog 취소 버튼 action
	$('button[id=editCommentCancel-button' + i + ']').click(function(){
		$('dialog[id=editComment-dialog' + i + ']').removeAttr('open');
	});
	
	// 댓글 수정 dialog 확인 버튼 action
	$('button[id=editCommentSubmit-button' + i + ']').click(function(){
		let commentId = $('input[id=editCommentId-text' + i + ']').val(); 
		let commentPw = $('input[id=editCommentPassword-text' + i + ']').val();
		let commentContent = $('input[id=editCommentContent-text' + i + ']').val();
		
		$('#input[id=commentContent-hidden' + i + ']').val(commentContent);
	
		if(commentId <= 0) {
			$('input[id=editCommentId-text' + i + ']').focus();
			return;
		}
		
		if(commentPw <= 0) {
			$('input[id=editCommentPassword-text' + i + ']').focus();
			return;
		}
		
		if(commentContent <= 0) {
			$('input[id=editCommentContent-text' + i + ']').focus();
			return;
		}
		
		// 댓글 번호
		const commentSeq = $('input[id=commentSeq' + i + ']').val();
		// dialog 번호
		const dialogSeq = $('input[id=dialogSeq' + i + ']').val();
		
		editComment(commentSeq, dialogSeq);
	});
}
// -----------------------------------------------------------------------------------