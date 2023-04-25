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

// 페이지네이션 action 때마다 내용이 바뀔 td들
const board_seq = document.getElementsByClassName('boardSeq-td');
const board_category = document.getElementsByClassName('boardCategory-td');
const board_title = document.getElementsByClassName('boardTitle-link');
const board_writer = document.getElementsByClassName('boardWriter-td');
const board_view = document.getElementsByClassName('boardView-td');
const board_writeDate = document.getElementsByClassName('boardWriteDate-td');

// 페이지네이션 action
if(urlParams != null) {
	// '>>' 링크
	$('#next-link').click(function() {
		// ajax 데이터 생성
		const parameters = {
			currentPage : $('#currentPage').val(),
			totalBoardSize : $('#totalBoardSize').val()
		}	
		// ajax로 데이터 전송
		$.ajax({
	        type: "POST",
	        url: contextPath + "/board/page",
	        contentType : "application/json;charset=UTF-8",
	        data : JSON.stringify(parameters),
			dataType : "json",
	        error: function() {
	          alert("통신 오류 error");
	        },
	        success: function(data) {
	        	alert("통신");
	        //innerHTML 작업 필요
        }
      });
	});
	
	
	// '<<' 링크				   
	//$('#prev-link').attr('href', contextPath + '/board?page=' + previousPage +
		//									   '&category=' + category_selected +
			//								   '&orderBy=' + orderBy_selected +
				//							   '&searchCategory=' + searchCategory_selected +
					//						   '&searchKeyword=' + searchKeyword_text);
		
	// 번호 링크
	//for(let i = paginationStart; i <= paginationEnd; i++) {
		//$('a[id=' + i + 'page]').attr('href', contextPath + '/board?page=' + pageNum[i-1] +
			//									    '&category=' + category_selected +
				//								    '&orderBy=' + orderBy_selected +
						//						    '&searchCategory=' + searchCategory_selected +
					//							    '&searchKeyword=' + searchKeyword_text);
	//}
}

// 글 쓰기 버튼 action
$('#write-button').click(function() {
	location.href = contextPath + "/board/write";
});

// 페이지네이션

// 현재 페이지 hidden value
currPage = $('#currPage').val();

// 페이지 번호 링크
const pageLink = document.querySelector('.page');
if(currPage != null) {
	 
}

