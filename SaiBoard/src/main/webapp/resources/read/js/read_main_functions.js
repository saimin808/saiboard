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

// -----------------------------------------------------------------------------------------

// ------------------------------------- 댓글 파트 -------------------------------------------

// ~~~~~~~~~~~~~~~~~~~~~~~~~ 댓글 리스팅 파트 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 댓글 리스팅 Function
function listComments(seq, currentPage) {
	
	$.ajax({
		type: 'POST',
	    url: contextPath + "/board/read/" + seq + "/"+ currentPage,
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
	    	
	    	const totalCommentSize = parseInt(data.totalCommentSize); // 가져온 게시글 총 갯수
	    	
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
			
			// 게시판 리스팅 & 페이지네이션 작업 구간 (위에서 가져온 댓글 목록이 존재할 경우 진행한다.)
			if (comments.length > 0) {
				// 새롭게 리스팅할 게시판
				const content = listBoard(startIndex, endIndex, comments, writeDate);
				// 새로운 페이지네이션
				const page = createPagination(paginationVO, totalCommentSize, seq);
				
				// 댓글 전체 컨테이너 (div)
				const comment_container = document.getElementById('comment_table-container');
		        // 페이지네이션 틀 (ul)
				const pagination_ul = document.getElementById('pagination-ul');
				
				// 댓글 전체 컨테이너(div) 안에 새롭게 리스팅할 게시판 입력
		        comment_container.innerHTML = content;
		        
				// 페이지네이션 컨테이너(ul) 안에 새로운 페이지네이션 입력
				pagination_ul.innerHTML = page;
			}
	   	});
}

