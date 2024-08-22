package com.kh.last.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.last.model.dto.MovieViewDTO;
import com.kh.last.model.vo.Faq;
import com.kh.last.model.vo.Profile;
import com.kh.last.model.vo.StopAccount;
import com.kh.last.model.vo.USERS;
import com.kh.last.model.vo.Visit;
import com.kh.last.repository.FaqRepository;
import com.kh.last.repository.MovieRepository;
import com.kh.last.repository.PostRepository;
import com.kh.last.repository.ProfileRepository;
import com.kh.last.repository.StopAccountRepository;
import com.kh.last.repository.UserRepository;
import com.kh.last.repository.VisitRepository;
import com.kh.last.repository.WatchLogRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ManageService {
	private final MovieRepository movieRepository;
	private final PostRepository postRepository; // 변수 이름을 소문자로 시작
	private final UserRepository userRepository;
	private final VisitRepository visitRepository;
	private final FaqRepository faqRepository;
	private final ProfileRepository profileRepository;
	private final StopAccountRepository stopAccountRepository;
	private final WatchLogRepository watchLogRepository;

	public int viewCount(LocalDate date) {
		// LocalDate를 LocalDateTime으로 변환하여 시작과 끝 시간을 설정
		LocalDateTime startOfDay = date.atStartOfDay();
		LocalDateTime endOfDay = date.atTime(23, 59, 59, 999999999);

		Long dailyCount = watchLogRepository.countDailyViews(startOfDay, endOfDay);
		int count = (dailyCount != null) ? dailyCount.intValue() : 0;

		log.info("count = {}", count);

		return count;
	}

	public int todayVisit(LocalDate date) {

		Integer count = visitRepository.todayVisit(date);
		if (count == null) {
			count = 0;
		}
		log.debug("count = {}", count);
		return count.intValue();
	}

	public int movieCount() {
		long count = movieRepository.count();
		return (int) count;
	}

	public int userCount() {
		long count = userRepository.count();
		return (int) count;
	}

	public List<Visit> weekVisit() {
		LocalDate today = LocalDate.now();
		LocalDate weekAgo = today.minusDays(6); // 오늘 포함 7일이기 때문에 6일 전으로 설정

		List<Visit> visitList = visitRepository.findVisitsInRange(weekAgo, today);

		return visitList;
	}

	public void insertFaq(String question, String answer) {
		// Faq 객체 생성
		Faq faq = new Faq();
		faq.setQuestion(question);
		faq.setAnswer(answer);
		faq.setInsertDate(LocalDate.now()); // 오늘 날짜로 설정

		// 데이터베이스에 저장
		faqRepository.save(faq);
	}

	public void updateFaq(Long id, String question, String answer) {
		// ID로 기존 FAQ 항목 조회
		Optional<Faq> optionalFaq = faqRepository.findById(id);

		if (optionalFaq.isPresent()) {
			Faq faq = optionalFaq.get();
			faq.setQuestion(question);
			faq.setAnswer(answer);
			faq.setInsertDate(LocalDate.now());
			faqRepository.save(faq);
		} else {
			// 해당 ID를 가진 FAQ 항목이 없을 경우 예외 발생
			throw new RuntimeException("FAQ 항목을 찾을 수 없습니다.");
		}
	}

	public List<Faq> getFaq() {
		List<Faq> list = faqRepository.findAll();

		return list;
	}

	public void deleteFaq(Long id) {
		faqRepository.deleteById(id); // 해당 ID의 FAQ 항목을 삭제
	}

	public List<MovieViewDTO> getMovies() {

		List<MovieViewDTO> list = movieRepository.findAllMoviesAndView();
		return list;
	}

	public List<USERS> getUser() {
		List<USERS> list = userRepository.findByRoleNotAndStatusNot("admin", "D");
		return list;
	}

	public List<Profile> getProfile() {
		return profileRepository.findProfilesByUserRoleNotAndStatusNot("admin", "D");
	}

	public void stopAccount(Long userNo, StopAccount account) {
		Optional<USERS> opUser = userRepository.findById(userNo);
		USERS user = opUser.get();
		user.setStatus("S");
		userRepository.save(user);

		stopAccountRepository.save(account);
	}

	public StopAccount getStopInfo(Long userNo) {
		return stopAccountRepository.findByUserNo(userNo)
				.orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));
	}

	@Transactional
	public void unstopAccount(Long userNo) {
		Optional<USERS> opUser = userRepository.findById(userNo);
		if (opUser.isPresent()) {
			USERS user = opUser.get();
			user.setStatus("A");
			userRepository.save(user);

			stopAccountRepository.deleteByUserNo(userNo);
		} else {
			throw new IllegalArgumentException("User not found");
		}
	}
	
	public List<MovieViewDTO> recentMostView() {
	    LocalDateTime now = LocalDateTime.now();
	    LocalDateTime startDate = now.minus(29, ChronoUnit.DAYS);
	    LocalDateTime endDate = now;

	    // 상위 5개의 영화를 가져오기 위한 Pageable 객체 생성
	    Pageable pageable = PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "viewCount"));
	    
	    // 페이징된 결과를 가져옴
	    Page<MovieViewDTO> page = movieRepository.findMoviesWithViewCountAbove100(startDate, endDate, pageable);
	    
	    // 결과 리스트를 반환
	    return page.getContent();
	}
}
