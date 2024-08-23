import React, { useState } from 'react';
import styles from '../../components/BeforePage/css/ProfileSelect.module.css';
import { Profile } from '../../types/Profile';

interface ProfileSelectProps {
    profiles: Profile[];
    onProfileSelect: (profile: Profile) => void;
    onAddProfile: () => void;
    onProfileDelete: (profile: Profile) => void;
    highestScoreProfile: Profile | null;
}

const ProfileSelect: React.FC<ProfileSelectProps> = ({ profiles, onProfileSelect, onAddProfile, onProfileDelete, highestScoreProfile }) => {
    // 메인 계정을 앞에 두는 로직
    const sortedProfiles = [...profiles].sort((a, b) => {
        if (a.profileMain === 'M' && b.profileMain !== 'M') {
            return -1; // 메인 계정이 앞으로 오도록 정렬
        } else if (a.profileMain !== 'M' && b.profileMain === 'M') {
            return 1;
        } else {
            return 0;
        }
    });

    const handleProfileClick = (profile: Profile) => {
        onProfileSelect(profile);  // 프로필 클릭 시 상위 컴포넌트에 이벤트 전달
    };

    return (
        <div className={styles.profileSelectionPage}>
            <h1>계정을 선택해주세요.</h1>
            <div className={styles.profiles}>
                {sortedProfiles.map(profile => (
                    <div key={profile.profileNo} className={styles.profile}>
                        <div className={styles.crownContainer}>
                            {/* 하이스코어 프로필에만 왕관 아이콘 추가 */}
                            {highestScoreProfile && highestScoreProfile.profileNo === profile.profileNo && (
                                <div className={styles.crown}></div>
                            )}
                            <img
                                src={profile.profileImg}
                                alt={profile.profileName}
                                className={styles.profileImage}
                                onClick={() => handleProfileClick(profile)}
                            />
                        </div>
                        <h2 className={styles.profileName}>{profile.profileName}</h2>
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