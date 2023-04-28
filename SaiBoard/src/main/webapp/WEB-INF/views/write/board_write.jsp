<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri ="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>글 쓰기</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
<style>
/* 전체 컨테이너 */
#container {
	margin: 5% auto;
	width: 1230px;
}

/* 게시판 컨테이너 */
#write-container {
	margin-top: 3rem;
}

/* 글쓴이 & 비밀번호 input text, 카테고리 select  */
.col-2 {
	width: 210px;
}

/* 팝 오버 CSS */
.warning-popover {
	--bs-popover-bg: var(--bs-warning);
	--bs-popover-body-color: var(--bs-danger);
	font-size: 18px;
	font-weight: bold;
}

/* 취소 작성 버튼 */
#boardCancel-button, #boardSubmit-button {
	width: 100px;
}
</style>
</head>
<body>
<div id="container" class="container-xxl">
	<c:choose>
		<c:when test="${purpose eq 'write'}">
			<div id="title-container" class="container-xxl">
				<h1 class="fw-bold text-center">글 쓰기</h1>
			</div>
			<div id="write-container" class="container-xxl">
				<form id="board-form" action="<%= request.getContextPath()%>/board/write/write_board" method="POST"
				enctype="multipart/form-data">
					<div id="input-container" class="container-xxl">
						<div class="mb-3 row">
						   <label for="boardWriter-text" class="col-1 col-form-label text-center">글쓴이</label>
						   <div class="col-2">
						  		<input type="text" class="form-control" id="boardWriter-text" name="board_writer" placeholder="이름을 입력해주세요."
						      		 maxlength="10" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="top"
									 data-bs-custom-class="warning-popover" data-bs-content="이름을 제대로 입력해주세요!"
									 onkeyup="writer_checkText(this)">
						   </div>
						   <div class="col-3 d-flex align-items-center">
						   		<p class="fs-6 fw-semibold mb-0">*한글, 영문 포함 2 ~ 10자</p>
						   </div>
						</div>
						<div class="mb-3 row">
							<label for="boardCategory-select" class="col-1 col-form-label">카테고리</label>
							<div class="col-2">
								<select id="boardCategory-select" class="form-select text-center" name="board_category">
									<option value="공지">공지</option>
									<option value="자유" selected>자유</option>
								</select>
						    </div>
						</div>
						<div class="mb-3 row">
							<label for="boardTitle-text" class="col-1 col-form-label text-center">제목</label>
							<div class="col-9">
								<input type="text" class="form-control" id="boardTitle-text" name="board_title" placeholder="제목을 입력해주세요.(2 ~ 50자)"
										maxlength="50" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="top"
										onkeyup="title_checkText(this)" data-bs-custom-class="warning-popover" data-bs-content="제목을 제대로 입력해주세요!">
							</div>
						</div>
						<div class="row">
							<div class="col-12">
								<textarea id="boardContent-text" class="form-control" name="board_content" rows="10" cols="70" wrap="hard"
									  placeholder="내용을 입력해주세요. (4 ~ 1000자)" onkeyup="content_checkText(this)"
									  data-bs-container="body" data-bs-toggle="popover" data-bs-placement="bottom"
									  data-bs-custom-class="warning-popover" data-bs-content="내용을 제대로 입력해주세요!"></textarea>
							</div>
						</div>
						<div class="row mb-3 mr-0 mt-0">
							<div class="col-12 mt-0 text-end">(<span id="nowLetter">0</span>/1000자)</div>
						</div>
					</div>
					<div id="file-container" class="container-xxl">
						<div class="mb-3 row">
							<label for="boardUpload-file1" class="col-1 col-form-label">파일 1</label>
							<div class="input-group col-5 w-50">
								<input class="form-control" type="file" id="boardUpload-file1" name="upload_files">
								<button class="btn btn-outline-secondary" type="button" id="uploadCancel-button1">Cancel</button>
							</div>
						</div>
						<div class="mb-3 row">
							<label for="boardUpload-file2" class="col-1 col-form-label">파일 2</label>
							<div class="col-5 input-group w-50">
								<input class="form-control" type="file" id="boardUpload-file2" name="upload_files">
								<button class="btn btn-outline-secondary" type="button" id="uploadCancel-button2">Cancel</button>
							</div>
						</div>
						<div class="mb-3 row">
							<label for="boardUpload-file3" class="col-1 col-form-label">파일 3</label>
							<div class="col-5 input-group w-50">
								<input class="form-control" type="file" id="boardUpload-file3" name="upload_files">
								<button class="btn btn-outline-secondary" type="button" id="uploadCancel-button3">Cancel</button>
							</div>
						</div>
					</div>
					<div id="password-container" class="container-xxl">
						<div class="mb-3 row">
						   <label for="boardPassword-text" class="col-1 col-form-label">비밀번호</label>
						   <div class="col-2">
						  		<input type="password" class="form-control" id="boardPassword-text" name="board_pw" maxlength="16"
						      		 data-bs-container="body" data-bs-toggle="popover" data-bs-placement="bottom"
									 data-bs-custom-class="warning-popover" data-bs-content="비밀번호를 제대로 입력해 주세요!">
						   </div>
						   <div class="col-4 d-flex align-items-center">
						   		<p class="fs-6 fw-semibold mb-0">*영문, 숫자, 기호 최소 1개씩 포함 4 ~ 16자</p>
						   </div>
						</div>
					</div>
					<div id="button-container" class="container-xxl">
						<div class="m-5 row text-center">
							<div class="col-6 text-end">
								<button type="button" class="btn btn-light" id="boardCancel-button">취소</button>
							</div>
							<div class="col-6 text-start">
								<button type="button" class="btn btn-secondary" id="boardSubmit-button">작성</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</c:when>
		<c:when test="${purpose eq 'edit'}">
			<div id="title-container" class="container-xxl">
				<h1 class="fw-bold text-center">글 수정</h1>
			</div>
			<div id="write-container" class="container-xxl">
				<form id="board-form" action="<%= request.getContextPath()%>/board/write/write_board" method="POST"
				enctype="multipart/form-data">
					<div id="input-container" class="container-xxl">
						<div class="mb-3 row">
						   <label for="boardWriter-text" class="col-1 col-form-label text-center">글쓴이</label>
						   <div class="col-2">
						  		<input type="text" class="form-control" id="boardWriter-text" name="board_writer" placeholder="이름을 입력해주세요."
						      		 maxlength="10" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="top"
									 data-bs-custom-class="warning-popover" data-bs-content="이름을 제대로 입력해주세요!"
									 onkeyup="writer_checkText(this)" value="${board.board_writer}">
						   </div>
						   <div class="col-3 d-flex align-items-center">
						   		<p class="fs-6 fw-semibold mb-0">*한글, 영문 포함 2 ~ 10자</p>
						   </div>
						</div>
						<div class="mb-3 row">
							<label for="boardCategory-select" class="col-1 col-form-label">카테고리</label>
							<div class="col-2">
								<select id="boardCategory-select" class="form-select text-center" name="board_category">
									<option value="공지">공지</option>
									<option value="자유" selected>자유</option>
								</select>
						    </div>
						</div>
						<div class="mb-3 row">
							<label for="boardTitle-text" class="col-1 col-form-label text-center">제목</label>
							<div class="col-9">
								<input type="text" class="form-control" id="boardTitle-text" name="board_title" placeholder="제목을 입력해주세요.(2 ~ 50자)"
										maxlength="50" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="top"
										onkeyup="title_checkText(this)" data-bs-custom-class="warning-popover" data-bs-content="제목을 제대로 입력해주세요!"
										value="${board.board_title}">
							</div>
						</div>
						<div class="row">
							<div class="col-12">
								<textarea id="commentContent-text" class="form-control" name="board_content" rows="10" cols="70" wrap="hard"
									  placeholder="내용을 입력해주세요. (4 ~ 1000자)" onkeyup="content_checkText(this)"
									  data-bs-container="body" data-bs-toggle="popover" data-bs-placement="bottom"
									  data-bs-custom-class="warning-popover" data-bs-content="내용을 제대로 입력해주세요!">${board.board_content}</textarea>
							</div>
						</div>
						<div class="row mb-3 mr-0 mt-0">
							<div class="col-12 mt-0 text-end">(<span id="nowLetter">0</span>/1000자)</div>
						</div>
					</div>
					<!-- 아쉬운점 : input:file은 보안상 value를 설정 해줄수가 없음 (공백 제외)  -->
					<!-- 파일 업로드 방식을 달리 표현 해야됨 -->
					<div id="file-container" class="container-xxl">
						<div class="mb-3 row">
							<label for="boardUpload-file1" class="col-1 col-form-label">파일 1</label>
							<div class="input-group col-5 w-50">
								<input class="form-control" type="file" id="boardUpload-file1" name="upload_files">
								<button class="btn btn-outline-secondary" type="button" id="uploadCancel-button1">Cancel</button>
							</div>
						</div>
						<div class="mb-3 row">
							<label for="boardUpload-file2" class="col-1 col-form-label">파일 2</label>
							<div class="col-5 input-group w-50">
								<input class="form-control" type="file" id="boardUpload-file2" name="upload_files">
								<button class="btn btn-outline-secondary" type="button" id="uploadCancel-button2" >Cancel</button>
							</div>
						</div>
						<div class="mb-3 row">
							<label for="boardUpload-file3" class="col-1 col-form-label">파일 3</label>
							<div class="col-5 input-group w-50">
								<input class="form-control" type="file" id="boardUpload-file3" name="upload_files">
								<button class="btn btn-outline-secondary" type="button" id="uploadCancel-button3">Cancel</button>
							</div>
						</div>
					</div>
					<div id="password-container" class="container-xxl">
						<div class="mb-3 row">
						   <label for="boardPassword-text" class="col-1 col-form-label">비밀번호</label>
						   <div class="col-2">
						  		<input type="password" class="form-control" id="boardPassword-text" name="board_pw" maxlength="16"
						      		 data-bs-container="body" data-bs-toggle="popover" data-bs-placement="bottom"
									 data-bs-custom-class="warning-popover" data-bs-content="비밀번호를 제대로 입력해 주세요!">
						   </div>
						   <div class="col-3 d-flex align-items-center">
						   		<p class="fs-6 fw-semibold mb-0">*영문, 숫자, 기호 포함 4 ~ 16자</p>
						   </div>
						</div>
					</div>
					<div id="button-container" class="container-xxl">
						<div class="m-5 row text-center">
							<div class="col-6 text-end">
								<button type="button" class="btn btn-light" id="boardCancel-button">취소</button>
							</div>
							<div class="col-6 text-start">
								<button type="button" class="btn btn-secondary" id="boardSubmit-button">작성</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</c:when>
	</c:choose>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
<script>
	contextPath = '<%=request.getContextPath()%>';
</script>
<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.6.4.min.js" integrity="sha256-oP6HI9z1XaZNBrJURtCoUT5SUnxFr8s3BzRl+cbzUq8=" crossorigin="anonymous"></script>
<!-- board_write.js -->
<script src="<%=request.getContextPath()%>/resources/write/js/board_write.js"></script>
</body>
</html>