package com.kh.last.controller;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.last.model.dto.MovieViewDTO;
import com.kh.last.model.vo.Faq;
import com.kh.last.model.vo.Profile;
import com.kh.last.model.vo.StopAccount;
import com.kh.last.model.vo.USERS;
import com.kh.last.model.vo.Visit;
import com.kh.last.service.ManageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "http://localhost:3000")  // 클라이언트의 출처 설정
@RequiredArgsConstructor
@Slf4j
public class ManageController {
	
	private final ManageService service;
	
	@GetMapping("/viewCount")
	public int viewCount() {
		LocalDate date = LocalDate.now();
		int count = 0;
		count = service.viewCount(date);
		
		return count;
	}
	
	@GetMapping("/todayVisit")
	public int todayVisit() {
		LocalDate date = LocalDate.now();
		int count = 0;
		count = service.todayVisit(date);
		
		return count;
	}
	
	@GetMapping("/movieCount")
	public int movieCount() {
		int count = service.movieCount();
		return count;
	}
	
	@GetMapping("/allUserCount")
	public int allUserCount() {
		int count = service.userCount();
		return count;
	}
		
	@GetMapping("/weekVisit")
	public List<Visit> weekVisit() {
	    List<Visit> list = service.weekVisit();
	    
	    if (list.isEmpty()) {
	        return list;
	    }
	    
	    // 마지막 날짜를 기준으로 설정
	    LocalDate lastVisitDate = list.get(list.size() - 1).getVisitDate();
	    
	    for (Visit visit : list) {
	        long daysAgo = ChronoUnit.DAYS.between(visit.getVisitDate(), lastVisitDate);
	        
	        if (daysAgo == 0) {
	            visit.setDayCount("오늘");
	        } else {
	            visit.setDayCount(daysAgo + "일 전");
	        }
	    }
	    
	    return list;
	}
	
	@GetMapping("/getFaq")
	public List<Faq> getFaq(){
		List<Faq> list = service.getFaq();
		return list;
	}
	
	@PostMapping("/faq")
	public void insertOrUpdateFaq(@RequestBody Faq faq) {
		Long id = faq.getId();
		String question = faq.getQuestion();
		String answer = faq.getAnswer();
		
		if(id != null) {
			service.updateFaq(id, question, answer);
		}else {
			service.insertFaq(question, answer);			
		}
	}
	
	@DeleteMapping("/faq/{id}")
    public ResponseEntity<String> deleteFaq(@PathVariable Long id) {
        try {
        	service.deleteFaq(id);
            return ResponseEntity.ok("FAQ 삭제가 완료되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("FAQ 삭제 중 오류가 발생했습니다.");
        }
    }
    
	@GetMapping("/getMovie")
    public List<MovieViewDTO> getMovie() {
		List<MovieViewDTO> list = service.getMovies();
        return list;
    }
    
	@GetMapping("/getUser")
	public Map<String, Object> getUser(){
		List<USERS> list = service.getUser();
		List<Profile> list2 = service.getProfile();
		
		Map<String, Object> map = new HashMap<String, Object>();
		
		map.put("userList", list);
		map.put("profileList", list2);
		
		return map;
	}
	
	@PostMapping("/stopAccount")
	public void stopAccount(@RequestBody StopAccount account) {
		Long userNo = account.getUserNo();
		
		service.stopAccount(userNo, account);
	}
	
	@GetMapping("/getStopInfo/{userNo}")
    public StopAccount getStopInfo(@PathVariable Long userNo) {
        return service.getStopInfo(userNo);
    }
	
	@PostMapping("/unstopAccount")
	public void unstopAccount(@RequestBody Map<String, Long> request) {
	    Long userNo = request.get("userNo");
	    service.unstopAccount(userNo);
	}
	
	@GetMapping("/recentMostView")
	public List<MovieViewDTO> recentMostView(){
		return service.recentMostView();
	}
	
	@GetMapping("/getGenreView")
    public List<Map<String, Object>> getGenreView() {
        Map<String, Object> response = new HashMap<>();
        Map<String, Integer> genreViewCounts = service.getGenreViewCounts();

        log.info("장르 뽑아온거  : {}", genreViewCounts);
        // 데이터와 색상 추가
        List<Map<String, Object>> dataWithColors = genreViewCounts.entrySet().stream()
            .map(entry -> {
                Map<String, Object> item = new HashMap<>();
                item.put("name", entry.getKey());
                item.put("조회수", entry.getValue());
                item.put("fill", generateRandomColor());
                return item;
            })
            .collect(Collectors.toList());
        
        //response.put("data", dataWithColors);
        log.info("반환값 {} ", dataWithColors);
        return dataWithColors;
    }

    private String generateRandomColor() {
        int r = (int)(Math.random() * 256);
        int g = (int)(Math.random() * 256);
        int b = (int)(Math.random() * 256);
        return String.format("rgb(%d, %d, %d)", r, g, b);
    }
}






