import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

export default function Navbar({ user, onHistory, onLogout, onOpenAuth, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logo} onClick={() => { onNavigate('landing'); setMenuOpen(false); }}>
          <span className={styles.logoIcon}>◈</span>
          <span className={styles.logoText}>MediQ</span>
        </div>

        {/* Desktop Links */}
        <div className={styles.menu}>
          <button className={styles.navLink} onClick={() => onNavigate('landing')}>Compare</button>
          <button className={styles.navLink} onClick={() => onNavigate('landing', 'services')}>Services</button>
          <button className={styles.navLink} onClick={() => onNavigate('landing', 'hospitals')}>Hospitals</button>
          <button className={styles.navLink} onClick={() => onNavigate('landing', 'how-it-works')}>How it works</button>
        </div>

        {/* Action CTAs */}
        <div className={styles.actions}>
          {user ? (
            <div className={styles.userSession}>
              <span className={styles.userName}>Hi, {user.name.split(' ')[0]}</span>
              <button className={styles.secondaryBtn} onClick={onHistory}>History</button>
              <button className={styles.outlineBtn} onClick={onLogout}>Logout</button>
            </div>
          ) : (
            <div className={styles.authActions}>
              <button className={styles.navLink} onClick={onOpenAuth}>Sign in</button>
              <button className={styles.primaryBtn} onClick={() => onNavigate('landing', 'search-widget')}>
                Find a service
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={styles.hamburger} 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ''}`} />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className={styles.mobileDropdown}>
          <button 
            className={styles.mobileNavLink} 
            onClick={() => { onNavigate('landing'); setMenuOpen(false); }}
          >
            Compare
          </button>
          <button 
            className={styles.mobileNavLink} 
            onClick={() => { onNavigate('landing', 'services'); setMenuOpen(false); }}
          >
            Services
          </button>
          <button 
            className={styles.mobileNavLink} 
            onClick={() => { onNavigate('landing', 'hospitals'); setMenuOpen(false); }}
          >
            Hospitals
          </button>
          <button 
            className={styles.mobileNavLink} 
            onClick={() => { onNavigate('landing', 'how-it-works'); setMenuOpen(false); }}
          >
            How it works
          </button>
          <div className={styles.mobileDivider} />
          {user ? (
            <div className={styles.mobileAuthCol}>
              <span className={styles.mobileUserName}>Hi, {user.name}</span>
              <button 
                className={styles.mobilePrimaryBtn} 
                onClick={() => { onHistory(); setMenuOpen(false); }}
              >
                Booking History
              </button>
              <button 
                className={styles.mobileOutlineBtn} 
                onClick={() => { onLogout(); setMenuOpen(false); }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className={styles.mobileAuthCol}>
              <button 
                className={styles.mobileOutlineBtn} 
                onClick={() => { onOpenAuth(); setMenuOpen(false); }}
              >
                Sign in
              </button>
              <button 
                className={styles.mobilePrimaryBtn} 
                onClick={() => { onNavigate('landing', 'search-widget'); setMenuOpen(false); }}
              >
                Find a service
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
