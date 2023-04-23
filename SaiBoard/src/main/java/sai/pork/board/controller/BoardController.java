package sai.pork.board.controller;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import sai.pork.board.model.BoardDTO;
import sai.pork.board.model.CommentDTO;
import sai.pork.board.model.FileDTO;
import sai.pork.board.service.BoardService;

@Controller
@RequestMapping("/board")
public class BoardController {

	// BoardService
	@Autowired
	BoardService boardService;
	
	// 게시판 (board_main)
	@GetMapping(value= {"", "/"})
	public String showMainBoard(Model model, HttpServletRequest req, @RequestParam Map<String, String> parameters) {
		// parameter를 Map으로 받을 때 만약 null값이 들어오게 된다면 value가 비어있는게 아닌 String값인 "null"이 들어있는 것이다.
		System.out.println("Controller parameters : " + parameters);
		
		boardService.showBoards(req, parameters);
				
		return "board_main";
	}
	
	// 게시글 쓰기 페이지로 이동
	@GetMapping("/write")
	public String openWriteBoardPage(Model model) {
		
		model.addAttribute("purpose", "write");
		
		return "write/board_write";
	}
	
	// 게시글 쓰기
	@PostMapping("/write/write_board")
	public String writeBoard(Model model, HttpServletRequest req, BoardDTO board,
						List<MultipartFile> upload_files) throws IllegalStateException, IOException {
		
		System.out.println("board : " + board);
		System.out.println("files : " + upload_files);
		System.out.println("files : " + upload_files.toString());
		
		boardService.writeBoard(req, board);
		// board_seq를 글쓰기에서는 못받아와 주니까 만든 다음에 board를 가져와서 seq를 전달해줘야됨 
		if(upload_files.size() > 0) {
			List<BoardDTO> boards = boardService.getAllBoards();
			Integer newBoard_seq = boards.get(0).getBoard_seq();		
			boardService.uploadFiles(req, newBoard_seq, upload_files);
		}
		
		return "redirect:/board";
	}
	
	// 게시글 보기
	@GetMapping("/read")
	public String readBoard(Model model, HttpServletRequest req, @RequestParam Integer board_seq) {
		
		System.out.println("parameters : " + board_seq);
		
		boardService.readBoard(req, board_seq); 
		boardService.showComments(req, board_seq);
		
		return "read/board_read";
	}
	
	// 게시글 삭제
	@PostMapping("/delete")
	public String deleteBoard(Model model, @RequestParam Map<String,String> parameters) {

		System.out.println("delete_board: " + parameters);
		
		String result = boardService.boardPasswordCheck(parameters);
		
		if(result == "pw_checked") {
			boardService.deleteBoard(parameters);
			model.addAttribute("board_seq", parameters.get("board_seq"));
			model.addAttribute("status", "delete_board_success");
			return "redirect:/board";
		} else {
			model.addAttribute("board_seq", parameters.get("board_seq"));
			model.addAttribute("status", "delete_" + result);
			return "redirect:/board/read";
		}
	}
	
	// 게시글 수정 페이지로 이동
	@PostMapping("/edit")
	public String editPasswordCheck(Model model, HttpServletRequest req, @RequestParam Map<String,String> parameters) {
		
		String result = boardService.boardPasswordCheck(parameters);
		
		if(result == "pw_checked") {
			model.addAttribute("purpose", "edit");
			boardService.readBoard(req, Integer.parseInt(parameters.get("board_seq")));
			return "write/board_write";
		} else {
			model.addAttribute("status", "edit_" + result);
			model.addAttribute("board_seq", parameters.get("board_seq"));
			return "redirect:/board/read";
		}
	}
	
	// 게시글 수정
	@PostMapping("/edit/do")
	public String editBoard(Model model, HttpServletRequest req, BoardDTO board, List<FileDTO> files) {
		
		String result = boardService.editBoard(board, files);
		
		model.addAttribute("status", result);
		
		return "redirect:/board";
	}
	
	// 댓글 작성
	@PostMapping("/write_comment")
	public String writeComment(Model model, HttpServletRequest req, @ModelAttribute CommentDTO comment) {
		
		boardService.showComments(req, comment.getBoard_seq());
		String result = boardService.writeComment(comment);
		
		model.addAttribute("board_seq", comment.getBoard_seq());
		model.addAttribute("page", 1);
		model.addAttribute("status", result);
		return "redirect:/board/read";
	}
	
	// 댓글 수정 전 비밀번호 확인
	@PostMapping("/edit_comment_pw_check")
	public String editCommentPasswordCheck(Model model, HttpServletRequest req, @ModelAttribute CommentDTO comment) {
		
		System.out.println("editCommentPwCheck : " + comment);
		boardService.showComments(req, comment.getBoard_seq());
		String comment_pw = boardService.commentPasswordCheck(comment.getComment_seq());
		
		if(comment_pw.equals(comment.getComment_pw())) {
			model.addAttribute("board_seq", comment.getComment_seq());
			model.addAttribute("status", "edit_comment_pw_checked" + comment.getComment_seq());
			return "redirect:/board/edit";
		} else {
			model.addAttribute("board_seq", comment.getComment_seq());
			model.addAttribute("status", "edit_comment_wrong_pw");
			return "redirect:/board/read";
		}
	}
	
	// 댓글 삭제
	@PostMapping("/delete_comment")
	public String deleteComment(Model model, HttpServletRequest req, @ModelAttribute CommentDTO comment) {
		
		System.out.println("deleteCommentPwCheck : " + comment);
		// 1. 댓글의 비밀번호를 가져온다.
		String comment_pw = boardService.commentPasswordCheck(comment.getComment_seq());
		
		// 2. 댓글의 비밀번호와 입력한 비밀번호를 비교한 뒤 결과에 맞게 처리해 준다.
		if(comment_pw.equals(comment.getComment_pw())) {
			// 3-1. 비밀번호가 같다면 댓글을 지운다
			String result = boardService.deleteComment(comment.getComment_seq());
			model.addAttribute("status", result);
		} else {
			// 3-2. 비밀번호가 틀리다면 지우지 않는다.
			model.addAttribute("status", "delete_comment_wrong_pw");
		}
		// 4. 다시 게시글 보기 페이지로 돌아가기 위해 댓글과 게시글 번호를 readBoard()에 파라미터로 전달한다.
		model.addAttribute("board_seq", comment.getComment_seq());
		boardService.showComments(req, comment.getBoard_seq());
		return "redirect:/board/read";
	}
	
	// 댓글 수정
	@PostMapping("/edit_comment")
	public String editComment(Model model, HttpServletRequest req, @ModelAttribute CommentDTO comment) {
		
		System.out.println("editComment : " + comment);
		boardService.showComments(req, comment.getBoard_seq());
		String result = boardService.editComment(comment);
		
		model.addAttribute("board_seq", comment.getBoard_seq());
		model.addAttribute("status", result);
		return "redirect:/board/read";
	}
	
	// 파일 다운로드
	@GetMapping("/file_download/{file_seq:[0-9]{1,6}}")
	public void fileDownload(HttpServletResponse resp, @PathVariable(name="file_seq") Integer file_seq) throws Exception {
		boardService.downloadFile(resp, file_seq);
	}
}
