package com.kh.last.model.vo;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "CHAT_ROOM_LIST")
public class ChatRoomList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CHAT_ROOM_ID")
    private Long chatRoomId;

    @Column(name = "PROFILE_NO", nullable = false)
    private Long profileNo;

    @Column(name = "CREATE_DATE", nullable = false)
    private LocalDateTime createDate = LocalDateTime.now();

    @Column(name = "CHAT_CHECK", nullable = false, length = 3)
    private String chatCheck = "N";

    @Column(name = "EXIT_ROOM", nullable = false, length = 3)
    private String exitRoom = "N";
}
