import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import EnrollmentForm from '../EnrollmentForm';
import './styles.css'

const ContactUs = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    reason: ''
  });

  const { handleSubmit, formState: { errors } } = useForm();

  const handleFirstNameChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleLastNameChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleReasonChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };


  const onSubmit = async (e) => {
    try {
      await axios.post('https://api.sunshinepreschool1-2.org/api/contacts', formData);
      const notify = () => toast.success("Success! Please check your email.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "light",
      });
      notify();
    } catch (error) {
      console.error('Error sending email', error);
    }
  };

  return (
    <div className='contact-container'>
      <div className='contact-form-container'>
        <h1>Contact Us</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='contact-item-container'>
            <input
              className='contact-input'
              type="text"
              name="first_name"
              placeholder='First Name'
              value={formData.firstName}
              onChange={handleFirstNameChange}
              required
            />
          </div>
          <div className='contact-item-container'>
            <input
              className='contact-input'
              type="text"
              name="last_name"
              placeholder='Last Name'
              value={formData.lastName}
              onChange={handleLastNameChange}
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
              onChange={handlePhoneChange}
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
              onChange={handleEmailChange}
            />
          </div>
          <div className='contact-item-container'>
            <select 
            name="reason" 
            className='contact-input'
            value={formData.reason} 
            onChange={handleReasonChange} 
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
        <EnrollmentForm/>
      </div>
      
      <ToastContainer />
    </div>
  );
};

export default ContactUs;