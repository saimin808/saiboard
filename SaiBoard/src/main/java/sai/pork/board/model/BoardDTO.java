package sai.pork.board.model;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Calendar;
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
	
	private static SimpleDateFormat dayFormat = new SimpleDateFormat("yyyy-MM-dd");
	private static SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm");
	
	private static SimpleDateFormat hourFormat = new SimpleDateFormat("HH");
	private static SimpleDateFormat minFormat = new SimpleDateFormat("mm");
	
	public String getCreationDateTime() {		
		LocalDate creationDate = LocalDate.ofInstant(board_write_date.toInstant(), ZoneId.systemDefault());
		LocalDate today = LocalDate.ofInstant(new Date().toInstant(), ZoneId.systemDefault());
		
		Calendar calendarToday = Calendar.getInstance();
		Integer hour_of_today = calendarToday.get(Calendar.HOUR_OF_DAY);
		Integer min_of_today = calendarToday.get(Calendar.MINUTE);
		
		Integer hour_of_creationDate = Integer.parseInt(hourFormat.format(board_write_date));
		Integer min_of_creationDate = Integer.parseInt(minFormat.format(board_write_date));
		
		if(creationDate.isEqual(today)) {
			if(hour_of_today == hour_of_creationDate) {
				if(min_of_today == min_of_creationDate) {
					return "방금 전";
				} else {
					return String.valueOf(min_of_today - min_of_creationDate) + "분 전";
				}
			} else {
				return String.valueOf(hour_of_today - hour_of_creationDate) + "시간 전";
			}
		} else {
			return dayFormat.format(board_write_date);
		}
	}
}
