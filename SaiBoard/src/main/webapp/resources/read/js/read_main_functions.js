// ------------------------------ 게시글 파트 -------------------------------------

// 게시글 삭제 function
function deleteBoard(seq) {
	
	let pw = $('#deletePassword').val();
	
	if(pw == null || pw == "") {
		$('#deleteWarningMsg').html('비밀번호를 입력해 주세요!');
		return;
	}
	
	$.ajax({
		type: 'POST',
	    url: contextPath + "/board/delete/"+ seq,
		// String data를 넘길 때는 data 항목에 직접 {}로 입력해준다. 
	    data : { input_pw : pw },
	 })
	    .fail( function(e) {
	    	console.log(e);
	    	alert("통신 오류 error");
	    })
	    .done(function(data) {
	    
	    console.log('통신 성공!');
	    	
	    console.log(data);	
	    	
	    	if(data == 'board_deletion_success') {
	    		location.href = contextPath + '/board?status=' + data;
	    	} else if (data == 'delete_wrong_pw') {
	    		$('#deleteWarningMsg').html('잘못된 비밀번호입니다!');
	    	} else {
	    		location.href = contextPath + '/board?status=' + data;
	    	}
		});
}

// file 다운로드 function
function file_download(num) {
	let url = contextPath + '/board/file_download/' + num;
	window.open(url);
}

// -----------------------------------------------------------------------------------

// ------------------------------ 댓글 파트 -------------------------------------------

// 댓글 전체 컨테이너 (td)
const comment_container = document.getElementById('comment_table-container');

// 페이지네이션 틀 (ul)
const pagination_ul = document.getElementById('pagination-ul');

