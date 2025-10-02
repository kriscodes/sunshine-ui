import Header from "../../components/Header";
import ImageSlider from "../../components/ImageSlider";
import Footer from "../../components/Footer";
import sunshineVideo from '../../assets/sunshine-web.mp4'; 
import sunshineVideoC from '../../assets/sunshine-web-2.mp4' ; 
import ScheduleList from "../../components/ScheduleList";

const bellSchedule = [
  { label: "School Opens",             start: "06:30" },
  { label: "Snack Time",               start: "09:30", end: "10:30" },
  { label: "Lunch Time",               start: "11:25" },
  { label: "Nap Time",                 start: "12:00", end: "14:30" },
  { label: "Snack",                    start: "15:30" },
  { label: "Afterschool Arrival Time", start: "15:35" },
  { label: "School Closes",            start: "17:30" },
];

const lunchMenuString = "Download latest lunch menu";

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

function FamilyResources() {
  return (
    <>
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
        <h1 style={{ marginTop: 0 }}>Family Resources</h1>

        <section id="bell-schedule" style={{ marginTop: 16 }}>
          <h2>Bell Schedule</h2>
          <ScheduleList items={bellSchedule} />
        </section>

        <section id="calendar" style={{ marginTop: 32 }}>
          <h2>Calendar</h2>
          <p>We will scan and post the latest calendar each month.</p>
          <p><a href="/docs/October 2025 calendar.pdf" target="_blank">Download latest calendar</a></p>
          <p style={{ opacity: 0.8, fontSize: 14 }}>
            Tip: You can also version files (e.g., <code>/docs/calendar-YYYY-MM.pdf</code>).
          </p>
        </section>

        <section id="lunch-menu" style={{ marginTop: 32 }}>
          <h2>Lunch Menu</h2>
          <p>We will scan and post the latest lunch menu each month.</p>
          <p><a  href="/docs/image0.png" target="_blank">October Breakfast Menu</a></p>
          <p><a  href="/docs/image1.png" target="_blank">October Snack Menu</a></p>
          <p><a  href="/docs/image2.png" target="_blank">October Lunch Menu</a></p>
          <p><a  href="/docs/image3.png" target="_blank">October Dinner Menu</a></p>
           
        </section>

        <section id="drew" style={{ marginTop: 32 }}>
          <h2>Drew</h2>
          <p>
            <a href="https://drewcdc.org/services/child-care/" target="_blank" rel="noopener noreferrer">
              Child Care Subsidy in South LA | DrewCDC
            </a>
          </p>
        </section>

        <section id="crystal-stairs" style={{ marginTop: 24 }}>
          <h2>Crystal Stairs</h2>
          <p>
            <a
              href="https://www.crystalstairs.org/parents-families/child-care-assistance-program-eligibility-2-2/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Child Care Assistance Program Eligibility - Crystal Stairs
            </a>
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default FamilyResources;

function DownloadIcon() {
  return (
    <svg
      aria-hidden
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      style={{ marginRight: 8, flex: '0 0 auto' }}
    >
      <path d="M12 3v12m0 0l-5-5m5 5l5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 21h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}