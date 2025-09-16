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
            if(props.location == 'Lynwood' || props.location == 'lynwood') {
                const filteredLynwoodData = c.filter((item) => {
                    return item.location.includes('lynwood')
                })
                setEvents(filteredLynwoodData);
            }
            else if(props.location == 'Compton' || props.location == 'compton') {
                const filteredComptonData = c.filter((item) => {
                    return item.location.includes('compton')
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