package com.kh.last.chat;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kh.last.model.dto.ChatRoomListDTO;
import com.kh.last.model.vo.ChatRoomList;
import com.kh.last.model.vo.Chatting;


@Service
public class ChatService {

    @Autowired
    private ChatRoomListRepository chatRoomListRepository;

    @Autowired
    private ChattingRepository chattingRepository;

    public List<ChatRoomList> getActiveChatRooms(Long profileNo) {
        return chatRoomListRepository.findByProfileNoAndExitRoom(profileNo, "N");
    }

    public ChatRoomList createChatRoom(Long profileNo) {
        ChatRoomList chatRoom = new ChatRoomList();
        chatRoom.setProfileNo(profileNo);
        return chatRoomListRepository.save(chatRoom);
    }

    public List<Chatting> getChatHistory(Long chatRoomId) {
        return chattingRepository.findByChatRoomIdOrderByChatIdAsc(chatRoomId);
    }
    
	public void insertChat(Chatting message, Long chatRoomId) {
        ChatRoomList chatRoom = chatRoomListRepository.findById(chatRoomId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid chatRoomId: " + chatRoomId));
        if(message.getRoll().equals("user")) {
        	chatRoom.setChatCheck("N");
        	chatRoomListRepository.save(chatRoom);
        }
		chattingRepository.save(message);
	}

    public void closeChatRoom(Long chatRoomId) {
        ChatRoomList chatRoom = chatRoomListRepository.findById(chatRoomId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid chatRoomId: " + chatRoomId));
        chatRoom.setExitRoom("Y");
        chatRoomListRepository.save(chatRoom);
    }

    public List<ChatRoomListDTO> getChatRoomListByExitRoom(String exitRoom) {
        return chatRoomListRepository.findChatRoomListWithRecentChatAndProfileName(exitRoom);
    }

    public void updateAdminCheckToY(Long chatRoomId) {
    	List<Chatting> chats = chattingRepository.findByChatRoomIdAndAdminCheck(chatRoomId, "N");
        for (Chatting chat : chats) {
            chat.setAdminCheck("Y");
            chattingRepository.save(chat);
        }
        ChatRoomList chatRoom = chatRoomListRepository.findById(chatRoomId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid chatRoomId: " + chatRoomId));
    	chatRoom.setChatCheck("Y");
    	chatRoomListRepository.save(chatRoom);
    }
}