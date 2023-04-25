<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri ="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="sai.pork.board.model.PaginationVO" %>
<%@ page import="sai.pork.board.model.BoardDTO" %>
<%@ page import="java.util.List" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<!-- *** : bootstrap을 사용하기 위해 필요한 요소들 -->
<!-- *** 적절한 반응형 동작 -->
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sai Board</title>
<!-- *** bootstrap 링크 -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
<link href="<%=request.getContextPath()%>/resources/main/css/board_main.css" rel="stylesheet"/>
</head>
<body>
	<div id="container" class="container-xxl">
		<!-- title -->
		<div id="title-container" class="container-xxl">
			<h1 class="fw-bold text-center"><a id="title" href="<%= request.getContextPath()%>/board">Sai Board</a></h1>
		</div>
		<!-- Board -->
		<div id="board-container" class="container-xxl">
			<div id="category-container" class="container-xxl">
				<form id="board-form" action="<%= request.getContextPath()%>/board" method="GET">
					<div class="row">
						<!-- col-12(max) -->
						<!-- 리스팅 요소 컨테이너 -->
						<input type="hidden" id="category" name="category" value="total"/>
						<input type="hidden" id="orderBy" name="orderBy" value="board_seq"/>
						<input type="hidden" id="searchCategory" name="searchCategory" value="board_title"/>
						<div id="listing-container" class="col-3">
							<div class="row">
								<div class="col-4">
									<select id="category-select" class="form-select">
									  <option value="total" selected>전체</option>
									  <option value="news">공지</option>
									  <option value="free">자유</option>
									</select>
								</div>
								<div class="col">
									<select id="orderBy-select" class="form-select">
									  <option value="board_seq" selected>최신 글</option>
									  <option value="board_view">조회 수</option>
									</select>
								</div>
							</div>
						</div>
						<div class="col-5">
						</div>
						<!-- 검색 요소 컨테이너 -->
						<div id="search-container" class="col-4">
							<div class="row">
								<div class="col-3">
									<select id="searchCategory-select" class="form-select">
									  <option value="board_title" selected>제목</option>
									  <option value="board_writer">글쓴이</option>
									</select>
								</div>
								<div class="col-9">
									<div class="input-group mb-3">
									  <button id="search-button" class="btn btn-outline-secondary" type="button">
									  	<i class="fa-solid fa-magnifying-glass"></i>
									  </button>
									  <input type="text" id="search-text" name="searchKeyword" class="form-control"
									   aria-describedby="search-button">
									</div>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
			<div id="table-container" class="container-xxl">
				<table class="table w-100">
					<colgroup>
						<col style="width:10%;">
						<col style="width:15%;">
						<col style="width:40%;">
						<col style="width:15%;">
						<col style="width:10%;">
						<col style="width:20%;">
					</colgroup>
						<tr>
							<th scope="col">No.</th>
							<th scope="col">카테고리</th>
							<th scope="col">제목</th>
							<th scope="col">글쓴이</th>
							<th scope="col">조회수</th>
							<th scope="col">작성일</th>
						</tr>
						<c:choose>
							<c:when test="${not empty boards}">
								<c:forEach begin="0" end="9" var="i">
									<tr>
										<td class="boardSeq-td">${boards.get(i).board_seq}</td>
										<td class="boardCategory-td">${boards.get(i).board_category}</td>
										<td>
											<a class="boardTitle-link" href="<%=request.getContextPath()%>/board/read?board_seq=${boards.get(i).board_seq}&page=1">${boards.get(i).board_title}</a>
											<c:set var="loop_flag" value="false" />
											<c:forEach items="${files}" var="file">
												<c:if test="${not loop_flag}">
													<c:if test="${file.board_seq eq boards.get(i).board_seq}">
														<i class="fa-solid fa-paperclip"></i>
														<c:set var="loop_flag" value="true" />
													</c:if>
												</c:if>
											</c:forEach>
										</td>
										<td class="boardWriter-td">${boards.get(i).board_writer}</td>
										<td class="boardView-td">${boards.get(i).board_view}</td>
										<td class="boardWriteDate-td">${write_date.get(i)}</td>
									</tr>
								</c:forEach>
							</c:when>
							<c:otherwise>
								<td colspan="6">게시글이 없습니다.</td>
							</c:otherwise>
						</c:choose>
				</table>
			</div>
			<div id="button-container" class="container-xxl d-flex justify-content-end">
				<button id="write-button" type="button" class="btn btn-secondary">글 쓰기</button>
			</div>
			<div id="pagination-container" class="container-xxl">
				<input type="hidden" id="currentPage-hidden" value="${page}"/>
				<input type="hidden" id="totalBoardSize-hidden" value="${totalBoardSize}"/>
				<nav>
					<ul class="pagination justify-content-center">
						<li class="page-item">
							<c:choose>
								<c:when test="${paginationStart > 5}">
									<a id="prev-link" class="page-link" aria-label="Previous">
										<span aria-hidden="true">&laquo;</span>
									</a>
								</c:when>
								<c:otherwise>
									<a class="page-link" aria-label="Previous"
										style="pointer-event: none; cursor: default;">
										<span aria-hidden="true">&laquo;</span>
									</a>
								</c:otherwise>
							</c:choose>
						</li>
						<c:forEach begin="${paginationStart}" end="${paginationEnd}" var="i">
							<li class="page-item">
								<c:choose>
									<c:when test="${page == i}">
										<a id="${i}page" class="page page-link" style="color: white; background-color: #6c757d;
																	pointer-event: none; cursor: default;">${i}</a>
									</c:when>
									<c:otherwise>
										<a id="${i}page" class="page page-link">${i}</a>
									</c:otherwise>
								</c:choose>
							</li>
						</c:forEach>
						<li class="page-item">
							<c:choose>
								<c:when test="${paginationEnd % 5 == 0 && totalBoardSize > paginationEnd * 10}">
									<a id="next-link" class="page-link" aria-label="Next" style="cursor: pointer;">
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

