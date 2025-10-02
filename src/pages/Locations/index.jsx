import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import ImageSlider from '../../components/ImageSlider';
import sunshineVideo from '../../assets/sunshine-web.mp4'; 
import Footer from '../../components/Footer';
import './index.css';

const images = [
  '/lawndale/A7402329.jpg',
  '/lawndale/A7402417.jpg',
  '/lawndale/A7402539.jpg',
  '/lawndale/IMG_3581.jpg',
  '/lawndale/IMG_3872.jpg',
  '/lawndale/IMG_8643.jpg',
  '/compton/image1.jpeg',
  '/compton/image2.jpeg',
  '/compton/image3.jpeg',
  '/compton/image4.jpeg',
  '/compton/image5.jpeg',
  '/compton/image6.jpeg',
  '/compton/image7.jpeg',
  '/compton/image8.jpg',
  '/compton/image9.jpg'
];

export default function Locations() {
  const tiles = [
    {
      to: '/lynwood',
      title: 'Sunshine Preschool – Lynwood',
      img: '/sunshinelyn.jpg', 
      alt: 'Children playing at the Lynwood campus',
    },
    {
      to: '/compton',
      title: 'Sunshine Preschool – Compton',
      img: '/sunshinecom.jpg', 
      alt: 'Classroom activities at the Compton campus',
    },
  ];

  return (
    <div className="locations">
      <Header/>
              <ImageSlider
                images={images}
                videoSrc={sunshineVideo}  
                interval={7000}
                fadeDuration={600}
                holdBlack={220}
                height="clamp(420px, 68vh, 900px)"
                contentAlign="left"
                minHeight="70vh"
                debug
                startAtIndex={999}
              >
      
            </ImageSlider>
      <header className="locations__header">
        <h1 className="locations__title">Our Locations</h1>
        <p className="locations__subtitle">Choose a campus to learn more.</p>
      </header>

      <section className="locations__grid" aria-label="Campus links">
        {tiles.map((t) => (
          <Link key={t.to} to={t.to} className="locCard" aria-label={t.title}>
            <figure className="locCard__media">
              <img
                className="locCard__image"
                src={t.img}
                alt={t.alt}
                loading="lazy"
                decoding="async"
                onError={(e) => { e.currentTarget.style.opacity = 0.0; }}
              />
              <figcaption className="locCard__label">{t.title}</figcaption>
            </figure>
          </Link>
        ))}
      </section>
      <Footer/>
    </div>
  );
}
