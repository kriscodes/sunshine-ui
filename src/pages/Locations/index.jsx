import React from 'react';
import Header from '../../components/Header';
import ImageSlider from '../../components/ImageSlider'
import EventList from '../../components/EventList';
import Footer from '../../components/Footer';
import "./styles.css"


const Location = (props) => {
  const {name, description} = props;
  return (
    <div className="location-card">
      <p className="location-name">
        {name}
      </p>

      <p>
      Lorem Ipsum is simply dummy text of the printing and 
      typesetting industry. Lorem Ipsum has been the industry's 
      standard dummy text ever since the 1500s, when an unknown 
      printer took a galley of type and scrambled it to make a 
      type specimen book. It has survived not only five 
      centuries, but also the leap into electronic typesetting, 
      remaining essentially unchanged. It was popularised in the 
      1960s with the release of Letraset sheets containing Lorem 
      Ipsum passages, and more recently with desktop publishing 
      software like Aldus PageMaker including versions of Lorem Ipsum.
      </p>
    </div>
  );
}

function Locations() {

  return (
    <div>
        <Header/>
        <ImageSlider/>
        <div style={{ margin: '64px 0' }}>
          <div style={{ display: 'flex', justifyContent: "center" }}>
            <Location name="Compton"/>
            <Location name="Lynwood"/>
          </div>
          <div style={{display: 'flex', justifyContent: "center"}}>
            <EventList/>
          </div>
          
        </div>
        
        
        <Footer/>
    </div>
  );
}

export default Locations;