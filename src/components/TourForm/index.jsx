import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import './styles.css';

const TourForm = () => {

  const { handleSubmit, formState: { errors } } = useForm();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    child_name: '',
    childBirthday: '',
    program: '',
    school: '',
    tour_date: '',
    tour_time: '09:30:00',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    let number = value.replace(/\D/g,'');
    setFormData({
        ...formData,
        [name]: number
    });
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setFormData({
        ...formData,
        'tour_time': value
      });
  };

  const updateTours = async () => {
    console.log(formData);
    try {
        await axios.post('https://dev.api.sunshinepreschool1-2.org/api/tours', formData);
      } catch (error) {
        console.error('Error creating event', error);
        alert('Failed to create event.');
      }
  };

  const onSubmit = async(e) => {
    updateTours();
  };

  return (
    
    <form onSubmit={handleSubmit(onSubmit)}>
        <div>
            <h2 style={{ textAlign: 'center' }}>Schedule A Tour</h2>
            <div className="form-container">
                <div style={{ marginRight: "24px"}}>
                    <div className="form-input-container">
                        <label>First Name:</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-input-container">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-input-container">
                        <label>Child's Name:</label>
                        <input
                            type="text"
                            name="child_name"
                            value={formData.child_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-input-container">
                        <label>Program:</label>
                        <select
                            name="program"
                            value={formData.program}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select...</option>
                            <option value="TWO-YEAR-OLD PROGRAM">TWO-YEAR-OLD PROGRAM</option>
                            <option value="THREE-YEAR-OLD PROGRAM">THREE-YEAR-OLD PROGRAM</option>
                            <option value="AFTER-SCHOOL PROGRAM">AFTER-SCHOOL PROGRAM</option>
                            <option value="PRE-K CLASS">PRE-K CLASS</option>
                        </select>
                    </div>
                </div>
                <div>
                    <div className="form-input-container">
                        <label>Last Name:</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-input-container">
                        <label>Phone Number:</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            required
                        />
                    </div>
                    <div className="form-input-container">
                        <label>Tour Date</label>
                        <input
                            type="date"
                            name="tour_date"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-input-container">
                        <label>Tour Time </label>
                        <select name="date_time" id="date_time" onChange={handleTimeChange}>
                            <option value="09:30 AM">9:30 AM</option>
                            <option value="10:00 AM">10:00 AM</option>
                            <option value="10:30 AM">10:30 AM</option>
                            <option value="11:00 AM">11:00 AM</option>
                            <option value="11:30 AM">11:30 AM</option>
                            <option value="1:30 PM">1:30 PM</option>
                            <option value="2:00 PM">2:00 PM</option>
                            <option value="2:30 PM">2:30 PM</option>
                            <option value="3:00 PM">3:00 PM</option>
                            <option value="3:30 PM">3:30 PM</option>
                            <option value="4:00 PM">4:00 PM</option>
                        </select>
                    </div>
                    <div className="form-input-container">
                        <label>Select School</label>
                        <select
                        name="school"
                        onChange={handleChange}
                        required
                        >
                        <option value="Compton">Compton</option>
                        <option value="Lynwood">Lynwood</option>
                        </select>
                    </div>
                </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: '32px', position:'relative' }}>
                <button type="submit" className='form-button'>Submit</button>
            </div>
      </div>
    </form>
  );
};

export default TourForm;
