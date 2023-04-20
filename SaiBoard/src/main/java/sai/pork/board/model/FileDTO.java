package sai.pork.board.model;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class FileDTO {
	
	Integer file_seq;
	Integer board_seq;
	String file_name;
	String file_src;
}
