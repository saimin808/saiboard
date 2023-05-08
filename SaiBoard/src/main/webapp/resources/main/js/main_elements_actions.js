// elements_actions.js : 요소의 action(click, hover, change 등등...)들을 모아놓은 js

// 카테고리 select action
$("#category-select").change(function() {
	listBoards(1);
});

$("#orderBy-select").change(function() {
	listBoards(1);
});

// 글 쓰기 버튼 action
$('#write-button').click(function() {
	location.href = contextPath + "/board/write";
});
