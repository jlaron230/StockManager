import React, { useState, useEffect } from 'react';
import Spray from '@assets/image/Spray.jpg'

const ProduitSection =({ autoSlide = true, autoSlideInterval = 8000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const images = [
        `${Spray}`,
        `${Spray}`,
        `${Spray}`
    ];

    useEffect(() => {
        if (autoSlide) {
            const slideInterval = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
            }, autoSlideInterval);
            return () => clearInterval(slideInterval);
        }
    }, [autoSlide, autoSlideInterval, images.length]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <div className="relative w-full max-w-3xl mx-auto">
            <div className="overflow-hidden relative h-64">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-transform transform ${
                            index === currentIndex ? 'translate-x-0' : 'translate-x-full'
                        }`}
                    >
                        <img src={image} alt={`Slide ${index}`} className="w-full h-full object-cover" />
                    </div>
                ))}
            </div>
            <button
                className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white p-2"
                onClick={prevSlide}
            >
                Prev
            </button>
            <button
                className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white p-2"
                onClick={nextSlide}
            >
                Next
            </button>
        </div>
    )
}
export default ProduitSection