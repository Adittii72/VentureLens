import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="contact" className="contact">
      <div className="contact-container">
        <h2 className="section-title">Get in touch.</h2>
        <h3 className="contact-subtitle">Contact</h3>
        <p className="newsletter-text">Sign up to our newsletter:</p>
        <form onSubmit={handleSubmit} className="newsletter-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="email-input"
          />
          <button type="submit" className="submit-button">Subscribe</button>
        </form>
        {submitted && (
          <p className="success-message">Thank you! Your submission has been received!</p>
        )}
      </div>
    </section>
  );
};

export default Contact;
