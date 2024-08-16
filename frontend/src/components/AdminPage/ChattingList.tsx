import React, { useState, useEffect } from 'react';
import styles from '../../pages/AdminPage/css/DashboardPage.module.css';
import Pagination from './Pagination';
import { Chatting } from './Chatting';
import axios from 'axios';
import { format } from 'date-fns';

interface ChatItem {
    chatRoomId: number;
    profileName: string;
    recentChat: string;
    createDate: Date;
    hasNewMessage: boolean;
    exitRoom: string;
}

const ChattingList: React.FC = () => {
    const [data, setData] = useState<ChatItem[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [currentChat, setCurrentChat] = useState<ChatItem | null>(null);
    const [filter, setFilter] = useState<'open' | 'closed'>('open'); // 추가된 필터 상태
    const itemsPerPage = 10;

    useEffect(() => {
        // 필터에 따라 채팅 목록 API 호출
        const fetchChatData = async () => {
            const exitRoomValue = filter === 'open' ? 'N' : 'Y';
            try {
                const response = await axios.get('http://localhost:8088/api/chat/admin/list', {
                    params: { exitRoom: exitRoomValue }
                });
                const modifiedData = response.data.map((item: ChatItem) => ({
                    ...item,
                    recentChat: item.recentChat ?? '' // recentChat이 null이면 빈 문자열로 설정
                }));
                setData(modifiedData);
                console.log(`열린 채팅 데이터: ${filter === 'open' ? JSON.stringify(modifiedData) : '[]'}`);
                console.log(`닫힌 채팅 데이터: ${filter === 'closed' ? JSON.stringify(modifiedData) : '[]'}`);
            } catch (error) {
                console.error('Error fetching chat list:', error);
            }
        };

        fetchChatData();
    }, [filter]); // filter 상태가 변경될 때마다 API 호출

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // 페이지네이션을 위한 현재 아이템
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const openModal = (chatItem: ChatItem) => {
        setCurrentChat(chatItem);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setCurrentChat(null);
    };

    return (
        <div className={styles.ChattingContainer}>
            <div className={styles.headerContainer}>
                <h1 className={styles.ChattingTitle}>1대1 문의</h1>
                <div className={styles.filterContainer}>
                    <span
                        className={filter === 'open' ? styles.activeFilter : ''}
                        onClick={() => setFilter('open')}
                    >
                        열린채팅보기
                    </span>
                    &nbsp;|&nbsp;
                    <span
                        className={filter === 'closed' ? styles.activeFilter : ''}
                        onClick={() => setFilter('closed')}
                    >
                        닫힌채팅보기
                    </span>
                </div>
            </div>
            <div className={styles.ChattingGrid}>
                {currentItems.map((item) => (
                    <div key={item.chatRoomId} className={styles.ChattingCard} style={{ position: 'relative' }}>
                        <div className={styles.ChattingCardTitle}>
                            {item.profileName}님의 채팅
                            {item.hasNewMessage && (
                                <span className={styles.newMessageIndicator}>!</span>
                            )}
                        </div>
                        <div className={styles.ChattingCardDate}>{format(new Date(item.createDate), 'yyyy-MM-dd HH:mm')}</div>
                        <input type='text' className={styles.lastChat} value={item.recentChat} disabled />
                        <button
                            className={styles.ChattingCardButton}
                            onClick={() => openModal(item)}
                        >
                            {item.exitRoom === 'Y' ? '답변보기' : '답변하기'}
                        </button>
                    </div>
                ))}
            </div>
            <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={data.length}
                paginate={paginate}
                currentPage={currentPage}
            />
            {currentChat && (
                <Chatting
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    chatRoomId={currentChat.chatRoomId}
                    isReadOnly={currentChat.exitRoom === 'Y'}
                />
            )}
        </div>
    );
}

export default ChattingList;
