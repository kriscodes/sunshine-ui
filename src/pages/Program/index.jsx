import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ImageSlider from '../../components/ImageSlider';
import TourForm from '../../components/TourForm';

const Program = () => {
  return (
    <>
        <Header/>
        <ImageSlider/>

        <div style={{ margin: '64px 0' }}>
          <div style={{display: 'flex', justifyContent: "center"}}>
            <div>
              
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

export default Program;