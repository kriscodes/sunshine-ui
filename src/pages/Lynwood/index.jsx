import React from 'react';
import Header from '../../components/Header';
import ImageSlider from '../../components/ImageSlider'
import EventList from '../../components/EventList';
import Footer from '../../components/Footer';


function Lynwood() {

    return (
      <div>
          <Header/>
          <ImageSlider location='l'/>
          <div style={{ margin: '64px 0' }}>
            <div style={{ display: 'flex', justifyContent: "center", fontSize: '48px', fontWeight: 'bold' }}>
              Lynwood
            </div>
            <div style={{display: 'flex', justifyContent: "center"}}>
              <EventList location='Lynwood' />
            </div>
            
          </div>
          <Footer/>
      </div>
    );
  }
  
  export default Lynwood;