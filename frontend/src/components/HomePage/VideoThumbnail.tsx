import React, { useRef, useEffect, useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './css/VideoThumbnail.module.css';

interface VideoThumbnailProps {
    video: {
        id: number;
        title: string;
        description: string;
        url: string;
        thumbnailUrl: string;
    };
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = memo(({ video }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isVideoError, setIsVideoError] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const navigate = useNavigate();

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (videoRef.current && isVideoLoaded) {
            videoRef.current.play().catch(error => {
                console.error('Video play was interrupted:', error);
            });
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    const handleLoadedData = () => {
        setIsVideoLoaded(true);
        setIsVideoError(false);
    };

    const handleError = () => {
        setIsVideoError(true);
    };

    const handleClick = () => {
        navigate(`/movie/${video.id}`);
    };

    // 비디오를 화면에 나타나기 전에 미리 로드
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.preload = 'auto'; // 비디오를 미리 로드하도록 설정
            videoRef.current.addEventListener('loadeddata', handleLoadedData);
            videoRef.current.addEventListener('error', handleError);
            videoRef.current.load(); // 비디오 로드 트리거

            return () => {
                videoRef.current?.removeEventListener('loadeddata', handleLoadedData);
                videoRef.current?.removeEventListener('error', handleError);
            };
        }
    }, [video.url]);

    return (
        <div
            className={styles.thumbnail}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            <img
                src={video.thumbnailUrl}
                alt={video.title}
                className={styles.thumbnailImage}
                style={{ display: isHovered && isVideoLoaded ? 'none' : 'block' }}
            />
            <video
                ref={videoRef}
                muted
                preload="auto"
                className={styles.video}
                style={{ display: isHovered && isVideoLoaded ? 'block' : 'none' }}
            >
                <source src={video.url} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            {isVideoError && (
                <div className={styles.error}>비디오를 로드하는 데 실패했습니다.</div>
            )}
        </div>
    );
});

export default VideoThumbnail;
