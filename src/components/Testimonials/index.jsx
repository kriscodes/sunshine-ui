import React, { useEffect, useState } from "react";
import { ImQuotesLeft, ImQuotesRight } from "react-icons/im";

import './styles.css';

export const Testimonial = ({ quote, author }) => {
  return (
    <div className="testimonial">
      <p className="quote">
        <span className="quote-mark">
            <ImQuotesLeft />
        </span>
        {quote}
        <span className="quote-mark">
            <ImQuotesRight />
        </span>
      </p>
      <p className="author">- {author}</p>
    </div>
  );
};

export const TextTestimonial = () => {
    
    return (
        <div className="testimonial-container">
            <div className="testimonial-title">
                Testimonials
            </div>
            <div>
            <Testimonial quote="Lorem ipsum dolor sit amet, consectetur 
                adipiscing elit, sed do eiusmod tempor incididunt 
                ut labore et dolore magna aliqua."
                author="A person's name"/>
            </div>
            <div>
            <Testimonial quote="Lorem ipsum dolor sit amet, consectetur 
                adipiscing elit, sed do eiusmod tempor incididunt 
                ut labore et dolore magna aliqua."
                author="A person's name"/>
            </div>
        </div>
    )
}

export const VideoTestimonial = () => {
    const [width, setWidth] = useState(window.innerWidth);
    let iframeWidth = "560"
    useEffect(() => {
        if(width < 700) {
            iframeWidth = "255";
        }
    }, [width])

    return (
        <div className="testimonial-video-container">
            <iframe 
                id='testimonial-video'
                src="https://www.youtube.com/embed/-oynJiQ8ZJ8?si=Ih6OUeolusNRgF1L" 
                title="YouTube video player" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerpolicy="strict-origin-when-cross-origin" 
                allowfullscreen
            >
            </iframe>
        </div>
    )
}