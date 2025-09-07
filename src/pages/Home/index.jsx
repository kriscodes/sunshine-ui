import React from 'react';
import './styles.css';
import Header from '../../components/Header';
import ImageSlider from '../../components/ImageSlider';
import Submenu from '../../components/Subheader';
import MissionStatement from '../../components/MissionStatement';
import { TextTestimonial, VideoTestimonial } from '../../components/Testimonials';
import ContactUs from '../../components/ContactUs';
import TourForm from '../../components/TourForm';
import Footer from '../../components/Footer';
import YouTubeEmbed from '../../components/YouTubeEmbed'
import sunshineVideo from '../../assets/sunshine-web.mp4'; // bundle-managed URL
import FormsQuickLinks from '../../components/FormsQuickLinks';

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

function Home() {
  let n = Math.random() * 2;
  let l = n > 1 ? 'c' : 'l';
  console.log(n);
  console.log(sunshineVideo)
  return (
    <div>
        <Header/>
        <ImageSlider
          images={images}
          videoSrc={sunshineVideo}  // ✅ pass video separately; plays last, then resets to first image
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
        
        <div className="container">
            <MissionStatement/>
            <FormsQuickLinks
              englishHref="/forms/enrollment-english.pdf"
              spanishHref="/forms/enrollment-spanish.pdf"
            />
            <TextTestimonial/>
            <YouTubeEmbed
              url="https://youtube.com/shorts/ypzhv0q1byI"
              title="A day at Sunshine"
              // Optional overrides:
              // aspect="16 / 9"           // force 16:9 instead of auto
              // maxWidth="min(100%, 720px)" // adjust width if desired
            />
            <TourForm/>
            <Footer/>
        </div>
        
    </div>
  );
}

export default Home;