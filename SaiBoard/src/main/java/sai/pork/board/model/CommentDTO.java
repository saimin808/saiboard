package sai.pork.board.model;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;

import lombok.Data;

@Data
public class CommentDTO {

	Integer comment_seq;
	Integer board_seq;
	String comment_id;
	String comment_pw;
	String comment_content;
	Date comment_date;
	
	private static SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
	private static SimpleDateFormat hourFormat = new SimpleDateFormat("HH");
	private static SimpleDateFormat minFormat = new SimpleDateFormat("mm");
	
	public String getCreationDateTime() {		
		LocalDate creationDate = LocalDate.ofInstant(comment_date.toInstant(), ZoneId.systemDefault());
		LocalDate today = LocalDate.ofInstant(new Date().toInstant(), ZoneId.systemDefault());
		
		Calendar calendarToday = Calendar.getInstance();
		Integer hour_of_today = calendarToday.get(Calendar.HOUR_OF_DAY);
		Integer min_of_today = calendarToday.get(Calendar.MINUTE);
		
		Integer hour_of_creationDate = Integer.parseInt(hourFormat.format(comment_date));
		Integer min_of_creationDate = Integer.parseInt(minFormat.format(comment_date));
		
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
			return dateFormat.format(comment_date);
		}
	}
}
