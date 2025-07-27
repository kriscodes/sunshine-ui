import React, { useState, useEffect } from 'react';
import './styles.css';

const images1 = [
  '/lawndale/A7402329.jpg',
  '/lawndale/A7402417.jpg',
  '/lawndale/A7402539.jpg',
  '/lawndale/IMG_3581.jpg',
  '/lawndale/IMG_3872.jpg',
  '/lawndale/IMG_8643.jpg'
];

const images2 = [
  '/compton/image1.jpeg',
  '/compton/image2.jpeg',
  '/compton/image3.jpeg',
  '/compton/image4.jpeg',
  '/compton/image5.jpeg',
  '/compton/image6.jpeg',
  '/compton/image7.jpeg',
  '/compton/image8.jpg',
  '/compton/image9.jpg',
]

const ImageSlider = (props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const {location} = props;

  const goToNextSlide = () => {
    let images = location === "c" ? images2 : images1;
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const intervalId = setInterval(goToNextSlide, 5000); 
    return () => clearInterval(intervalId);
  }, []); 

  const goToPreviousSlide = () => {
    let images = location === "c" ? images2 : images1;
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
      <img src={location === 'c' ? images2[currentIndex] : images1[currentIndex]} alt="slider" className="slider-image" />
      <button className="right-arrow" onClick={goToNextSlide}>
        &#10095;
      </button>
      <div className="dots">
        {location === 'c' ? images2.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentIndex === index ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        )) : images1.map((_, index) => (
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