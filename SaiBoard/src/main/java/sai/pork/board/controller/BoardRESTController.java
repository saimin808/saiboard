package sai.pork.board.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import sai.pork.board.model.PaginationVO;

@RestController
public class BoardRESTController {
	
	@PostMapping("/board/page")
	public PaginationVO changeMainPage(@RequestBody Map <String,Integer> parameters) {
		
		PaginationVO pagination = new PaginationVO(parameters.get("currentPage"), parameters.get("totalBoardSize"));
		
		return pagination;
	}
}
