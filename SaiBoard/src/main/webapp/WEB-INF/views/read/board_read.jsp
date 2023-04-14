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
	/* 컨테이너 */
	#container {
		margin: 5% auto;
	}
	
	
</style>
</head>
<body>

	<!-- <div id="container" class="container-xxl">
		title
		<div id="title-container" class="container-xxl">
			<h1 class="fw-bold text-center">글 보기</h1>
		</div>
	
	</div> -->
	
	<div>${board.board_seq}</div>
	<br>
	<div>${board.board_title}</div>
	<br>
	<div>${board.board_category}</div>
	<br>
	<div>${board.board_writer}</div>
	<br>
	<div>${board.board_content}</div>
	<br>
	<div>${board.board_view}</div>
	<br>
	<div>${board.getCreationDateTime()}</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
</body>
</html>