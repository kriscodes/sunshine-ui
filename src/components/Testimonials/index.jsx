import React, { useEffect, useState } from "react";
import './styles.css';

export const TextTestimonial = () => {
    
    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <div>
                Testimonials
            </div>
            <div className="test-container-m">
                <div className="test-container-t">
                    <span>
                        "Lorem ipsum dolor sit amet, consectetur 
                        adipiscing elit, sed do eiusmod tempor incididunt 
                        ut labore et dolore magna aliqua."
                    </span>
                    <span>
                        - This is a persons name
                    </span>
                </div>
                <div className="test-container-b">
                    <p>
                        "Duis aute irure dolor in reprehenderit in 
                        voluptate velit esse cillum dolore eu fugiat 
                        nulla pariatur."
                    </p>
                    <span>
                        - A persons name
                    </span>
                </div>
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