import React from 'react';
import Header from '../../components/Header';
import ImageSlider from '../../components/ImageSlider'
import EventList from '../../components/EventList';
import Footer from '../../components/Footer';
import "./styles.css"
import { Link } from 'react-router-dom';

const LocationCard = (props) => {
  const {name, description} = props;
  return (
    
      <div className="location-card">
        <Link to={props.name === "Compton" ? "/compton" : "/lynwood"} className="link">
          <p className="location-name">
            {name}
          </p>
          <img src={props.name === "Compton" ? "/sunshinecom.jpg" : "/sunshinelyn.jpg"} alt="" width="400" />
        </Link>
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
            <LocationCard name="Compton"/>
            <LocationCard name="Lynwood"/>
          </div>
          
        </div>
        
        
        <Footer/>
    </div>
  );
}

export default Locations;