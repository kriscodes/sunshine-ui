import React, { useState } from 'react';
import './styles.css';

const images = [
  '/image.jpeg',
  '/prek.jpg',
  '/hands.jpeg',
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPreviousSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="slider">
      <button className="left-arrow" onClick={goToPreviousSlide}>
        &#10094;
      </button>
      <img src={images[currentIndex]} alt="slider" className="slider-image" />
      <button className="right-arrow" onClick={goToNextSlide}>
        &#10095;
      </button>
      <div className="dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentIndex === index ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;