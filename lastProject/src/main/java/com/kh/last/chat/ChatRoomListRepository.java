package com.kh.last.chat;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.kh.last.model.dto.ChatRoomListDTO;
import com.kh.last.model.vo.ChatRoomList;

@Repository
public interface ChatRoomListRepository extends JpaRepository<ChatRoomList, Long> {

    List<ChatRoomList> findByProfileNoAndExitRoom(Long profileNo, String exitRoom);
    
    @Query("SELECT new com.kh.last.model.dto.ChatRoomListDTO(crl.chatRoomId, p.profileName, c.chat, crl.createDate, " +
           "(CASE WHEN crl.chatCheck = 'Y' THEN true ELSE false END), crl.exitRoom) " +
           "FROM ChatRoomList crl " +
           "LEFT JOIN Chatting c ON crl.chatRoomId = c.chatRoomId AND c.chatDate = " +
           "(SELECT MAX(c2.chatDate) FROM Chatting c2 WHERE c2.chatRoomId = crl.chatRoomId) " +
           "LEFT JOIN Profile p ON crl.profileNo = p.profileNo " +
           "WHERE crl.exitRoom = :exitRoom " +
           "ORDER BY c.chatDate DESC")
    List<ChatRoomListDTO> findChatRoomListWithRecentChatAndProfileName(@Param("exitRoom") String exitRoom);
}