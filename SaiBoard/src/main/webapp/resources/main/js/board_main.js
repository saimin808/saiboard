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

// form으로 넘겨주기 위한 Hidden들의 value 값
let category_hidden = $('input[name=category]').val();
let orderBy_hidden = $('input[name=orderBy]').val();
let searchCategory_hidden = $('input[name=searchCategory]').val();

// select 선택한 값 받는 변수들
let category_selected = $('#category-select option:selected').val();
let orderBy_selected = $('#orderBy-select option:selected').val();
let searchCategory_selected = $('#searchCategory-select option:selected').val();

// 검색어 받는 변수
let searchKeyword_text = $('input[name=searchKeyword]').val();

// 카테고리 선택 action
$("#category-select").change(function() {
    category_selected = $('#category-select option:selected').val();
    
    // form으로 넘겨주기 위해 Hidden에다가 select value 대입
    $('input[name=category]').attr('value', category_selected);
 	
 	// form submit
 	$('#board-form').submit();
});

// 정렬(orderBy) 선택 action
$("#orderBy-select").change(function() {
	orderBy_selected = $('#orderBy-select option:selected').val();
	
	// form으로 넘겨주기 위해 Hidden에다가 select value 대입
    $('input[name=orderBy]').attr('value', orderBy_selected);
	
	// form submit
 	$('#board-form').submit();
});

$("#searchCategory-select").change(function() {
	searchCategory_selected = $('#searchCategory-select option:selected').val();
	
	// form으로 넘겨주기 위해 Hidden에다가 select value 대입
    $('input[name=searchCategory]').attr('value', searchCategory_selected);	
});

$("#search-button").click(function() {
	
	// form submit
	$('#board-form').submit();
	
});

// 게시판 내용들 (td)
const boardSeq_td = document.getElementsByClassName('boardSeq-td');
const boardCategory_td = document.getElementsByClassName('boardCategory-td');
const boardTitle_td = document.getElementsByClassName('boardTitle-td');
const boardWriter_td = document.getElementsByClassName('boardWriter-td');
const boardView_td = document.getElementsByClassName('boardView-td');
const boardWriteDate_td = document.getElementsByClassName('boardWriteDate-td');

// 페이지네이션 틀 (ul)
const pagination_ul = document.getElementById('pagination-ul');

// 게시판 조회 function
function getBoard(page) {
	console.log('page : ' + page);
	// ajax 데이터 생성
	const parameters = {
		category : category_selected,
		orderBy : orderBy_selected,
		searchCategory : searchCategory_selected,
		searchKeyword : searchKeyword_text
	}
	// ajax로 데이터 전송
	$.ajax({
		type: 'POST',
	    url: contextPath + "/board/" + page,
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
	    	boards = data.boards;
	    	writeDate = data.boardWriteDate;
	    	files = data.isBoardWithFiles;
	    	
	    	let currentPage = data.currentPage;
	    	paginationStart = data.paginationStart;
	    	paginationEnd = data.paginationEnd;
	    	
	    	for(let i = 0; i < boards.length; i++) {
	    		boardSeq_td.item(i).innerHTML = boards[i].board_seq;
	    		boardCategory_td.item(i).innerHTML = boards[i].board_category;
	    		let content = '';
	    		content += '<a href="' + contextPath + '/board/read?board_seq=' + boards[i].board_seq + '&page=1">' + boards[i].board_title + '</a>';
	    		if(files[i] == true) {
					content += '<i class="fa-solid fa-paperclip"></i>';								
				}
				boardTitle_td.item(i).innerHTML = content;
	    		boardWriter_td.item(i).innerHTML = boards[i].board_writer;
	    		boardView_td.item(i).innerHTML = boards[i].board_view;
	    		boardWriteDate_td.item(i).innerHTML = writeDate[i];
	    	}
	    	
	    	let content2 = '';
				content2 +=	'	<li class="page-item">';
				
			
			if(parseInt(paginationStart) > 5) {
				content2 +=	'				<a id="prev-link" class="page-link" aria-label="Previous">';
				content2 +=	'					<span aria-hidden="true">&laquo;</span>';
				content2 +=	'				</a>';
			} else {
				content2 += '				<a class="page-link" aria-label="Previous"';
				content2 += '				  style="pointer-event: none; cursor: default;">';
				content2 += '					<span aria-hidden="true">&laquo;</span>';
				content2 += '				</a>';
			}
				
				content2 +=	'	</li>';
				
	    	for(let i = parseInt(paginationStart); i <= parseInt(paginationEnd); i++) {
				content2 += '<li class="page-item">';
	    		if(currentPage == i) {	    			
					content2 += '	<a class="page page-link" style="color: white; background-color: #6c757d;';
					content2 += '			pointer-event: none; cursor: default;">' + i + '</a>';
				} else {
					content2 += '	<a class="page page-link">' + i + '</a>';
				}
				content2 += '</li>';
	    	}
	    	
	    		content2 += '<li class="page-item">';
				
			if(parseInt(paginationEnd) % 5 == 0 && boards.length > parseInt(paginationEnd) * 10) {
				content2 +=	'			<a id="next-link" class="page-link" aria-label="Next" style="cursor: pointer;">';
				content2 += '				<span aria-hidden="true">&raquo;</span>';
				content2 += '			</a>';
			} else {
				content2 += '			<a class="page-link" aria-label="Next"';
				content2 += '				style="pointer-event: none; cursor: default;">';
				content2 += '				<span aria-hidden="true">&raquo;</span>';
				content2 += '			</a>';
			}
												
				content2 += '</li>';
			
			pagination_ul.innerHTML = '';
			pagination_ul.innerHTML += content2;
			console.log(content2);			
       	})
}

// 페이지네이션 action

// '>>' 링크
let nextPage = parseInt(paginationEnd) + 1;
$('#next-link').click(function() {
	getBoard(nextPage);
});
	
// '<<' 링크
let prevPage = parseInt(paginationStart) + 1;
$('#prev-link').click(function() {
	getBoard(prevPage);
});

// 글 쓰기 버튼 action
$('#write-button').click(function() {
	location.href = contextPath + "/board/write";
});

