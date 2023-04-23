package sai.pork.board.service.impl;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import sai.pork.board.mapper.BoardMapper;
import sai.pork.board.model.BoardDTO;
import sai.pork.board.model.CommentDTO;
import sai.pork.board.model.FileDTO;
import sai.pork.board.service.BoardService;

@Service
public class BoardServiceImpl implements BoardService {

	@Autowired
	BoardMapper boardMapper;
	
	@Override
	public List<BoardDTO> getAllBoards() {
		return boardMapper.getAllBoards();
	}
	
	@Override
	public void showBoards(HttpServletRequest req, Map<String, String> parameters) {
		// 선택한 페이지 숫자를 불러옴
		String pageStr = req.getParameter("page");

		System.out.println("getAllBoard");
		System.out.println(parameters);
		List<BoardDTO> boards = boardMapper.getAllBoards();
		List<FileDTO> files = boardMapper.getAllFiles();
		
		// page : 총 게시글 수
		int page;
		
		if(pageStr == null) {
			page = 1;
		} else {
			page = Integer.parseInt(pageStr);
		}
		
		// 들어온 파라미터 중 searchKeyword값(검색어)이 없으면 getSpecificBoards(검색어 없이 board 조회) 메서드로
		// searchKeyword값이 있으면 getSearchedBoards(검색한 제목의 board만 조회) 메서드로 파라미터를 전달한다.
		if (parameters.size() > 0 && parameters.get("category") != null && parameters.get("orderBy") != null
				&& parameters.get("searchCategory") != null) {
			String category = parameters.get("category");
			String searchKeyword = parameters.get("searchKeyword");
			if (searchKeyword.equals("null") || searchKeyword.equals("")) {
				System.out.println("getSpecificBoards");
				if (category.equals("news")) {
					parameters.remove("category");
					parameters.put("category", "공지");
					boards = boardMapper.getSpecificBoards(parameters);
				} else if (category.equals("free")) {
					parameters.remove("category");
					parameters.put("category", "자유");
					boards = boardMapper.getSpecificBoards(parameters);
				} else if (category.equals("total")) {
					// 들어온 파라미터 중 category(카테고리)값이 total(전체)이면 Query문에서 board_category 조건을 빼야하기 때문에
					// 그 조건을 제거한 Mapper로 연결해 준다.
					boards = boardMapper.getTotalSpecificBoards(parameters);
				} else {
					boards = boardMapper.getAllBoards();
				}
			} else if (!searchKeyword.equals("null") || searchKeyword.equals("")) {
				System.out.println("searchKeyword : " + searchKeyword);
				System.out.println("getSearchedBoards");
				if (category.equals("news")) {
					parameters.remove("category");
					parameters.put("category", "공지");
					boards = boardMapper.getSearchedBoards(parameters);
				} else if (category.equals("free")) {
					parameters.remove("category");
					parameters.put("category", "자유");
					boards = boardMapper.getSearchedBoards(parameters);
				} else if (category.equals("total")) {
					// 들어온 파라미터 중 category(카테고리)값이 total(전체)이면 Query문에서 board_category 조건을 빼야하기 때문에
					// 그 조건을 제거한 Mapper로 연결해 준다.
					boards = boardMapper.getTotalSearchedBoards(parameters);
				} else {
					boards = boardMapper.getAllBoards();
				}
			}
		}
		
		// pageSize : 한 페이지에 한번에 출력할 게시글 갯수 
		int pageSize = 10;
		// boardSize : 전체 게시글 사이즈
		int boardSize = boards.size();
		// startIndex : 출력할 10개의 게시글 중에서 첫 게시글의 순서
		int startIndex = (page - 1) * pageSize;
		// endIndex : 출력할 10개의 게시글 중에서 마지막 게시글의 순서
		int endIndex = page * pageSize;
		// 마지막 페이지에 표시되는 게시글들은 딱 10개로 떨어지지 않을 수도 있으니
		// 전체 게시글 사이즈(boardSize)와 page * pageSize(endIndex)를 비교해서
		// endIndex가 더 크면 boardSize로 boardSize가 더 크거나 같으면 endIndex 그대로 대입해준다. 
		endIndex = endIndex > boardSize ? boardSize : endIndex;
		
		System.out.printf("현재 페이지는 %d페이지고, 시작 인덱스는 %d, 마지막 인덱스는 %d 입니다.\n",
				page, startIndex, endIndex);
		
		// 전체 페이지 사이즈
		int maxPage = boardSize % pageSize == 0 ? boardSize / pageSize : boardSize / pageSize + 1;
		
		// paginationSize : 한번에 출력할 페이지네이션 사이즈
		int paginationSize = 5;
		// paginationStart : 전체 페이지네이션 시작 숫자
		int paginationStart = (page / paginationSize) * paginationSize + 1;
		
		paginationStart = page % paginationSize == 0 ? page - 4 : paginationStart;
		
		// paginationEnd : 전체 페이지네이션 마지막 숫자
		int paginationEnd = (page / paginationSize + 1) * paginationSize;
		if(page % paginationSize == 0) {
			paginationEnd = paginationEnd - paginationSize;
		} else {
			paginationEnd = paginationEnd > maxPage ? maxPage : paginationEnd;
		}
		
		int nextPage = paginationEnd + 1;
		int previousPage = paginationStart - 1;
		
		System.out.printf("현재 페이지는 %d페이지고, 페이지네이션 시작은 %d, 마지막 숫자는 %d 입니다. \n",
				page, paginationStart, paginationEnd);

		req.setAttribute("page", page);
		req.setAttribute("boards", boards.subList(startIndex, endIndex));
		req.setAttribute("files", files);
		req.setAttribute("paginationStart", paginationStart);
		req.setAttribute("paginationEnd", paginationEnd);
		req.setAttribute("nextPage", nextPage);
		req.setAttribute("previousPage", previousPage);
		req.setAttribute("boardSize", boardSize);
	}
	
