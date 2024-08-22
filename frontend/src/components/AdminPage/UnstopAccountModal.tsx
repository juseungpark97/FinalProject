import React from 'react';
import styles from './css/Modal.module.css'; // 모달 스타일 파일을 임포트

interface UnstopModalProps {
  isOpen: boolean;
  onClose: () => void;
  stopInfo: { reason: string; stopDate: string } | null;
  onConfirm: () => void;
}

const UnstopModal: React.FC<UnstopModalProps> = ({ isOpen, onClose, stopInfo, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent}>
        <h2 className={styles.stopTitle}>정지 해제 정보</h2>
        {stopInfo ? (
          <div>
            <p>정지 사유: {stopInfo.reason}</p>
            <p>정지 일자: {stopInfo.stopDate}</p>
            <div className={styles.modalButtons}>
              <button onClick={onConfirm} className={styles.confirmButton}>
                정지 해제 확인
              </button>
              <button onClick={onClose} className={styles.cancelButton}>
                취소
              </button>
            </div>
          </div>
        ) : (
          <p>정지 정보를 가져오는 중입니다...</p>
        )}
      </div>
    </div>
  );
};

export default UnstopModal;
