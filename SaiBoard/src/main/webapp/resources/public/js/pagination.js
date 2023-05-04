	// currentPage : 현재 페이지 번호
	// sizePerPage : 한 페이지에 한번에 출력할 글 갯수
	// totalSize : 전체 글 수
	// paginationSize : 한번에 출력할 페이지네이션 사이즈
// 페이지네이션 작업 function
function getPaginationVO(currentPage, sizePerPage, totalSize, paginationSize) {

	let startIndex; // startIndex : 출력할 10개의 게시글 중에서 첫 글 순서 번호
	let endIndex; // endIndex : 출력할 10개의 게시글 중에서 마지막 글의 순서 번호
	let maxPagination; // maxPagination : 전체 페이지 갯수
	let paginationStart; // paginationStart : 현재 출력된 페이지 리스트의 첫 페이지 번호
	let paginationEnd; // paginationEnd : 현재 출력된 페이지 리스트의 마지막 번호
	let nextPage; // nextPage : 현재 페이지에서 다음 페이지
	let prevPage; // prevPage : 현재 페이지에서 이전 페이지
	
	// 페이지 네이션 로직 파트 ------------------------------------------------------------
	startIndex = (currentPage - 1) * sizePerPage;
	endIndex = currentPage * sizePerPage;
	// 마지막 페이지에 표시되는 게시글들은 딱 10개로 떨어지지 않을 수도 있으니
	// 전체 게시글 사이즈(boardSize)와 page * pageSize(endIndex)를 비교해서
	// endIndex가 더 크면 boardSize로 boardSize가 더 크거나 같으면 endIndex 그대로 대입해준다.
	endIndex = endIndex > totalSize ? totalSize : endIndex;
	
	maxPagination = totalSize % sizePerPage == 0 ? totalSize / sizePerPage : totalSize / sizePerPage + 1;
	
	// 자바스크립트에선 정수(Integer), 소수(Double)만 개별적으로 받아주는 변수는 없어서
	// 로직을 java와는 다르게 처리해야한다. 
	// Math.floor() - 소수점 버림
	paginationStart = Math.floor(currentPage / paginationSize) * paginationSize + 1;
	paginationStart = Math.floor(currentPage % paginationSize) == 0 ? currentPage - 4 : paginationStart;
	
	paginationEnd = (currentPage / paginationSize + 1) * paginationSize;
	if(currentPage % paginationSize == 0) {
		paginationEnd = paginationEnd - paginationSize;
	} else {
		paginationEnd = paginationEnd > maxPagination ? maxPagination : paginationEnd;
	}
	
	nextPage = paginationEnd + 1;
	prevPage = paginationStart - 1;
	// ---------------------------------------------------------------------------------
	
	const paginationVO = {
		currentPage : currentPage,
		sizePerPage : sizePerPage,
		totalSize : totalSize,
		paginationSize : paginationSize,
		startIndex : startIndex,
		endIndex : endIndex,
		maxPagination : maxPagination,
		paginationStart : paginationStart,
		paginationEnd : paginationEnd,
		nextPage : nextPage,
		prevPage : prevPage
	}
	
	return paginationVO;	
}