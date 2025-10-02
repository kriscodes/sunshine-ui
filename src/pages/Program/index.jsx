import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ImageSlider from '../../components/ImageSlider';
import TourForm from '../../components/TourForm';

const Program = (props) => {
  const { name, description } = props;
  console.log(props);
  return (
    <>
        <Header/>
        <ImageSlider/>

        <div style={{ margin: '64px 0' }}>
          <div style={{display: 'flex', justifyContent: "center"}}>
            <div>
              {name}
              {description}
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
export default Program;