import {useState, useEffect} from 'react';
import Header from '../../components/Header';
import ImageSlider from '../../components/ImageSlider'
import Footer from '../../components/Footer';
import axios from 'axios';
import './styles.css';

const images = [
  '/lawndale/A7402329.jpg',
  '/lawndale/A7402417.jpg',
  '/lawndale/A7402539.jpg',
  '/lawndale/IMG_3581.jpg',
  '/lawndale/IMG_3872.jpg',
  '/lawndale/IMG_8643.jpg',
]

function Lynwood() {

  const [events, setEvents] = useState();

  useEffect( () => {
    async function fetchEvents() {
      await axios.get('https://sunshine-api.onrender.com/events')
      .then(res => {
        const c = res.data;
        const filteredData = c.filter((item) => {
          return item.location.includes('lynwood')
        })
        setEvents(filteredData);
      })
    };
    
    fetchEvents();
    
  }, [])

  return (
    <div>
      <Header/>
      <ImageSlider
        images={images}
        interval={7000}
        fadeDuration={600}
        holdBlack={220}
        height="clamp(420px, 68vh, 900px)"
        contentAlign="left"
      >
      </ImageSlider>
      <div style={{ margin: '64px 0' }}>
        <div style={{ display: 'flex', justifyContent: "center", fontSize: '48px', fontWeight: 'bold' }}>
          Lynwood
        </div>
        <div style={{display: 'flex', justifyContent: "center"}}>
          <div>
            <p className="event-title">
                Events
            </p>
            {events && 
            <div className="event-list-container">
                {events.map((event, index) => {
                  const dateObject = new Date(event?.date);

                  const month = dateObject.getMonth() + 1; // getMonth() is 0-indexed
                  const day = dateObject.getDate();
                  const year = dateObject.getFullYear();

                  const formattedDate = `${month}/${day}/${year}`;
                    return (
                      <div class="event-card" key={index}>
                          <div>
                              <p>{event?.name}</p>
                              <p>Lynwood</p>
                              <p>{formattedDate}</p>
                              <p>{event?.description}</p>
                          </div>
                      </div>
                    );
                })}
            </div>
            }
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
export default Lynwood;