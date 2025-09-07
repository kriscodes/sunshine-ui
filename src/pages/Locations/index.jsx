import React from 'react';
import Header from '../../components/Header';
import ImageSlider from '../../components/ImageSlider'
import EventList from '../../components/EventList';
import Footer from '../../components/Footer';
import "./styles.css"
import { Link } from 'react-router-dom';
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