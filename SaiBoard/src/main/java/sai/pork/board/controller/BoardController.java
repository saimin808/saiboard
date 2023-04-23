package sai.pork.board.controller;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import sai.pork.board.model.BoardDTO;
import sai.pork.board.model.CommentDTO;
import sai.pork.board.model.FileDTO;
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
	public String readBoard(Model model, HttpServletRequest req, @RequestParam Integer board_seq) {
		
		System.out.println("parameters : " + board_seq);
		
		boardService.readBoard(req, board_seq); 
		boardService.showComments(req, board_seq);
		
		return "read/board_read";
	}
	
	@PostMapping("/delete")
	public String deleteBoard(Model model, @RequestParam Map<String,String> parameters) {

		System.out.println("delete_board: " + parameters);
		
		String result = boardService.deleteBoard(parameters);
		
		if(result == "delete_wrong_pw") {
			model.addAttribute("board_seq", parameters.get("board_seq"));
			model.addAttribute("status", result);
			return "redirect:/board/read";
		} else {
			model.addAttribute("board_seq", parameters.get("board_seq"));
			model.addAttribute("status", result);
			return "redirect:/board";
		}
	}
	
	@PostMapping("/edit")
	public String editBoard(Model model, HttpServletRequest req, Integer board_seq) {
		
		model.addAttribute("purpose", "edit");
		boardService.readBoard(req, board_seq);
		
		return "write/board_write";
	}
	
	@GetMapping("/write")
	public String openWriteBoardPage(Model model) {
		
		model.addAttribute("purpose", "write");
		
		return "write/board_write";
	}
	
	@PostMapping("/write/write_board")
	public String writeBoard(Model model, HttpServletRequest req, BoardDTO board,
						List<MultipartFile> upload_files) throws IllegalStateException, IOException {
		
		System.out.println("board : " + board);
		System.out.println("files : " + upload_files);
		System.out.println("files : " + upload_files.toString());
		
		boardService.writeBoard(req, board);
		// board_seq를 글쓰기에서는 못받아와 주니까 만든 다음에 board를 가져와서 seq를 전달해줘야됨 
		if(upload_files.size() > 0) {
			List<BoardDTO> boards = boardService.getAllBoards();
			Integer newBoard_seq = boards.get(0).getBoard_seq();		
			boardService.uploadFiles(req, newBoard_seq, upload_files);
		}
		
		return "redirect:/board";
	}
	
	@PostMapping("/write_comment")
	public String writeComment(Model model, HttpServletRequest req, @ModelAttribute CommentDTO comment) {
		
		boardService.showComments(req, comment.getBoard_seq());
		String result = boardService.writeComment(comment);
		
		model.addAttribute("board_seq", comment.getBoard_seq());
		model.addAttribute("page", 1);
		model.addAttribute("status", result);
		return "redirect:/board/read";
	}
	
	@PostMapping("/edit_comment_pw_check")
	public String editCommentPasswordCheck(Model model, HttpServletRequest req, @ModelAttribute CommentDTO comment) {
		
		System.out.println("editCommentPwCheck : " + comment);
		boardService.showComments(req, comment.getBoard_seq());
		String comment_pw = boardService.commentPasswordCheck(comment.getComment_seq());
		
		if(comment_pw.equals(comment.getComment_pw())) {
			model.addAttribute("board_seq", comment.getComment_seq());
			model.addAttribute("status", "edit_comment_pw_checked" + comment.getComment_seq());
			return "redirect:/board/edit";
		} else {
			model.addAttribute("board_seq", comment.getComment_seq());
			model.addAttribute("status", "edit_comment_wrong_pw");
			return "redirect:/board/read";
		}
	}
	
	@PostMapping("/delete_comment")
	public String deleteComment(Model model, HttpServletRequest req, @ModelAttribute CommentDTO comment) {
		
		System.out.println("deleteCommentPwCheck : " + comment);
		boardService.showComments(req, comment.getBoard_seq());
		String comment_pw = boardService.commentPasswordCheck(comment.getComment_seq());
		
		if(comment_pw.equals(comment.getComment_pw())) {
			String result = boardService.deleteComment(comment.getComment_seq());
			model.addAttribute("board_seq", comment.getComment_seq());
			model.addAttribute("status", result);
		} else {
			model.addAttribute("board_seq", comment.getComment_seq());
			model.addAttribute("status", "delete_comment_wrong_pw");
		}
		return "redirect:/board/read";
	}
	
	@PostMapping("/edit_comment")
	public String editComment(Model model, HttpServletRequest req, @ModelAttribute CommentDTO comment) {
		
		System.out.println("editComment : " + comment);
		boardService.showComments(req, comment.getBoard_seq());
		String result = boardService.editComment(comment);
		
		model.addAttribute("board_seq", comment.getBoard_seq());
		model.addAttribute("status", result);
		return "redirect:/board/read";
	}
	
	@GetMapping("/file_download/{file_seq:[0-9]{1,6}}")
	public void fileDownload(@PathVariable(name="file_seq") Integer file_seq, HttpServletResponse resp) throws Exception {
		
		// service를 통해 첨부파일 가져오기
		FileDTO file = boardService.getSingleFile(file_seq);
		// 파일명에 한글이 있는경우 처리 (header에 들어갈수 있는 type으로 변환)
		String originalName = new String(file.getFile_name().getBytes("utf-8"), "iso-8859-1");
		
		// 경로에 있는 파일 찾기
		File f = new File(file.getFile_src());
		
		// 파일이 존재하지 않는 경우 
		if(!f.isFile()) {
			throw new FileNotFoundException("해당 첨부파일이 존재하지 않습니다.");
		}
		
		// 다운로드를 위한 헤더 생성
		// application/octet-stream : 8비트 단위의 binary data이다. 파일이기때문에 byte단위로 전송된다.
		resp.setHeader("Content-Type", "application/octet-stream;");
		// Content-Disposition : attachment;filename=\"" + originalName + "\";"
		// 다운로드 시 무조건 파일 다운로드 대화상자가 뜨도록 하는 속성. filename= 은 대화상자의 이름이 된다.
		resp.setHeader("Content-Disposition", "attachment;filename=\"" + originalName + "\";");
		// Content-Transfer-Encoding : binary;
		// 이 헤더는 디코더가 메시지의 body를 원래의 포맷으로 바꾸기 위해 사용하는 디코딩방식이다.
		resp.setHeader("Content-Transfer-Encoding", "binary;");
		resp.setContentLength((int) f.length()); // 진행율
		// Pragma : no-cache;  HTTP 1.0 이전 버전의 클라이언트를 위한 헤더,
        // 캐시가 캐시 복사본을 릴리즈 하기전에 원격 서버로 요청을 날려 유효성 검사를 강제하도록 함
		resp.setHeader("Pragma", "no-cache;");
		// Expires : -1  (만료일: -1이면 다운로드의 제한시간 없음.  요즘엔 크게 중요하지않음)
		resp.setHeader("Expires", "-1;");
		// 저장된 파일을 응답객체의 스트림으로 내보내기, resp의 outputStream에 해당파일을 복사
		FileUtils.copyFile(f, resp.getOutputStream());
		resp.getOutputStream().close();
	}
}