// comment 페이지네이션 action
// ajax로 데이터 전송
function getComments(seq, currentPage) {
	const parameters = {
		board_seq : seq
	}
	
	$.ajax({
		type: 'POST',
	    url: contextPath + "/board/read/" + seq + "/"+ currentPage,
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
	    	
	    	let totalCommentSize = parseInt(data.totalCommentSize); // 가져온 게시글 총 갯수
	    	
	    	let sizePerPage = 5; // 한 페이지에 출력할 게시글 수
	    	let paginationSize = 5; // 한 페이지에 출력할 페이지네이션 수
	    	
	    	// currentPage, sizePerPage, totalSize, paginationSize
	    	const paginationVO = getPaginationVO(currentPage, 5, totalCommentSize, paginationSize);
	    	
	    	// getPaginationVO를 통해 받아온 페이지네이션 정보들 받아주는 변수들
	    	const startIndex = paginationVO.startIndex;
	    	const endIndex = paginationVO.endIndex;
	    	paginationStart = paginationVO.paginationStart;
	    	paginationEnd = paginationVO.paginationEnd;
	    	const nextPage = paginationVO.nextPage;
	    	const prevPage = paginationVO.prevPage;
			
			console.log('script startIndex : ' + startIndex);
			console.log('script endIndex : ' + endIndex);
			console.log('script paginationStart : ' + paginationStart);
			console.log('script patinationEnd : ' + paginationEnd);
			console.log('script nextPage : ' + nextPage);
			console.log('script prevPage : ' + prevPage);
			
			// 댓글 노가다 작업 필요!!
			
			let content= '';
			if(comments.length > 0) {
				for(let i = startIndex; i < endIndex; i++) {
					content += '	<div class="row row-cols-3 pb-0">';
					content += '		<div class="col-2">';
					content += '			<p class="fs-6">' + comments[i].comment_id + '</p>';
					content += '				</div>';
					content += '		<div class="col-7">';
					content += '			<p class="fs-6">' + writeDate[i] + '</p>';
					content += '			</div>';
					content += '		<div class="col-3 text-end">';
					content += '			<button id="editComment' + i + '" class="btn btn-white">수정</button>';
					content += '			<button id="deleteComment' + i + '" class="btn btn-white">삭제</button>';
					content += '		</div>';
					content += '		<dialog id="commentPwCheck-dialog' + i + '" class="dialog">';
					content += '			<div>';
					content += '			<div style="display:inline-block; margin-right: 47px;">◀</div>';
					content += '				<h5 id="commentPwCheck-title' + i + '" class="fw-semibold" style="display:inline-block;">댓글 수정</h5>';
					content += '			</div>';
					content += '			<div class="mb-3">';
					content += '			<form id="commentPwCheck-form' + i + '" action="'+ contextPath +'/board/edit_comment_pw_check" method="POST">';
					content += '				<input type="password" id="commentPwCheckPassword-text' + i + '" name="comment_input_pw"';
					content += '						class="form-control text-center" placeholder="비밀번호를 입력해주세요.">';
					content += '				<input type="hidden" name="comment_seq" value="' + comments[i].comment_seq + '"/>';
					content += '				<input type="hidden" name="board_seq" value="' + comments[i].board_seq + '"/>';
					content += '				<input type="hidden" name="dialog_seq" value="' + i + '"/>';
					content += '			</form>';
					content += '			</div>';
					content += '			<div class="text-center">';
					content += '				<button id="commentPwCheckCancel-button' + i + '" class="btn btn-light">취소</button>';
					content += '				<button id="commentPwCheckSubmit-button' + i + '" class="btn btn-secondary">확인</button>';
					content += '			</div>';
					content += '		</dialog>';
					content += '		<input type="hidden" id="editCommentStatus-hidden' + i + '" value="${param.status}"/>';
					content += '		<dialog id="editComment-dialog' + i + '" class="editComment-dialog">';
					content += '			<div>';
					content += '				<div style="display:inline-block; margin-right: 170px;">◀</div>';
					content += '				<h5 id="editComment-title' + i + '" class="fw-semibold" style="display:inline-block;">댓글 수정</h5>';
					content += '			</div>';
					content += '			<div class="mb-3">';
					content += '				<div class="w-25 m-2" style="display:inline-block;">';
					content += '					<input type="text" id="editCommentId-text' + i + '" name="comment_id"';
					content += '						value="' + comments[i].comment_id + '" maxlength="8" class="form-control" placeholder="ID"/>';
					content += '				</div>';
					content += '				<div class="w-25 m-2"style="display:inline-block;">';
					content += '					<input type="password" id="editCommentPassword-text' + i + '" name="comment_pw"';
					content += '						maxlength="6" class="form-control" placeholder="Password">';
					content += '				</div>';
					content += '				<div class="mb-0">';
					content += '					<textarea id="commentContent-text' + i + '" class="form-control" rows="1" cols="40" wrap="hard"';
					content += '						 name="comment_content" placeholder="내용을 입력해주세요. (4 ~ 40자)"';
					content += '						 onkeyup="edit_content_checkText(this)">' + comments[i].comment_content + '</textarea>';
					content += '				</div>';
					content += '				<div class="w-100 mt-0">';
					content += '					<div class="mt-0 text-end">(<span id="edit_nowLetter">0</span>/40자)</div>';
					content += '				</div>';
					content += '				<input type="hidden" name="comment_seq" value="' + comments[i].comment_seq + '"/>';
					content += '				<input type="hidden" name="board_seq" value="' + comments[i].board_seq + '"/>';
					content += '			</div>';
					content += '			<div class="text-center">';
					content += '				<button id="editCommentCancel-button' + i + '" class="btn btn-light">취소</button>';
					content += '				<button id="editCommentSubmit-button' + i + '" class="btn btn-secondary">확인</button>';
					content += '			</div>';
					content += '		</dialog>';
					content += '	</div>';
					content += '	<div class="row row-cols-1 container-lg w-100 pt-0">';
					content += '		<div class="col-12">' + comments[i].comment_content + '</div>';
					content += '	</div>';
				}
				
				// comment_table_container(div) 안에 content 입력
				comment_container.innerHTML = '';
				comment_container.innerHTML = content;
			}
	    	
	    	let content2 = '';
				content2 +=	'	<li class="page-item">';
				
			if(paginationStart > 5) {
				content2 +=	'				<a id="prev-link" class="page-link" aria-label="Previous"';
				content2 += '					style="cursor: pointer;" onclick="getComments('+ seq + ', ' + prevPage + ')">';
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
					if(i * 5 > totalCommentSize) {
						break;
					}
					content2 += '	<a class="page-link" style="cursor: pointer;" onclick="getComments('+ seq + ', ' + i +')">' + i + '</a>';
				}
				content2 += '</li>';
	    	}
	    	
	    		content2 += '<li class="page-item">';
				
			if(paginationEnd % 5 == 0 && totalCommentSize > paginationEnd * 10) {
				content2 +=	'			<a id="next-link" class="page-link" aria-label="Next"';
				content2 +=	'				style="cursor: pointer;" onclick="getComments(' + seq + ', ' + nextPage + ')">';
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

// 댓글 삭제 function
function deleteComment(seq, cnt) {

	let pw = $('input[id=commentPwCheckPassword-text' + cnt + ']').val();
	let bseq = $('input[id=boardSeq' + cnt + ']').val();
	let dseq = $('input[id=dialogSeq' + cnt + ']').val();
	
	console.log(pw);
	console.log(bseq);
	console.log(dseq);
	
	if(pw == null || pw == "") {
		$('#commentWarning' + seq + '').html('비밀번호를 입력해 주세요!');
		return;
	}
	
	// String data를 넘길 때는 data 항목에 직접 {}로 입력해준다. 
	$.ajax({
		type: 'POST',
	    url: contextPath + '/board/delete_comment/'+ seq,
	    data : { board_seq : bseq,
	    		 dialog_seq : dseq,  
	    		 input_pw : pw },
	 })
	    .fail( function(e) {
	    	console.log(e);
	    	alert("통신 오류 error");
	    })
	    .done(function(data) {
	    
	    console.log('통신 성공!');
	    	
	    console.log(data);	
	    	
	    	if(data == 'comment_deletion_success') {
	    		location.href = contextPath + '/board/read/' + bseq + '?status=' + data;
	    	} else if (data == 'comment_delete_wrong_pw') {
	    		$('#commentWarning' + dseq + '').html('잘못된 비밀번호입니다!');
	    	} else {
	    		location.href = contextPath + '/board/read/' + bseq + '?status=' + data;
	    	}
		});
}

// 댓글 수정 전 비밀번호 확인
function editCommentPasswordCheck(seq, cnt) {
	
	const pw = $('input[id=commentPwCheckPassword-text' + cnt + ']').val();
	const bseq = $('input[id=boardSeq' + cnt + ']').val();
	const dseq = $('input[id=dialogSeq' + cnt + ']').val();
	
	console.log(pw);
	console.log(bseq);
	console.log(dseq);
	
	if(pw == null || pw == "") {
		$('#commentWarning' + seq + '').html('비밀번호를 입력해 주세요!');
		return;
	}
	
	// String data를 넘길 때는 data 항목에 직접 {}로 입력해준다. 
	$.ajax({
		type: 'POST',
	    url: contextPath + '/board/edit_comment_pw_check/'+ seq,
	    data : { board_seq : bseq,
	    		 dialog_seq : dseq,  
	    		 comment_input_pw : pw }
	 })
	    .fail( function(e) {
	    	console.log(e);
	    	alert("통신 오류 error");
	    })
	    .done(function(data) {
	    
	    console.log('통신 성공!');
	    	
	    console.log(data);	
	    	
	    	if(data == 'pw_checked') {
	    		$('dialog[id=editComment-dialog' + cnt + ']').attr('open', 'open');
	    	} else if (data == 'wrong_pw') {
	    		$('#commentWarning' + dseq + '').html('잘못된 비밀번호입니다!');
	    	}
		});
}

// 댓글 수정
function editComment(seq, cnt) {

	const commentId = $('input[id=editCommentId-text' + cnt  + ']').val();
	const commentPw = $('input[id=editCommentPassword-text' + cnt  + ']').val();
	const commentContent = $('textarea[id=editCommentContent-text' + cnt  + ']').val();
	
	const comment = {
		comment_seq : seq,
		comment_id : commentId,
	    comment_pw : commentPw,  
	    comment_content : commentContent
	}
	
	console.log(comment);

	const bseq = $('input[id=boardSeq' + cnt + ']').val();

	$.ajax({
		type: 'POST',
	    url: contextPath + '/board/edit_comment/'+ seq,
	    contentType: 'application/json;charset=UTF-8',
	    data : JSON.stringify(comment),
	    progress : true
	 })
	    .fail( function(e) {
	    	console.log(e);
	    	alert("통신 오류 error");
	    })
	    .done(function(data) {
	    
	    console.log('통신 성공!');
	    	
	    console.log(data);	
	    	
	    	if(data == 'edit_comment_success') {
	    		location.href = contextPath + '/board/read/' + bseq + '?status=' + data;
	    	} else {
	    		location.href = contextPath + '/board/read/' + bseq + '?status=' + data;
	    	}
		});
}
// ----------------------------------------------------------------------------