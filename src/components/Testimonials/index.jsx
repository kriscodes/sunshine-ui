import React from "react";
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
                    <div class="line-t"></div>
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

    return (
        <div style={{ padding: "60px 0" }}>
            <iframe 
                width="560" 
                height="315" 
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