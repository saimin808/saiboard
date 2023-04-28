package sai.pork.board.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.ParseException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
	
	// 게시글 쓰기
	// 보통 Controller로 요청이 온 JSON을 DTO로 바인딩 할 때는 @RequestBody를 주로 사용한다.
	//그리고 File을 받을 때는 MultipartFile 객체를 사용하고 @RequestParam을 사용한다.
	//하지만 File과 Dto를 같이 받기 위해서는 @RequestPart라는 어노테이션을 사용한다.
	@PostMapping("/board/write/write_board")
	public String writeBoard(Model model, HttpServletResponse resp, @RequestPart(name = "board") BoardDTO board,
							@RequestPart(name = "upload_files") List<MultipartFile> upload_files) throws IllegalStateException, IOException {
			
		// 파라미터 확인용 
		System.out.println("board : " + board);
		System.out.println("files : " + upload_files);
			
		Boolean result = boardService.writeBoard(board);
		
		// board_seq를 글쓰기에서는 못받아와 주니까 만든 다음에 board를 가져와서 seq를 전달해줘야됨
		if(result == true) {
			if(upload_files.size() > 0) {
				List<BoardDTO> boards = boardService.getAllBoards();
				Integer newBoard_seq = boards.get(0).getBoard_seq();		
				boardService.uploadFiles(newBoard_seq, upload_files);
			}
			return "true";
		} else {
			return "false";
		}
	}
	
	// 게시글 삭제
	// input_pw 일반 텍스트로 받을수 있는 파라미터로 바꾸고 Ajax도 수정처리 하기!!
	@PostMapping("/board/delete/{seq}")
	public String deleteBoard(Model model,@PathVariable("seq") String board_seq, @RequestParam Map<String,String> parameters) {
			
		// 파라미터 확인용
		System.out.println("delete_board_seq: " + board_seq);
		System.out.println("delete_board: " + parameters);
		
		parameters.put("board_seq", board_seq);
		String result = boardService.boardPasswordCheck(parameters);
			
		if(result == "pw_checked") {
			Boolean result2 = boardService.deleteBoard(parameters);
			if(result2 == true) {
				return "redirect:/board?status=delete_board_success";
			} else {
				model.addAttribute("status", "delete_" + result);
				return "redirect:/board/read/" + board_seq;
			}
		} else {
			model.addAttribute("status", "delete_" + result);
			return "redirect:/board/read/" + board_seq;
		}
	}
}
