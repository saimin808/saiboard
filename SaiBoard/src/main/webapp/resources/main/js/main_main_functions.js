// main_function.js : 각 페이지에 메인이 되는 기능들을 모아놓은 js

// *게시판 카테고리 변경과 페이지 링크 클릭의 동작 둘다
//  1. 옵션(현재 카테고리 정보와 현재 페이지 data)을 가지고
//  2. 옵션에 해당하는 게시글과 그 게시글 총 개수에 맞는 페이지 링크들을 만들어
//  3. board_main.jsp에 있는 게시판 table과 페이지네이션 div에 각각 출력하는 기능이 필요해서
// 둘이 나눠서 펑션화 시키기 어렵다고 판단 하였다.
// 그래서 listBoards()를 둘다 활용하게 된 것이다.

// 게시판 리스팅 function
function listBoards(currentPage) {

    // 게시판 조회에 필요한 데이터를 모아준다.
    const parameters = getherDataToInquire();

    // 잘 들어왔는지 console로 확인
    console.log(parameters);

    // ajax로 데이터 전송
    $.ajax({
            type: 'POST',
            url: contextPath + "/board/page/" + currentPage,
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify(parameters),
            dataType: 'json',
            progress: true
        })
        .fail(function(e) {
            console.log(e);
            alert("통신 오류 error");
        })
        .done(function(data) {
            console.log('통신 성공!');

            // 게시판 리스팅에 필요한 데이터 구성하기 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            // 게시글 데이터 *************************************************
            let boards = new Array;
            let writeDate = new Array;
            let files = new Array;

            boards = data.boards; // 가져온 게시글 리스트
            writeDate = data.boardWriteDate; // 가져온 게시글 작성일 리스트
            files = data.isBoardWithFiles; // 가져온 첨부파일 리스트
            //*************************************************************

            // 페이지네이션 데이터를 구성하기 위해 필요한 데이터 **********************************
            let sizePerPage = 10; // 한 페이지에 출력할 게시글 수
            let paginationSize = 5; // 한 페이지에 출력할 페이지네이션 수
            const totalBoardSize = data.totalBoardSize; // 조회된 게시글 총 갯수
            //**************************************************************

            // 페이지네이션 데이터 ****************************************************
            // currentPage, sizePerPage, totalSize, paginationSize
            console.log('currentPage : ' + currentPage);
            console.log('totalBoardSize : ' + totalBoardSize);
            const paginationVO = getPaginationVO(currentPage, sizePerPage, totalBoardSize, paginationSize);

            // getPaginationVO를 통해 받아온 페이지네이션 정보들 받아주는 변수들
            const startIndex = paginationVO.startIndex;
            const endIndex = paginationVO.endIndex;
            paginationStart = paginationVO.paginationStart;
            paginationEnd = paginationVO.paginationEnd;
            const nextPage = paginationVO.nextPage;
            const prevPage = paginationVO.prevPage;

            console.log('script startIndex : ' + startIndex);
            console.log('script endIndex : ' + endIndex);
            console.log('script paginationStart : ' + paginationStart);
            console.log('script patinationEnd : ' + paginationEnd);
            console.log('script nextPage : ' + nextPage);
            console.log('script prevPage : ' + prevPage);
            //*********************************************************************
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


            // 게시판 리스팅 & 페이지네이션 작업 구간 (위에서 가져온 댓글 목록이 존재할 경우 진행한다.)
            if (boards.length > 0) {
                // 새롭게 리스팅할 게시판
                const content = createBoards(startIndex, endIndex, boards, writeDate, files);
                // 새로운 페이지네이션
                const page = createPagination(paginationVO, totalBoardSize);

                // 페이지네이션 틀 (ul)
                const pagination_ul = document.getElementById('pagination-ul');

                // 게시글 전체 테이블(table) 안에 새롭게 리스팅할 게시판 입력
                $('#board-table').html(content);

                // 페이지네이션 컨테이너(ul) 안에 새로운 페이지네이션 입력
                pagination_ul.innerHTML = page;
            }
        })
}

// 게시판 조회에 필요한 데이터 모으기 function
function getherDataToInquire() {
	// 게시판 조회에 필요한 parameters
	const parameters = {
		category : $('#category-select option:selected').val(), // 선택한 카테고리
		orderBy : $('#orderBy-select option:selected').val(), // 선택한 정렬 기준
		searchCategory : $('#searchCategory-select option:selected').val(), // 선택한 검색 주제
		searchKeyword : $('input[name=searchKeyword]').val() // 선택한 검색어
	}
	
	return parameters;
}

