import Header from '../../components/Header';
import ImageSlider from '../../components/ImageSlider';
import Footer from '../../components/Footer';
import TestimonialsGrid from "../../components/TestimonialsGrid";
import sunshineVideo from '../../assets/sunshine-web.mp4'; 
import sunshineVideoC from '../../assets/sunshine-web-2.mp4' ; 

import lunchMenu from '../../assets/enrollment_english.pdf';
import formES from '../../assets/enrollment_spanish.pdf';

const testimonialImages = [
  { src: "/testimonials/img-1.png", alt: "Smiling preschoolers painting at an easel" },
  { src: "/testimonials/img-2.png", alt: "Teacher reading a story to a small group" },
  { src: "/testimonials/img-3.png", alt: "Teacher reading a story to a small group" },
  { src: "/testimonials/img-4.png", alt: "Teacher reading a story to a small group" },
  { src: "/testimonials/img-5.png", alt: "Teacher reading a story to a small group" }
];

const images = [
  '/lawndale/A7402329.jpg',
  '/lawndale/A7402417.jpg',
  '/lawndale/A7402539.jpg',
  '/lawndale/IMG_3581.jpg',
  '/lawndale/IMG_3872.jpg',
  '/lawndale/IMG_8643.jpg',
  '/compton/image1.jpeg',
  '/compton/image2.jpeg',
  '/compton/image3.jpeg',
  '/compton/image4.jpeg',
  '/compton/image5.jpeg',
  '/compton/image6.jpeg',
  '/compton/image7.jpeg',
  '/compton/image8.jpg',
  '/compton/image9.jpg'
];

export default function About() {
  return (
    <div>
        <Header/>
          <ImageSlider
                    images={images}
                    videoSrc={sunshineVideo}  
                    videoSrc2={sunshineVideoC}
                    interval={7000}
                    fadeDuration={600}
                    holdBlack={220}
                    height="clamp(420px, 68vh, 900px)"
                    contentAlign="left"
                    minHeight="70vh"
                    debug
                    startAtIndex={0}
                  >
                </ImageSlider>
          <main style={{ padding: "24px 16px", maxWidth: 960, margin: "0 auto" }}>
            <h1 style={{ marginTop: 0 }}>About Us</h1>

            <section style={{ marginTop: 0 }}>
            <h2>Principal’s Message</h2>
            <p>
                <strong>Welcome!</strong> Thank you for popping in and making the time to get to know us
                better. My name is <strong>Yolanda Lopez</strong> and I am the Director of Sunshine
                Pre-School. I have been in the field of education my entire adult life and it is
                something that I am deeply passionate about.
            </p>
            <p>
                We&apos;ve been in business for 25 years and we&apos;re starting year 9 here at
                <strong> Sunshine Preschool 2</strong> and we hope for many many more years to come.
            </p>
            <p>Please feel free to stop by either of our centers, we can&apos;t wait to meet you!</p>
            <p style={{ opacity: 0.85 }}>— <em>Yolanda Lopez, Director</em></p>
            </section>

            <section style={{ marginTop: 32 }}>
                <h2>Testimonials</h2>
                <TestimonialsGrid images={testimonialImages} />
            </section>

            <section style={{ marginTop: 32 }}>
            <a href="/#contact">Contact Us</a>
            </section>
          </main>
          <Footer/>
      </div>
  );
}
