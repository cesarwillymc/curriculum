"use client"; // Ensure this line is at the top for client-side rendering

import React, { useState } from "react";
import './ContactForm.css'; // Add a CSS file for custom styles

import {apiFormData} from "../../data/FetchData";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    messageTitle: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", formData);
    const response = await apiFormData(formData);
    if (response.success) {
      alert('Email sent successfully!');
      setFormData({ name: '', email: '', phone: '', messageTitle: '', message: '' });
    } else {
      alert('Failed to send email. Please try again.');
    }
  };

  return (
    <div className="contact-form-container">
      <h1>Contact Me</h1>
      <p>Drop me a line!</p>
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <input
            type="text"
            id="messageTitle"
            name="messageTitle"
            value={formData.messageTitle}
            onChange={handleChange}
            placeholder="Message title"
            required
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email*"
            required
          />
        </div>

        <div className="form-group">
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name*"
            required
          />
        </div>

        <div className="form-group">
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Message*"
            required
          />
        </div>

        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default ContactForm;
