package sai.pork.board.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.ParseException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import sai.pork.board.model.BoardDTO;
import sai.pork.board.model.CommentDTO;
import sai.pork.board.model.PaginationVO;
import sai.pork.board.service.BoardService;

@RestController
public class BoardRESTController {
	
	@Autowired
	BoardService boardService;
	
	@PostMapping("/board/page/{page}")
	public String showBoardSelectedPage(HttpServletResponse resp, @PathVariable("page") String currentPage, @RequestBody Map<String, String> parameters) throws ParseException, IOException {
		// parameter를 Map으로 받았을때 key값은 있고 value값이 null이라면
		// value가 비어있는게 아닌 String값인 "null"이 들어있는 것이다.
		System.out.println("Controller parameters : " + parameters);
		
		System.out.println("Controller currentPage : " + currentPage);
		parameters.put("page", currentPage);
		
		List<BoardDTO> boards = boardService.showBoards(parameters);
		List<String> creationDateTimeList = boardService.getBoardsCreationDateTimeList(boards);
		List<Boolean> isBoardWithFiles = boardService.getBoardsWithFiles(boards);
		PaginationVO page = boardService.getPaginationVO(Integer.parseInt(currentPage), 10, boards.size());
		
		JSONObject obj = new JSONObject();
		PrintWriter out = resp.getWriter(); 
		
		System.out.println(page.getPaginationStart());
		System.out.println(page.getPaginationEnd());
		
		obj.put("boards", boards.subList(page.getStartIndex(), page.getEndIndex()));
		obj.put("boardWriteDate", creationDateTimeList.subList(page.getStartIndex(), page.getEndIndex()));
		obj.put("isBoardWithFiles",  isBoardWithFiles.subList(page.getStartIndex(), page.getEndIndex()));
		obj.put("currentPage", page.getCurrentPage());
		obj.put("paginationStart", page.getPaginationStart());
		obj.put("paginationEnd", page.getPaginationEnd());
		obj.put("totalBoardSize", page.getTotalSize());
		
		out.print(obj);
		return null;
	}
	
	@PostMapping("/board/read/{seq}/{page}")
	public String showCommentSelectedPage(HttpServletResponse resp, @PathVariable("seq") String board_seq, 
				@PathVariable("page") String currentPage, @RequestBody Map<String, String> parameters) throws ParseException, IOException {
		
		// parameter를 Map으로 받았을때 key값은 있고 value값이 null이라면
		// value가 비어있는게 아닌 String값인 "null"이 들어있는 것이다.
		System.out.println("Controller parameters : " + parameters);
		
		System.out.println("Controller currentPage : " + currentPage);
		parameters.put("board_seq", board_seq);
		parameters.put("page", currentPage);
		
		List<CommentDTO> comments = boardService.showComments(Integer.parseInt(board_seq));
		List<String> creationDateTimeList = boardService.getCommentsCreationDateTimeList(comments);
		PaginationVO page = boardService.getPaginationVO(Integer.parseInt(currentPage), 5, comments.size());
		
		JSONObject obj = new JSONObject();
		PrintWriter out = resp.getWriter(); 
		
		System.out.println(page.getPaginationStart());
		System.out.println(page.getPaginationEnd());
		
		obj.put("comments", comments.subList(page.getStartIndex(), page.getEndIndex()));
		obj.put("commentWriteDate", creationDateTimeList.subList(page.getStartIndex(), page.getEndIndex()));
		obj.put("currentPage", page.getCurrentPage());
		obj.put("paginationStart", page.getPaginationStart());
		obj.put("paginationEnd", page.getPaginationEnd());
		obj.put("totalCommentSize", page.getTotalSize());
		
		out.print(obj);
		return null;
	}
}
