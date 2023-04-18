package sai.pork.board.service;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import sai.pork.board.model.BoardDTO;

public interface BoardService {

	void showBoards(HttpServletRequest req, Map<String, String> parameters);
	
	BoardDTO readBoard(Integer board_seq);
	
	String deleteBoard(BoardDTO board);
	
	void showComments(HttpServletRequest req, Map<String, String> parameters);
	
	String writeComment(Map<String, String> parameters);
}
