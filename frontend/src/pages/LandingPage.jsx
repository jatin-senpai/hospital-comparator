import { useState } from 'react';
import { SERVICES, CITIES, HOSPITALS } from '../services/mockData';
import styles from './LandingPage.module.css';

// SVG Icon Pack - High-End Premium Vectors
const Icons = {
  imaging: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  ),
  pathology: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <path d="M4.5 16.5c-1.5 1.26-2.5 3.19-2.5 5.5h20c0-2.31-1-4.24-2.5-5.5" />
      <path d="M12 2v14" />
      <path d="M9 7h6" />
    </svg>
  ),
  cardiology: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
};

export default function LandingPage({ onSearch, onSelectHospital, onSelectService }) {
  const [selectedServiceId, setSelectedServiceId] = useState('mri');
  const [selectedCityId, setSelectedCityId] = useState('jaipur');
  const [hoveredPreviewId, setHoveredPreviewId] = useState(null);
  const [activeWorkStep, setActiveWorkStep] = useState(0);

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
      report: svc?.report || '24 hrs',
      // Map vector coordinates on centerpiece visual SVG map
      x: h.id === 1 ? 55 : h.id === 2 ? 180 : h.id === 3 ? 245 : 100,
      y: h.id === 1 ? 70 : h.id === 2 ? 185 : h.id === 3 ? 115 : 210
    };
  }).filter(r => r.price > 0).sort((a, b) => a.price - b.price);

  const minPrice = previewResults.length ? previewResults[0].price : 0;
  const hoveredHospital = previewResults.find(r => r.id === hoveredPreviewId);

  const handleSearchSubmit = () => {
    onSearch(activeService.label, selectedServiceId, activeCity);
  };

  return (
    <div className={styles.page}>
      {/* Editorial Hero */}
      <section className={styles.heroSection}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          Diagnostic service comparison platform
        </div>
        <h1 className={styles.headline}>
          Compare care <br />
          <span className={styles.highlight}>before you get there.</span>
        </h1>
        <p className={styles.sub}>
          Compare available prices, distance, and report turnaround side-by-side before choosing where to go. Avoid paying extra on diagnostic procedures.
        </p>

        <div className={styles.heroBtns}>
          <button className={styles.primaryBtn} onClick={handleSearchSubmit}>
            Compare services
          </button>
          <a href="#how-it-works" className={styles.secondaryBtn}>
            How it works
          </a>
        </div>
      </section>

      {/* Centerpiece Split Search & Map Experience */}
      <section id="search-widget" className={styles.centerpieceSection}>
        <div className={styles.searchWidget}>
          <div className={styles.searchHeader}>
            <span className={styles.searchHeaderIcon}>◈</span>
            Find a diagnostic service
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
              Compare →
            </button>
          </div>

          {/* Interactive Split View: Left List, Right Vector Map */}
          <div className={styles.interactiveSplit}>
            {/* Left list preview */}
            <div className={styles.previewListCol}>
              <div className={styles.previewMetaHeader}>
                {previewResults.length} providers near {activeCity.name}
              </div>
              <div className={styles.previewList}>
                {previewResults.map(r => (
                  <div 
                    key={r.id} 
                    className={`${styles.previewRow} ${hoveredPreviewId === r.id ? styles.previewRowActive : ''}`}
                    onMouseEnter={() => setHoveredPreviewId(r.id)}
                    onMouseLeave={() => setHoveredPreviewId(null)}
                    onClick={() => onSelectHospital(r.id)}
                  >
                    <div className={styles.hDetails}>
                      <div className={styles.hNameRow}>
                        <span className={styles.hName}>{r.name}</span>
                        {r.price === minPrice && <span className={styles.lowestBadge}>LOWEST</span>}
                      </div>
                      <div className={styles.hMetaRow}>
                        <span>★ {r.rating}</span>
                        <span>·</span>
                        <span>{r.distance} km</span>
                        <span>·</span>
                        <span>{r.report}</span>
                      </div>
                    </div>
                    <div className={styles.priceDetails}>
                      <span className={styles.price}>₹{r.price.toLocaleString()}</span>
                      <span className={styles.viewLink}>View profile →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Vector Map mock visualization */}
            <div className={styles.previewMapCol}>
              <div className={styles.vectorMapContainer}>
                {/* SVG Mock Map Grid */}
                <svg className={styles.vectorMapSvg} viewBox="0 0 300 280">
                  <defs>
                    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(15,23,42,0.03)" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Distance Rings */}
                  <circle cx="150" cy="140" r="60" fill="none" stroke="rgba(37,99,235,0.04)" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="150" cy="140" r="110" fill="none" stroke="rgba(37,99,235,0.02)" strokeWidth="1" strokeDasharray="3 3" />

                  {/* Connection line if row hovered */}
                  {hoveredHospital && (
                    <>
                      <line 
                        x1="150" 
                        y1="140" 
                        x2={hoveredHospital.x} 
                        y2={hoveredHospital.y} 
                        stroke="var(--accent)" 
                        strokeWidth="1.5" 
                        strokeDasharray="4 4"
                      />
                      <circle cx={hoveredHospital.x} cy={hoveredHospital.y} r="16" fill="rgba(37,99,235,0.08)" />
                    </>
                  )}

                  {/* Center "You" node */}
                  <circle cx="150" cy="140" r="6" fill="var(--accent)" />
                  <circle cx="150" cy="140" r="12" fill="none" stroke="var(--accent)" strokeWidth="1.5" style={{ opacity: 0.4 }} />

                  {/* Hospital Nodes */}
                  {previewResults.map(r => {
                    const isNodeHovered = hoveredPreviewId === r.id;
                    const nodeColor = isNodeHovered ? 'var(--accent)' : r.price === minPrice ? 'var(--success)' : 'var(--chalk-2)';
                    
                    return (
                      <g key={r.id} className={styles.mapNodeGroup} onMouseEnter={() => setHoveredPreviewId(r.id)} onMouseLeave={() => setHoveredPreviewId(null)}>
                        <circle 
                          cx={r.x} 
                          cy={r.y} 
                          r={isNodeHovered ? "8" : "5"} 
                          fill={nodeColor}
                          style={{ transition: 'all 0.2s' }}
                        />
                        <text 
                          x={r.x} 
                          y={r.y - 12} 
                          textAnchor="middle" 
                          fill="var(--chalk)" 
                          className={styles.mapNodeText}
                          style={{ fontWeight: isNodeHovered ? 700 : 500 }}
                        >
                          ₹{r.price.toLocaleString()}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                {hoveredHospital && (
                  <div className={styles.mapTooltip}>
                    <strong>{hoveredHospital.name}</strong> is <span>{hoveredHospital.distance} km</span> away
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Proof Section */}
      <section className={styles.proofSection}>
        <div className={styles.sectionHeading}>
          <h2 className={styles.sectionTitle}>Compare what actually matters.</h2>
          <p className={styles.sectionSubtitle}>We compile real pricing spreads, geographic distances, and report turnaround speeds side-by-side.</p>
        </div>

        <div className={styles.proofGrid}>
          {/* Price proof Column */}
          <div className={styles.proofCol}>
            <div className={styles.proofColHeader}>PRICE COMPARISON (MRI SCAN)</div>
            <div className={styles.proofVisualList}>
              <div className={styles.proofVisualRow} style={{ color: 'var(--success)' }}>
                <span className={styles.proofLabel}>Max LifeCare Center (Lowest)</span>
                <span className={styles.proofBarContainer}>
                  <span className={styles.proofBar} style={{ width: '67%', backgroundColor: 'var(--success)' }} />
                </span>
                <span className={styles.proofVal}>₹3,500</span>
              </div>
              <div className={styles.proofVisualRow}>
                <span className={styles.proofLabel}>Fortis Health Hub</span>
                <span className={styles.proofBarContainer}>
                  <span className={styles.proofBar} style={{ width: '76%', backgroundColor: 'var(--chalk-2)' }} />
                </span>
                <span className={styles.proofVal}>₹3,999</span>
              </div>
              <div className={styles.proofVisualRow}>
                <span className={styles.proofLabel}>Apollo Diagnostics</span>
                <span className={styles.proofBarContainer}>
                  <span className={styles.proofBar} style={{ width: '86%', backgroundColor: 'var(--chalk-2)' }} />
                </span>
                <span className={styles.proofVal}>₹4,500</span>
              </div>
              <div className={styles.proofVisualRow}>
                <span className={styles.proofLabel}>Medanta Diagnostics (Highest)</span>
                <span className={styles.proofBarContainer}>
                  <span className={styles.proofBar} style={{ width: '100%', backgroundColor: 'var(--chalk-2)' }} />
                </span>
                <span className={styles.proofVal}>₹5,200</span>
              </div>
            </div>
          </div>

          {/* Distance proof Column */}
          <div className={styles.proofCol}>
            <div className={styles.proofColHeader}>PROXIMITY FROM CENTER (JAIPUR)</div>
            <div className={styles.proofVisualList}>
              <div className={styles.proofVisualRow}>
                <span className={styles.proofLabel}>Apollo Diagnostics (Closest)</span>
                <span className={styles.proofBarContainer}>
                  <span className={styles.proofBar} style={{ width: '29%', backgroundColor: 'var(--accent)' }} />
                </span>
                <span className={styles.proofVal}>1.2 km</span>
              </div>
              <div className={styles.proofVisualRow}>
                <span className={styles.proofLabel}>Fortis Health Hub</span>
                <span className={styles.proofBarContainer}>
                  <span className={styles.proofBar} style={{ width: '65%', backgroundColor: 'var(--accent)' }} />
                </span>
                <span className={styles.proofVal}>2.7 km</span>
              </div>
              <div className={styles.proofVisualRow}>
                <span className={styles.proofLabel}>Max LifeCare Center</span>
                <span className={styles.proofBarContainer}>
                  <span className={styles.proofBar} style={{ width: '82%', backgroundColor: 'var(--accent)' }} />
                </span>
                <span className={styles.proofVal}>3.4 km</span>
              </div>
              <div className={styles.proofVisualRow}>
                <span className={styles.proofLabel}>Medanta Diagnostics</span>
                <span className={styles.proofBarContainer}>
                  <span className={styles.proofBar} style={{ width: '100%', backgroundColor: 'var(--accent)' }} />
                </span>
                <span className={styles.proofVal}>4.1 km</span>
              </div>
            </div>
          </div>

          {/* Turnaround proof Column */}
          <div className={styles.proofCol}>
            <div className={styles.proofColHeader}>REPORT DELIVERY TURNAROUND</div>
            <div className={styles.proofVisualList}>
              <div className={styles.proofVisualRow} style={{ color: 'var(--success)' }}>
                <span className={styles.proofLabel}>Medanta Diagnostics (Fastest)</span>
                <span className={styles.proofBarContainer}>
                  <span className={styles.proofBar} style={{ width: '25%', backgroundColor: 'var(--success)' }} />
                </span>
                <span className={styles.proofVal}>12 hrs</span>
              </div>
              <div className={styles.proofVisualRow}>
                <span className={styles.proofLabel}>Fortis Health Hub</span>
                <span className={styles.proofBarContainer}>
                  <span className={styles.proofBar} style={{ width: '50%', backgroundColor: 'var(--primary)' }} />
                </span>
                <span className={styles.proofVal}>24 hrs</span>
              </div>
              <div className={styles.proofVisualRow}>
                <span className={styles.proofLabel}>Apollo Diagnostics</span>
                <span className={styles.proofBarContainer}>
                  <span className={styles.proofBar} style={{ width: '50%', backgroundColor: 'var(--primary)' }} />
                </span>
                <span className={styles.proofVal}>24 hrs</span>
              </div>
              <div className={styles.proofVisualRow} style={{ color: 'var(--warning)' }}>
                <span className={styles.proofLabel}>Max LifeCare Center</span>
                <span className={styles.proofBarContainer}>
                  <span className={styles.proofBar} style={{ width: '100%', backgroundColor: 'var(--warning)' }} />
                </span>
                <span className={styles.proofVal}>48 hrs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* "One Decision, All the Context" Capability Showcase */}
      <section className={styles.capabilitySection}>
        <div className={styles.capabilityContent}>
          <div className={styles.leftColInfo}>
            <div className={styles.leftLabel}>One decision, all the context.</div>
            <p className={styles.capabilityText}>
              We combine diagnostic pricing parameters, geographical distance calculations, and laboratory turnaround times into a single visual summary.
            </p>
          </div>

          {/* Compact decision matrix using actual Jaipur MRI rates */}
          <div className={styles.decisionMatrixContainer}>
            <div className={styles.matrixHeader}>
              <span>PROVIDER</span>
              <span>PRICE</span>
              <span>DISTANCE</span>
              <span>TURNAROUND</span>
            </div>
            <div className={styles.matrixBody}>
              <div className={styles.matrixRow}>
                <span className={styles.mName}>Max LifeCare</span>
                <span className={styles.mPrice}>₹3,500</span>
                <span className={styles.mDist}>3.4 km</span>
                <span className={styles.mTime}>48 hrs</span>
              </div>
              <div className={styles.matrixRow}>
                <span className={styles.mName}>Fortis Hub</span>
                <span className={styles.mPrice}>₹3,999</span>
                <span className={styles.mDist}>2.7 km</span>
                <span className={styles.mTime}>24 hrs</span>
              </div>
              <div className={styles.matrixRow}>
                <span className={styles.mName}>Apollo Diag.</span>
                <span className={styles.mPrice}>₹4,500</span>
                <span className={styles.mDist}>1.2 km</span>
                <span className={styles.mTime}>24 hrs</span>
              </div>
              <div className={styles.matrixRow}>
                <span className={styles.mName}>Medanta Diag.</span>
                <span className={styles.mPrice}>₹5,200</span>
                <span className={styles.mDist}>4.1 km</span>
                <span className={styles.mTime}>12 hrs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Workflow Stepper */}
      <section id="how-it-works" className={styles.timelineSection}>
        <div className={styles.sectionHeading}>
          <h2 className={styles.sectionTitle}>How it works</h2>
          <p className={styles.sectionSubtitle}>Select the steps below to preview our diagnostic booking workflow.</p>
        </div>

        <div className={styles.interactiveWorkflow}>
          <div className={styles.workflowToggles}>
            {[
              { title: '01 Search', desc: 'Choose service and location' },
              { title: '02 Compare', desc: 'Sort by price, distance, or time' },
              { title: '03 Choose', desc: 'Select matching slot calendar' },
              { title: '04 Book', desc: 'Submit patient form & pay' },
            ].map((st, idx) => (
              <button 
                key={idx}
                className={`${styles.workflowTab} ${activeWorkStep === idx ? styles.workflowTabActive : ''}`}
                onClick={() => setActiveWorkStep(idx)}
              >
                <div className={styles.workflowTabTitle}>{st.title}</div>
                <div className={styles.workflowTabDesc}>{st.desc}</div>
              </button>
            ))}
          </div>

          {/* Workflow Simulation Preview window */}
          <div className={styles.workflowPreview}>
            {activeWorkStep === 0 && (
              <div className={styles.simCard}>
                <div className={styles.simCardHeader}>STEP 1: SELECT DIAGNOSTIC PROCEDURE</div>
                <div className={styles.simForm}>
                  <div className={styles.simInputGroup}>
                    <label>PROCEDURE</label>
                    <div className={styles.simFakeInput}>MRI Scan</div>
                  </div>
                  <div className={styles.simInputGroup}>
                    <label>LOCATION</label>
                    <div className={styles.simFakeInput}>Jaipur, Rajasthan</div>
                  </div>
                  <button className={styles.simBtn} onClick={() => setActiveWorkStep(1)}>Compare local rates →</button>
                </div>
              </div>
            )}

            {activeWorkStep === 1 && (
              <div className={styles.simCard}>
                <div className={styles.simCardHeader}>STEP 2: COMPARE ACCREDITED HOSPITALS</div>
                <div className={styles.simList}>
                  <div className={styles.simRow} style={{ borderColor: 'var(--success)' }}>
                    <span>Max LifeCare</span>
                    <strong>₹3,500</strong>
                    <span className={styles.simTag}>Cheapest</span>
                  </div>
                  <div className={styles.simRow}>
                    <span>Fortis Hub</span>
                    <strong>₹3,999</strong>
                  </div>
                  <div className={styles.simRow}>
                    <span>Apollo Diagnostics</span>
                    <strong>₹4,500</strong>
                  </div>
                </div>
              </div>
            )}

            {activeWorkStep === 2 && (
              <div className={styles.simCard}>
                <div className={styles.simCardHeader}>STEP 3: SELECT CONVENIENT TIME SLOT</div>
                <div className={styles.simSlotsGrid}>
                  <span className={styles.simSlotItem}>09:00 AM</span>
                  <span className={`${styles.simSlotItem} ${styles.simSlotActive}`}>11:00 AM (Selected)</span>
                  <span className={styles.simSlotItem}>02:00 PM</span>
                  <span className={styles.simSlotItem}>04:00 PM</span>
                </div>
                <button className={styles.simBtn} onClick={() => setActiveWorkStep(3)}>Continue to patient details →</button>
              </div>
            )}

            {activeWorkStep === 3 && (
              <div className={styles.simCard}>
                <div className={styles.simCardHeader}>STEP 4: SECURE PAYMENT &amp; CONFIRM</div>
                <div className={styles.simInvoice}>
                  <div className={styles.simInvoiceRow}>
                    <span>MRI Scan test</span>
                    <span>₹3,500</span>
                  </div>
                  <div className={styles.simInvoiceRow}>
                    <span>Platform Service Fee</span>
                    <span style={{ color: 'var(--success)' }}>FREE</span>
                  </div>
                  <div className={styles.simInvoiceDivider} />
                  <div className={styles.simInvoiceFinal}>
                    <span>Total Cost</span>
                    <span>₹3,500</span>
                  </div>
                </div>
                <div className={styles.simFooter}>
                  🔒 Secured checkout using SSL &amp; Razorpay
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services grid selection */}
      <section id="services" className={styles.categoriesSection}>
        <div className={styles.sectionHeading}>
          <h2 className={styles.sectionTitle}>Explore services</h2>
          <p className={styles.sectionSubtitle}>Select diagnostic procedures sorted into structured clinical departments.</p>
        </div>

        <div className={styles.categoriesGroups}>
          {/* Imaging department */}
          <div className={styles.catGroup}>
            <div className={styles.catGroupHeader}>
              {Icons.imaging()}
              <span>Imaging Scans</span>
            </div>
            <div className={styles.catGroupList}>
              {SERVICES.filter(s => s.category === 'Imaging').map(s => (
                <div key={s.id} className={styles.catRow} onClick={() => { setSelectedServiceId(s.id); onSelectService(s.id); }}>
                  <span>{s.label}</span>
                  <span className={styles.catArrow}>→</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pathology department */}
          <div className={styles.catGroup}>
            <div className={styles.catGroupHeader}>
              {Icons.pathology()}
              <span>Pathology Panels</span>
            </div>
            <div className={styles.catGroupList}>
              {SERVICES.filter(s => s.category === 'Pathology').map(s => (
                <div key={s.id} className={styles.catRow} onClick={() => { setSelectedServiceId(s.id); onSelectService(s.id); }}>
                  <span>{s.label}</span>
                  <span className={styles.catArrow}>→</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cardiology department */}
          <div className={styles.catGroup}>
            <div className={styles.catGroupHeader}>
              {Icons.cardiology()}
              <span>Cardiology Department</span>
            </div>
            <div className={styles.catGroupList}>
              {SERVICES.filter(s => s.category === 'Cardiology').map(s => (
                <div key={s.id} className={styles.catRow} onClick={() => { setSelectedServiceId(s.id); onSelectService(s.id); }}>
                  <span>{s.label}</span>
                  <span className={styles.catArrow}>→</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hospital showcase list */}
      <section id="hospitals" className={styles.hospitalsSection}>
        <div className={styles.sectionHeading}>
          <h2 className={styles.sectionTitle}>Partner diagnostic networks</h2>
          <p className={styles.sectionSubtitle}>Accredited clinics, testing laboratories, and hospital centers in our network.</p>
        </div>

        <div className={styles.hospitalsGrid}>
          {HOSPITALS.slice(0, 4).map(h => (
            <div 
              key={h.id} 
              className={styles.hospitalShowcard}
              onClick={() => onSelectHospital(h.id)}
            >
              <div className={styles.hospitalHead}>
                <div className={styles.accBadge}>
                  {Icons.shield()}
                  <span>{h.badge || 'NABL Accredited'}</span>
                </div>
                <div className={styles.starsRow}>★ {h.rating}</div>
              </div>
              
              <div className={styles.hospitalBody}>
                <h4 className={styles.hName}>{h.name}</h4>
                <p className={styles.hAddress}>📍 {h.address}</p>
                <div className={styles.hServicesList}>
                  {Object.keys(h.services || {}).slice(0, 3).map(svcKey => {
                    const match = SERVICES.find(x => x.id === svcKey);
                    return <span key={svcKey} className={styles.hServiceTag}>{match?.label || svcKey}</span>;
                  })}
                </div>
              </div>

              <div className={styles.hospitalFooter}>
                <span className={styles.hHours}>⏰ {h.open_hours || h.hours}</span>
                <span className={styles.viewLink}>View provider →</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
