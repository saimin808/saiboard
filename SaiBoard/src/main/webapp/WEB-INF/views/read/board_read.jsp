<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri ="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>글 보기</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
<link href="<%=request.getContextPath()%>/resources/read/css/board_read.css" rel="stylesheet"/>
</head>
<body>
	<div id="container" class="container-xxl">
		<div id="title-container" class="container-xxl">
			<h1 class="fw-bold text-center">글 보기</h1>
		</div>
	
		<div id="board-container" class="container-xxl">
			<div id="table-container" class="container-xxl">
				<table class="w-100">
					<colgroup>
						<col style="width:85%">
						<col style="width:15%">
					</colgroup>
					<thead>
						<tr>
							<th colspan="2" class="fs-3">
								${board.board_title}
							</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td class="fs-5">
								${board.board_writer} &nbsp;
								<i class="fa-regular fa-clock"></i> ${write_date} &nbsp; 
								<i class="fa-solid fa-eye"></i> ${board.board_view} &nbsp;
							</td>
							<td class="fs-5 text-end">
								${board.board_category}
							</td>
						</tr>
						<tr>
							<td colspan="2">
								<div id="content-container" class="container-xxl">
									${board.board_content}
								</div>
								<div id="file-container" class="container-xxl">
									<c:forEach items="${files}" var="file" varStatus="i">
										<div class="card w-25 mb-3">
										  <div class="card-body">
										  	<i class="fa-solid fa-paperclip"></i>
										    <a class="link-primary" href="#" onclick="file_download(${file.file_seq})">${file.file_name}</a>
										  </div>
										</div>
									</c:forEach>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
				<div id="button-container" class="container-xxl d-flex justify-content-end">
					<button id="delete-button" type="button" class="btn btn-light" data-bs-toggle="modal" data-bs-target="#deleteModal">삭제</button>
					<button id="edit-button" type="button" class="btn btn-light" data-bs-toggle="modal" data-bs-target="#editModal">수정</button>
					<button id="home-button" type="button" class="btn btn-secondary">목록</button>
				</div>
				<!-- 글 삭제 모달 -->
				<div class="modal fade" id="deleteModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalTitle" aria-hidden="true">
					<div class="modal-dialog modal-dialog-centered justify-content-center">
						<div class="modal-content w-75">
							<div class="modal-header justify-content-center">
						       <h1 class="modal-title fs-4 fw-bold" id="modalTitle">글 삭제 비밀번호 확인</h1>
					      	</div>
					      	<div class="modal-body container">
					      		<div class="row text-center">
					        		<p class="text-info">비밀번호를 입력하세요</p>
					        	</div>
					        	<div class="row d-flex justify-content-center">
					        		<input id="deletePassword" name="input_pw" type="password" class="form-control text-center w-75">
					        	</div>
						        <div class="row text-center">
						        	<p id="deleteWarningMsg" class="text-danger"></p>
						        </div>
					      	</div>
					      	<div class="modal-footer container justify-content-center">
					      		<div class="row w-100 h-100 text-center">
					      			<div class="col-6">
					        			<button id="delete_cancel-button" type="button" class="btn btn-white fw-semibold text-secondary" data-bs-dismiss="modal">취소</button>
					        		</div>
					        		<div class="col-6">
					        			<button id="delete_submit-button" type="button" class="btn btn-white fw-semibold text-info" onclick="deleteBoard(${board.board_seq})">확인</button>
					        		</div>
					        	</div>
					      	</div>
						</div>
					</div>
				</div>
				<!-- 글 수정 모달 -->
				<div class="modal fade" id="editModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalTitle" aria-hidden="true">
					<div class="modal-dialog modal-dialog-centered justify-content-center">
						<div class="modal-content w-75">
							<div class="modal-header justify-content-center">
						       <h1 class="modal-title fs-4 fw-bold" id="modalTitle">글 수정 비밀번호 확인</h1>
					      	</div>
					      	<div class="modal-body container">
					      		<div class="row text-center">
					        		<p class="text-info">비밀번호를 입력하세요</p>
					        	</div>
					        	<form id="editForm" class="row justify-content-center" action="<%= request.getContextPath()%>/board/edit/${board.board_seq}" method="POST">
					        		<input id="editPassword" type="password" name="input_pw" class="form-control text-center w-75" />
					        	</form>
					        	<c:if test="${not empty param.status && param.status eq 'edit_wrong_pw'}">
						        	<div class="row text-center">
						        		<p id="editWarningMsg" class="text-danger">잘못된 비밀번호입니다!</p>
						        	</div>
					        	</c:if>
					      	</div>
					      	<div class="modal-footer container justify-content-center">
					      		<div class="row w-100 h-100 text-center">
					      			<div class="col-6">
					        			<button id="edit_cancel-button" type="button" class="btn btn-white fw-semibold text-secondary" data-bs-dismiss="modal">취소</button>
					        		</div>
					        		<div class="col-6">
					        			<button id="edit_submit-button" type="button" class="btn btn-white fw-semibold text-info">확인</button>
					        		</div>
					        	</div>
					      	</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<div id="comment-container" class="container-lg">
			<div id="comment_input-container" class="container-lg w-100">
				<form id="writeComment-form" name="writeComment-form" action="<%=request.getContextPath()%>/board/write_comment" method="POST">
					<input type="hidden" name="board_seq" form="writeComment-form" value="${board.board_seq}"/> 
					<div id="commentTitle" class="row row-cols-1 w-100">
						<h3 class="fw-bold">댓글 ${totalSize}개</h3>
					</div>
					<div id="commentInput" class="row row-cols-6 w-100">
						<div class="col-auto text-center">
							<label for="comment_id-text" style="display:inline-block" class="fs-4">ID</label>
						</div>
						<div class="col-4">
							<input type="text" class="form-control" id="commentId-text" name="comment_id"
									form="writeComment-form" maxlength="8" placeholder="한글, 영어 포함 2 ~ 8자"
									data-bs-container="body" data-bs-toggle="popover" data-bs-placement="top"
									data-bs-custom-class="warning-popover" data-bs-content="아이디를 제대로 입력해주세요!">
						</div>
						<div class="col-auto text-center">
							<label for="commentPw-text" style="display:inline-block;" class="fs-4">PW</label>
						</div>
						<div class="col-4">
							<input type="password" class="form-control" id="commentPw-text" name="comment_pw"
									form="writeComment-form" maxlength="6" placeholder="영어, 숫자, 기호 포함 4 ~ 6자"
									data-bs-container="body" data-bs-toggle="popover" data-bs-placement="top"
									data-bs-custom-class="warning-popover" data-bs-content="비밀번호를 제대로 입력해주세요!">				
						</div>
						<div class="col-2 text-end" style="padding-right: 0;">
							<button id="writeCommentSubmit-button" type="button" class="btn btn-secondary">쓰기</button>
						</div>
					</div>
					<div id="commentContent" class="row row-cols-1 mb-0 w-100">
						<div class="col-12 mb-0">
							<textarea id="commentContent-text" class="form-control" name="comment_content" rows="1" cols="40" wrap="hard"
									  placeholder="내용을 입력해주세요. (4 ~ 40자)" onkeyup="content_checkText(this)" 
									  data-bs-container="body" data-bs-toggle="popover" data-bs-placement="right"
									  data-bs-custom-class="warning-popover" data-bs-content="내용을 제대로 입력해주세요!"></textarea>
						</div>
					</div>
				</form>
				<div class="row row-cols-1 w-100 mt-0">
					<div class="col-12 mt-0 text-end">(<span id="nowLetter">0</span>/40자)</div>
				</div>
			</div>
			<div id="comment_list-container" class="container-lg w-100">
				<div id="comment_table-container" class="container-lg w-100">
					<c:choose>
						<c:when test="${not empty comments && comments.size() > 0}">
							<c:forEach items="${comments}" var="comment" varStatus="i">
								<div class="row row-cols-3 pb-0">
									<div class="col-2">
										<p class="fs-6">${comment.comment_id}</p>
									</div>
									<div class="col-7">
										<p class="fs-6">${commentWriteDate.get(i.index)}</p>
									</div>
									<div class="col-3 text-end">
										<button id="editComment${i.count}" class="btn btn-white">수정</button>
										<button id="deleteComment${i.count}" class="btn btn-white">삭제</button>
									</div>
									<dialog id="commentPwCheck-dialog${i.count}" class="pwCheck-dialog">
										<div>
											<div style="display:inline-block; margin-right: 47px;">◀</div>
											<h5 id="commentPwCheck-title${i.count}" class="fw-semibold" style="display:inline-block;">댓글 수정</h5>
										</div>
										<div class="mb-3">
											<div>
												<input type="password" id="commentPwCheckPassword-text${i.count}" name="comment_input_pw"
														class="form-control text-center" placeholder="비밀번호를 입력해주세요.">
												<input type="hidden" id="commentSeq${i.count}" value="${comment.comment_seq}"/>
												<input type="hidden" id="boardSeq${i.count}" value="${board.board_seq}"/>
												<input type="hidden" id="dialogSeq${i.count}" value="${i.count}"/>
											</div>
											<div>
												<p id="commentWarning${i.count}" class="text-center text-danger"></p>
											</div>
										</div>
										<div class="text-center">
											<button id="commentPwCheckCancel-button${i.count}" class="btn btn-light">취소</button>
											<button id="commentPwCheckSubmit-button${i.count}" class="btn btn-secondary">확인</button>
										</div>
									</dialog>
									<input type="hidden" id="editCommentStatus-hidden${i.count}" value="${param.status}"/>
									<dialog id="editComment-dialog${i.count}" class="editComment-dialog">
										<div>
											<div style="display:inline-block; margin-right: 170px;">◀</div>
											<h5 id="editComment-title${i.count}" class="fw-semibold" style="display:inline-block;">댓글 수정</h5>
										</div>
										<div class="mb-3">
											<div class="w-25 m-2" style="display:inline-block;">
												<input type="text" id="editCommentId-text${i.count}" name="comment_id"
														value="${comment.comment_id}" maxlength="8" class="form-control" placeholder="ID"/>
											</div>
											<div class="w-25 m-2"style="display:inline-block;">
												<input type="password" id="editCommentPassword-text${i.count}" name="comment_pw"
														maxlength="6" class="form-control" placeholder="Password">
											</div>
											<div class="mb-0">
												<textarea id="editCommentContent-text${i.count}" class="form-control" rows="1" cols="40" wrap="hard"
													 name="comment_content" placeholder="내용을 입력해주세요. (4 ~ 40자)"
													 onkeyup="edit_content_checkText(this)">${comment.comment_content}</textarea>
											</div>
											<div class="w-100 mt-0">
												<div class="mt-0 text-end">(<span id="edit_nowLetter">0</span>/40자)</div>
											</div>
											<input type="hidden" id="commentSeq${i.count}" value="${comment.comment_seq}"/>
											<input type="hidden" id="boardSeq${i.count}" value="${board.board_seq}"/>
											<input type="hidden" id="dialogSeq${i.count}" value="${i.count}"/>
										</div>
										<div class="text-center">
											<button id="editCommentCancel-button${i.count}" class="btn btn-light">취소</button>
											<button id="editCommentSubmit-button${i.count}" class="btn btn-secondary">확인</button>
										</div>
									</dialog>
								</div>
								<div class="row row-cols-1 container-lg w-100 pt-0">
									<div class="col-12">${comment.comment_content}</div>
								</div>
							</c:forEach>
						</c:when>
						<c:otherwise>
							<div class="row row-cols-1 container-lg w-100 pb-0">
								<div class="col-12 text-center">댓글이 없습니다.</div>
							</div>
						</c:otherwise>
					</c:choose>
			</div>
			<div id="comment_pagi-conatiner" class="container-lg w-100">
				<div class="row row-cols-1 container-lg w-100">
					<div id="pagination-container" class="container-xxl">
						<nav>
							<ul id="pagination-ul" class="pagination justify-content-center">
								<li class="page-item">
									<a class="page-link" aria-label="Previous"
										style="pointer-event: none; cursor: default;">
										<span aria-hidden="true">&laquo;</span>
									</a>
								</li>
								<c:forEach begin="${paginationStart}" end="${paginationEnd}" var="i">
									<li class="page-item">
										<c:choose>
											<c:when test="${i == 1}">
												<a id="page1" class="page page-link" style="color: white; background-color: #6c757d;
																	pointer-event: none; cursor: default;">1</a>
											</c:when>
											<c:when test="${page == i}">
												<a id="page${i}" class="page page-link" style="color: white; background-color: #6c757d;
																	pointer-event: none; cursor: default;">${i}</a>
											</c:when>
											<c:otherwise>
												<a id="page${i}" class="page page-link" style="cursor: pointer;" onclick="listComments(${board.board_seq},${i})">${i}</a>
											</c:otherwise>
										</c:choose>
									</li>
								</c:forEach>
								<li class="page-item">
									<c:choose>
										<c:when test="${paginationEnd % 5 == 0 && totalSize > paginationEnd * 5}">
											<a id="next-link" class="page-link" aria-label="Next" onclick="listComments(6)">
												<span aria-hidden="true">&raquo;</span>
											</a>
										</c:when>
										<c:otherwise>
											<a class="page-link" aria-label="Next"
												style="pointer-event: none; cursor: default;">
												<span aria-hidden="true">&raquo;</span>
											</a>								
										</c:otherwise>
									</c:choose>
								</li>
							</ul>
						</nav>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- bootstrap script -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
