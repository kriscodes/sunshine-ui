import React, { useState } from 'react';
import './styles.css'
import axios from 'axios';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    reason: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/sendEmail', formData);
      alert('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email', error);
      alert('Failed to send email.');
    }
  };

  return (
    <div className='contact-container'>
      <div className='contact-form-container'>
        <h1>Contact Us</h1>
        <form onSubmit={handleSubmit}>
          <div className='contact-item-container'>
            <input
              className='contact-input'
              type="text"
              name="firstName"
              placeholder='First Name'
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className='contact-item-container'>
            <input
              className='contact-input'
              type="text"
              name="lastName"
              placeholder='Last Name'
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className='contact-item-container'>
            <input
              className='contact-input'
              type="tel"
              name="phone"
              placeholder='Phone Number'
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className='contact-item-container'>
            <input
              className='contact-input'
              type="email"
              name="email"
              placeholder='Email'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className='contact-item-container'>
            <select 
            name="reason" 
            className='contact-input'
            value={formData.reason} 
            onChange={handleChange} 
            required
            >
              <option value="">Reason for Call</option>
              <option value="support">Support</option>
              <option value="sales">Sales</option>
              <option value="general">General Inquiry</option>
            </select>
          </div>
          <div className='contact-item-container'>
            <button 
            className='contact-button'
            type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
      <div className='contact-form-container'>
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
    </div>
  );
};

export default ContactUs;