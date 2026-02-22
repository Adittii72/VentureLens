import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import companiesData from '../../data/companies.json';
import styles from '../../styles/Companies.module.css';

export default function Companies() {
  const [companies] = useState(companiesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDomain, setFilterDomain] = useState('All');

  const domains = ['All', ...new Set(companies.map(c => c.domain))];

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.domain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = filterDomain === 'All' || company.domain === filterDomain;
    return matchesSearch && matchesDomain;
  });

  return (
    <>
      <Head>
        <title>Companies - VentureLens</title>
      </Head>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Companies</h1>
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
                  <button className={styles.seeMoreBtn}>See More</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
