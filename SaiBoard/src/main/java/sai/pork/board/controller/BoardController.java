package sai.pork.board.controller;

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

import sai.pork.board.model.BoardDTO;
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
	public String readBoard(Model model, HttpServletRequest req, @RequestParam Map<String, String> parameters) {
		
		System.out.println("parameters : " + parameters);
		
		model.addAttribute("board", boardService.readBoard(Integer.parseInt(parameters.get("board_seq")))); 
		boardService.showComments(req, parameters);
		
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
	
	@PostMapping("/edit")
	public String editBoard(Model model, Integer board_seq) {
		
		return "read/board_edit";
	}
	
	@GetMapping("/write")
	public String writeBoard() {
		
		return "write/board_write";
	}
	
	@PostMapping("/write_comment")
	public String writeComment(Model model, HttpServletRequest req, @RequestParam Map<String,String> parameters) {
		
		boardService.showComments(req, parameters);
		String result = boardService.writeComment(parameters);
		
		model.addAttribute("board_seq", parameters.get("board_seq"));
		model.addAttribute("page", 1);
		model.addAttribute("status", result);
		return "redirect:/board/read";
	}
	
	@PostMapping("/edit_comment_pw_check")
	public String editCommentPasswordCheck(Model model, HttpServletRequest req, @RequestParam Map<String,String> parameters) {
		
		System.out.println("editCommentPwCheck : " + parameters);
		boardService.showComments(req, parameters);
		String comment_pw = boardService.commentPasswordCheck(Integer.parseInt(parameters.get("comment_seq")));
		
		if(comment_pw.equals(parameters.get("comment_pw"))) {
			model.addAttribute("board_seq", parameters.get("board_seq"));
			model.addAttribute("status", "edit_comment_pw_checked" + parameters.get("dialog_seq"));
		} else {
			model.addAttribute("board_seq", parameters.get("board_seq"));
			model.addAttribute("status", "edit_comment_wrong_pw");
		}
		return "redirect:/board/read";
	}
	
	@PostMapping("/delete_comment")
	public String deleteComment(Model model, HttpServletRequest req, @RequestParam Map<String,String> parameters) {
		
		System.out.println("deleteCommentPwCheck : " + parameters);
		boardService.showComments(req, parameters);
		String comment_pw = boardService.commentPasswordCheck(Integer.parseInt(parameters.get("comment_seq")));
		
		if(comment_pw.equals(parameters.get("comment_pw"))) {
			String result = boardService.deleteComment(Integer.parseInt(parameters.get("comment_seq")));
			model.addAttribute("board_seq", parameters.get("board_seq"));
			model.addAttribute("status", result);
		} else {
			model.addAttribute("board_seq", parameters.get("board_seq"));
			model.addAttribute("status", "delete_comment_wrong_pw");
		}
		return "redirect:/board/read";
	}
	
	@PostMapping("/edit_comment")
	public String editComment(Model model, HttpServletRequest req, @RequestParam Map<String,String> parameters) {
		
		System.out.println("editComment : " + parameters);
		boardService.showComments(req, parameters);
		String result = boardService.editComment(parameters);
		
		model.addAttribute("board_seq", parameters.get("board_seq"));
		model.addAttribute("status", result);
		return "redirect:/board/read";
	}
}
