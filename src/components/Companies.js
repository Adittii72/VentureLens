import React from 'react';
import './Companies.css';

const Companies = () => {
  const companies = [
    { name: 'EcoWave', domain: 'Sustainability', website: 'https://ecowave.com' },
    { name: 'PulseNet', domain: 'Health Tech', website: 'https://pulsenet.com' },
    { name: 'NexaFlow', domain: 'Fintech', website: 'https://nexaflow.com' },
    { name: 'FusionGrid', domain: 'Energy', website: 'https://fusiongrid.com' },
    { name: 'CloudSync', domain: 'SaaS', website: 'https://cloudsync.com' },
    { name: 'BioGenix', domain: 'Biotech', website: 'https://biogenix.com' },
    { name: 'QuantumAI', domain: 'Artificial Intelligence', website: 'https://quantumai.com' },
    { name: 'GreenTech', domain: 'Climate Tech', website: 'https://greentech.com' },
    { name: 'DataVault', domain: 'Cybersecurity', website: 'https://datavault.com' },
    { name: 'MediCore', domain: 'Healthcare', website: 'https://medicore.com' },
    { name: 'RoboTech', domain: 'Robotics', website: 'https://robotech.com' },
    { name: 'SpaceLink', domain: 'Aerospace', website: 'https://spacelink.com' }
  ];

  const handleEnrich = (companyName) => {
    console.log('Enriching:', companyName);
  };

  const handleSeeMore = (companyName) => {
    console.log('See more:', companyName);
  };

  return (
    <section id="portfolio" className="companies">
      <div className="companies-container">
        <h2 className="section-title">Companies</h2>
        <div className="companies-grid">
          {companies.map((company, index) => (
            <div key={index} className="company-card">
              <a 
                href={company.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="visit-site-btn"
              >
                Visit Site →
              </a>
              <div className="company-info">
                <h3 className="company-name">{company.name}</h3>
                <p className="company-domain">{company.domain}</p>
              </div>
              <div className="company-actions">
                <button 
                  className="action-btn enrich-btn"
                  onClick={() => handleEnrich(company.name)}
                >
                  Enrich
                </button>
                <button 
                  className="action-btn seemore-btn"
                  onClick={() => handleSeeMore(company.name)}
                >
                  See More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Companies;
