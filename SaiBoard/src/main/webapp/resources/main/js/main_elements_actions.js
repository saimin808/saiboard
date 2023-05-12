// elements_actions.js : 요소의 action(click, hover, change 등등...)들을 모아놓은 js

// 카테고리 select action
$("#category-select").change(function() {
	listBoards(1);
});

$("#orderBy-select").change(function() {
	listBoards(1);
});

// 2023-05-09 (화) 한페이지에 출력할 게시글 선택기능 추가
// 한페이지 게시글 출력 갯수 number
// 엔터로 입력가능
$("#sizePerPage-number").change(function() {
	sizePerPage = $("#sizePerPage-number").val();
	if(sizePerPage < 5) {
		$("#sizePerPage-number").val(5);
		alert('최소 5개 최대 10개씩만 출력 가능합니다!');
	} else if(sizePerPage > 10) {
		$("#sizePerPage-number").val(10);
		alert('최소 5개 최대 10개씩만 출력 가능합니다!');
	} else {
		listBoards(1);
	}
});

// 페이지네이션 링크 갯수 select
$('#paginationSize-select').change(function() {
	listPagination(1);
});

// 글 쓰기 버튼 action
$('#write-button').click(function() {
	location.href = contextPath + "/board/write";
});
