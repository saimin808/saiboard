package sai.pork.board.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.multipart.MultipartFile;

import sai.pork.board.model.BoardDTO;
import sai.pork.board.model.CommentDTO;

public interface BoardService {

	void showBoards(HttpServletRequest req, Map<String, String> parameters);
	
	void writeBoard(HttpServletRequest req, BoardDTO board);
	
	String uploadFiles(Integer board_seq, List<MultipartFile> files) throws IllegalStateException, IOException;
	
	BoardDTO readBoard(Integer board_seq);
	
	String deleteBoard(Map<String, String> parameters);
	
	void showComments(HttpServletRequest req, Integer board_seq);
	
	String commentPasswordCheck(Integer comment_seq);
	
	String writeComment(CommentDTO comment);
	
	String editComment(CommentDTO comment);
	
	String deleteComment(Integer comment_seq);
}
