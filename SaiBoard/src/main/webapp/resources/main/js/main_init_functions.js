// main_default_categories.js : 이 js를 참조한 페이지를 open 또는 redirect할 때마다 기본적으로 세팅되는 카테고리들 및 검색어
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