import React, { useState } from 'react';
import './Hero.css';

const Hero = () => {
  const [companyInput, setCompanyInput] = useState('');

  const handleAddCompany = (e) => {
    e.preventDefault();
    console.log('Adding company:', companyInput);
    setCompanyInput('');
  };

  const watchlists = [
    { name: 'Climate Tech', count: 12 },
    { name: 'Fintech Seed', count: 8 },
    { name: 'AI Infra', count: 5 }
  ];

  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <div className="quick-add-section">
          <form onSubmit={handleAddCompany} className="quick-add-form">
            <input
              type="text"
              placeholder="Enter company name or URL"
              value={companyInput}
              onChange={(e) => setCompanyInput(e.target.value)}
              className="company-input"
            />
            <button type="submit" className="add-button">Add & Enrich</button>
          </form>
        </div>

        <div className="watchlist-snapshot">
          <h3 className="watchlist-title">Watchlist Snapshot</h3>
          <div className="watchlist-grid">
            {watchlists.map((list, index) => (
              <a href="#saved" key={index} className="watchlist-card">
                <h4>{list.name}</h4>
                <p>{list.count} companies</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