// 게시판 리스팅 function
function listBoard(startIndex, endIndex, comments, writeDate) {

	// 가져온 매개변수들로 게시판을 구현한다.
    let content = '';
        for (let i = startIndex; i < endIndex; i++) {
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
            content += '			<form id="commentPwCheck-form' + i + '" action="' + contextPath + '/board/edit_comment_pw_check" method="POST">';
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

    return content;
}

// 페이지네이션 생성 function
function createPagination(paginationVO, totalCommentSize, boardSeq) {
	
	// 페이지네이션에 필요한 데이터를 담아주는 변수들
	const currentPage = paginationVO.currentPage; // 현재 페이지
	const sizePerPage = paginationVO.sizePerPage; // 한 페이지당 출력할 글 갯수
	const paginationSize = paginationVO.paginationSize; // 한번에 출력할 페이지네이션 갯수
    paginationStart = paginationVO.paginationStart; // 현재 출력된 페이지네이션의 시작 페이지
    paginationEnd = paginationVO.paginationEnd; // 현재 출력된 페이지네이션의 마지막 페이지
    const nextPage = paginationVO.nextPage; // 현재 출력된 페이지네이션의 다음 페이지네이션
    const prevPage = paginationVO.prevPage; // 현재 출력된 페이지네이션의 이전 페이지네이션

	// 페이지네이션 링크 작업 구간
    let page = '';
    page += '	<li class="page-item">';

	// '<<'(전 페이지네이션) 링크 생성
    if (paginationStart > paginationSize) {
		// 현재 출력된 페이지네이션의 첫 페이지(paginationStart)의 숫자가 한번에 출력할 페이지네이션 사이즈(paginationSize)
		// 보다 크면 전 페이지네이션('<<') 링크 활성화
		// ex) paginationSize = 10이면 -> 처음에 출력되는 페이지네이션의 마지막 페이지가 10
		//     그때 paginationStart = 11이면 -> 현재 보여지는 페이지네이션은 11~ 일것이다.
		//     그러면 이전 페이지네이션(1 ~ 10)이 존재하므로 '<<' 링크를 활성화 시킨다.
        page += '				<a id="prev-link" class="page-link" aria-label="Previous"';
        page += '					style="cursor: pointer;" onclick="listComments(' + boardSeq + ', ' + prevPage + ')">';
        page += '					<span aria-hidden="true">&laquo;</span>';
        page += '				</a>';
    } else {
        page += '				<a class="page-link" aria-label="Previous"';
        page += '				  style="pointer-event: none; cursor: default;">';
        page += '					<span aria-hidden="true">&laquo;</span>';
        page += '				</a>';
    }

    page += '	</li>';

	// 각 페이지 링크 생성
    for (let i = paginationStart; i <= paginationEnd; i++) {
        page += '<li class="page-item">';
        // 현재 페이지랑 동일한 링크는 이미 선택된 링크처럼 표시하기 위해 onclick을 없애고 디자인을 바꾼다.
        if (currentPage == i) {
            page += '	<a class="page-link" style="color: white; background-color: #6c757d;';
            page += '		pointer-event: none; cursor: default;">' + i + '</a>';
        } else {
        	// 페이지(i) * 한 페이지당 출력할 글의 수(sizePerPage) > 전체 댓글의 수(totalCommentSize)
        	// true 이면 페이지 링크를 더이상 생성하면 안되므로 break
            if (i * sizePerPage > totalCommentSize) {
                break;
            }
            page += '	<a class="page-link" style="cursor: pointer;" onclick="listComments(' + boardSeq + ', ' + i + ')">' + i + '</a>';
        }
        page += '</li>';
    }

    page += '<li class="page-item">';
	
	// 화면에 출력될 마지막 페이지(paginationEnd)가 한번에 출력할 페이지네이션 사이즈(paginationSize)의 배수이고
	// 가져온 총 댓글 수(totalCommentSize)가 현재 출력된 마지막 페이지에서 출력할 수 있는 최대 글 수(paginationEnd * sizePerPage)
	// 보다 크면 '>>' 링크 활성화
    if (paginationEnd % paginationSize == 0 && totalCommentSize > paginationEnd * sizePerPage) {
        page += '			<a id="next-link" class="page-link" aria-label="Next"';
        page += '				style="cursor: pointer;" onclick="listComments(' + boardSeq + ', ' + nextPage + ')">';
        page += '				<span aria-hidden="true">&raquo;</span>';
        page += '			</a>';
    } else {
        page += '			<a class="page-link" aria-label="Next"';
        page += '				style="pointer-event: none; cursor: default;">';
        page += '				<span aria-hidden="true">&raquo;</span>';
        page += '			</a>';
    }

    page += '</li>';

    return page;
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// ~~~~~~~~~~~~~~~~~~~~~~~~ 댓글 UPDATE & DELETE 파트 ~~~~~~~~~~~~~~~~~~~~~~~~

// 삭제/수정 전 비밀번호 확인 function
function passwordCheck(cnt){
	
	// 댓글 삭제에 필요한 데이터들
	let pw = $('input[id=commentPwCheckPassword-text' + cnt + ']').val(); // 입력한 비밀번호
	let bseq = $('input[id=boardSeq' + cnt + ']').val(); // 게시글 번호
	let dseq = $('input[id=dialogSeq' + cnt + ']').val();// 댓글 삭제 dialog의 번호
	// 비밀번호가 틀리면 돌아가서 해당 dialog를 다시 켜야하기 때문에 필요함
	
	console.log(pw);
	console.log(bseq);
	console.log(dseq);
	
	// 비밀번호를 입력하지 않았다면 false를 return
	if(pw == null || pw == "") {
		return false;
	}
	
	// 데이터들을 JSON type으로 모아준다.
	const info = {
		boardSeq : bseq,
	    dialogSeq : dseq,  
	    inputPw : pw
	}
	
	return info;
}

// 댓글 삭제 function
function deleteComment(seq, cnt) {

	// 삭제 전 비밀번호 확인
	const info = passwordCheck(cnt);
	
	// 비밀번호를 입력하지 않았다면 경고메세지만 출력
	if(info == false) {
		$('#commentWarning' + seq + '').html('비밀번호를 입력해 주세요!');
		return;
	}
		
	// String data를 넘길 때는 data 항목에 직접 {}로 입력해준다.
	// 모아준 정보를 boardRESTController의 deleteBoard()로 보내준다.
	$.ajax({
		type: 'POST',
	    url: contextPath + '/board/delete_comment/'+ seq,
	    data : { input_pw : info.inputPw },
	 })
	    .fail( function(e) {
	    	console.log(e);
	    	alert("통신 오류 error");
	    })
	    .done(function(data) {
	    
	    console.log('통신 성공!');
	    	
	    console.log(data);	
	    	
	    	// 결과 data에 따라 다른 결과를 준다.
	    	if(data == 'comment_deletion_success') {
	    		// 댓글 삭제에 성공하면 삭제된 후의 댓글 목록을 다시 보기 위해 게시글 상세보기 페이지로 돌아간다. 
	    		location.href = contextPath + '/board/read/' + info.boardSeq + '?status=' + data;
	    	} else if (data == 'comment_delete_wrong_pw') {
	    		// 비밀번호가 틀리면 댓글을 삭제하지 않고 경고메세지만 출력한다.
	    		$('#commentWarning' + info.dseq + '').html('잘못된 비밀번호입니다!');
	    	} else {
	    		// 그 이외에는 전부 게시글 상세보기 페이지로 돌아간다.
	    		location.href = contextPath + '/board/read/' + info.boardSeq + '?status=' + data;
	    	}
		});
}

// 댓글 수정 전 비밀번호 확인
function editCommentPasswordCheck(seq, cnt) {
	
	// 삭제 전 비밀번호 확인
	const info = passwordCheck(cnt);
	
	// 비밀번호를 입력하지 않았다면 경고메세지를 dialog에 추가한다.
	if(info == false) {
		$('#commentWarning' + seq + '').html('비밀번호를 입력해 주세요!');
		return;
	}
	
	// String data를 넘길 때는 data 항목에 직접 {}로 입력해준다.
	// 모아준 정보를 boardRESTController의 editCommentPasswordCheck()로 보내준다. 
	$.ajax({
		type: 'POST',
	    url: contextPath + '/board/edit_comment_pw_check/'+ seq,
	    data : { input_pw : info.inputPw },
	 })
	    .fail( function(e) {
	    	console.log(e);
	    	alert("통신 오류 error");
	    })
	    .done(function(data) {
	    
	    console.log('통신 성공!');
	    	
	    console.log(data);	
	    	
	    	// 비밀번호가 일치할 경우 댓글 수정 dialog창을 open한다.
	    	if(data == 'pw_checked') {
	    		$('dialog[id=editComment-dialog' + cnt + ']').attr('open', 'open');
	    	} else if (data == 'wrong_pw') {
	    	// 비밀번호가 틀리면 경고메세지를 dialog에 추가한다.
	    		$('#commentWarning' + info.dseq + '').html('잘못된 비밀번호입니다!');
	    	}
		});
}

// 댓글 수정
function editComment(seq, cnt) {
	
	// 댓글 수정에 필요한 데이터들
	const commentId = $('input[id=editCommentId-text' + cnt  + ']').val();
	const commentPw = $('input[id=editCommentPassword-text' + cnt  + ']').val();
	const commentContent = $('textarea[id=editCommentContent-text' + cnt  + ']').val();
	
	// 그 데이터들을 모아준다.
	const comment = {
		comment_seq : seq, // 댓글 번호
		comment_id : commentId, // 댓글 id
	    comment_pw : commentPw, // 댓글 비밀번호
	    comment_content : commentContent // 댓글 내용
	}
	
	console.log(comment);

	// 모아준 정보를 boardRESTController의 editComment()로 보내준다. 
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
	    
	    	
	    const bseq = $('input[id=boardSeq' + cnt + ']').val();
	    	// 통신이 끝나면 게시글 상세보기로 redirect 한다.
	    	if(data == 'edit_comment_success') {
	    		location.href = contextPath + '/board/read/' + bseq + '?status=' + data;
	    	} else {
	    		location.href = contextPath + '/board/read/' + bseq + '?status=' + data;
	    	}
		});
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// --------------------------------------------------------------------------------------