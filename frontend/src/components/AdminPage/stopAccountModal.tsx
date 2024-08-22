import React, { useCallback, useState } from 'react';
import styles from './css/Modal.module.css'; // 모달 스타일 파일을 임포트

interface StopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const StopModal: React.FC<StopModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');

  const handleModalClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (reason.trim() === '') {
      alert('정지 사유를 입력해야 합니다.');
      return;
    }
    onConfirm(reason);
    setReason('');
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={handleModalClick}>
        <h2 className={styles.stopTitle}>정지 사유 입력</h2>
        <textarea
          placeholder="정지 사유를 입력하세요"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className={styles.textarea}
        />
        <div className={styles.modalButtons}>
          <button onClick={handleConfirm} className={styles.confirmButton}>
            확인
          </button>
          <button onClick={onClose} className={styles.cancelButton}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default StopModal;
