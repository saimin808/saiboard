package sai.pork.board.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import sai.pork.board.model.BoardDTO;
import sai.pork.board.model.CommentDTO;
import sai.pork.board.service.BoardService;

@Controller
@RequestMapping("/board")
public class BoardController {

	// BoardService
	@Autowired
	BoardService boardService;
	
	@GetMapping(value= {"", "/"})
	public String showBoard(Model model, HttpServletRequest req, @RequestParam Map<String, String> parameters) {
		// parameter를 Map으로 받을 때 만약 null값이 들어오게 된다면 value가 비어있는게 아닌 String값인 "null"이 들어있는 것이다.
		System.out.println("Controller parameters : " + parameters);
		
		boardService.showBoards(req, parameters);
				
		return "board_main";
	}
	
	@GetMapping("/read")
	public String readBoard(Model model, HttpServletRequest req, @RequestParam Integer board_seq) {
		
		System.out.println("parameters : " + board_seq);
		
		model.addAttribute("board", boardService.readBoard(board_seq)); 
		boardService.showComments(req, board_seq);
		
		return "read/board_read";
	}
	
	@PostMapping("/delete")
	public String deleteBoard(Model model, @RequestParam Map<String,String> parameters) {

		System.out.println("delete_board: " + parameters);
		
		String result = boardService.deleteBoard(parameters);
		
		if(result == "delete_wrong_pw") {
			model.addAttribute("board_seq", parameters.get("board_seq"));
			model.addAttribute("status", result);
			return "redirect:/board/read";
		} else {
			model.addAttribute("board_seq", parameters.get("board_seq"));
			model.addAttribute("status", result);
			return "redirect:/board";
		}
	}
	
	@GetMapping("/edit")
	public String editBoard(Model model, @ModelAttribute Integer board_seq) {
		
		model.addAttribute("purpose", "edit");
		model.addAttribute("board", boardService.readBoard(board_seq));
		
		return "write/board_write";
	}
	
	@GetMapping("/write")
	public String openWriteBoardPage(Model model) {
		
		model.addAttribute("purpose", "write");
		
		return "write/board_write";
	}
	
	@PostMapping("/write/write_board")
	public String writeBoard(Model model, HttpServletRequest req, BoardDTO board,
						List<MultipartFile> upload_files) throws IllegalStateException, IOException {
		
		System.out.println("board : " + board);
		System.out.println("files : " + upload_files);
		System.out.println("files : " + upload_files.toString());
		
		boardService.writeBoard(req, board);
		
		// board_seq를 글쓰기에서는 못받아와 주니까 만든 다음에 board를 가져와서 seq를 전달해줘야됨 		
		boardService.uploadFiles(board.getBoard_seq(), upload_files);
		
		return "redirect:/board";
	}
	
	@PostMapping("/write_comment")
	public String writeComment(Model model, HttpServletRequest req, @ModelAttribute CommentDTO comment) {
		
		boardService.showComments(req, comment.getBoard_seq());
		String result = boardService.writeComment(comment);
		
		model.addAttribute("board_seq", comment.getBoard_seq());
		model.addAttribute("page", 1);
		model.addAttribute("status", result);
		return "redirect:/board/read";
	}
	
	@PostMapping("/edit_comment_pw_check")
	public String editCommentPasswordCheck(Model model, HttpServletRequest req, @ModelAttribute CommentDTO comment) {
		
		System.out.println("editCommentPwCheck : " + comment);
		boardService.showComments(req, comment.getBoard_seq());
		String comment_pw = boardService.commentPasswordCheck(comment.getComment_seq());
		
		if(comment_pw.equals(comment.getCommnet_pw())) {
			model.addAttribute("board_seq", comment.getComment_seq());
			model.addAttribute("status", "edit_comment_pw_checked" + comment.getComment_seq());
			return "redirect:/board/edit";
		} else {
			model.addAttribute("board_seq", comment.getComment_seq());
			model.addAttribute("status", "edit_comment_wrong_pw");
			return "redirect:/board/read";
		}
	}
	
	@PostMapping("/delete_comment")
	public String deleteComment(Model model, HttpServletRequest req, @ModelAttribute CommentDTO comment) {
		
		System.out.println("deleteCommentPwCheck : " + comment);
		boardService.showComments(req, comment.getBoard_seq());
		String comment_pw = boardService.commentPasswordCheck(comment.getComment_seq());
		
		if(comment_pw.equals(comment.getCommnet_pw())) {
			String result = boardService.deleteComment(comment.getComment_seq());
			model.addAttribute("board_seq", comment.getComment_seq());
			model.addAttribute("status", result);
		} else {
			model.addAttribute("board_seq", comment.getComment_seq());
			model.addAttribute("status", "delete_comment_wrong_pw");
		}
		return "redirect:/board/read";
	}
	
	@PostMapping("/edit_comment")
	public String editComment(Model model, HttpServletRequest req, @ModelAttribute CommentDTO comment) {
		
		System.out.println("editComment : " + comment);
		boardService.showComments(req, comment.getBoard_seq());
		String result = boardService.editComment(comment);
		
		model.addAttribute("board_seq", comment.getBoard_seq());
		model.addAttribute("status", result);
		return "redirect:/board/read";
	}
}
