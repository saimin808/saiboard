package lv0;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class LV1_신고결과받기 {

	public int[] solution(String[] id_list, String[] report, int k) {
		
		// Stream은 Java 8부터 추가된 Collection의 저장 요소를 하나씩 참조해서 람다식으로 처리할 수 있도록 해주는 반복자이다.
		// Stream을 온전히 이해하진 못함...
		// java.util.stream.distinct() : 중복 제거
		// java.util.stream.collect(자료형) : stream의 데이터를 변형 등 처리를 하고 원하는 자료형으로 변환
		// 참고 : https://codechacha.com/ko/java8-stream-collect/
		// Collectors - Stream을 일반적인 List, Set 드으로 변경시키는 Stream 메서드
		// Collectors.toList() - List로 변환, Collectors.toSet() - Set으로 변환
		// 1. 신고 목록을 stream형태로 변환하여 distinct()로 중복값 제거, collect()로 리스트 형태로 변환시켜준다.
		List<String> list = Arrays.stream(report).distinct().collect(Collectors.toList());
		// 신고 당한 사람별 신고 횟수 기록하는 HashMap
		HashMap<String, Integer> count = new HashMap<>();
		
		// 2. 신고 목록을 split()으로 공백을 기준으로 분리시켜서
		//  두번째 값인 신고 당한 사람을 Key로 설정하고 Value로는 몇번 신고를 당했는지 기록한다.
		for(String s : list) {
			String target = s.split(" ")[1];
			// .getOrDefault(Object key, Integer defaultValue) : 찾는 키가 존재한다면 찾는 키의 값을 반환하고 없다면 기본 값을 반환하는 메서드
			count.put(target, count.getOrDefault(target, 0) + 1);
		}
		System.out.println(list);
		System.out.println(count);
		// stream.map() : 요소들을 특정조건에 해당하는 값으로 변환해 준다
		// 요소들을 대,소문자 변형 등 의 작업을 하고 싶을 때 사용 가능 하다.
		return Arrays.stream(id_list).map(_user -> {
			final String user = _user;
			// stream.filter() : 스트림 요소를 순회하면서 특정 조건을 만족하는 요소로 구성된 새로운 스트림을 반환한다.
			List<String> reportList = list.stream().filter(s -> s.startsWith(user + " ")).collect(Collectors.toList());
			System.out.println("reportList : " + reportList);
			return reportList.stream().filter(s -> count.getOrDefault(s.split(" ")[1], 0) >= k).count();
		}).mapToInt(Long::intValue).toArray();
		
//		List<String> ones_report = new ArrayList<String>();
//		List<String> ones_report2 = new ArrayList<String>();
//		List<String> reportees = new ArrayList<String>();
//		Set<String> alert_set = new HashSet<String>();
//		String reporter = null;
//		int[] answer = new int[id_list.length];
//		
//		// 1. id_list 배열에 있는 id와 report 배열에 있는 신고 목록의 신고자를 하나씩 비교하여
//		// 같으면 ones_report(특정 신고자의 신고 목록) List에 추가해준다.
//		for(int i = 0; i < id_list.length; i++) {
//			for(int j = 0; j < report.length; j++) {
//				if(id_list[i].equals(report[j].substring(0, id_list[i].length()))) {
//						
//						reporter = id_list[i];
//						System.out.println("reporter : " + reporter);
//						ones_report.add(report[j]);
//						answer[i] = 0;
//				}
//			}
//			
//			System.out.println("ones_report - " + reporter + " : " + ones_report);
//			
//			if(ones_report.size() > 0) {
//				// 몇번 신고를 당했는지 알아내기 위한 단계
//				// 2. 그 신고자의 신고 목록이 존재한다면 substring을 통해 
//				//   신고 목록에서 첫 번째 신고 당한 사람(reportee String)을 추출하고
//				String reportee = ones_report.get(0).substring(reporter.length()+1);
//				// 먼저 신고 당한 사람 목록(reportees List)
//				reportees.add(reportee);
//				//  나머지 신고 목록에 있는 신고 당한 사람들과 비교하여
//				System.out.println("reportee : " + reportee);
//				for(int j = 0; j < ones_report.size(); j++) {
//					//  다르면 신고 당한 사람 목록(reportees) List에 넣는다.
//					if(!reportee.equals(ones_report.get(j).substring(reporter.length()+1))) {
//						reportees.add(ones_report.get(j).substring(reporter.length()+1));
//					}
//				}
//				System.out.println("reportees : " + reportees);
//			}
//			// 3. 다음 신고자도 비교하기 위해 ones_report(한명의 신고자의 신고 목록)을 비워준다.
//			ones_report.clear();
//		}
//		
//		// 4. 비교가 끝나고 신고 당한 사람 목록(reportees) List에 중복된 신고 당한 사람을 골라내기 위해
//		//   첫번째 와 나머지를 비교한다.
//		// 같으면 cnt +1 해준다.
//		Integer cnt = 0;
//		for(int i = 0; i < reportees.size(); i++) {
//			for(int j = 0; j < reportees.size(); j++) {
//				if(reportees.get(i).equals(reportees.get(j))) {
//					cnt += 1;
//				}
//			}
//			System.out.println(cnt);
//			// 5. cnt가 k 이상이면 (reportees에 첫번째 값과 중복되는 값이 여러개면)
//			//   HashSet값에 담아준다.
//			if(cnt >= k) {
//				alert_set.add(reportees.get(i));
//			}
//			cnt = 0;
//		}
//		System.out.println(alert_set);
		
//		return answer;
	}
	
	public static void main(String[] args) {
		LV1_신고결과받기 test = new LV1_신고결과받기();
		String[] id_list = {"muzi","frodo","apeach","neo"};
		String[] id_list2 = {"ryan","con"};		
		String[] report = {"muzi frodo", "apeach frodo", "frodo neo", "muzi neo", "apeach muzi"};
		String[] report2 = {"ryan con","ryan con", "ryan con", "ryan con"};
		
		int[] answers = test.solution(id_list, report, 2);
//		int[] answers = test.solution(id_list2, report2, 3);
		
		String answer = "";
		String answer2 = "";
//		for(int i = 0; i < answers.length; i++) {
//			answer += answers[i];
//		}
 		
		System.out.println(answer);
	}
}