	@Override
	public void writeBoard(HttpServletRequest req, BoardDTO board) {
				
		String pageStr = req.getParameter("page");
		
		// 비밀번호를 암호화할 BCryptPasswordEncoder 객체 생성
		BCryptPasswordEncoder encrypt = new BCryptPasswordEncoder();
		
		// 비밀번호를 암호화한 후 받아온 파라미터 board에 대입해주고
		String encrypted_pass = encrypt.encode(board.getBoard_pw());
		System.out.println("encrypted_pass : " + encrypted_pass);
		board.setBoard_pw(encrypted_pass);
		
		// DB에 저장
		Integer row = boardMapper.writeBoard(board);
		
		if(row > 0) {
			req.setAttribute("status", "board_write_success");
		} else {
			req.setAttribute("status", "board_write_failed");			
		}
		
		List<BoardDTO> boards = boardMapper.getAllBoards();
		
		// page : 총 게시글 수
		int page;
		
		if(pageStr == null) {
			page = 1;
		} else {
			page = Integer.parseInt(pageStr);
		}
		
		// pageSize : 한 페이지에 한번에 출력할 게시글 갯수 
		int pageSize = 10;
		// boardSize : 전체 게시글 사이즈
		int boardSize = boards.size();
		// startIndex : 출력할 10개의 게시글 중에서 첫 게시글의 순서
		int startIndex = (page - 1) * pageSize;
		// endIndex : 출력할 10개의 게시글 중에서 마지막 게시글의 순서
		int endIndex = page * pageSize;
		// 마지막 페이지에 표시되는 게시글들은 딱 10개로 떨어지지 않을 수도 있으니
		// 전체 게시글 사이즈(boardSize)와 page * pageSize(endIndex)를 비교해서
		// endIndex가 더 크면 boardSize로 boardSize가 더 크거나 같으면 endIndex 그대로 대입해준다.
		endIndex = endIndex > boardSize ? boardSize : endIndex;

		System.out.printf("현재 페이지는 %d페이지고, 시작 인덱스는 %d, 마지막 인덱스는 %d 입니다.\n", page, startIndex, endIndex);

		// 전체 페이지 사이즈
		int maxPage = boardSize % pageSize == 0 ? boardSize / pageSize : boardSize / pageSize + 1;

		// paginationSize : 한번에 출력할 페이지네이션 사이즈
		int paginationSize = 5;
		// paginationStart : 전체 페이지네이션 시작 숫자
		int paginationStart = (page / paginationSize) * paginationSize + 1;

		paginationStart = page % paginationSize == 0 ? page - 4 : paginationStart;

		// paginationEnd : 전체 페이지네이션 마지막 숫자
		int paginationEnd = (page / paginationSize + 1) * paginationSize;
		if (page % paginationSize == 0) {
			paginationEnd = paginationEnd - paginationSize;
		} else {
			paginationEnd = paginationEnd > maxPage ? maxPage : paginationEnd;
		}

		int nextPage = paginationEnd + 1;
		int previousPage = paginationStart - 1;

		System.out.printf("현재 페이지는 %d페이지고, 페이지네이션 시작은 %d, 마지막 숫자는 %d 입니다. \n", page, paginationStart, paginationEnd);
		
		req.setAttribute("page", page);
		req.setAttribute("boards", boards.subList(startIndex, endIndex));
		req.setAttribute("paginationStart", paginationStart);
		req.setAttribute("paginationEnd", paginationEnd);
		req.setAttribute("nextPage", nextPage);
		req.setAttribute("previousPage", previousPage);
		req.setAttribute("boardSize", boardSize);
	}
	
