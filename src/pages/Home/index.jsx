import React from 'react';
import './styles.css';
import Header from '../../components/Header';
import ImageSlider from '../../components/ImageSlider';
import Submenu from '../../components/Subheader';
import MissionStatement from '../../components/MissionStatement';
import { TextTestimonial, VideoTestimonial } from '../../components/Testimonials';
import ContactUs from '../../components/ContactUs';
import TourForm from '../../components/TourForm';
import Footer from '../../components/Footer';

function Home() {
  let n = Math.random() * 2;
  let l = n > 1 ? 'c' : 'l';
  console.log(n);
  return (
    <div>
        <Header/>
        <ImageSlider location={l}/>
        {/*<Submenu/>*/}
        <div className="container">
            <MissionStatement/>
            <TextTestimonial/>
            {/*<VideoTestimonial/>*/}
            <ContactUs/>
            <TourForm/>
            <Footer/>
        </div>
        
    </div>
  );
}

export default Home;