import React from 'react';
import './styles.css';
import Header from '../../components/Header';
import ImageSlider from '../../components/ImageSlider';
import Submenu from '../../components/Subheader';
import MissionStatement from '../../components/MissionStatement';

function Home() {
  return (
    <div>
        <Header/>
        <ImageSlider/>
        <Submenu/>
        <div className="container">
            <MissionStatement/>
        </div>
    </div>
  );
}

export default Home;