	@Override
	public String uploadFiles(HttpServletRequest req, Integer board_seq, List<MultipartFile> files) throws IllegalStateException, IOException {

		System.out.println("uploadFiles : " + files);
		
		List<FileDTO> uploadFiles = new ArrayList<FileDTO>();
		
		// 파일 저장 경로
		// 나중에 밑의 경로로 바꿔야된다.
		// "C:/Users/east/git/saiboard/SaiBoard/src/main/webapp/resources/upload_files";		
//		String uploadPath = req.getSession().getServletContext().getRealPath("/resources/upload_files");
		String uploadPath = "C:/Users/east/git/saiboard/SaiBoard/src/main/webapp/resources/upload_files";
		
		Path directoryPath = Paths.get(uploadPath + File.separator + board_seq);
		// 새롭게 업로드한 파일을 저장할 board_seq 이름으로 새로운 폴더 생성
		Files.createDirectory(directoryPath);
		System.out.println(directoryPath + " 디렉토리가 생성되었습니다.");
		
		// 파일 이름 저장할 배열
		String[] fileName = new String[3];

		for (int i = 0; i < files.size(); i++) {
			// getOriginalFilename()으로 원래 파일 이름 받아오기 
			fileName[i] = files.get(i).getOriginalFilename();
			// 파일을 uploadPath에 fileName[i]으로 저장
			File saveFile = new File(directoryPath.toString(), fileName[i]);
			
			if (i == 0 && !files.get(i).isEmpty()) {
				FileDTO file1 = new FileDTO();
				files.get(i).transferTo(saveFile);
				file1.setBoard_seq(board_seq);
				file1.setFile_name(files.get(i).getOriginalFilename());
				file1.setFile_src(directoryPath.toString() + File.separator + fileName[i]);
				uploadFiles.add(file1);

			} else if (i == 1 && !files.get(i).isEmpty()) {
				FileDTO file2 = new FileDTO();
				files.get(i).transferTo(saveFile);
				file2.setBoard_seq(board_seq);
				file2.setFile_name(files.get(i).getOriginalFilename());
				file2.setFile_src(directoryPath.toString() + File.separator + fileName[i]);
				uploadFiles.add(file2);

			} else if (i == 2 && !files.get(i).isEmpty()) {
				FileDTO file3 = new FileDTO();
				files.get(i).transferTo(saveFile);
				file3.setBoard_seq(board_seq);
				file3.setFile_name(files.get(i).getOriginalFilename());
				file3.setFile_src(directoryPath.toString() + File.separator + fileName[i]);
				uploadFiles.add(file3);
			}
		}
		
		Integer row = 0;
		for(int i = 0; i < uploadFiles.size(); i++) {
			row += boardMapper.uploadFiles(uploadFiles.get(i));
		}
			
		if(row >= 3) {			
			return "file_uploaded";
		} else {
			return "upload_failed";
		}
	}
	
