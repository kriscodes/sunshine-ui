import React from 'react';
import './styles.css';
import Header from '../../components/Header';
import ImageSlider from '../../components/ImageSlider';
import Submenu from '../../components/Subheader';
import MissionStatement from '../../components/MissionStatement';
import { TextTestimonial, VideoTestimonial } from '../../components/Testimonials';

function Home() {
  return (
    <div>
        <Header/>
        <ImageSlider/>
        <Submenu/>
        <div className="container">
            <MissionStatement/>
            <TextTestimonial/>
            <VideoTestimonial/>
        </div>
    </div>
  );
}

export default Home;