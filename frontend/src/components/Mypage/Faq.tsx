
import React, { useEffect, useState } from 'react';
import styles from './css/HelpPage.module.css';
import axios from 'axios';

interface FaqProps {
    faqList: {
        id: number;
        question: string;
        answer: string;
        insertDate: string;
    }[];
}

interface FaqType {
    id: number;
    question: string;
    answer: string;
    insertDate: string; // LocalDate를 문자열로 처리
  }
  
const Faq: React.FC = () => {
    const [openFaqId, setOpenFaqId] = useState<number | null>(null);

    const toggleAnswer = (id: number) => {
        setOpenFaqId(openFaqId === id ? null : id);
    };

    const [faqList, setFaqList] = useState<FaqType[]>([]);

    useEffect(() => {
        const getFAQ = async () => {
            try {
                const response = await axios.get<FaqType[]>('http://localhost:8088/dashboard/getFaq');
                // 변환된 날짜 문자열로 처리
                const updatedData = response.data.map(item => ({
                    ...item,
                    insertDate: item.insertDate.toString() // 날짜를 문자열로 변환
                }));
                setFaqList(updatedData);
                console.log(faqList);
            } catch (error) {
                console.error("Failed to get FAQ", error);
            }
        };
        getFAQ();
    }, []);

    return (
        <div className={styles.myPage}>
            <div className={styles.content}>
                <h1>FAQ</h1>
                <h3>자주하는 질문</h3>
            </div>
            <div className={styles.quickLinks}>
                <ul>
                    {faqList.map(faq => (
                        <li key={faq.id} onClick={() => toggleAnswer(faq.id)} style={{ cursor: 'pointer' }}>
                            <h4>{faq.question}</h4>
                            <div className={`${styles.answer} ${openFaqId === faq.id ? styles.open : ''}`}>
                                <p>{faq.answer}</p>
                            </div>
                        </li>
                    ))}
                </ul>

            </div>
        </div>
    );
};

export default Faq;

