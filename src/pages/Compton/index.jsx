import {useState, useEffect} from 'react';
import Header from '../../components/Header';
import ImageSlider from '../../components/ImageSlider'
import Footer from '../../components/Footer';
import axios from 'axios';
import './index.css';

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
    <main className="lynwood">
      <Header/>
      <ImageSlider
        images={images}
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
      <section className="lynwood__hero" aria-labelledby="lynwood-title">
        <div className="lynwood__heroInner">
          <h1 id="lynwood-title" className="lynwood__title">Compton Campus</h1>
          <p className="lynwood__subtitle">Upcoming events</p>
        </div>
      </section>
        {/* Events section — KEEP YOUR EXISTING EVENT CARDS HERE */}
      <section className="lynwood__events" aria-labelledby="lynwood-events-title">
        

        {/* ───────────── DO NOT CHANGE THE EVENT CARDS ─────────────
            Put your existing event list/component exactly here.
            Example: <EventsList location="lynwood" /> or your current map() of cards.
        */}
        <div className="lynwood__eventsList">
          {/*
            ⬇️ Keep your existing event cards code here. For example:
            {events.map(e => <EventCard key={e.id} {...e} />)}
          */}
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
                              <h2>{event?.name}</h2>
                              <h3>Compton</h3>
                              <h4>{formattedDate}</h4>
                              <p>{event?.description}</p>
                          </div>
                      </div>
                    );
                })}
            </div>
          }
        </div>
        {/* ───────────── END: YOUR EXISTING EVENT CARDS ───────────── */}
      </section>
            
      <Footer/>
    </main>
  );
}
export default Lynwood;