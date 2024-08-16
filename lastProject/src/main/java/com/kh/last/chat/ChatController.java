package com.kh.last.chat;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kh.last.model.dto.ChatRoomListDTO;
import com.kh.last.model.vo.ChatRoomList;
import com.kh.last.model.vo.Chatting;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/chat")
@Slf4j
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping("/start")
    public ChatRoomList startChat(@RequestParam Long profileNo) {
        List<ChatRoomList> activeRooms = chatService.getActiveChatRooms(profileNo);
        if (activeRooms.isEmpty()) {
            return chatService.createChatRoom(profileNo);
        } else {
            return activeRooms.get(0);
        }
    }

    @GetMapping("/history")
    public List<Chatting> getChatHistory(@RequestParam Long chatRoomId) {
        return chatService.getChatHistory(chatRoomId);
    }

    @PostMapping("/close")
    public void closeChatRoom(@RequestParam Long chatRoomId) {
        chatService.closeChatRoom(chatRoomId);
    }
    
    @GetMapping("/admin/list")
    public List<ChatRoomListDTO> getChatRoomList(@RequestParam(defaultValue = "N") String exitRoom) {
    	log.info("열린/닫힌 상태 {} ", exitRoom);
    	return chatService.getChatRoomListByExitRoom(exitRoom);
    }
    
    @PostMapping("/updateAdminCheck")
    public void updateAdminCheck(@RequestParam Long chatRoomId) {
        chatService.updateAdminCheckToY(chatRoomId);
    }
}
