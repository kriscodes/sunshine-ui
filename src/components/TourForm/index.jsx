import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './styles.css';

const TourForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    childFirstName: '',
    childBirthday: '',
    program: '',
    school: ''
  });

  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    console.log(formData, selectedDate);
  };

  return (
    
    <form onSubmit={handleSubmit}>
        <div>
            <div className="form-container">
                <div style={{ marginRight: "24px"}}>
                    <div className="form-input-container">
                        <label>First Name:</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
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
                        <label>Child's First Name:</label>
                        <input
                            type="text"
                            name="childFirstName"
                            value={formData.childFirstName}
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
                            name="lastName"
                            value={formData.lastName}
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
                        <label>Child's Birthday:</label>
                        <input
                        type="date"
                        name="childBirthday"
                        value={formData.childBirthday}
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
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <label>Select Date and Time:</label>
                <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                />
                <button type="submit" className='form-button' style={{ marginTop: '20px' }}>Submit</button>
            </div>
      </div>
    </form>
  );
};

export default TourForm;
