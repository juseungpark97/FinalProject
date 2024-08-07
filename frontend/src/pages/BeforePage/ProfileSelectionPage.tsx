import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Profile {
    profileNo: number;
    image: string;
    name: string;
    user: {
        userNo: number;
    };
}

const ProfileSelectionPage: React.FC = () => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
    const [newProfileName, setNewProfileName] = useState('');
    const [newProfileImage, setNewProfileImage] = useState<File | null>(null);

    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (userString) {
            try {
                const user = JSON.parse(userString);
                const userNo = user.userNo;

                if (userNo) {
                    axios.get(`/api/profiles/user/${userNo}`)
                        .then(response => {
                            setProfiles(response.data);
                        })
                        .catch(error => {
                            console.error('Error fetching profiles:', error);
                        });
                } else {
                    console.error('User number is missing in user data');
                }
            } catch (e) {
                console.error('Failed to parse user data:', e);
            }
        } else {
            console.error('No user data in local storage');
        }
    }, []);

    const handleProfileSelect = (profile: Profile) => {
        setSelectedProfile(profile);
        // TODO: 프로필 선택 후 필요한 작업 수행
    };

    const handleCreateProfile = () => {
        if (profiles.length >= 4) {
            alert('You can create up to 4 profiles.');
            return;
        }

        const userString = localStorage.getItem('user');
        if (userString) {
            try {
                const user = JSON.parse(userString);
                const userNo = user.userNo;

                if (userNo && newProfileName && newProfileImage) {
                    const formData = new FormData();
                    formData.append('userNo', userNo);
                    formData.append('name', newProfileName);
                    formData.append('image', newProfileImage);

                    axios.post('/api/profiles/create', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                        .then(response => {
                            setProfiles([...profiles, response.data]);
                            setNewProfileName('');
                            setNewProfileImage(null);
                        })
                        .catch(error => {
                            console.error('Error creating profile:', error);
                        });
                } else {
                    console.error('User number, profile name or image is missing');
                }
            } catch (e) {
                console.error('Failed to parse user data:', e);
            }
        } else {
            console.error('No user data in local storage');
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setNewProfileImage(event.target.files[0]);
        }
    };

    return (
        <div>
            <h1>Select a Profile</h1>
            <div className="profiles">
                {profiles.map(profile => (
                    <div key={profile.profileNo} className="profile" onClick={() => handleProfileSelect(profile)}>
                        <img src={`/profile-images/${profile.image}`} alt={profile.name} />
                        <h2>{profile.name}</h2>
                    </div>
                ))}
            </div>
            {selectedProfile && (
                <div>
                    <h2>Selected Profile:</h2>
                    <img src={`/profile-images/${selectedProfile.image}`} alt={selectedProfile.name} />
                    <h2>{selectedProfile.name}</h2>
                </div>
            )}
            <div>
                <h2>Create a New Profile</h2>
                <input
                    type="text"
                    placeholder="Profile Name"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                />
                <input
                    type="file"
                    onChange={handleFileChange}
                />
                <button onClick={handleCreateProfile} disabled={profiles.length >= 4}>Create Profile</button>
                {profiles.length >= 4 && <p>You can create up to 4 profiles.</p>}
            </div>
        </div>
    );
};

export default ProfileSelectionPage;