import React from "react";
import { Link } from 'react-router-dom';
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
                    <img className='footer-logo' src='/sunshine_logo.png' alt='sunshine' width='70%' />
                </div>
                <div style={{display: 'flex', justifyContent: 'space-evenly', zIndex:'99'}}>
                    <a href="https://www.instagram.com/sunshine_preschool2" target="_blank">
                        <img className='footer-logo' src='/instagram.png' alt='sunshine' width='48px' />
                    </a>
                    <a href="mailto:support@sunshinepreschool1-2.org">
                        <img className='footer-logo' src='/g-mail.png' alt='sunshine' width='48px' />
                    </a>
                    <a href="https://www.tiktok.com/@sunshine_preschool1" target="_blank">
                        <img className='footer-logo' src='/tiktok.png' alt='sunshine' width='48px' />
                    </a>
                </div>
                <span className="footer-link">
                    <Link to="/privacy-policy">
                        Privacy Policy
                    </Link>
                </span>
                <span  className="footer-link">
                    <Link to="/terms-of-use">
                        Terms of Use
                    </Link>
                </span>
                <span className="footer-copyright">
                    &copy; Copyright {currentYear} Sunshine Preschools
                </span>
            </div>
        </footer>
    )
}

export default Footer;