	@Override
	public void downloadFile(HttpServletResponse resp, Integer file_seq) throws Exception  {
		
		// service를 통해 첨부파일 가져오기
		FileDTO file = boardMapper.getFile(file_seq);
		// 파일명에 한글이 있는경우 처리 (header에 들어갈수 있는 type으로 변환)
		String originalName = new String(file.getFile_name().getBytes("utf-8"), "iso-8859-1");

		// 경로에 있는 파일 찾기
		File f = new File(file.getFile_src());

		// 파일이 존재하지 않는 경우
		if (!f.isFile()) {
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
		// Pragma : no-cache; HTTP 1.0 이전 버전의 클라이언트를 위한 헤더,
		// 캐시가 캐시 복사본을 릴리즈 하기전에 원격 서버로 요청을 날려 유효성 검사를 강제하도록 함
		resp.setHeader("Pragma", "no-cache;");
		// Expires : -1 (만료일: -1이면 다운로드의 제한시간 없음. 요즘엔 크게 중요하지않음)
		resp.setHeader("Expires", "-1;");
		// 저장된 파일을 응답객체의 스트림으로 내보내기, resp의 outputStream에 해당파일을 복사
		FileUtils.copyFile(f, resp.getOutputStream());
		resp.getOutputStream().close();
	}
	
	@Override
	public void readBoard(HttpServletRequest req, Integer board_seq) {
		
		// 1. 조회수 +1
		boardMapper.updateView(board_seq);
		// 2. board_seq로 게시판 가져오기
		req.setAttribute("board", boardMapper.getBoard(board_seq));
		// 3. board_seq로 업로드한 파일 가져오기
		req.setAttribute("files", boardMapper.getFiles(board_seq));
	}
	
	@Override
	public String boardPasswordCheck(Map<String, String> parameters) {
		
		// 비밀번호를 decode해서 비교할 BCryptPasswordEncoder 객체 생성
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
				
		// DB에 기록했던 암호화된 비밀번호를 불러와주고
		String password = boardMapper.boardPasswordCheck(Integer.parseInt(parameters.get("board_seq")));
				
		// 암호화된 비밀번호를 복호화하여 입력받은 비밀번호와 비교하여 같은지 확인한다. 
		if(encoder.matches(parameters.get("input_pw"), password)) {
			return "pw_checked";
		} else {
			return "wrong_pw";
		}
	}
	
	@Override
	public String editBoard(BoardDTO board, List<FileDTO> files) {
		
		Integer board_result = boardMapper.editBoard(board);
		Integer file_result = 0;
		for(int i = 0; i < files.size(); i++) {
			file_result += boardMapper.editFile(files.get(i));
		}
		
		System.out.println("board_result : " + board_result);
		System.out.println("file_result : " + file_result);
		
		if(board_result > 0 && file_result >= files.size()) {			
			return "edit_board_success";
		} else {
			return "edit_board_failed";
		}
		
	}
	
	@Override
	public String deleteBoard(Map<String, String> parameters) {

		// 1. 우선 업로드한 파일 먼저 지운다.
		// - 지우려는 게시판에 업로드 했던 파일들 불러오기
		List<FileDTO> files = boardMapper.getFiles(Integer.parseInt(parameters.get("board_seq")));

		// 업로드한 파일이 저장되어있는 폴더 지움 유무
		boolean dir_result = false;
		// 업로드한 파일을 지우기 위해 만들 File 객체
		File uploaded_file = null;
		// 파일을 제거할 때마다 1씩 증가시킬 cnt
		Integer file_delete_cnt = 0;
		for (int i = 0; i < files.size(); i++) {
			// 2. 파일 먼저 하나씩 지운다
			// - DB에 저장했던 파일 경로를 가지고 하나의 File객체로 만들어준다.
			uploaded_file = new File(files.get(i).getFile_src());

			// file.delete() - 파일을 제거하는 메소드 (boolean 타입 반환)
			boolean file_result = uploaded_file.delete();
			// - 하나씩 지울 때마다 cnt를 1씩 증가 시킨다.
			if (file_result) {
				file_delete_cnt += 1;
			}
		}

		System.out.println("file_delete_cnt : " + file_delete_cnt);
		// 3. 업로드 했던 파일을 다 지우면 저장했던 폴더도 지운다.
		if (file_delete_cnt >= files.size() && files.size() > 0) {
			File dir = new File(uploaded_file.getParent());

			System.out.println("isDirectory : " + dir.isDirectory());
			if (dir.isDirectory()) {
				dir_result = dir.delete();
			}
		}

		System.out.println("dir_result : " + dir_result);

		Integer row = 0;
		// 4. 폴더도 지우게 되면 마지막으로 게시판을 지운다.
		row = boardMapper.deleteBoard(Integer.parseInt(parameters.get("board_seq")));

		if (row > 0) {
			return "delete_success";
		} else {
			return "delete_fail";
		}
	}
	
	@Override
	public void showComments(HttpServletRequest req, Integer board_seq) {
		
		// 선택한 페이지 숫자를 불러옴
		String pageStr = req.getParameter("page");
		
		// page : 총 댓글 수
		int page;

		if (pageStr == null) {
			page = 1;
		} else {
			page = Integer.parseInt(pageStr);
		}
		
		List<CommentDTO> comments = boardMapper.getComments(board_seq);
		
		// pageSize : 한 페이지에 한번에 출력할 댓글 갯수 
		int pageSize = 5;
		// boardSize : 전체 댓글 사이즈
		int	commentSize = comments.size();
		// startIndex : 출력할 5개의 댓글 중에서 첫 댓글의 순서
		int startIndex = (page - 1) * pageSize;
		// endIndex : 출력할 5개의 댓글 중에서 마지막 댓글의 순서
		int endIndex = page * pageSize;
		// 마지막 페이지에 표시되는 댓글들은 딱 5개로 떨어지지 않을 수도 있으니
		// 전체 댓글 사이즈(boardSize)와 page * pageSize(endIndex)를 비교해서
		// endIndex가 더 크면 boardSize로 boardSize가 더 크거나 같으면 endIndex 그대로 대입해준다.
		endIndex = endIndex > commentSize ? commentSize : endIndex;

		System.out.printf("현재 페이지는 %d페이지고, 시작 인덱스는 %d, 마지막 인덱스는 %d 입니다.\n", page, startIndex, endIndex);

		// 전체 페이지 사이즈
		int maxPage = commentSize % pageSize == 0 ? commentSize / pageSize : commentSize / pageSize + 1;

		// paginationSize : 한번에 출력할 페이지네이션 사이즈
		int paginationSize = 5;
		// paginationStart : 전체 페이지네이션 시작 숫자
		int paginationStart = (page / paginationSize) * paginationSize + 1;

		paginationStart = page % paginationSize == 0 ? page - 4 : paginationStart;

		// paginationEnd : 전체 페이지네이션 마지막 숫자
		int paginationEnd = (page / paginationSize + 1) * paginationSize;
		if (page % paginationSize == 0) {
			paginationEnd = paginationEnd - paginationSize;
		} else {
			paginationEnd = paginationEnd > maxPage ? maxPage : paginationEnd;
		}

		int nextPage = paginationEnd + 1;
		int previousPage = paginationStart - 1;

		System.out.printf("현재 페이지는 %d페이지고, 페이지네이션 시작은 %d, 마지막 숫자는 %d 입니다. \n", page, paginationStart, paginationEnd);
		
		req.setAttribute("page", page);
		req.setAttribute("comments", comments.subList(startIndex, endIndex));
		req.setAttribute("paginationStart", paginationStart);
		req.setAttribute("paginationEnd", paginationEnd);
		req.setAttribute("nextPage", nextPage);
		req.setAttribute("previousPage", previousPage);
		req.setAttribute("commentSize", commentSize);
	}
	
	@Override
	public String commentPasswordCheck(Integer comment_seq) {
		
		return	boardMapper.commentPasswordCheck(comment_seq);
	}
	
	@Override
	public String writeComment(CommentDTO comment) {
		
		Integer result = boardMapper.writeComment(comment);
		
		if(result > 0) {
			return "write_comment_success";
		} else {
			return "write_comment_failed";
		}
	}
	
	@Override
	public String editComment(CommentDTO comment) {
		
		Integer result = boardMapper.editComment(comment);
		
		if(result > 0) {
			return "edit_comment_success";
		} else {
			return "edit_comment_failed";
		}
	}
	
	@Override
	public String deleteComment(Integer comment_seq) {
		
		Integer result = boardMapper.deleteComment(comment_seq);
		
		if(result > 0) {
			return "delete_comment_success";
		} else {
			return "delete_comment_failed";
		}
	}
}
