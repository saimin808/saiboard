package sai.pork.board.mapper;

import java.util.List;
import java.util.Map;

import sai.pork.board.model.BoardDTO;
import sai.pork.board.model.CommentDTO;

public interface BoardMapper {

	List<BoardDTO> getAllBoards();
	
	List<BoardDTO> getSpecificBoards(Map<String, String> parameters);
	
	List<BoardDTO> getTotalSpecificBoards(Map<String, String> parameters);

	List<BoardDTO> getSearchedBoards(Map<String, String> parameters);

	List<BoardDTO> getTotalSearchedBoards(Map<String, String> parameters);
	
	BoardDTO getBoard(Integer board_seq);
	
	List<CommentDTO> getComments(Integer board_seq);
	
	Integer writeComment(Map<String, String> parameters);
	
	void updateView(Integer board_seq);
	
	String passwordCheck(Integer board_seq);
	
	Integer deleteBoard(Integer board_seq);
	
}
