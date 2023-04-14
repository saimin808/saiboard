package sai.pork.board.service.impl;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import sai.pork.board.mapper.BoardMapper;
import sai.pork.board.model.BoardDTO;
import sai.pork.board.service.BoardService;

@Service
public class BoardServiceImpl implements BoardService {

	@Autowired
	BoardMapper boardMapper;
	
	@Override
	public void showBoards(HttpServletRequest req, Map<String, String> parameters) {
		// 선택한 페이지 숫자를 불러옴
		String pageStr = parameters.get("page");

		System.out.println("getAllBoard");
		System.out.println(parameters);
		List<BoardDTO> boards = boardMapper.getAllBoards();
		
		// page : 총 게시글 수
		int page;
		
		if(pageStr == null) {
			page = 1;
		} else {
			page = Integer.parseInt(pageStr);
		}
		
		// 들어온 파라미터 중 searchKeyword값(검색어)이 없으면 getSpecificBoards(검색어 없이 board 조회) 메서드로
		// searchKeyword값이 있으면 getSearchedBoards(검색한 제목의 board만 조회) 메서드로 파라미터를 전달한다.
		if (parameters.size() > 0) {
			String category = parameters.get("category");
			String searchKeyword = parameters.get("searchKeyword");
			if (searchKeyword.equals("null") || searchKeyword.equals("")) {
				System.out.println("getSpecificBoards");
				if (category.equals("news")) {
					parameters.remove("category");
					parameters.put("category", "공지");
					boards = boardMapper.getSpecificBoards(parameters);
				} else if (category.equals("free")) {
					parameters.remove("category");
					parameters.put("category", "자유");
					boards = boardMapper.getSpecificBoards(parameters);
				} else if (category.equals("total")) {
					// 들어온 파라미터 중 category(카테고리)값이 total(전체)이면 Query문에서 board_category 조건을 빼야하기 때문에
					// 그 조건을 제거한 Mapper로 연결해 준다.
					boards = boardMapper.getTotalSpecificBoards(parameters);
				}
			} else if (!searchKeyword.equals("null")) {
				System.out.println("searchKeyword : " + searchKeyword);
				System.out.println("getSearchedBoards");
				if (category.equals("news")) {
					parameters.remove("category");
					parameters.put("category", "공지");
					boards = boardMapper.getSearchedBoards(parameters);
				} else if (category.equals("free")) {
					parameters.remove("category");
					parameters.put("category", "자유");
					boards = boardMapper.getSearchedBoards(parameters);
				} else if (category.equals("total")) {
					// 들어온 파라미터 중 category(카테고리)값이 total(전체)이면 Query문에서 board_category 조건을 빼야하기 때문에
					// 그 조건을 제거한 Mapper로 연결해 준다.
					boards = boardMapper.getTotalSearchedBoards(parameters);
				}
			}
		}
		
		// pageSize : 한 페이지에 한번에 출력할 게시글 갯수 
		int pageSize = 10;
		// boardSize : 전체 게시글 사이즈
		int boardSize = boards.size();
		// startIndex : 출력할 10개의 게시글 중에서 첫 게시글의 순서
		int startIndex = (page - 1) * pageSize;
		// endIndex : 출력할 10개의 게시글 중에서 마지막 게시글의 순서
		int endIndex = page * pageSize;
		// 마지막 페이지에 표시되는 게시글들은 딱 10개로 떨어지지 않을 수도 있으니
		// 전체 게시글 사이즈(boardSize)와 page * pageSize(endIndex)를 비교해서
		// endIndex가 더 크면 boardSize로 boardSize가 더 크거나 같으면 endIndex 그대로 대입해준다. 
		endIndex = endIndex > boardSize ? boardSize : endIndex;
		
		System.out.printf("현재 페이지는 %d페이지고, 시작 인덱스는 %d, 마지막 인덱스는 %d 입니다.\n",
				page, startIndex, endIndex);
		
		// 전체 페이지 사이즈
		int maxPage = boardSize % pageSize == 0 ? boardSize / pageSize : boardSize / pageSize + 1;
		
		// paginationSize : 한번에 출력할 페이지네이션 사이즈
		int paginationSize = 5;
		// paginationStart : 전체 페이지네이션 시작 숫자
		int paginationStart = (page / paginationSize) * paginationSize + 1;
		
		paginationStart = page % paginationSize == 0 ? page - 4 : paginationStart;
		
		// paginationEnd : 전체 페이지네이션 마지막 숫자
		int paginationEnd = (page / paginationSize + 1) * paginationSize;
		if(page % paginationSize == 0) {
			paginationEnd = paginationEnd - paginationSize;
		} else {
			paginationEnd = paginationEnd > maxPage ? maxPage : paginationEnd;
		}
		
		int nextPage = paginationEnd + 1;
		int previousPage = paginationStart - 1;
		
		System.out.printf("현재 페이지는 %d페이지고, 페이지네이션 시작은 %d, 마지막 숫자는 %d 입니다. \n",
				page, paginationStart, paginationEnd);

		req.setAttribute("page", page);
		req.setAttribute("boards", boards.subList(startIndex, endIndex));
		req.setAttribute("paginationStart", paginationStart);
		req.setAttribute("paginationEnd", paginationEnd);
		req.setAttribute("nextPage", nextPage);
		req.setAttribute("previousPage", previousPage);
		req.setAttribute("boardSize", boardSize);
	}
	
	@Override
	public BoardDTO readBoard(Integer board_seq) {
		
		return boardMapper.getBoard(board_seq);
	}
}
