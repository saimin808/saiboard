package sai.pork.board.service;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.multipart.MultipartFile;

import sai.pork.board.model.BoardDTO;
import sai.pork.board.model.CommentDTO;
import sai.pork.board.model.FileDTO;
import sai.pork.board.model.PaginationVO;

public interface BoardService {

	List<BoardDTO> getAllBoards();
	
	List<BoardDTO> showBoards(Map<String, String> parameters);
	
	List<String> getBoardsCreationDateTimeList(List<BoardDTO> boards) throws ParseException;
	
	List<String> getCommentsCreationDateTimeList(List<CommentDTO> comments) throws ParseException;
	
	PaginationVO getPaginationVO(Integer currentPage, Integer sizePerPage, Integer totalSize);
	
	List<Boolean> getBoardsWithFiles(List<BoardDTO> boards);
	
	Boolean writeBoard(BoardDTO board);
	
	Boolean uploadFiles(Integer newBoard_seq, List<MultipartFile> files) throws IllegalStateException, IOException;
	
	void downloadFile(HttpServletResponse resp, Integer file_seq) throws Exception;
	
	void readBoard(HttpServletRequest req, Integer board_seq) throws ParseException;
	
	String boardPasswordCheck(Map<String, String> parameters);
	
	String editBoard(BoardDTO board, List<FileDTO> files);
	
	Boolean deleteBoard(Map<String, String> parameters);
	
	List<CommentDTO> showComments(Integer board_seq);
	
	Boolean commentPasswordCheck(String input_pw, Integer comment_seq);
	
	String writeComment(CommentDTO comment);
	
	String editComment(CommentDTO comment);
	
	String deleteComment(Integer comment_seq);
}
