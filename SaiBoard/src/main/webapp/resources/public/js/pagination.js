// 페이지네이션 데이터 생성 js

	// currentPage : 현재 페이지 번호
	// sizePerPage : 한 페이지에 출력할 글 갯수
	// totalSize : 전체 글 수
	// paginationSize : 한페이지에 출력할 페이지네이션 사이즈
// 페이지네이션 작업 function
function getPaginationVO(currentPage, sizePerPage, totalSize, paginationSize) {

	console.log('currentPage : ' + currentPage);
    console.log('sizePerPage : ' + sizePerPage);
    console.log('totalSize : ' + totalSize);
    console.log('paginationSize : ' + paginationSize);
	
	let startIndex; // startIndex : 출력할 10개의 게시글 중에서 첫 글 순서 번호
	let endIndex; // endIndex : 출력할 10개의 게시글 중에서 마지막 글의 순서 번호
	let maxPagination; // maxPagination : 전체 페이지 갯수
	let paginationStart; // paginationStart : 현재 출력된 페이지 리스트의 첫 페이지 번호
	let paginationEnd; // paginationEnd : 현재 출력된 페이지 리스트의 마지막 번호
	let nextPage; // nextPage : 현재 페이지에서 다음 페이지
	let prevPage; // prevPage : 현재 페이지에서 이전 페이지
	
	// 페이지네이션 로직 파트 ------------------------------------------------------------
	startIndex = (currentPage - 1) * sizePerPage;
	endIndex = currentPage * sizePerPage;
	// 마지막 페이지에 표시되는 게시글들은 딱 10개로 떨어지지 않을 수도 있으니
	// 전체 게시글 사이즈(boardSize)와 page * pageSize(endIndex)를 비교해서
	// endIndex가 더 크면 boardSize로 boardSize가 더 크거나 같으면 endIndex 그대로 대입해준다.
	endIndex = endIndex > totalSize ? totalSize : endIndex;
	
	// JS에선 정수(Integer), 소수(Double)만 가질수 있는 변수는 없다.
	// JS는 '/'(나누기)를 할 경우 대상이 정수값 또는 소수값인 것과 상관없이 나머지가 0이 될때까지 나누기 때문에
	// 소수(Double)인 결과가 나올 수도 있다.
	
	// 그래서 내가 원하는 결과를 얻기 위해선 나누고 소수인 값은 버려야한다.
	// Math.floor() - 소수점 버림
	maxPagination = totalSize % sizePerPage == 0 ? Math.floor(totalSize / sizePerPage) : Math.floor(totalSize / sizePerPage) + 1;
	
	// 7 / 2 = 3
	// 현재 출력할 페이지네이션 첫번째 링크 = (현재 페이지 / 페이지네이션 사이즈) * 페이지네이션 사이즈 + 1  
	paginationStart = Math.floor(currentPage / paginationSize) * paginationSize + 1;
	
	// 만약 현재 페이지가 페이지네이션 사이즈의 배수나 약수면 위 로직에서의 결과가 구해주려는 값보다 더 오버가 될 수 있기 때문에
	// 그것을 방지하기 위해 배수인 경우 현재 페이지 - (페이지네이션 사이즈 - 1)을 해주어 첫번째 페이지로 출력되게끔 강제한다.
	paginationStart = Math.floor(currentPage % paginationSize) == 0 ? currentPage - (paginationSize - 1) : paginationStart;
	
	// 현재 출력할 페이지네이션 마지막 링크 = ((현재 페이지 / 페이지네이션 사이즈) + 1) * 페이지네이션 사이즈 
	paginationEnd = (Math.floor(currentPage / paginationSize) + 1) * paginationSize;
	
	// paginationStart와 마찬가지로 페이지네이션 사이즈의 배수나 약수면 구해주려는 값의 두배가 되어버리기 때문에
	// 배수이면 두배인 값을 반으로 줄여준다.
	if(currentPage % paginationSize == 0) {
		paginationEnd = paginationEnd - paginationSize;
	} else {
		// 마지막 페이지에
		paginationEnd = paginationEnd > maxPagination ? maxPagination : paginationEnd;
	}
	
	nextPage = paginationEnd + 1;
	// 만약 이전 페이지의 paginationStart가 1일 경우 -1을 처리해버리면 0페이지가 되어 오류가 나기 때문에
	// 그때를 방지하기 위해 3항 연산자를 사용하여 paginationStart - 1 == 0이 true 이면 1로
	// false면 연산식의 결과값 그대로를 대입하여준다.
	prevPage = paginationStart - 1 == 0 ? 1 : paginationStart - 1;
	// ---------------------------------------------------------------------------------
	
	console.log('script startIndex : ' + startIndex);
   	console.log('script endIndex : ' + endIndex);
    console.log('script paginationStart : ' + paginationStart);
    console.log('script patinationEnd : ' + paginationEnd);
    console.log('script nextPage : ' + nextPage);
    console.log('script prevPage : ' + prevPage);
	
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