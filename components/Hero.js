import { useState, useEffect } from 'react';
import Link from 'next/link';
import companiesData from '../data/companies.json';
import styles from './Hero.module.css';

const Hero = () => {
  const [companyInput, setCompanyInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [enrichmentResult, setEnrichmentResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [watchlists, setWatchlists] = useState([]);

  useEffect(() => {
    // Calculate watchlist counts from saved companies
    const savedIds = JSON.parse(localStorage.getItem('savedCompanies') || '[]');
    const savedCompanies = companiesData.filter(c => savedIds.includes(c.id));
    
    // Group by domain and count
    const domainCounts = {};
    savedCompanies.forEach(company => {
      domainCounts[company.domain] = (domainCounts[company.domain] || 0) + 1;
    });

    // Get top 3 domains or use default categories
    const sortedDomains = Object.entries(domainCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    if (sortedDomains.length > 0) {
      setWatchlists(sortedDomains.map(([name, count]) => ({ name, count })));
    } else {
      // Default categories if no saved companies
      const allDomains = [...new Set(companiesData.map(c => c.domain))];
      const defaultWatchlists = allDomains.slice(0, 3).map(domain => ({
        name: domain,
        count: companiesData.filter(c => c.domain === domain).length
      }));
      setWatchlists(defaultWatchlists);
    }
  }, []);

  const handleAddCompany = async (e) => {
    e.preventDefault();
    
    if (!companyInput.trim()) {
      setError('Please enter a company URL');
      return;
    }

    // Validate URL
    let url = companyInput.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError(null);
    setEnrichmentResult(null);

    try {
      const response = await fetch('/api/add-company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to add company');
      }

      const data = await response.json();
      
      // Save new company to localStorage for client-side persistence
      if (!data.alreadyExists) {
        const customCompanies = JSON.parse(localStorage.getItem('customCompanies') || '[]');
        customCompanies.push(data.company);
        localStorage.setItem('customCompanies', JSON.stringify(customCompanies));
      }
      
      setEnrichmentResult(data);
      setShowModal(true);
      setCompanyInput('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEnrichmentResult(null);
  };

  return (
    <section id="home" className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.quickAdd}>
          <form onSubmit={handleAddCompany} className={styles.form}>
            <input
              type="text"
              placeholder="Enter company URL (e.g., stripe.com)"
              value={companyInput}
              onChange={(e) => setCompanyInput(e.target.value)}
              className={styles.input}
              disabled={loading}
            />
            <button type="submit" className={styles.addBtn} disabled={loading}>
              {loading ? 'Enriching...' : 'Add & Enrich'}
            </button>
          </form>
          {error && <div className={styles.error}>{error}</div>}
        </div>

        <div className={styles.watchlist}>
          <h3 className={styles.title}>Watchlist Snapshot</h3>
          <div className={styles.grid}>
            {watchlists.map((list, index) => (
              <Link href="#saved" key={index} className={styles.card}>
                <h4>{list.name}</h4>
                <p>{list.count} {list.count === 1 ? 'company' : 'companies'}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {showModal && enrichmentResult && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{enrichmentResult.company.name}</h2>
              <button onClick={closeModal} className={styles.closeBtn}>×</button>
            </div>
            
            <div className={styles.modalContent}>
              {enrichmentResult.alreadyExists && (
                <div className={styles.notice}>
                  ℹ️ This company already exists in your database
                </div>
              )}

              <div className={styles.companyInfo}>
                <p><strong>Domain:</strong> {enrichmentResult.company.domain}</p>
                <p><strong>Website:</strong> <a href={enrichmentResult.company.website} target="_blank" rel="noopener noreferrer">{enrichmentResult.company.website}</a></p>
                <p><strong>Description:</strong> {enrichmentResult.company.description}</p>
              </div>

              <div className={styles.enrichmentSection}>
                <h3>AI Enrichment Results</h3>
                
                <div className={styles.section}>
                  <h4>Summary</h4>
                  <p>{enrichmentResult.enrichment.summary}</p>
                </div>

                <div className={styles.section}>
                  <h4>What They Do</h4>
                  <ul>
                    {enrichmentResult.enrichment.whatTheyDo?.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.section}>
                  <h4>Keywords</h4>
                  <div className={styles.keywords}>
                    {enrichmentResult.enrichment.keywords?.map((keyword, idx) => (
                      <span key={idx} className={styles.keyword}>{keyword}</span>
                    ))}
                  </div>
                </div>

                <div className={styles.section}>
                  <h4>Signals</h4>
                  <ul>
                    {enrichmentResult.enrichment.signals?.map((signal, idx) => (
                      <li key={idx} className={styles.signal}>✓ {signal}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.section}>
                  <h4>Sources</h4>
                  {enrichmentResult.enrichment.sources?.map((source, idx) => (
                    <div key={idx} className={styles.source}>
                      <a href={source.url} target="_blank" rel="noopener noreferrer">
                        {source.title || source.url}
                      </a>
                      <span className={styles.timestamp}>
                        {new Date(source.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.modalActions}>
                <Link href={`/companies/${enrichmentResult.company.id}`}>
                  <button className={styles.viewProfileBtn}>View Full Profile</button>
                </Link>
                <button onClick={closeModal} className={styles.doneBtn}>Done</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
