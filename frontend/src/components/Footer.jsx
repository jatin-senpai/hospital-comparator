import styles from './Footer.module.css';

export default function Footer({ onNavigate }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brandCol}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>◈</span>
            <span className={styles.logoText}>MediQ</span>
          </div>
          <p className={styles.tagline}>Making healthcare services transparent, accessible, and comparable.</p>
        </div>

        <div className={styles.linksCol}>
          <div className={styles.linkGroup}>
            <h4 className={styles.title}>Product</h4>
            <button className={styles.link} onClick={() => onNavigate('landing')}>Comparison Tool</button>
            <button className={styles.link} onClick={() => onNavigate('landing', 'services')}>Diagnostics Services</button>
            <button className={styles.link} onClick={() => onNavigate('landing', 'hospitals')}>Hospitals Network</button>
          </div>

          <div className={styles.linkGroup}>
            <h4 className={styles.title}>Company</h4>
            <span className={styles.staticLink}>About MediQ</span>
            <span className={styles.staticLink}>Privacy Policy</span>
            <span className={styles.staticLink}>Terms of Service</span>
          </div>

          <div className={styles.linkGroup}>
            <h4 className={styles.title}>Contact</h4>
            <span className={styles.staticLink}>support@mediq.in</span>
            <span className={styles.staticLink}>+91 1800 120 4560</span>
            <span className={styles.staticLink}>Jaipur, India</span>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.bottomContainer}>
          <p className={styles.copyright}>&copy; {new Date().getFullYear()} MediQ Technologies Pvt Ltd. All rights reserved.</p>
          <p className={styles.disclosure}>MediQ is a search aggregator. Diagnostic reports and treatments are provided by partner hospitals.</p>
        </div>
      </div>
    </footer>
  );
}
