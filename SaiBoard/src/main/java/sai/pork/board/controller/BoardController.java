package sai.pork.board.controller;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import sai.pork.board.model.BoardDTO;
import sai.pork.board.model.CommentDTO;
import sai.pork.board.model.FileDTO;
import sai.pork.board.model.PaginationVO;
import sai.pork.board.service.BoardService;

@Controller
public class BoardController {

	// BoardService
	@Autowired
	BoardService boardService;
	
	// 게시판 (board_main)
	@GetMapping(value= {"/board", "/board/"})
	public String showMainBoard(Model model, @RequestParam Map<String, String> parameters) throws ParseException, IOException {
		// parameter를 Map으로 받았을때 key값은 있고 value값이 null이라면
		// value가 비어있는게 아닌 String값인 "null"이 들어있는 것이다.
		System.out.println("Controller parameters : " + parameters);
		
		List<BoardDTO> boards = boardService.showBoards(parameters);
		List<String> creationDateTimeList = boardService.getBoardsCreationDateTimeList(boards);
		List<Boolean> isBoardWithFiles = boardService.getBoardsWithFiles(boards);
		PaginationVO page = boardService.getPaginationVO(null, 10, boards.size());
		
		model.addAttribute("boards", boards);
		model.addAttribute("boardWriteDate", creationDateTimeList);
		model.addAttribute("isBoardWithFiles", isBoardWithFiles);
		// 페이지네이션 전달
		model.addAttribute("currentPage", page.getCurrentPage());
		model.addAttribute("totalBoardSize", page.getTotalSize());
		model.addAttribute("startIndex", page.getStartIndex());
		model.addAttribute("endIndex", page.getEndIndex());
		model.addAttribute("paginationStart", page.getPaginationStart());
		model.addAttribute("paginationEnd", page.getPaginationEnd());
		model.addAttribute("nextPage", page.getNextPage());
		model.addAttribute("previousPage", page.getPrevPage());
		
		return "board_main";
	}
	
	// 게시글 쓰기 페이지로 이동
	@GetMapping("/board/write")
	public String openWriteBoardPage(Model model) {
		
		model.addAttribute("purpose", "write");
		
		return "write/board_write";
	}
	
	// 게시글 보기
	@GetMapping("/board/read/{board_seq}")
	public String readBoard(Model model, HttpServletRequest req, @PathVariable("board_seq") Integer board_seq) throws ParseException {
		
		// 파라미터 확인용
		System.out.println("parameters : " + board_seq);
		
		boardService.readBoard(req, board_seq); 
		List<CommentDTO> comments = boardService.showComments(board_seq);
		List<String> creationDateTimeList = boardService.getCommentsCreationDateTimeList(comments);
		PaginationVO page = boardService.getPaginationVO(null, 5, comments.size());
		
		model.addAttribute("comments", comments.subList(page.getStartIndex(), page.getEndIndex()));
		model.addAttribute("commentWriteDate", creationDateTimeList.subList(page.getStartIndex(), page.getEndIndex()));
		// 페이지네이션 전달
		model.addAttribute("currentPage", page.getCurrentPage());
		model.addAttribute("totalCommentSize", page.getTotalSize());
		model.addAttribute("startIndex", page.getStartIndex());
		model.addAttribute("endIndex", page.getEndIndex());
		model.addAttribute("paginationStart", page.getPaginationStart());
		model.addAttribute("paginationEnd", page.getPaginationEnd());
		model.addAttribute("nextPage", page.getNextPage());
		model.addAttribute("previousPage", page.getPrevPage());
		
		return "read/board_read";
	}
	
	// 게시글 수정 페이지로 이동
	@PostMapping("/board/edit")
	public String editPasswordCheck(Model model, HttpServletRequest req, @RequestParam Map<String,String> parameters) throws NumberFormatException, ParseException {
		
		Boolean result = boardService.boardPasswordCheck(1, "");
		
		if(result == true) {
			model.addAttribute("purpose", "edit");
			boardService.readBoard(req, Integer.parseInt(parameters.get("board_seq")));
			return "write/board_write";
		} else {
			model.addAttribute("status", "edit_wrong_pw");
			model.addAttribute("board_seq", parameters.get("board_seq"));
			return "redirect:/board/read";
		}
	}
	
	// 게시글 수정
	@PostMapping("/board/edit/do")
	public String editBoard(Model model, HttpServletRequest req, BoardDTO board, List<FileDTO> files) {
		
		String result = boardService.editBoard(board, files);
		
		model.addAttribute("status", result);
		
		return "redirect:/board";
	}
	
	// 댓글 작성
	@PostMapping("/board/write_comment")
	public String writeComment(Model model, CommentDTO comment) {
		
		String result = boardService.writeComment(comment);
		List<CommentDTO> comments = boardService.showComments(comment.getBoard_seq());
		
		model.addAttribute("status", result);
		model.addAttribute("comments", comments);
		return "redirect:/board/read/"+ comment.getBoard_seq();
	}
	
	// 댓글 수정 전 비밀번호 확인
	@PostMapping("/board/edit_comment_pw_check")
	public String editCommentPasswordCheck(Model model, String comment_input_pw, Integer dialog_seq,  Integer comment_seq, Integer board_seq) {
		
		// 파라미터 확인용
		System.out.println("editCommentPwCheck : " + comment_input_pw + "" + comment_seq);
		// 1. 댓글의 비밀번호 확인
		Boolean isCorrect = boardService.commentPasswordCheck(comment_input_pw, comment_seq);
		
		// 2. 비밀번호 확인 후  
		if(isCorrect == true) {
			model.addAttribute("status", "edit_comment_pw_checked" + dialog_seq);
			return "redirect:/board/read/" + board_seq;
		} else {
			model.addAttribute("status", "edit_comment_wrong_pw");
			return "redirect:/board/read/" + board_seq;
		}
	}
	
	// 댓글 수정
	@PostMapping("/board/edit_comment")
	public String editComment(Model model, CommentDTO comment) {
		
		System.out.println("editComment : " + comment);
		
		List<CommentDTO> comments = boardService.showComments(comment.getBoard_seq());
		String result = boardService.editComment(comment);
		
		model.addAttribute("comments", comments);
		model.addAttribute("status", result);
		return "redirect:/board/read/" + comment.getBoard_seq();
	}
	
	// 파일 다운로드
	@GetMapping("/board/file_download/{file_seq:[0-9]{1,6}}")
	public void fileDownload(HttpServletResponse resp, @PathVariable(name="file_seq") Integer file_seq) throws Exception {
		boardService.downloadFile(resp, file_seq);
	}
}
