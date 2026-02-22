import Link from 'next/link';
import styles from './About.module.css';

const About = () => {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        <h2 className={styles.title}>About VentureLens</h2>
        
        <p className={styles.heroText}>
          Smarter Venture Intelligence for Modern Investors
        </p>
        <p className={styles.text}>
          VentureLens helps investors track, enrich, and evaluate startups faster — turning 
          scattered information into structured insights that drive better decisions.
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>The Problem</h3>
            <p>Early-stage investing runs on fragmented information. Investors constantly switch between company websites, news articles, LinkedIn profiles, and funding databases. Deal flow becomes messy, context gets lost, and signals get missed.</p>
          </div>

          <div className={styles.card}>
            <h3>Our Solution</h3>
            <p>VentureLens centralizes startup intelligence into one structured workflow. Track companies, enrich data automatically, generate AI-powered summaries, and organize watchlists — all in one place.</p>
          </div>

          <div className={styles.card}>
            <h3>Who It's For</h3>
            <p>Built for angel investors, VC analysts, seed funds, startup scouts, and innovation teams. Anyone who evaluates startups at scale.</p>
          </div>
        </div>

        <div className={styles.vision}>
          <p className={styles.visionText}>
            Make startup intelligence structured, searchable, and scalable.
          </p>
          <p className={styles.tagline}>Built for speed. Designed for clarity.</p>
        </div>

        <Link href="/companies">
          <button className={styles.btn}>Explore Companies</button>
        </Link>
      </div>
    </section>
  );
};

export default About;
