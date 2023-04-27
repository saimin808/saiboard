// url parameter를 불러온 변수
const urlParams = new URLSearchParams(location.search);

// url parameter에서 받아온 값(status)으로 모달의 경고 메세지 표시
if(urlParams.get('status') == 'delete_wrong_pw') {
	
	// alert로 대체
	alert('글 삭제 실패 : 잘못된 비밀번호');
	
	// 왠지 모를 오류로 구현 못함
	//$('#deleteModal').show();	
}

// url parameter에서 받아온 값(status)으로 모달의 경고 메세지 표시
if(urlParams.get('status') == 'edit_wrong_pw') {
	// alert으로 대체
	alert('글 수정 실패 : 잘못된 비밀번호');
	
	// 왠지 모를 오류로 구현 못함
	//$('#editModal').show();
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

// 모달의 확인 버튼 action
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

// file
function file_download(num) {
	let url = contextPath + '/board/file_download/' + num;
	window.open(url);
}

// comment

// 댓글 작성 글자 제한 byte
function content_checkText(obj){
	const maxlength = 40; //최대 40자
    const text_val = obj.value; //입력한 문자
    const text_len = text_val.length; //입력한 문자수
    
    let total=0;
    for(let i=0; i<text_len; i++){
    	const each_char = text_val.charAt(i);
        
        // 글자 수만큼 증가 (+1)
        total += each_char.length;
    }
    
    // 글자가 넘어가면 알림 후 maxlength 글자까지만 substr
    if(total > maxlength) {
    	alert('최대 40자까지만 입력가능합니다.');
       	document.getElementById("nowLetter").innerText = total;
        document.getElementById("nowLetter").style.color = "red";
        $(obj).val($(obj).val().substr(0, $(obj).attr('maxlength')));
    } else {
       	document.getElementById("nowLetter").innerText = total;
        document.getElementById("nowLetter").style.color = "green";
    }
}

// 댓글 수정(edit) 글자 제한 byte
function edit_content_checkText(obj) {
	const maxlength = 40; //최대 40자
    const text_val = obj.value; //입력한 문자
    const text_len = text_val.length; //입력한 문자수
    
    let total=0;
    for(let i=0; i<text_len; i++){
    	const each_char = text_val.charAt(i);
        
        // 글자 수만큼 증가 (+1)
        total += each_char.length;
    }
    
    // 글자가 넘어가면 알림 후 maxlength 글자까지만 substr
    if(total > maxlength){
    	alert('최대 40자까지만 입력가능합니다.');
        document.getElementById("edit_nowLetter").innerText = total;
        document.getElementById("edit_nowLetter").style.color = "red";
        $(obj).val($(obj).val().substr(0, $(obj).attr('maxlength')));
    }else{
       	document.getElementById("edit_nowLetter").innerText = total;
        document.getElementById("edit_nowLetter").style.color = "green";
    }
}

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


for(let i = 1; i <= commentSize; i++) {
	// 수정 버튼 action
	$('button[id=editComment' + i + ']').click(function() {
		console.log('edit click');
		$('dialog').removeAttr('open');
		
		$('h5[id=commentPwCheck-title' + i + ']').text('댓글 수정');
		$('form[id=commentPwCheck-form' + i + ']').attr('action', contextPath + '/board/edit_comment_pw_check');
		$('input[id=commentPwCheckPassword-text' + i + ']').val('');
		
		$('dialog[id=commentPwCheck-dialog' + i + ']').attr('open', 'open');	
	});
	// 삭제 버튼 action
	$('button[id=deleteComment' + i + ']').click(function() {
		console.log('delete click');
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
		
		$('form[id=editComment-form' + i + ']').submit();			
	});
}

// comment 페이지네이션 action
// ajax로 데이터 전송
function getComments(seq, page) {
	const parameters = {
		board_seq : seq
	}
	
	$.ajax({
		type: 'POST',
	    url: contextPath + "/board/read/" + seq + "/"+ page,
	    contentType: 'application/json;charset=UTF-8',
	    data : JSON.stringify(parameters),
	    dataType : 'json',
	    progress : true
	 })
	    .fail( function(e) {
	    	console.log(e);
	    	alert("통신 오류 error");
	    })
	    .done(function(data) {
	    
	    let boards = new Array;
	    	console.log('통신 성공!');
	    	
	    	let comments = new Array;
	    	let writeDate = new Array;
	    	
	    	comments = data.comments; // 가져온 게시글 리스트
	    	writeDate = data.commentWriteDate; // 가져온 게시글 작성일 리스트
	    	
	    	let currentPage = parseInt(data.currentPage); // 현재 페이지
	    	paginationStart = parseInt(data.paginationStart); // 페이지네이션 시작 번호
	    	paginationEnd = parseInt(data.paginationEnd); // 페이지네이션 마지막 번호
	    	let totalCommentSize = parseInt(data.totalCommentSize); // 가져온 게시글 총 갯수
	    	
			
			
	    	
	    	let content2 = '';
				content2 +=	'	<li class="page-item">';
				
			let prevPage = paginationStart - 1;
			
			if(paginationStart > 5) {
				content2 +=	'				<a id="prev-link" class="page-link" aria-label="Previous"';
				content2 += '					style="cursor: pointer;" onclick="getBoard(' + prevPage + ')">';
				content2 +=	'					<span aria-hidden="true">&laquo;</span>';
				content2 +=	'				</a>';
			} else {
				content2 += '				<a class="page-link" aria-label="Previous"';
				content2 += '				  style="pointer-event: none; cursor: default;">';
				content2 += '					<span aria-hidden="true">&laquo;</span>';
				content2 += '				</a>';
			}
				
				content2 +=	'	</li>';
				
	    	for(let i = paginationStart; i <= paginationEnd; i++) {
				content2 += '<li class="page-item">';
	    		if(currentPage == i) {	    			
					content2 += '	<a class="page-link" style="color: white; background-color: #6c757d;';
					content2 += '		pointer-event: none; cursor: default;">' + i + '</a>';
				} else {
					if(i * 10 > totalBoardSize) {
						break;
					}
					content2 += '	<a class="page-link" style="cursor: pointer;" onclick="getBoard('+i+')">' + i + '</a>';
				}
				content2 += '</li>';
	    	}
	    	
	    		content2 += '<li class="page-item">';
				
			let nextPage = paginationEnd + 1;
			
			if(paginationEnd % 5 == 0 && totalBoardSize > paginationEnd * 10) {
				content2 +=	'			<a id="next-link" class="page-link" aria-label="Next"';
				content2 +=	'				style="cursor: pointer;" onclick="getBoard(' + nextPage + ')">';
				content2 += '				<span aria-hidden="true">&raquo;</span>';
				content2 += '			</a>';
			} else {
				content2 += '			<a class="page-link" aria-label="Next"';
				content2 += '				style="pointer-event: none; cursor: default;">';
				content2 += '				<span aria-hidden="true">&raquo;</span>';
				content2 += '			</a>';
			}
												
				content2 += '</li>';
			
			pagination_ul.innerHTML = content2;
	   	});
}