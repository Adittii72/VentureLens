import React from 'react';
import './SavedList.css';

const SavedList = () => {
  const investments = [
    { sector: 'Construction', stageBefore: 'Seed', round: '$10M (SERIES A)' },
    { sector: 'Health Tech', stageBefore: 'Pre-Seed', round: '$3M (seed)' },
    { sector: 'Finetech', stageBefore: 'Series B', round: '$50M (SERIES C)' },
    { sector: 'Energy', stageBefore: '$10m Series A', round: '$10M (SERIES A)' },
    { sector: 'Sustainability', stageBefore: '$2M Seed', round: '$10M (SERIES A)' }
  ];

  return (
    <section id="investors" className="investment-approach">
      <div className="investment-container">
        <h2 className="section-title">Saved List</h2>
        <p className="investment-intro">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius 
          enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros 
          dolor interdum nulla, ut commodo diam libero vitae erat.
        </p>
        <h3 className="venture-title">venture model</h3>
        <div className="investment-grid">
          {investments.map((investment, index) => (
            <div key={index} className="investment-card">
              <h4>{investment.sector}</h4>
              <div className="investment-details">
                <div className="detail-row">
                  <span className="label">Stage Before CrestFund</span>
                  <span className="value">{investment.stageBefore}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Round before CrestFund</span>
                  <span className="value">{investment.round}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="cta-button">See More</button>
      </div>
    </section>
  );
};

export default SavedList;
