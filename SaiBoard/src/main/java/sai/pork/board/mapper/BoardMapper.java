package sai.pork.board.mapper;

import java.util.List;
import java.util.Map;

import sai.pork.board.model.BoardDTO;
import sai.pork.board.model.CommentDTO;
import sai.pork.board.model.FileDTO;

public interface BoardMapper {

	List<BoardDTO> getAllBoards();
	
	List<FileDTO> getAllFiles();
	
	List<BoardDTO> getSpecificBoards(Map<String, String> parameters);
	
	List<BoardDTO> getTotalSpecificBoards(Map<String, String> parameters);

	List<BoardDTO> getSearchedBoards(Map<String, String> parameters);

	List<BoardDTO> getTotalSearchedBoards(Map<String, String> parameters);
	
	Integer writeBoard(BoardDTO board);
	
	Integer uploadFiles(FileDTO uploadFile);
	
	Integer deleteFile(String file_name);
	
	BoardDTO getBoard(Integer board_seq);
	
	List<FileDTO> getFiles(Integer board_seq);
	
	FileDTO getFile(Integer file_seq);
	
	void updateView(Integer board_seq);
	
	String boardPasswordCheck(Integer board_seq);
	
	Integer deleteBoard(Integer board_seq);
	
	List<CommentDTO> getComments(Integer board_seq);
	
	Integer writeComment(CommentDTO comment);
	
	String commentPasswordCheck(Integer comment_seq);
	
	Integer editComment(CommentDTO comment);
	
	Integer deleteComment(Integer comment_seq);
	
}
