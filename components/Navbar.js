import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleScroll = (e, targetId) => {
    e.preventDefault();
    
    // If not on home page, navigate to home first
    if (router.pathname !== '/') {
      router.push(`/#${targetId}`);
      return;
    }
    
    // Smooth scroll to section
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsOpen(false);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>VentureLens</Link>
        <div className={`${styles.menu} ${isOpen ? styles.active : ''}`}>
          <a href="#home" onClick={(e) => handleScroll(e, 'home')} className={styles.link}>
            Home
          </a>
          <a href="#about" onClick={(e) => handleScroll(e, 'about')} className={styles.link}>
            About
          </a>
          <a href="#companies" onClick={(e) => handleScroll(e, 'companies')} className={styles.link}>
            Companies
          </a>
          <a href="#saved" onClick={(e) => handleScroll(e, 'saved')} className={styles.link}>
            Saved List
          </a>
        </div>
        <div className={styles.toggle} onClick={() => setIsOpen(!isOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
