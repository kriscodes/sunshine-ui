import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ImageSlider from '../../components/ImageSlider';
import ProgramList from '../../components/ProgramList'
import TourForm from '../../components/TourForm';

function Programs() {
  return (
    <>
        <Header/>
        <ImageSlider/>

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