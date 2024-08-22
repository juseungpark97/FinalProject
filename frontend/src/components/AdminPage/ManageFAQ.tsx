// pages/ManageFAQ.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../pages/AdminPage/css/DashboardPage.module.css';
import Pagination from './Pagination'; // 공통 컴포넌트 호출
import axios from 'axios';

interface FaqType {
    id: number;
    question: string;
    answer: string;
    insertDate: string; // LocalDate를 문자열로 처리
}

export default function ManageFAQ() {
    const [data, setData] = useState<FaqType[]>([]);
    const { page } = useParams<{ page: string }>();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState<string>('');
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState<number>(page ? parseInt(page, 10) : 1);

    useEffect(() => {
        if (page) {
            setCurrentPage(parseInt(page, 10));
        }
    }, [page]);

    useEffect(() => {
        const fetchFAQ = async () => {
            try {
                const response = await axios.get<FaqType[]>('http://localhost:8088/dashboard/getFaq');
                // 변환된 날짜 문자열로 처리
                const updatedData = response.data.map(item => ({
                    ...item,
                    insertDate: item.insertDate.toString() // 날짜를 문자열로 변환
                }));
                setData(updatedData);
            } catch (error) {
                console.error("Failed to get FAQ", error);
            }
        };

        fetchFAQ();
    }, []);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchClick = () => {
        console.log("검색어:", searchTerm);
    };

    const handleEditClick = (id: number) => {
        const selectedFAQ = data.find(item => item.id === id);
        if (selectedFAQ) {
            navigate(`/dashboard/FAQManage/InsertFAQ/${id}`, { state: { question: selectedFAQ.question, answer: selectedFAQ.answer } });
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        navigate(`/dashboard/FAQManage/${pageNumber}`);
    };

    const handleInsertFAQClick = () => {
        navigate('/dashboard/FAQManage/InsertFAQ');
    };

    return (
        <div className={styles.tableContainer}>
            <div className={styles.headerContainer}>
                <h1 className={styles.movimanage}>자주하는질문</h1>
                <div className={styles.searchContainer}>
                    <button className={styles.insertFAQButton} onClick={handleInsertFAQClick}>작성하기</button>
                </div>
            </div>
            <div>
                <table className={styles.tg}>
                    <colgroup>
                        <col style={{ width: "100px" }} />
                        <col style={{ width: "300px" }} />
                        <col style={{ width: "500px" }} />
                        <col style={{ width: "100px" }} />
                        <col style={{ width: "100px" }} />
                    </colgroup>
                    <thead>
                        <tr id={styles.firstrow}>
                            <th>질문번호</th>
                            <th>질문내용</th>
                            <th>답변</th>
                            <th>게시날짜</th>
                            <th>수정하기</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.question}</td>
                                <td>{item.answer}</td>
                                <td>{item.insertDate}</td> {/* 날짜 표시 */}
                                <td><button onClick={() => handleEditClick(item.id)}>수정하기</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination
                    itemsPerPage={itemsPerPage}
                    totalItems={data.length}
                    paginate={paginate}
                    currentPage={currentPage}
                />
            </div>
        </div>
    );
}
