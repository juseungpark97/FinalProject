import React from 'react';
import styles from '../BeforePage/css/ConfirmModal.module.css';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <p>{message}</p>
                <button onClick={onConfirm} className={styles.confirmButton}>확인</button>
                <button onClick={onClose} className={styles.cancelButton}>취소</button>
            </div>
        </div>
    );
};

export default ConfirmModal;