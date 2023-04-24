package sai.pork.board.model;

import java.util.Date;

import lombok.Data;

@Data
public class BoardDTO {
	
	private Integer board_seq;
	private String board_category;
	private String board_writer;
	private String board_title;
	private String board_content;
	private String board_pw;
	private String board_view;
	private Date board_write_date;
	
}
