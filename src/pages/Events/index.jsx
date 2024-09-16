import React from 'react';
import Header from '../../components/Header';
import ImageSlider from '../../components/ImageSlider';
import EventList from '../../components/EventList';
import Footer from '../../components/Footer';

function Events() {
  return (
    <div>
          <Header/>
          <ImageSlider/>
          <div style={{ margin: '64px 0' }}>
            <div style={{display: 'flex', justifyContent: "center"}}>
              <EventList/>
            </div>
            
          </div>
          
          
          <Footer/>
      </div>
  );
}

export default Events;