// 게시판 생성 function
function createBoards(startIndex, endIndex, boards, writeDate, files) {

	// 가져온 매개변수들로 게시판을 구현한다.
    let content = '';
    if (boards.length > 0) {
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
        for (let i = startIndex; i < endIndex; i++) {
            content += '	<tr>';
            content += '		<td>' + boards[i].board_seq + '</td>';
            content += '		<td>' + boards[i].board_category + '</td>';
            content += '		<td>';
            content += '<a href="' + contextPath + '/board/read/' + boards[i].board_seq + '">' + boards[i].board_title + '</a>';
            if (files[i] == true) {
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

    return content;
}

// 페이지네이션 생성 function
function createPagination(paginationVO, totalBoardSize) {

    // 페이지네이션에 필요한 데이터를 담아주는 변수들
    const currentPage = paginationVO.currentPage; // 현재 페이지
    const sizePerPage = paginationVO.sizePerPage; // 한 페이지당 출력할 글 갯수
    const paginationSize = paginationVO.paginationSize; // 한번에 출력할 페이지네이션 갯수
    paginationStart = paginationVO.paginationStart; // 현재 출력된 페이지네이션의 시작 페이지
    paginationEnd = paginationVO.paginationEnd; // 현재 출력된 페이지네이션의 마지막 페이지
    const nextPage = paginationVO.nextPage; // 현재 출력된 페이지네이션의 다음 페이지네이션
    const prevPage = paginationVO.prevPage; // 현재 출력된 페이지네이션의 이전 페이지네이션

	// 페이지네이션 링크 작업 구간
    let page = '';
    page += '	<li class="page-item">';

	// '<<'(전 페이지네이션) 링크 생성
    if (paginationStart > paginationSize) {
    	// 현재 출력된 페이지네이션의 첫 페이지(paginationStart)의 숫자가 한번에 출력할 페이지네이션 사이즈(paginationSize)
		// 보다 크면 전 페이지네이션('<<') 링크 활성화
		// ex) paginationSize = 10이면 -> 처음에 출력되는 페이지네이션의 마지막 페이지가 10
		//     그때 paginationStart = 11이면 -> 현재 보여지는 페이지네이션은 11~ 일것이다.
		//     그러면 이전 페이지네이션(1 ~ 10)이 존재하므로 '<<' 링크를 활성화 시킨다.
        page += '				<a id="prev-link" class="page-link" aria-label="Previous"';
        page += '					style="cursor: pointer;" onclick="listBoards(' + prevPage + ')">';
        page += '					<span aria-hidden="true">&laquo;</span>';
        page += '				</a>';
    } else {
        page += '				<a class="page-link" aria-label="Previous"';
        page += '				  style="pointer-event: none; cursor: default;">';
        page += '					<span aria-hidden="true">&laquo;</span>';
        page += '				</a>';
    }

    page += '	</li>';

	// 각 페이지 링크 생성
    for (let i = paginationStart; i <= paginationEnd; i++) {
        page += '<li class="page-item">';
        // 현재 페이지랑 동일한 링크는 이미 선택된 링크처럼 표시하기 위해 onclick을 없애고 디자인을 바꾼다.
        if (currentPage == i) {
            page += '	<a class="page-link" style="color: white; background-color: #6c757d;';
            page += '		pointer-event: none; cursor: default;">' + i + '</a>';
        } else {
            // 페이지(i) * 한 페이지당 출력할 글의 수(sizePerPage) > 전체 게시글의 수(totalBoardSize)
            // true 이면 페이지 링크를 더이상 생성하면 안되므로 break
            if (i * sizePerPage > totalBoardSize) {
                break;
            }
            page += '	<a class="page-link" style="cursor: pointer;" onclick="listBoards(' + i + ')">' + i + '</a>';
        }
        page += '</li>';
    }

    page += '<li class="page-item">';

	// 화면에 출력될 마지막 페이지(paginationEnd)가 한번에 출력할 페이지네이션 사이즈(paginationSize)의 배수이고
	// 가져온 총 게시글 수(totalBoardSize)가 현재 출력된 마지막 페이지에서 출력할 수 있는 최대 글 수(paginationEnd * sizePerPage)
	// 보다 크면 '>>' 링크 활성화
    if (paginationEnd % paginationSize == 0 && totalBoardSize > paginationEnd * sizePerPage) {
        page += '			<a id="next-link" class="page-link" aria-label="Next"';
        page += '				style="cursor: pointer;" onclick="listBoards(' + nextPage + ')">';
        page += '				<span aria-hidden="true">&raquo;</span>';
        page += '			</a>';
    } else {
        page += '			<a class="page-link" aria-label="Next"';
        page += '				style="pointer-event: none; cursor: default;">';
        page += '				<span aria-hidden="true">&raquo;</span>';
        page += '			</a>';
    }

    page += '</li>';
	
	// 만들어준 데이터를 return한다.
    return page;
}