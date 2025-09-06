import React, {useEffect, useState} from "react";
import axios from "axios";
import "./styles.css"

const EventList = (props) => {

    const [events, setEvents] = useState([]);

    useEffect( () => {
        try{
          async function fetchEvents() {
            await axios.get('https://sunshine-api.onrender.com/events')
          .then(res => {
            const c = res.data;
            console.log(res.data);
            console.log(props.location);
            if(props.location === 'Lynwood') {
                console.log('inside props.location if statement');
                const filteredLynwoodData = c.filter((item) => {
                    console.log('inside filter for lynwood')
                    return item.location.includes('lynwood')
                })
                console.log(filteredLynwoodData);
                setEvents(filteredLynwoodData);
            }
            else if(props.location === 'Compton') {
                const filteredComptonData = c.filter((item) => {
                    return item.location.includes('Compton')
                })
                setEvents(filteredComptonData);
            }
            else {
                setEvents(c);
            }
          });
          }
          fetchEvents();
        }
        catch(err){
          console.log(err);
        }
      }, [])

    return (
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
    )
}

export default EventList;