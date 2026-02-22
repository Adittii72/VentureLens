import React from 'react';
import './About.css';

const About = () => {
  return (
    <section id="about" className="about">
      <div className="about-container">
        <h2 className="section-title">About VentureLens</h2>
        
        <p className="hero-text">
          Smarter Venture Capital for Modern Investors
        </p>
        <p className="about-text">
          VentureLens helps investors track, enrich, and evaluate startups faster — turning 
          scattered information into structured insights that drive better decisions.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <h3>The Problem</h3>
            <p>Early-stage investing runs on fragmented information. Investors constantly switch between company websites, news articles, LinkedIn profiles, and funding databases. Deal flow becomes messy, context gets lost, and signals get missed.</p>
          </div>

          <div className="feature-card">
            <h3>Our Solution</h3>
            <p>VentureLens centralizes startup intelligence into one structured workflow. Track companies, enrich data automatically, generate AI-powered summaries, and organize watchlists — all in one place.</p>
          </div>

          <div className="feature-card">
            <h3>Who It's For</h3>
            <p>Built for angel investors, VC analysts, seed funds, startup scouts, and innovation teams. Anyone who evaluates startups at scale.</p>
          </div>
        </div>

        <div className="vision-section">
          <p className="vision-text">
            Make startup intelligence structured, searchable, and scalable.
          </p>
          <p className="tagline">Built for speed. Designed for clarity.</p>
        </div>

        <button className="cta-button">Explore Companies</button>
      </div>
    </section>
  );
};

export default About;
