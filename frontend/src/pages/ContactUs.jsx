// src/pages/ContactUs.js
import React from 'react';
import '../styles/ContactUs.css';

const ContactUs = () => {
    return (
        <div className="contact-us">
            <h1>Contact Us</h1>
            <p>If you have any questions, feel free to reach out to us!</p>
            <form>
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" required />
                </div>
                <div>
                    <label>Message:</label>
                    <textarea name="message" required></textarea>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default ContactUs;
