// src/pages/HomePage/components/SliderSection.tsx

import React from 'react';
import Slider from 'react-slick';
import { Movie } from '../../pages/HomePage/services/interfaces';
import VideoThumbnail from './VideoThumbnail';
import styles from '../../pages/HomePage/css/HomePage.module.css';

interface SliderSectionProps {
    title: string;
    movies: Movie[];
}

const SliderSection: React.FC<SliderSectionProps> = ({ title, movies }) => {
    const getSliderSettings = (movieCount: number) => ({
        dots: false,
        infinite: movieCount > 4,
        speed: 600,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: movieCount > 2
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1,
                    infinite: movieCount > 1
                }
            }
        ]
    });

    return (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{title}</h2>
            <Slider {...getSliderSettings(movies.length)} className={styles.tileRows}>
                {movies.map((movie, index) => (
                    <div className={styles.tile} key={index}>
                        <VideoThumbnail video={movie} />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default SliderSection;
