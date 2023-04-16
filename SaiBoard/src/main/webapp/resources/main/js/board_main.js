// url parameter를 불러온 변수
const urlParams = new URLSearchParams(location.search);

// url parameter에서 받아온 값으로 선택한 select 유지
if(urlParams.get('category') != null) {
	const category = urlParams.get('category');

	$('#category-select').val(category).prop('selected', true);	
}
if(urlParams.get('orderBy') != null) {
	const orderBy = urlParams.get('orderBy');
	
	$('#orderBy-select').val(orderBy).prop('selected', true);
}
if(urlParams.get('searchCategory') != null) {
	const searchCategory = urlParams.get('searchCategory');

	$('#searchCategory-select').val(searchCategory).prop('selected', true);
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
 	
 	// 검색어 지워주기
 	$('input[name=searchKeyword]').val("");
 	
 	// form submit 	
 	$('#board-form').submit();
});

// 정렬(orderBy) 선택 action
$("#orderBy-select").change(function() {
	orderBy_selected = $('#orderBy-select option:selected').val();
	
	// form으로 넘겨주기 위해 Hidden에다가 select value 대입
    $('input[name=orderBy]').attr('value', orderBy_selected);
	
	// 검색어 지워주기
	$('input[name=searchKeyword]').val("");
	
	// form submit
 	$('#board-form').submit();
});

$("#searchCategory-select").change(function() {
	searchCategory_selected = $('#searchCategory-select option:selected').val();
	
	// form으로 넘겨주기 위해 Hidden에다가 select value 대입
    $('input[name=searchCategory]').attr('value', searchCategory_selected);	
});

$("#search-button").click(function() {
	searchKeyword_text = $('input[name=searchKeyword]').val();
	
	if(searchKeyword_text == null || searchKeyword_text == "") {
	
		$("[data-bs-toggle='popover']").popover();
		
		$('input[name=searchKeyword]').focus();
		
	} else {
		// form으로 넘겨주기 위해 Hidden에다가 select value 대입
	    $('input[name=searchKeyword]').attr('value', searchKeyword_text);
		
		// form submit
		$('#board-form').submit();
	}
	
});

// 페이지네이션 action
// 위에 select, 검색 기능과 상호작용을 위해 페이지네이션 링크의 href를 parameter를 추가하여 구성함
if(urlParams != null) {
	// '>>' 링크
	$('#next-link').attr('href', contextPath + '/board?page=' + nextPage +
											   '&category=' + category_selected +
											   '&orderBy=' + orderBy_selected +
											   '&searchCategory=' + searchCategory_selected +
											   '&searchKeyword=' + searchKeyword_text);
	// '<<' 링크				   
	$('#prev-link').attr('href', contextPath + '/board?page=' + previousPage +
											   '&category=' + category_selected +
											   '&orderBy=' + orderBy_selected +
											   '&searchCategory=' + searchCategory_selected +
											   '&searchKeyword=' + searchKeyword_text);
		
	// 번호 링크
	for(i = paginationStart; i <= paginationEnd; i++) {
		$('a[id=' + i + 'page]').attr('href', contextPath + '/board?page=' + pageNum[i-1] +
												    '&category=' + category_selected +
												    '&orderBy=' + orderBy_selected +
												    '&searchCategory=' + searchCategory_selected +
												    '&searchKeyword=' + searchKeyword_text);
	}
}

// 글 쓰기 버튼 action
$('#write-button').click(function() {
	location.href= contextPath + "/board/write";
});
