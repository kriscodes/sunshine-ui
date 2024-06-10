import React from "react";
import './styles.css'

const Footer = () => {
    let currentYear = new Date().getFullYear()
    return (
        <footer className="footer-container">
            <div className="footer-text-container">
                <span className="footer-title">
                    Sunshine Preschool - Lynwood
                </span>
                <span className="footer-address">
                    12070 Santa Fe Ave, <br/>
                    Lynwood, CA 90262 <br/>
                    (310) 762-2558
                </span>
                <span className="footer-title">
                    Sunshine Preschool - Compton
                </span>
                <span className="footer-address">
                    2038 E Compton Blvd, <br/>
                    Compton, CA 90221 <br/>
                    (424) 338-3053
                </span>
            </div>
            <div className="footer-links-container">
                <div>
                    <img className='footer-logo' src='/sunshine.jpeg' alt='sunshine' width='70%' />
                </div>
                <span className="footer-link">
                    <a href="">
                        Enrolmment
                    </a>
                </span>
                <span className="footer-link">
                    <a href="">
                        Privacy Policy
                    </a>
                </span>
                <span  className="footer-link">
                    <a href="">
                        Terms of Use
                    </a>
                </span>
                <span className="footer-copyright">
                    &copy; Copyright {currentYear} Sunshine Preschools
                </span>
            </div>
        </footer>
    )
}

export default Footer;