package sai.pork.board.service.impl;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import sai.pork.board.mapper.BoardMapper;
import sai.pork.board.model.BoardDTO;
import sai.pork.board.model.CommentDTO;
import sai.pork.board.model.FileDTO;
import sai.pork.board.service.BoardService;

@Service
public class BoardServiceImpl implements BoardService {

	@Autowired
	BoardMapper boardMapper;
	
	@Override
	public void showBoards(HttpServletRequest req, Map<String, String> parameters) {
		// 선택한 페이지 숫자를 불러옴
		String pageStr = req.getParameter("page");

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
		if (parameters.size() > 0 && parameters.get("category") != null && parameters.get("orderBy") != null
				&& parameters.get("searchCategory") != null) {
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
				} else {
					boards = boardMapper.getAllBoards();
				}
			} else if (!searchKeyword.equals("null") || searchKeyword.equals("")) {
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
				} else {
					boards = boardMapper.getAllBoards();
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
	public void writeBoard(HttpServletRequest req, BoardDTO board) {
				
		String pageStr = req.getParameter("page");

		Integer row = boardMapper.writeBoard(board);
		
		if(row > 0) {
			req.setAttribute("status", "board_write_success");
		} else {
			req.setAttribute("status", "board_write_failed");			
		}
		
		List<BoardDTO> boards = boardMapper.getAllBoards();
		
		// page : 총 게시글 수
		int page;
		
		if(pageStr == null) {
			page = 1;
		} else {
			page = Integer.parseInt(pageStr);
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

		System.out.printf("현재 페이지는 %d페이지고, 시작 인덱스는 %d, 마지막 인덱스는 %d 입니다.\n", page, startIndex, endIndex);

		// 전체 페이지 사이즈
		int maxPage = boardSize % pageSize == 0 ? boardSize / pageSize : boardSize / pageSize + 1;

		// paginationSize : 한번에 출력할 페이지네이션 사이즈
		int paginationSize = 5;
		// paginationStart : 전체 페이지네이션 시작 숫자
		int paginationStart = (page / paginationSize) * paginationSize + 1;

		paginationStart = page % paginationSize == 0 ? page - 4 : paginationStart;

		// paginationEnd : 전체 페이지네이션 마지막 숫자
		int paginationEnd = (page / paginationSize + 1) * paginationSize;
		if (page % paginationSize == 0) {
			paginationEnd = paginationEnd - paginationSize;
		} else {
			paginationEnd = paginationEnd > maxPage ? maxPage : paginationEnd;
		}

		int nextPage = paginationEnd + 1;
		int previousPage = paginationStart - 1;

		System.out.printf("현재 페이지는 %d페이지고, 페이지네이션 시작은 %d, 마지막 숫자는 %d 입니다. \n", page, paginationStart, paginationEnd);

		req.setAttribute("page", page);
		req.setAttribute("boards", boards.subList(startIndex, endIndex));
		req.setAttribute("paginationStart", paginationStart);
		req.setAttribute("paginationEnd", paginationEnd);
		req.setAttribute("nextPage", nextPage);
		req.setAttribute("previousPage", previousPage);
		req.setAttribute("boardSize", boardSize);
	}
	
	@Override
	public String uploadFiles(Integer board_seq, List<MultipartFile> files) throws IllegalStateException, IOException {

		System.out.println("uploadFiles : " + files);
		
		List<FileDTO> uploadfiles = new ArrayList<FileDTO>();
		
		// 서버 경로
		String uploadPath = "C:/Users/east/git/saiboard/SaiBoard/src/main/webapp/resources/files";

		String[] fileName = new String[3];

		for (int i = 0; i < files.size(); i++) {
			fileName[i] = files.get(i).getOriginalFilename();
			File saveFile = new File(uploadPath, fileName[i]);

			if (i == 0 && !files.get(i).isEmpty()) {
				FileDTO file1 = new FileDTO();
				files.get(i).transferTo(saveFile);
				file1.setBoard_seq(board_seq);
				file1.setFile_name(files.get(i).getOriginalFilename());
				file1.setFile_src(uploadPath);
				uploadfiles.add(file1);

			} else if (i == 1 && !files.get(i).isEmpty()) {
				FileDTO file2 = new FileDTO();
				files.get(i).transferTo(saveFile);
				file2.setBoard_seq(board_seq);
				file2.setFile_name(files.get(i).getOriginalFilename());
				file2.setFile_src(uploadPath);
				uploadfiles.add(file2);

			} else if (i == 2 && !files.get(i).isEmpty()) {
				FileDTO file3 = new FileDTO();
				files.get(i).transferTo(saveFile);
				file3.setBoard_seq(board_seq);
				file3.setFile_name(files.get(i).getOriginalFilename());
				file3.setFile_src(uploadPath);
				uploadfiles.add(file3);
			}
		}
		
		Integer row = boardMapper.uploadFiles(uploadfiles);
			
		if(row > 0) {			
			return "file_uploaded";
		} else {
			return "upload_failed";
		}
	}
	
	@Override
	public BoardDTO readBoard(Integer board_seq) {
		
		boardMapper.updateView(board_seq);
		
		return boardMapper.getBoard(board_seq);
	}
	
	@Override
	public String deleteBoard(Map<String, String> parameters) {
		
		if(parameters.get("input_pw").equals(boardMapper.boardPasswordCheck(Integer.parseInt(parameters.get("board_seq"))))) {
			Integer row = boardMapper.deleteBoard(Integer.parseInt(parameters.get("board_seq")));
			
			if(row > 0) {
				return "delete_success";
			} else {
				return "delete_fail";
			}
		} else {
			return "delete_wrong_pw";
		}
	 }
	
	@Override
	public void showComments(HttpServletRequest req, Integer board_seq) {
		
		// 선택한 페이지 숫자를 불러옴
		String pageStr = req.getParameter("page");
		
		// page : 총 댓글 수
		int page;

		if (pageStr == null) {
			page = 1;
		} else {
			page = Integer.parseInt(pageStr);
		}
		
		List<CommentDTO> comments = boardMapper.getComments(board_seq);
		
		// pageSize : 한 페이지에 한번에 출력할 댓글 갯수 
		int pageSize = 5;
		// boardSize : 전체 댓글 사이즈
		int	commentSize = comments.size();
		// startIndex : 출력할 5개의 댓글 중에서 첫 댓글의 순서
		int startIndex = (page - 1) * pageSize;
		// endIndex : 출력할 5개의 댓글 중에서 마지막 댓글의 순서
		int endIndex = page * pageSize;
		// 마지막 페이지에 표시되는 댓글들은 딱 5개로 떨어지지 않을 수도 있으니
		// 전체 댓글 사이즈(boardSize)와 page * pageSize(endIndex)를 비교해서
		// endIndex가 더 크면 boardSize로 boardSize가 더 크거나 같으면 endIndex 그대로 대입해준다.
		endIndex = endIndex > commentSize ? commentSize : endIndex;

		System.out.printf("현재 페이지는 %d페이지고, 시작 인덱스는 %d, 마지막 인덱스는 %d 입니다.\n", page, startIndex, endIndex);

		// 전체 페이지 사이즈
		int maxPage = commentSize % pageSize == 0 ? commentSize / pageSize : commentSize / pageSize + 1;

		// paginationSize : 한번에 출력할 페이지네이션 사이즈
		int paginationSize = 5;
		// paginationStart : 전체 페이지네이션 시작 숫자
		int paginationStart = (page / paginationSize) * paginationSize + 1;

		paginationStart = page % paginationSize == 0 ? page - 4 : paginationStart;

		// paginationEnd : 전체 페이지네이션 마지막 숫자
		int paginationEnd = (page / paginationSize + 1) * paginationSize;
		if (page % paginationSize == 0) {
			paginationEnd = paginationEnd - paginationSize;
		} else {
			paginationEnd = paginationEnd > maxPage ? maxPage : paginationEnd;
		}

		int nextPage = paginationEnd + 1;
		int previousPage = paginationStart - 1;

		System.out.printf("현재 페이지는 %d페이지고, 페이지네이션 시작은 %d, 마지막 숫자는 %d 입니다. \n", page, paginationStart, paginationEnd);
		
		req.setAttribute("page", page);
		req.setAttribute("comments", comments.subList(startIndex, endIndex));
		req.setAttribute("paginationStart", paginationStart);
		req.setAttribute("paginationEnd", paginationEnd);
		req.setAttribute("nextPage", nextPage);
		req.setAttribute("previousPage", previousPage);
		req.setAttribute("commentSize", commentSize);
	}
	
	@Override
	public String commentPasswordCheck(Integer comment_seq) {
		
		return	boardMapper.commentPasswordCheck(comment_seq);
	}
	
	@Override
	public String writeComment(CommentDTO comment) {
		
		Integer result = boardMapper.writeComment(comment);
		
		if(result > 0) {
			return "write_comment_success";
		} else {
			return "write_comment_failed";
		}
	}
	
	@Override
	public String editComment(CommentDTO comment) {
		
		Integer result = boardMapper.editComment(comment);
		
		if(result > 0) {
			return "edit_comment_success";
		} else {
			return "edit_comment_failed";
		}
	}
	
	@Override
	public String deleteComment(Integer comment_seq) {
		
		Integer result = boardMapper.deleteComment(comment_seq);
		
		if(result > 0) {
			return "delete_comment_success";
		} else {
			return "delete_comment_failed";
		}
	}
}
