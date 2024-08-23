import React, { useState, useEffect, useRef } from 'react';
import styles from '../../pages/AdminPage/css/DashboardPage.module.css';
import axios from 'axios';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { format } from 'date-fns';

interface ChattingProps {
    isOpen: boolean;
    onClose: () => void;
    chatRoomId: number;
    isReadOnly: boolean;
}

interface ChatMessage {
    chat: string;
    chatRoomId: number | undefined;
    roll: string;
    chatDate: string; // ISO 8601 문자열 형태로 LocalDateTime 데이터가 전달됨
    adminCheck: string; // adminCheck 필드 추가
}

export const Chatting: React.FC<ChattingProps> = ({ isOpen, onClose, chatRoomId, isReadOnly }) => {
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [webSocket, setWebSocket] = useState<any>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen) {
            fetchChatMessages(chatRoomId);
            if (!isReadOnly) {
                initializeWebSocket(chatRoomId);
            }
        }

        return () => {
            if (webSocket) {
                webSocket.deactivate();
            }
        };
    }, [isOpen, chatRoomId, isReadOnly]);

    const fetchChatMessages = (chatRoomId: number) => {
        axios.get(`http://localhost:8088/api/chat/history`, { params: { chatRoomId: chatRoomId } })
            .then(response => {
                setChatMessages(response.data);
                
                // 렌더링 후에 스크롤 이동
                setTimeout(() => {
                    // 배열에서 첫 번째 adminCheck가 'N'인 인덱스 찾기
                    const firstUncheckedMessageIndex = response.data.findIndex((msg: ChatMessage) => msg.adminCheck === 'N');
    
                    console.log("First unchecked message index:", firstUncheckedMessageIndex);
    
                    if (firstUncheckedMessageIndex !== -1) {
                        scrollToMessage(firstUncheckedMessageIndex);
                        updateAdminCheck(chatRoomId);
                    } else {
                        scrollToBottom();
                    }
                }, 0);  // 타이밍 문제를 피하기 위해 약간의 지연을 추가
            })
            .catch(error => console.error('Error fetching chat messages:', error));
    };    

    const initializeWebSocket = (chatRoomId: number) => {
        const socket = new SockJS('http://localhost:8088/chat-websocket');
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            setIsConnected(true);
            stompClient.subscribe(`/app/chat/chatRoomNo/${chatRoomId}/message`, (message) => {
                const newMessage = JSON.parse(message.body) as ChatMessage;
                setChatMessages(prev => [...prev, newMessage]);
                scrollToBottom();
            });
        });

        setWebSocket(stompClient);
    };

    const updateAdminCheck = (chatRoomId: number) => {
        axios.post(`http://localhost:8088/api/chat/updateAdminCheck`, null, {
            params: { chatRoomId }
        })
        .then(response => {
            console.log('Admin check updated.');
        })
        .catch(error => console.error('Error updating admin check:', error));
    };
    
    const scrollToBottom = () => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToMessage = (index: number) => {
        const element = document.getElementById(`chat-message-${index}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const insertChat = () => {
        if (!newMessage.trim()) {
            alert('메시지를 입력하세요.');
            return;
        }

        if (!webSocket || !isConnected) {
            alert('WebSocket 연결이 아직 완료되지 않았습니다.');
            return;
        }

        const message = {
            chatRoomId,
            chat: newMessage,
            roll: 'admin',
            chatDate: new Date().toISOString(),
        };

        try {
            webSocket.publish({
                destination: `/app/chat/sendMessage/chatRoomId/${chatRoomId}`,
                body: JSON.stringify(message),
            });
            setNewMessage('');
            setTimeout(() => {
                scrollToBottom();
            }, 100);
        } catch (error) {
            console.error("메시지 전송 실패:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <span className={styles.chatTitle}>채팅 내역</span>
                <span className={styles.closeButton} onClick={onClose}>&times;</span>
                <div className={styles.chatWindow}>
                    <div className={styles.chatMessages}>
                        {chatMessages.map((message, index) => (
                            <div
                                key={index}
                                id={`chat-message-${index}`}
                                className={`${styles.chatContent} ${message.roll === 'admin' ? styles.myMessage : styles.theirMessage}`}
                            >
                                <div className={styles.messageBubble}>
                                    {message.chat}
                                </div>
                                <div className={styles.chatDate}>
                                    {format(new Date(message.chatDate), 'yyyy-MM-dd HH:mm')}
                                </div>
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>
                    <input
                        type="text"
                        placeholder="메시지를 입력하세요"
                        className={styles.chatInput}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                insertChat();
                            }
                        }}
                        disabled={isReadOnly}
                    />
                    <button
                        className={styles.sendButton}
                        onClick={insertChat}
                        disabled={isReadOnly}
                    >
                        전송하기
                    </button>
                </div>
            </div>
        </div>
    );
};
