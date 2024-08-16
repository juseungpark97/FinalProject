package com.kh.last.chat;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kh.last.model.vo.Chatting;

@Repository
public interface ChattingRepository extends JpaRepository<Chatting, Long> {
	List<Chatting> findByChatRoomIdOrderByChatIdAsc(Long chatRoomId);
	
	List<Chatting> findByChatRoomIdAndAdminCheck(Long chatRoomId, String adminCheck);
}