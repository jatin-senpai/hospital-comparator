import { useState } from 'react';
import { SERVICES, CITIES, HOSPITALS } from '../services/mockData';
import styles from './LandingPage.module.css';

export default function LandingPage({ onSearch, onSelectHospital, onSelectService }) {
  const [selectedServiceId, setSelectedServiceId] = useState('mri');
  const [selectedCityId, setSelectedCityId] = useState('jaipur');

  // Find active service and city details
  const activeService = SERVICES.find(s => s.id === selectedServiceId) || SERVICES[0];
  const activeCity = CITIES.find(c => c.id === selectedCityId) || CITIES[0];

  // Derive mockup preview results for the centerpiece using mock data
  const previewResults = HOSPITALS.map(h => {
    const svc = h.services ? h.services[selectedServiceId] : null;
    return {
      id: h.id,
      name: h.name,
      rating: h.rating,
      badge: h.badge,
      distance: h.distance,
      price: svc?.price || 0,
      available: svc?.available || false,
      report: svc?.report || '24 hrs'
    };
  }).filter(r => r.price > 0).sort((a, b) => a.price - b.price);

  const minPrice = previewResults.length ? previewResults[0].price : 0;

  const handleSearchSubmit = () => {
    // Trigger main search query transition
    onSearch(activeService.label, selectedServiceId, activeCity);
  };

  return (
    <div className={styles.page}>
      {/* Editorial Hero */}
      <section className={styles.heroSection}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          Compare &amp; Save on Diagnostics
        </div>
        <h1 className={styles.headline}>
          Compare care <br />
          <span className={styles.highlight}>before you get there.</span>
        </h1>
        <p className={styles.sub}>
          Diagnostic prices vary up to 70% between centers. Compare rates, verified ratings, and report delivery times at top accredited hospitals in your city.
        </p>

        <div className={styles.heroBtns}>
          <button className={styles.primaryBtn} onClick={() => handleSearchSubmit()}>
            Compare prices now
          </button>
          <a href="#how-it-works" className={styles.secondaryBtn}>
            See how it works
          </a>
        </div>
      </section>

      {/* Centerpiece Comparison Widget */}
      <section id="search-widget" className={styles.centerpieceSection}>
        <div className={styles.searchWidget}>
          <div className={styles.searchHeader}>
            <span className={styles.searchHeaderIcon}>◈</span>
            Compare pricing in real-time
          </div>

          <div className={styles.searchControls}>
            <div className={styles.controlGroup}>
              <label className={styles.label}>Select Service / Test</label>
              <select 
                className={styles.select}
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
              >
                {SERVICES.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.label}>Location / City</label>
              <select 
                className={styles.select}
                value={selectedCityId}
                onChange={(e) => setSelectedCityId(e.target.value)}
              >
                {CITIES.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <button className={styles.widgetBtn} onClick={handleSearchSubmit}>
              Search comparison list
            </button>
          </div>

          {/* Interactive results preview list */}
          <div className={styles.previewContainer}>
            <div className={styles.previewTitleRow}>
              <span>Interactive comparison preview ({previewResults.length} centers in {activeCity.name})</span>
              <span className={styles.activeLabel}>Live data</span>
            </div>

            <div className={styles.previewList}>
              {previewResults.map(r => (
                <div key={r.id} className={styles.previewRow} onClick={() => onSelectHospital(r.id)}>
                  <div className={styles.hospitalMeta}>
                    <div className={styles.hospitalNameRow}>
                      <span className={styles.hospitalName}>{r.name}</span>
                      <span className={styles.distanceBadge}>{r.distance} km</span>
                    </div>
                    <div className={styles.hospitalSubRow}>
                      <span>★ {r.rating}</span>
                      <span className={styles.bullet}>·</span>
                      <span>Report in {r.report}</span>
                    </div>
                  </div>
                  
                  <div className={styles.priceMeta}>
                    <div className={styles.price}>
                      ₹{r.price.toLocaleString()}
                      {r.price === minPrice && <span className={styles.cheapLabel}>LOWEST</span>}
                    </div>
                    <span className={styles.viewLink}>View profile →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHeading}>
          <h2 className={styles.sectionTitle}>Why compare on MediQ?</h2>
          <p className={styles.sectionSubtitle}>We bring absolute transparency to diagnostic testing, helping you make informed decisions.</p>
        </div>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>💸</div>
            <h3 className={styles.featureTitle}>Transparent Pricing</h3>
            <p className={styles.featureDesc}>Hospitals charge differently for the exact same test. Compare prices and avoid paying extra.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⭐️</div>
            <h3 className={styles.featureTitle}>Verified Reviews</h3>
            <p className={styles.featureDesc}>View verified ratings from actual patients who booked diagnostic tests through our network.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h3 className={styles.featureTitle}>Direct Slot Bookings</h3>
            <p className={styles.featureDesc}>No phone calls or waiting lists. Choose your preferred day and hourly slot, book, and receive instantly.</p>
          </div>
        </div>
      </section>

      {/* How it works Timeline */}
      <section id="how-it-works" className={styles.timelineSection}>
        <div className={styles.sectionHeading}>
          <h2 className={styles.sectionTitle}>How it works</h2>
          <p className={styles.sectionSubtitle}>Book diagnostic procedures locally in four simple steps.</p>
        </div>

        <div className={styles.timeline}>
          <div className={styles.timelineStep}>
            <div className={styles.stepNum}>01</div>
            <h4 className={styles.stepTitle}>Select Diagnostic test</h4>
            <p className={styles.stepDesc}>Choose from imaging scans (MRI, CT, Ultrasound) or pathology packages (Blood, Thyroid, Urine panels).</p>
          </div>
          <div className={styles.timelineStep}>
            <div className={styles.stepNum}>02</div>
            <h4 className={styles.stepTitle}>Compare local options</h4>
            <p className={styles.stepDesc}>Filter by cost, proximity distance, hospital accreditation badges, and report turnaround times.</p>
          </div>
          <div className={styles.timelineStep}>
            <div className={styles.stepNum}>03</div>
            <h4 className={styles.stepTitle}>Schedule slot &amp; pay</h4>
            <p className={styles.stepDesc}>Enter patient details, pick a convenient calendar hour, and finalize payment securely via Razorpay.</p>
          </div>
          <div className={styles.timelineStep}>
            <div className={styles.stepNum}>04</div>
            <h4 className={styles.stepTitle}>Get tested &amp; download</h4>
            <p className={styles.stepDesc}>Visit the center for your scheduled appointment. Receive report PDF directly inside your dashboard history.</p>
          </div>
        </div>
      </section>

      {/* Explore Services Grid */}
      <section id="services" className={styles.categoriesSection}>
        <div className={styles.sectionHeading}>
          <h2 className={styles.sectionTitle}>Explore services</h2>
          <p className={styles.sectionSubtitle}>Select a category to compare pricing and view accredited providers.</p>
        </div>

        <div className={styles.categoriesGrid}>
          {SERVICES.map(s => (
            <div 
              key={s.id} 
              className={styles.categoryCard} 
              onClick={() => onSelectService(s.id)}
            >
              <span className={styles.catIcon}>{s.icon}</span>
              <div className={styles.catInfo}>
                <h4 className={styles.catLabel}>{s.label}</h4>
                <p className={styles.catType}>{s.category}</p>
              </div>
              <span className={styles.catArrow}>→</span>
            </div>
          ))}
        </div>
      </section>

      {/* Explore Hospitals Showcase */}
      <section id="hospitals" className={styles.hospitalsSection}>
        <div className={styles.sectionHeading}>
          <h2 className={styles.sectionTitle}>Partner diagnostic networks</h2>
          <p className={styles.sectionSubtitle}>Top-rated labs, testing centers, and NABL/NABH accredited providers in our network.</p>
        </div>

        <div className={styles.hospitalsGrid}>
          {HOSPITALS.slice(0, 4).map(h => (
            <div 
              key={h.id} 
              className={styles.hospitalShowcard}
              onClick={() => onSelectHospital(h.id)}
            >
              <div className={styles.hospitalHead}>
                <span className={styles.hospitalInitial}>{h.name[0]}</span>
                <span className={styles.hBadge} style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
                  {h.badge || 'Verified'}
                </span>
              </div>
              <div className={styles.hospitalBody}>
                <h4 className={styles.hName}>{h.name}</h4>
                <p className={styles.hAddress}>📍 {h.address}</p>
                <div className={styles.hMeta}>
                  <span>★ {h.rating}</span>
                  <span className={styles.bullet}>·</span>
                  <span>{h.openHours || h.hours}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

