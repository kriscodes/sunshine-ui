import React, {useEffect, useState} from "react";
import axios from "axios";
import "./styles.css"

const EventList = () => {

    const [events, setEvents] = useState([]);

    useEffect( () => {
        try{
          async function fetchEvents() {
            await axios.get('https://dev.api.sunshinepreschool1-2.org/api/events')
          .then(res => {
            const c = res.data;
            setEvents(c);
            console.log(c);
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
            <div className="event-list-container">
                {events.map((event, index) => {
                    return (
                        <div className="event-container">
                            <img src="/kids.jpg" alt="" width="160" />
                            <div>
                                <p>{event.title}</p>
                                <p>{event.location}</p>
                                <p>{event.date}</p>
                                <p>{event.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default EventList;