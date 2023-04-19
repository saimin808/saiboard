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
	if(password == null || password == "") {
		$('#deleteWarningMsg').text('영문, 숫자, 기호 포함 4~16자로 입력해 주세요!');
	} else {
		$('#deleteForm').submit();
	}
});

// 모달의 
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


// comment

// 댓글 작성 글자 제한 byte
function fn_checkByte(obj){
	const maxlength = 40; //최대 40자
    const text_val = obj.value; //입력한 문자
    const text_len = text_val.length; //입력한 문자수
    
    let total=0;
    for(let i=0; i<text_len; i++){
    	const each_char = text_val.charAt(i);
        
        // 글자 수만큼 증가 (+1)
        total += each_char.length;
    }
    
    if(total > maxlength){
    	alert('최대 40자까지만 입력가능합니다.');
        	document.getElementById("nowLetter").innerText = total;
            document.getElementById("nowLetter").style.color = "red";
        }else{
        	document.getElementById("nowLetter").innerText = total;
            document.getElementById("nowLetter").style.color = "green";
    }
}

// 댓글 수정(edit) 글자 제한 byte
function edit_fn_checkByte(obj) {
	const maxlength = 40; //최대 40자
    const text_val = obj.value; //입력한 문자
    const text_len = text_val.length; //입력한 문자수
    
    let total=0;
    for(let i=0; i<text_len; i++){
    	const each_char = text_val.charAt(i);
        
        // 글자 수만큼 증가 (+1)
        total += each_char.length;
    }
    
    if(total > maxlength){
    	alert('최대 40자까지만 입력가능합니다.');
        	document.getElementById("edit_nowLetter").innerText = total;
            document.getElementById("edit_nowLetter").style.color = "red";
        }else{
        	document.getElementById("edit_nowLetter").innerText = total;
            document.getElementById("edit_nowLetter").style.color = "green";
    }
}

// 댓글 '쓰기' 버튼 action (팝오버)
$('#writeCommentSubmit-button').click(function() {
	if($('#commentId-text').val().length < 4) {
	
		$('input[id=commentId-text]').popover('show');
		$('input[id=commentId-text]').focus();
		
		return;
	}

	$('input[id=commentId-text]').popover('hide');
		
	if($('#commentPw-text').val().length < 4) {
	
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


for(let i = 1; i < commentSize; i++) {
	// 수정 링크 action
	$('button[id=editComment' + i + ']').click(function() {
		$('dialog').removeAttr('open');
		
		$('h5[id=commentPwCheck-title' + i + ']').text('댓글 수정');
		$('form[id=commentPwCheck-form' + i + ']').attr('action', contextPath + '/board/edit_comment_pw_check');
		$('input[id=commentPwCheckPassword-text' + i + ']').val('');
		
		$('dialog[id=commentPwCheck-dialog' + i + ']').attr('open', 'open');	
	});
	// 삭제 링크 action
	$('button[id=deleteComment' + i + ']').click(function() {
		$('dialog').removeAttr('open');
		
		$('h5[id=commentPwCheck-title' + i + ']').text('댓글 삭제');
		$('form[id=commentPwCheck-form' + i + ']').attr('action', contextPath + '/board/delete_comment');
		$('input[id=commentPwCheckPassword-text' + i + ']').val('');
		
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
		
		$('form[id=editComment-form' + i + ']').submit();			
	});
}

// 댓글 수정 창 표시


// comment 페이지네이션 action
if(urlParams != null) {
	// 번호 링크
	for(let i = paginationStart; i <= paginationEnd; i++) {
		$('a[id=' + i + 'page]').attr('href', contextPath + '/board/read?board_seq=' + urlParams.get('board_seq') +
															'&page='+ pageNum[i-1]);
	}
}
