package com.kh.last.model.vo;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "CHATTING")
public class Chatting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CHAT_ID")
    private Long chatId;

    @Column(name = "CHAT_ROOM_ID", nullable = false)
    private Long chatRoomId;

    @Column(name = "CHAT", nullable = false, length = 255)
    private String chat;

    @Column(name = "CHAT_DATE", nullable = false)
    private LocalDateTime chatDate;

    @Column(name = "ADMIN_CHECK", nullable = false, length = 3)
    private String adminCheck = "N";
    
    @Column(name = "ROLL", nullable = false, length = 10)
    private String roll;
    
    @PrePersist
    protected void onCreate() {
        this.chatDate = LocalDateTime.now();
    }
}
