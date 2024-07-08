import React from "react";
import events from '../../data/events.json'
import "./styles.css"

const EventList = () => {
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
                                <p>{event.name}</p>
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