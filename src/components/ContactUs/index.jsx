import React, { useState } from 'react';
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
    <div style={{ display: 'flex', flexDirection: 'row', padding: '20px' }}>
      <div style={{ flex: 1, marginRight: '20px' }}>
        <h1>Contact Us</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Phone Number:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Reason for Call:</label>
            <select name="reason" value={formData.reason} onChange={handleChange} required>
              <option value="">Select a reason</option>
              <option value="support">Support</option>
              <option value="sales">Sales</option>
              <option value="general">General Inquiry</option>
            </select>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
      <div style={{ flex: 1 }}>
        <h2>Our Addresses</h2>
        <p>123 Main St, Cityville, ST 12345</p>
        <p>456 Side St, Townsville, ST 67890</p>
      </div>
    </div>
  );
};

export default ContactUs;