import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ImageSlider from '../../components/ImageSlider';
import ProgramList from '../../components/ProgramList'
import TourForm from '../../components/TourForm';
import sunshineVideo from '../../assets/sunshine-web.mp4'; 

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
        <div style={{ margin: '64px 0' }}>
          <div style={{ padding: "24px 16px", maxWidth: 960, margin: "0 auto" }}>
            <h1>Classrooms</h1>
            <p>
              Here at Sunshine we use a play based approach to learning, our students are under the instruction of qualified teachers 
              who have really embraced the play based model. We prioritize structure, routine, and outdoor play. When our students know 
              what to expect during the day, it creates emotional security and predictability by building their confidence and independence. 
              Each classroom is designed with their age and developmental stage in mind. Click below for more details by age.
            </p>
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