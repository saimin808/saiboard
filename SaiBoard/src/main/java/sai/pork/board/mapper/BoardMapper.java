package sai.pork.board.mapper;

import java.util.List;
import java.util.Map;

import sai.pork.board.model.BoardDTO;

public interface BoardMapper {

	List<BoardDTO> getAllBoards();
	
	List<BoardDTO> getSpecificBoards(Map<String, String> parameters);
	
	List<BoardDTO> getTotalSpecificBoards(Map<String, String> parameters);

	List<BoardDTO> getSearchedBoards(Map<String, String> parameters);

	List<BoardDTO> getTotalSearchedBoards(Map<String, String> parameters);
	
	BoardDTO getBoard(Integer board_seq);
}
