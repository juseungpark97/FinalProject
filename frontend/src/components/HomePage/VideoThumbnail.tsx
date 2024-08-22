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
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // IntersectionObserver를 사용해 비디오가 뷰포트에 들어왔을 때 로드
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && videoRef.current) {
                    videoRef.current.preload = 'auto';
                    videoRef.current.load();
                    observer.unobserve(videoRef.current); // 로드가 시작되면 관찰 중지
                }
            },
            { threshold: 0.1 }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, [video.url]);

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (videoRef.current && isVideoLoaded) {
            videoRef.current.play().catch(error => console.error('Video play was interrupted:', error));
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
        if (isHovered) { // 이미 호버 상태라면 로드되자마자 재생
            videoRef.current?.play().catch(error => console.error('Video play was interrupted:', error));
        }
    };

    const handleClick = () => {
        navigate(`/movie/${video.id}`);
    };

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
                className={styles.video}
                style={{ display: isHovered && isVideoLoaded ? 'block' : 'none' }}
                onLoadedData={handleLoadedData}
            >
                <source src={video.url} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
});

export default VideoThumbnail;
