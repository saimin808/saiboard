package sai.pork.board.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import sai.pork.board.model.BoardDTO;

public interface BoardService {

	void showBoards(HttpServletRequest req, Map<String, String> parameters);
	
	BoardDTO readBoard(Integer board_seq);
	
	String deleteBoard(Map<String, String> parameters);
	
	void showComments(HttpServletRequest req, Map<String, String> parameters);
	
	String commentPasswordCheck(Integer comment_seq);
	
	String writeComment(Map<String, String> parameters);
	
	String editComment(Map<String, String> parameters);
	
	String deleteComment(Integer comment_seq);
}
