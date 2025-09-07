import React from 'react';
import Header from '../../components/Header';
import ImageSlider from '../../components/ImageSlider'
import EventList from '../../components/EventList';
import Footer from '../../components/Footer';

const images = [
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


function Compton() {

    return (
      <div>
          <Header/>
          <ImageSlider
            images={images}
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
            <div style={{ display: 'flex', justifyContent: "center", fontSize: '48px', fontWeight: 'bold' }}>
              Compton
            </div>
            <div style={{display: 'flex', justifyContent: "center"}}>
              <EventList location='Compton' />
            </div>
            
          </div>
          
          
          <Footer/>
      </div>
    );
  }
  
  export default Compton;