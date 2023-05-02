// url parameter를 불러온 변수
const urlParams = new URLSearchParams(location.search);

// url parameter에서 받아온 값으로 선택한 select 유지 및 hidden 값 변경
if(urlParams.get('category') != null) {
	$('#category-select option:selected').removeAttr('selected');
	
	const category = urlParams.get('category');

	$('#category-select').val(category).attr('selected', true);
	
	// category hidden 값 변경
	$('#category').attr('value', category);	
}
if(urlParams.get('orderBy') != null) {
	$('#orderBy-select option:selected').removeAttr('selected');
	
	const orderBy = urlParams.get('orderBy');
	
	$('#orderBy-select').val(orderBy).attr('selected', true);
	
	// orderBy hidden 값 변경
	$('#orderBy').attr('value', orderBy);
}
if(urlParams.get('searchCategory') != null) {
	$('#searchCategory-select option:selected').removeAttr('selected');
	
	const searchCategory = urlParams.get('searchCategory');

	$('#searchCategory-select').val(searchCategory).attr('selected', true);
	
	// searchCategory hidden 값 변경
	$('#searchCategory').attr('value', searchCategory);
}

// url parameter에서 받아온 값으로 입력한 검색어 유지
if(urlParams.get('searchKeyword') != null) {
	const searchKeyword = urlParams.get('searchKeyword');
	
	$('input[name=searchKeyword]').attr('value', searchKeyword);
}

// 카테고리 select action
$("#category-select").change(function() {
	getBoard(1);
});

$("#orderBy-select").change(function() {
	getBoard(1);
});

// 게시판 내용들 (td)
const board_table = document.getElementById('#board_table');

// 페이지네이션 틀 (ul)
const pagination_ul = document.getElementById('pagination-ul');

// 페이지네이션 function
function getBoard(page) {
	console.log('page : ' + page);
	// ajax 데이터 생성
	const parameters = {
		category : $('#category-select option:selected').val(), // 선택한 카테고리
		orderBy : $('#orderBy-select option:selected').val(), // 선택한 정렬 기준
		searchCategory : $('#searchCategory-select option:selected').val(), // 선택한 검색 주제
		searchKeyword : $('input[name=searchKeyword]').val() // 선택한 검색어
	}
	console.log(parameters);
	// ajax로 데이터 전송
	$.ajax({
		type: 'POST',
	    url: contextPath + "/board/page/" + page,
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
	    	console.log('통신 성공!');
	    	
	    	let boards = new Array;
	    	let writeDate = new Array;
	    	let files = new Array;
	    	boards = data.boards; // 가져온 게시글 리스트
	    	writeDate = data.boardWriteDate; // 가져온 게시글 작성일 리스트
	    	files = data.isBoardWithFiles; // 가져온 첨부파일 리스트
	    	
	    	const currentPage = parseInt(data.currentPage); // 현재 페이지
	    	paginationStart = parseInt(data.paginationStart); // 페이지네이션 시작 번호
	    	paginationEnd = parseInt(data.paginationEnd); // 페이지네이션 마지막 번호
	    	const totalBoardSize = parseInt(data.totalBoardSize); // 가져온 게시글 총 갯수
	    	const startIndex = parseInt(data.startIndex);
	    	const endIndex = parseInt(data.endIndex);
		    console.log(startIndex);
		    console.log(endIndex);
		    
		    let content = '';
	    	if(boards.length > 0) {
		    		content += '<colgroup>';
					content += '	<col style="width:10%;">';
					content += '	<col style="width:15%;">';
					content += '		<col style="width:40%;">';
					content += '		<col style="width:15%;">';
					content += '		<col style="width:10%;">';
					content += '		<col style="width:20%;">';
					content += '	</colgroup>';
					content += '	<tr>';
					content += '		<th scope="col">No.</th>';
					content += '		<th scope="col">카테고리</th>';
					content += '		<th scope="col">제목</th>';
					content += '		<th scope="col">글쓴이</th>';
					content += '		<th scope="col">조회수</th>';
					content += '		<th scope="col">작성일</th>';
					content += '	</tr>';
		    	for(let i = startIndex; i < endIndex; i++) {
					content += '	<tr>';
					content += '		<td>' + boards[i].board_seq + '</td>';
					content += '		<td>' + boards[i].board_category + '</td>';
					content += '		<td>';
					content += '<a href="' + contextPath + '/board/read/' + boards[i].board_seq + '">' + boards[i].board_title + '</a>';
		    		if(files[i] == true) {
						content += '<i class="fa-solid fa-paperclip"></i>';								
					}
					content += '		</td>';
					content += '		<td>' + boards[i].board_writer + '</td>';
					content += '		<td>' + boards[i].board_view + '</td>';
					content += '		<td>' + writeDate[i] + '</td>';
					content += '	</tr>';
				}
	    	} else {
	    		content += '<colgroup>';
				content += '	<col style="width:10%;">';
				content += '	<col style="width:15%;">';
				content += '		<col style="width:40%;">';
				content += '		<col style="width:15%;">';
				content += '		<col style="width:10%;">';
				content += '		<col style="width:20%;">';
				content += '	</colgroup>';
				content += '	<tr>';
				content += '		<th scope="col">No.</th>';
				content += '		<th scope="col">카테고리</th>';
				content += '		<th scope="col">제목</th>';
				content += '		<th scope="col">글쓴이</th>';
				content += '		<th scope="col">조회수</th>';
				content += '		<th scope="col">작성일</th>';
				content += '	</tr>';
				content += '	<tr>';
				content += '		<td colspan="6">게시물이 없습니다.</td>';
				content += '	</tr>';
	    	}
	    	
	    	// content에 새로운 게시물들을 다 담았으면 table을 content로 채워준다
	    	$('#board-table').html(content);
	    	
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
					//if(i * 10 > totalBoardSize) {
					//	break;
					//}
					content2 += '	<a class="page-link" style="cursor: pointer;" onclick="getBoard('+ i +')">' + i + '</a>';
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
       	})
}

// 글 쓰기 버튼 action
$('#write-button').click(function() {
	location.href = contextPath + "/board/write";
});

