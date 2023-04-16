<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri ="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>글 읽기 & 수정</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
<style>
	/* 전체 컨테이너 */
	#container {
		margin: 5% auto;
	}
	
	/* 게시판 컨테이너 */
	#board-container {
		margin-top: 3rem;
	}
	
	/* 게시판의 테이블 컨테이너  */
	#table-container table tr {
		border-bottom: 2px solid lightgrey;
	}
	
	/* 테이블 th td */
	th, td {
		padding: 0.3rem 1.2rem;
	}
	
	/* 게시판 내용 컨테이너 */
	#content-container {
		margin: 2rem 0;
	}
	
	/* 버튼 모음 컨테이너 */
	#button-container {
		margin: 1rem 0;
	}
	
	/* 버튼들 */
	#button-container button {
		margin-left: 1rem;
	}
	
</style>
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
								<i class="fa-regular fa-clock"></i> ${board.getCreationDateTime()} &nbsp; 
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
								<div id="files-container" class="container-xxl">
									
								</div>
							</td>
						</tr>
					</tbody>
				</table>
				<div id="button-container" class="container-xxl d-flex justify-content-end">
					<button id="delete-button" type="button" class="btn btn-light">삭제</button>
					<button id="edit-button" type="button" class="btn btn-light">수정</button>
					<button id="home-button" type="button" class="btn btn-secondary">목록</button>
				</div>
			</div>
		</div>
	</div>

<!-- bootstrap script -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
<!-- fontawesome : 아이콘 사용을 위한 script -->
<script src="https://kit.fontawesome.com/8fdf7187c9.js" crossorigin="anonymous"></script>
<!-- contextPath 변수 선언을 위한 script -->
<script>
	const contextPath = '<%=request.getContextPath()%>';
</script>
<!-- board_read.js -->
<script src="<%=request.getContextPath()%>/resources/read/js/board_read.js"></script>
</body>
</html>