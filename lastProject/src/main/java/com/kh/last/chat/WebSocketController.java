package com.kh.last.chat;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.kh.last.model.vo.Chatting;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Controller
@Slf4j
public class WebSocketController {
	
    private final ChatService chatService;

    @MessageMapping("/chat/sendMessage/chatRoomId/{chatRoomId}")
    @SendTo("/app/chat/chatRoomNo/{chatRoomId}/message")
    public Chatting broadcastMessage(@DestinationVariable Long chatRoomId, Chatting message) {
        // 이 메서드는 클라이언트로부터 특정 채팅방에 대한 메시지를 받아, 해당 방의 모든 구독자에게 전송합니다.
    	log.info("message : {} ", message);
    	chatService.insertChat(message, chatRoomId);
        return message;
    }
}