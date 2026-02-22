import { useState, useEffect } from 'react';
import Link from 'next/link';
import companiesData from '../data/companies.json';
import styles from './SavedList.module.css';

const SavedList = () => {
  const [savedCompanies, setSavedCompanies] = useState([]);

  useEffect(() => {
    loadSavedCompanies();
  }, []);

  const loadSavedCompanies = () => {
    const savedIds = JSON.parse(localStorage.getItem('savedCompanies') || '[]');
    const companies = companiesData.filter(c => savedIds.includes(c.id));
    setSavedCompanies(companies);
  };

  const handleRemove = (id) => {
    const savedIds = JSON.parse(localStorage.getItem('savedCompanies') || '[]');
    const updated = savedIds.filter(cid => cid !== id);
    localStorage.setItem('savedCompanies', JSON.stringify(updated));
    setSavedCompanies(savedCompanies.filter(c => c.id !== id));
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(savedCompanies, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'saved-companies.json';
    link.click();
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Domain', 'Website', 'Description', 'Founded', 'Stage'];
    const rows = savedCompanies.map(c => [
      c.name,
      c.domain,
      c.website,
      c.description,
      c.founded,
      c.stage
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'saved-companies.csv';
    link.click();
  };

  const scrollToCompanies = () => {
    document.getElementById('companies')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="saved" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Saved Companies</h2>
          {savedCompanies.length > 0 && (
            <div className={styles.actions}>
              <button onClick={handleExportJSON} className={styles.exportBtn}>
                Export JSON
              </button>
              <button onClick={handleExportCSV} className={styles.exportBtn}>
                Export CSV
              </button>
            </div>
          )}
        </div>

        {savedCompanies.length === 0 ? (
          <div className={styles.empty}>
            <p>No saved companies yet.</p>
            <button onClick={scrollToCompanies} className={styles.scrollBtn}>
              Browse Companies
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {savedCompanies.map((company) => (
              <div key={company.id} className={styles.card}>
                <div className={styles.info}>
                  <h3>{company.name}</h3>
                  <p className={styles.domain}>{company.domain}</p>
                  <p className={styles.description}>{company.description}</p>
                </div>
                <div className={styles.cardActions}>
                  <Link href={`/companies/${company.id}`}>
                    <button className={styles.viewBtn}>View</button>
                  </Link>
                  <button 
                    onClick={() => handleRemove(company.id)}
                    className={styles.removeBtn}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SavedList;
