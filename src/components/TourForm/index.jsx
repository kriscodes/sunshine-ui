import React, { useState } from 'react';
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
    tour_time: '',
  });
  const [time, setTime] = useState();

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name);
    console.log(value);
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    
    let date = value + " " + formData.tour_time + ":00"
    console.log(date);
    setFormData({
        ...formData,
        [name]: date
      });
  };

  const onSubmit = async(e) => {

    // Handle form submission logic
    console.log(formData);

    try {
        await axios.post('https://dev.api.sunshinepreschool1-2.org/api/tours', formData);
      } catch (error) {
        console.error('Error creating event', error);
        alert('Failed to create event.');
      }
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
                            <option value="program1">Program 1</option>
                            <option value="program2">Program 2</option>
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
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-input-container">
                        <label>Tour Date </label>
                        <input
                            type="date"
                            name="tour_date"
                            onChange={handleDateChange}
                            required
                        />
                    </div>
                    <div className="form-input-container">
                        <label>Tour Time </label>
                        <input
                            type="time"
                            name="tour_time"
                            value={formData.tour_time}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-input-container">
                        <label>School:</label>
                        <select
                        name="school"
                        value={formData.school}
                        onChange={handleChange}
                        required
                        >
                        <option value="">Select School</option>
                        <option value="school1">School 1</option>
                        <option value="school2">School 2</option>
                        </select>
                    </div>
                </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: '32px', position:'relative' }}>
                <button type="submit" className='form-button' style={{ marginTop: '20px' }}>Submit</button>
            </div>
      </div>
    </form>
  );
};

export default TourForm;
