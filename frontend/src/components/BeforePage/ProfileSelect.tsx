import React from 'react';
import styles from '../../components/BeforePage/css/ProfileSelect.module.css';
import { Profile } from '../../types/Profile';

interface ProfileSelectProps {
    profiles: Profile[];
    onProfileSelect: (profile: Profile) => void;
    onAddProfile: () => void;
    onProfileDelete: (profile: Profile) => void;
}

const ProfileSelect: React.FC<ProfileSelectProps> = ({ profiles, onProfileSelect, onAddProfile, onProfileDelete }) => {
    // profileMain이 'M'인 프로필을 앞에 오도록 정렬
    const sortedProfiles = [...profiles].sort((a, b) => {
        if (a.profileMain === 'M' && b.profileMain !== 'M') {
            return -1; // 'M'인 프로필이 앞으로 오도록
        } else if (a.profileMain !== 'M' && b.profileMain === 'M') {
            return 1; // 'M'이 아닌 프로필이 뒤로 가도록
        } else {
            return 0; // 둘 다 'M'이 아니거나 둘 다 'M'인 경우 순서를 유지
        }
    });

    return (
        <div className={styles.profileSelectionPage}>
            <h1>계정을 선택해주세요.</h1>
            <div className={styles.profiles}>
                {sortedProfiles.map(profile => (
                    <div key={profile.profileNo} className={styles.profile}>
                        <img src={(profile.profileImg)}
                            alt={profile.profileName}
                            className={styles.profileImage}
                            onClick={() => onProfileSelect(profile)}
                        />
                        <h2 className={styles.profileName}>{profile.profileName}</h2>
                        {/* 메인 계정이 아닐 때만 삭제 버튼 표시 */}
                        {profile.profileMain !== 'M' && (
                            <button
                                className={styles.deleteButton}
                                onClick={() => onProfileDelete(profile)}
                            >
                                삭제
                            </button>
                        )}
                    </div>
                ))}
                {profiles.length < 4 && (
                    <div className={styles.addProfile} onClick={onAddProfile}>
                        <h2>+ 추가</h2>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileSelect;