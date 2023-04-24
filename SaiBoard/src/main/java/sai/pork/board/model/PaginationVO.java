package sai.pork.board.model;

public class PaginationVO {

	// currentPage : 현재 페이지 번호
	private Integer currentPage;
	// boardCountPerPage : 한 페이지에 한번에 출력할 게시글 갯수
	private final Integer boardSizePerPage = 10;
	// totalBoardSize : 전체 게시글 수
	private Integer totalBoardSize;
	// startIndex : 출력할 10개의 게시글 중에서 첫 게시글 순서 번호
	private Integer startIndex;
	// endIndex : 출력할 10개의 게시글 중에서 마지막 게시글의 순서 번호
	private Integer endIndex;
	// paginationSize : 한번에 출력할 페이지네이션 사이즈
	private final Integer paginationSize = 5;
	// maxPagination : 전체 페이지 갯수
	private Integer maxPagination;
	// paginationStart : 현재 출력된 페이지 리스트의 첫 페이지 번호
	private Integer paginationStart;
	// paginationEnd : 현재 출력된 페이지 리스트의 마지막 번호
	private Integer paginationEnd;
	// paginationTotal : 전체 페이지 사이즈
	private Integer paginationTotal;
	// nextPage : 현재 페이지에서 다음 페이지
	private Integer nextPage;
	// prevPage : 현재 페이지에서 이전 페이지
	private Integer prevPage;
	
	public PaginationVO(Integer currentPage, Integer totalBoardSize) {
		this.currentPage = currentPage;
		this.totalBoardSize = totalBoardSize;
	}
	
	public Integer getCurrentPage() {
		return currentPage;
	}
	
	public Integer getTotalBoardSize() {
		return totalBoardSize;
	}
	
	public Integer getStartIndex() {
		return (currentPage - 1) * boardSizePerPage;
	}
	
	public Integer getEndIndex() {
		Integer end = currentPage * boardSizePerPage;
		// 마지막 페이지에 표시되는 게시글들은 딱 10개로 떨어지지 않을 수도 있으니
		// 전체 게시글 사이즈(boardSize)와 page * pageSize(endIndex)를 비교해서
		// endIndex가 더 크면 boardSize로 boardSize가 더 크거나 같으면 endIndex 그대로 대입해준다.
		end = endIndex > totalBoardSize ? totalBoardSize : endIndex;		
				
		return end;
	}
	
	public Integer getMaxPagination() {
		return totalBoardSize % boardSizePerPage == 0 ?
				totalBoardSize / boardSizePerPage : totalBoardSize / boardSizePerPage + 1;
	}
	
	public Integer getPaginationStart() {
		Integer start = currentPage / paginationSize * paginationSize + 1;
		
		start = currentPage % paginationSize == 0 ? currentPage - 4 : start;
		
		return start;
	}
	
	public Integer getPaginationEnd() {
		
		Integer end = (currentPage / paginationSize + 1) * paginationSize;
		
		if(currentPage % paginationSize == 0) {
			end = paginationEnd - paginationSize;
		} else {
			end = paginationEnd > maxPagination ? maxPagination : paginationEnd;
		}
		
		return end; 
	}
	
	public Integer getNextPage() {
		return paginationEnd + 1;
	}
	
	public Integer getPrevPage() {
		return paginationStart - 1;
	}
	

//	int pageSize = 10;
//	// boardSize : 전체 게시글 사이즈
//	int boardSize = boards.size();
//	// startIndex : 출력할 10개의 게시글 중에서 첫 게시글 순서 번호
//	int startIndex = (page - 1) * pageSize;
//	// endIndex : 출력할 10개의 게시글 중에서 마지막 게시글의 순서 번호
//	int endIndex = page * pageSize;
//	// 마지막 페이지에 표시되는 게시글들은 딱 10개로 떨어지지 않을 수도 있으니
//	// 전체 게시글 사이즈(boardSize)와 page * pageSize(endIndex)를 비교해서
//	// endIndex가 더 크면 boardSize로 boardSize가 더 크거나 같으면 endIndex 그대로 대입해준다.
//	endIndex=endIndex>boardSize?boardSize:endIndex;
//
//	System.out.printf("현재 페이지는 %d페이지고, 시작 인덱스는 %d, 마지막 인덱스는 %d 입니다.\n",page,startIndex,endIndex);
//
//	// 전체 페이지 사이즈
//	int maxPage = boardSize % pageSize == 0 ? boardSize / pageSize : boardSize / pageSize + 1;
//
//	// paginationSize : 한번에 출력할 페이지네이션 사이즈
//	int paginationSize = 5;
//	// paginationStart : 전체 페이지네이션 시작 숫자
//	int paginationStart = (page / paginationSize) * paginationSize + 1;
//
//	paginationStart=page%paginationSize==0?page-4:paginationStart;
//
//	// paginationEnd : 전체 페이지네이션 마지막 숫자
//	int paginationEnd = (page / paginationSize + 1) * paginationSize;

//	if(page % paginationSize==0) {
//		paginationEnd = paginationEnd - paginationSize;
//	} else {
//		paginationEnd = paginationEnd > maxPage ? maxPage : paginationEnd;
//	}
//
//	int nextPage = paginationEnd + 1;
//	int previousPage = paginationStart - 1;
//
//	System.out.printf("현재 페이지는 %d페이지고, 페이지네이션 시작은 %d, 마지막 숫자는 %d 입니다. \n",page,paginationStart,paginationEnd);
}
