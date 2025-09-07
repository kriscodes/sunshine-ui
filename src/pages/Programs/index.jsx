import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ImageSlider from '../../components/ImageSlider';
import ProgramList from '../../components/ProgramList'
import TourForm from '../../components/TourForm';
import sunshineVideo from '../../assets/sunshine-web.mp4'; // bundle-managed URL

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

function Programs() {
  return (
    <>
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

        <div style={{ margin: '64px 0' }}>
          <div style={{textAlign: 'center'}}>
            <h1>Classrooms</h1>
            <div>
              <ProgramList/>
            </div>
          </div>
          <div>
            <TourForm/>
          </div>
        </div>
        
        
        <Footer/>
    </>
  );
}

export default Programs;