import { useState } from 'react';
import Link from 'next/link';
import companiesData from '../data/companies.json';
import styles from './Companies.module.css';

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDomain, setFilterDomain] = useState('All');

  const domains = ['All', ...new Set(companiesData.map(c => c.domain))];

  // Get latest 3 companies (reverse to show newest first)
  const latestCompanies = [...companiesData].reverse().slice(0, 3);

  const filteredCompanies = latestCompanies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.domain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = filterDomain === 'All' || company.domain === filterDomain;
    return matchesSearch && matchesDomain;
  });

  return (
    <section id="companies" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Latest Companies</h2>
          <div className={styles.controls}>
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <select
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              className={styles.filterSelect}
            >
              {domains.map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.grid}>
          {filteredCompanies.map((company) => (
            <div key={company.id} className={styles.card}>
              <a 
                href={company.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.visitBtn}
              >
                Visit Site →
              </a>
              <div className={styles.info}>
                <h3>{company.name}</h3>
                <p className={styles.domain}>{company.domain}</p>
                <p className={styles.description}>{company.description}</p>
                <div className={styles.meta}>
                  <span>Founded: {company.founded}</span>
                  <span>{company.stage}</span>
                </div>
              </div>
              <div className={styles.actions}>
                <Link href={`/companies/${company.id}`}>
                  <button className={styles.seeMoreBtn}>View Details</button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.seeMoreContainer}>
          <Link href="/companies">
            <button className={styles.seeAllBtn}>
              See All Companies ({companiesData.length})
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Companies;
