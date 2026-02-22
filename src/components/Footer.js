import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#about">About Us</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#investors">Investors</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="footer-info">
          <p>22 Rue René Boulanger Paris, France</p>
          <p>@2024 - Powered by Webflow</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