<!-- fontawesome : 아이콘 사용을 위한 script -->
<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.6.4.min.js" integrity="sha256-oP6HI9z1XaZNBrJURtCoUT5SUnxFr8s3BzRl+cbzUq8=" crossorigin="anonymous"></script>
<script src="https://kit.fontawesome.com/8fdf7187c9.js" crossorigin="anonymous"></script>
<!-- contextPath 변수 선언을 위한 script -->
<script>
	const contextPath = '<%=request.getContextPath()%>';
	
	// url parameter를 불러온 변수
	const urlParams = new URLSearchParams(location.search);

	// url parameter에서 받아온 값(status)으로 모달의 경고 메세지 표시
	if(urlParams.get('status') == 'edit_wrong_pw') {
		// alert으로 대체
		alert('글 수정 실패 : 잘못된 비밀번호');
		
		// 왠지 모를 오류로 구현 못함
		//$('#editModal').show();
	}
</script>
<!-- pagination.js : 페이지네이션 Data script -->
<script src="<%=request.getContextPath()%>/resources/public/js/pagination.js"></script>
<!-- main_conditions.js : 가장 main이 되는 function들을 모아놓은 script (게시글 수정, 삭제 등)  -->
<script src="<%=request.getContextPath()%>/resources/read/js/read_main_functions.js"></script>
<!-- elements_actions.js : 각 요소의 액션들을 모아놓은 script  -->
<script src="<%=request.getContextPath()%>/resources/read/js/read_elements_actions.js"></script>
<!-- input_limits.js : 입력 제한 function들을 모아놓은 script  -->
<script src="<%=request.getContextPath()%>/resources/read/js/read_input_limits.js"></script>
</body>
</html>