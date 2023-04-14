package sai.pork.board.service;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import sai.pork.board.model.BoardDTO;

public interface BoardService {

	void showBoards(HttpServletRequest req, Map<String, String> parameters);
	
//	void showSpecificBoards(HttpServletRequest req, Map<String, String> parameters);
//	
//	void showSearchedBoards(HttpServletRequest req, Map<String, String> parameters);
	
}
