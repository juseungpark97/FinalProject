package com.kh.last.model.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomListDTO {
    private Long chatRoomId;
    private String profileName;
    private String recentChat;
    private LocalDateTime createDate;
    private boolean hasNewMessage;
    private String exitRoom;
}