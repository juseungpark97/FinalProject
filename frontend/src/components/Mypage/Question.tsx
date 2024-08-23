import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import styles from './css/HelpPage.module.css';
import { format } from 'date-fns';

export interface ChatMessage {
    chat: string;
    chatRoomId: string | undefined;
    roll: string;
    chatDate: string; // ISO 8601 문자열 형태로 LocalDateTime 데이터가 전달됨
}

export interface QuestionProps {
    profileNo: number | null;
};


const Question: React.FC<QuestionProps> = ({ profileNo }) => {
    const [webSocket, setWebSocket] = useState<Client | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const url = 'http://localhost:8088';

    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatRoomId, setChatRoomId] = useState<number | null>(null);
    const [isChatRoomClosed, setIsChatRoomClosed] = useState<boolean>(false);

    // 채팅방 ID 가져오기
    useEffect(() => {
        if (!profileNo) {
            console.error("프로필 번호가 없습니다. 올바른 프로필을 선택했는지 확인하세요.");
            return;
        }

        axios.post(`${url}/api/chat/start`, null, { params: { profileNo } })
            .then(response => {
                const roomId = response.data.chatRoomId;
                setChatRoomId(roomId);
                console.log('채팅방 ID 가져오기 성공:', roomId);
            })
            .catch(error => {
                console.error("채팅방 설정 실패:", error);
            });

    }, [profileNo]);

    // chatRoomId가 설정된 후 실행될 로직
    useEffect(() => {
        if (chatRoomId !== null) {
            // 이전 채팅 메시지 가져오기
            axios.get(`${url}/api/chat/history`, { params: { chatRoomId } })
                .then((res) => {
                    setChatMessages(res.data);
                })
                .catch(error => {
                    console.error("채팅 메시지 가져오기 실패:", error);
                });

            // WebSocket 설정 및 구독
            const createWebSocket = () => {
                console.log('WebSocket 생성');
                return new SockJS(url + "/chat-websocket");
            };

            console.log('STOMP 클라이언트 설정 중');
            const stompClient = new Client({
                webSocketFactory: createWebSocket,
                reconnectDelay: 10000,
                debug: (str) => console.log('STOMP Debug: ', str),
                onConnect: (frame) => {
                    console.log("STOMP connected", frame);
                    setIsConnected(true);
                    stompClient.subscribe(`/app/chat/chatRoomNo/${chatRoomId}/message`, (message) => {
                        console.log('Received message:', message.body);
                        const receivedMessage = JSON.parse(message.body) as ChatMessage;
                        setChatMessages((prevMessages) => [...prevMessages, receivedMessage]);
                    });

                    setWebSocket(stompClient);
                },
                onDisconnect: () => {
                    console.log('STOMP disconnected');
                    setIsConnected(false);
                },
                onStompError: (frame) => {
                    console.error("STOMP Error:", frame);
                    setIsConnected(false);
                }
            });

            stompClient.activate();  // STOMP 클라이언트 활성화
        }

        return () => {
            webSocket?.deactivate(); // 컴포넌트 소멸 시 웹소켓 해제
        };
    }, [chatRoomId]);

    // chatMessages가 업데이트될 때마다 스크롤을 아래로 이동
    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    const submitMessage = () => {
        if (!isChatRoomClosed) {
            sendMessage();
        }
    }

    const sendMessage = () => {
        if (!message.trim()) {
            alert("메시지를 입력하세요.");
            return;
        }
        if (!chatRoomId || !profileNo) {
            alert("채팅방 ID나 프로필 번호가 유효하지 않습니다.");
            return;
        }

        if (!webSocket || !isConnected) {
            alert("WebSocket 연결이 아직 완료되지 않았습니다.");
            return;
        }

        const chatMessage: ChatMessage = {
            chat: message,
            chatRoomId: chatRoomId.toString(),
            roll: 'user',
            chatDate: new Date().toISOString(),
        };

        try {
            webSocket.publish({
                destination: `/app/chat/sendMessage/chatRoomId/${chatRoomId}`,
                body: JSON.stringify(chatMessage),
            });
            // 클라이언트에 메시지 추가
            //setChatMessages((prevMessages) => [...prevMessages, chatMessage]);
            setMessage(''); // 입력창 초기화
        } catch (error) {
            console.error("메시지 전송 실패:", error);
        }
    }

    const exitChatRoom = () => {
        const userConfirmed = window.confirm("대화가 만족스러우셨나요? 대화를 종료하시겠습니까?");
        if (!userConfirmed) {
            return;
        }

        if (chatRoomId) {
            const finalMessage: ChatMessage = {
                chat: "감사합니다. 앞으로도 많은 이용 부탁드립니다.",
                chatRoomId: chatRoomId.toString(),
                roll: 'admin',
                chatDate: new Date().toISOString(),
            };

            setChatMessages((prevMessages) => {
                const updatedMessages = [...prevMessages, finalMessage];
                scrollToBottom(); // 상태가 업데이트된 후 스크롤 이동
                return updatedMessages;
            });

            axios.post(`${url}/api/chat/close`, null, { params: { chatRoomId } })
                .then(() => {
                    webSocket?.deactivate();
                    setIsChatRoomClosed(true); // 채팅방을 닫음으로 표시하여 전송 비활성화
                })
                .catch(error => {
                    console.error("채팅방 종료 실패:", error);
                });
        }
    }

    const scrollToBottom = () => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }

    return (
        <div className={styles.profileManagementPage}>
            <div className={styles.header}>
                <h1>1:1 문의</h1>
                <button className={styles.endChatButton} onClick={exitChatRoom} disabled={isChatRoomClosed}>
                    대화종료
                </button>
            </div>
            <div className={styles.chatContainer}>
                <div className={styles.chatBox}>
                    {chatMessages.map((chat, index) => (
                        <div
                            key={index}
                            className={`${styles.chatContent} ${chat.roll === 'user' ? styles.myMessage : styles.theirMessage}`}
                        >
                            <div className={styles.messageBubble}>
                                {chat.chat}
                            </div>
                            <div className={styles.chatDate}>
                                {format(new Date(chat.chatDate), 'yyyy-MM-dd HH:mm')}
                            </div>
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>
                <div className={styles.chatInputContainer}>
                    <textarea
                        ref={textareaRef}
                        rows={3}
                        placeholder="메시지를 입력하세요"
                        className={styles.chatInput}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                submitMessage();
                            }
                        }}
                        disabled={isChatRoomClosed} // 대화 종료 시 메시지 입력 비활성화
                    />
                    <button
                        className={styles.sendButton}
                        onClick={submitMessage}
                        disabled={isChatRoomClosed} // 대화 종료 시 전송 버튼 비활성화
                    >
                        전송
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Question;
