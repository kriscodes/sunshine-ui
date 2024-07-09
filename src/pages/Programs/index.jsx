import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ImageSlider from '../../components/ImageSlider';
import ProgramList from '../../components/ProgramList'

function Programs() {
  return (
    <>
        <Header/>
        <ImageSlider/>

        <div style={{ margin: '64px 0' }}>
          <div style={{display: 'flex', justifyContent: "center"}}>
            <div>
              <ProgramList/>
            </div>
          </div>
          
        </div>
        
        
        <Footer/>
    </>
  );
}

export default Programs;