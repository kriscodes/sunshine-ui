import React, {useState, useEffect} from 'react';
import Header from '../../components/Header';
import ImageSlider from '../../components/ImageSlider'
import EventList from '../../components/EventList';
import Footer from '../../components/Footer';


function Lynwood() {

  const [events, setEvents] = useState();

  useEffect( () => {
        
        async function fetchEvents() {
          await axios.get('https://sunshine-api.onrender.com/events')
        .then(res => {
          const c = res.data;
          console.log('res.data', res.data);
          
          console.log('inside props.location if statement');
          const filteredData = c.filter((item) => {
              console.log('inside filter for lynwood')
              return item.location.includes('lynwood')
          })
          console.log(filteredData);
          setEvents(filteredData);
          })
        };
        
        fetchEvents();
        
      }, [])

    return (
      <div>
          <Header/>
          <ImageSlider location='l'/>
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
                    console.log(event)
                    return (
                        <div className="event-container" key={index}>
                            <div>
                                <p>{event?.name}</p>
                                <p>{event?.location}</p>
                                <p>{event?.date}</p>
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