package sai.pork.board.controller;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
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
	public String readBoard(Model model, Integer board_seq) {
		
		model.addAttribute("board", boardService.readBoard(board_seq)); 
		
		return "read/board_read";
	}
	
	@PostMapping("/delete")
	public String deleteBoard(Model model, BoardDTO board) {
		
		String result = boardService.deleteBoard(board);
		
		if(result == "delete_wrong_pw") {
			return "redirect:/board/read?board_seq=" + board.getBoard_seq() + "status=" + result;
		} else {
			return "redirect:/board?status" + result;
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
}