<!-- *** bootstrap script -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
<!-- FontAwesome script : 폰트어썸 아이콘 사용시 필요한 script -->
<script src="https://kit.fontawesome.com/8fdf7187c9.js" crossorigin="anonymous"></script>
<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.6.4.min.js" integrity="sha256-oP6HI9z1XaZNBrJURtCoUT5SUnxFr8s3BzRl+cbzUq8=" crossorigin="anonymous"></script>
<!-- contextPath 변수 선언과 pagenation 구현을 위한 script -->
<script>
	const contextPath = '<%=request.getContextPath()%>';
	
	// 페이지네이션 기능을 위한 변수들
	const boardSeq_list = [];
	const boardCategory_list = [];
	const boardTitle_list = [];
	const boardWriter_list = [];
	const boardView_list = [];
	const boardWriteDate_list = [];
	let loop = 0;
	<%
	List<BoardDTO> boardList = (List<BoardDTO>)request.getAttribute("boards");
	List<String> writeDate = (List<String>)request.getAttribute("write_date");
	for(int i = 0; i < boardList.size(); i++) { %>
		boardSeq_list[loop] = '<%=boardList.get(i).getBoard_seq()%>'
		boardCategory_list[loop] = '<%=boardList.get(i).getBoard_category()%>'
		boardTitle_list[loop] = '<%=boardList.get(i).getBoard_title()%>'
		boardWriter_list[loop] = '<%=boardList.get(i).getBoard_writer()%>'
		boardView_list[loop] = '<%=boardList.get(i).getBoard_view()%>'
		boardWriteDate_list[loop] = '<%=writeDate.get(i)%>'
		loop++;
	<%}%>
	console.log(boardSeq_list);
	const paginationStart = '<%=request.getAttribute("paginationStart")%>';
	const paginationEnd = '<%=request.getAttribute("paginationEnd")%>';
	let pageNum = [];
	for(i = paginationStart; i <= paginationEnd; i++) {
		pageNum[i-1] = i;
	}
	const nextPage = '<%=request.getAttribute("nextPage")%>';
	const previousPage = '<%=request.getAttribute("previousPage")%>';
</script>
<!-- board_main.js -->
<script src="<%=request.getContextPath()%>/resources/main/js/board_main.js"></script>
</body>
</html>