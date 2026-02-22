import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import companiesData from '../../data/companies.json';
import styles from '../../styles/CompanyProfile.module.css';

export default function CompanyProfile() {
  const router = useRouter();
  const { id } = router.query;
  
  const [company, setCompany] = useState(null);
  const [enrichmentData, setEnrichmentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (id) {
      const foundCompany = companiesData.find(c => c.id === id);
      setCompany(foundCompany);
      
      const cached = localStorage.getItem(`enrichment_${id}`);
      if (cached) {
        setEnrichmentData(JSON.parse(cached));
      }
      
      const savedNotes = localStorage.getItem(`notes_${id}`);
      if (savedNotes) {
        setNotes(savedNotes);
      }
      
      const savedList = JSON.parse(localStorage.getItem('savedCompanies') || '[]');
      setIsSaved(savedList.includes(id));
    }
  }, [id]);

  const handleEnrich = async () => {
    if (!company) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/enrich', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: company.website,
          companyId: company.id
        }),
      });

      if (!response.ok) {
        throw new Error('Enrichment failed');
      }

      const data = await response.json();
      setEnrichmentData(data);
      localStorage.setItem(`enrichment_${id}`, JSON.stringify(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotes = () => {
    localStorage.setItem(`notes_${id}`, notes);
    alert('Notes saved!');
  };

  const handleToggleSave = () => {
    const savedList = JSON.parse(localStorage.getItem('savedCompanies') || '[]');
    if (isSaved) {
      const updated = savedList.filter(cid => cid !== id);
      localStorage.setItem('savedCompanies', JSON.stringify(updated));
      setIsSaved(false);
    } else {
      savedList.push(id);
      localStorage.setItem('savedCompanies', JSON.stringify(savedList));
      setIsSaved(true);
    }
  };

  if (!company) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>{company.name} - VentureLens</title>
      </Head>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1>{company.name}</h1>
            <p className={styles.domain}>{company.domain}</p>
          </div>
          <div className={styles.headerActions}>
            <a 
              href={company.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.visitBtn}
            >
              Visit Website
            </a>
            <button 
              onClick={handleToggleSave}
              className={isSaved ? styles.savedBtn : styles.saveBtn}
            >
              {isSaved ? '★ Saved' : '☆ Save'}
            </button>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.mainColumn}>
            <div className={styles.card}>
              <h2>Overview</h2>
              <p><strong>Description:</strong> {company.description}</p>
              <p><strong>Founded:</strong> {company.founded}</p>
              <p><strong>Stage:</strong> {company.stage}</p>
              <p><strong>Website:</strong> <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a></p>
            </div>

            <div className={styles.card}>
              <div className={styles.enrichHeader}>
                <h2>AI Enrichment</h2>
                <button 
                  onClick={handleEnrich} 
                  disabled={loading}
                  className={styles.enrichBtn}
                >
                  {loading ? 'Enriching...' : enrichmentData ? 'Re-enrich' : 'Enrich Now'}
                </button>
              </div>

              {error && <div className={styles.error}>Error: {error}</div>}

              {enrichmentData && (
                <div className={styles.enrichmentData}>
                  <div className={styles.section}>
                    <h3>Summary</h3>
                    <p>{enrichmentData.summary}</p>
                  </div>

                  <div className={styles.section}>
                    <h3>What They Do</h3>
                    <ul>
                      {enrichmentData.whatTheyDo?.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.section}>
                    <h3>Keywords</h3>
                    <div className={styles.keywords}>
                      {enrichmentData.keywords?.map((keyword, idx) => (
                        <span key={idx} className={styles.keyword}>{keyword}</span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.section}>
                    <h3>Signals</h3>
                    <ul>
                      {enrichmentData.signals?.map((signal, idx) => (
                        <li key={idx} className={styles.signal}>✓ {signal}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.section}>
                    <h3>Sources</h3>
                    {enrichmentData.sources?.map((source, idx) => (
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
              )}
            </div>
          </div>

          <div className={styles.sidebar}>
            <div className={styles.card}>
              <h2>Notes</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your notes here..."
                className={styles.notesArea}
              />
              <button onClick={handleSaveNotes} className={styles.saveNotesBtn}>
                Save Notes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
