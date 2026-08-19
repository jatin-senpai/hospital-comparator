import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { SERVICES } from '../services/mockData';
import styles from './HospitalDetailDrawer.module.css';

export default function HospitalDetailDrawer({ hospitalId, activeServiceId, onClose, onBook }) {
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!hospitalId) return;
    
    const fetchHospitalDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await api.getHospital(hospitalId);
        // data contains { hospital: {...}, services: [...] }
        setHospital(data.hospital || data);
      } catch (err) {
        setError('Failed to load hospital details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalDetails();
  }, [hospitalId]);

  if (!hospitalId) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        {/* Header bar */}
        <div className={styles.header}>
          <button className={styles.closeBtn} onClick={onClose}>
            ← Back to results
          </button>
          {hospital && (
            <span className={styles.badge} style={{ background: 'rgba(15,23,42,0.04)', color: 'var(--chalk-2)' }}>
              Est. {hospital.established || 2010}
            </span>
          )}
        </div>

        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <p>Loading hospital profiles...</p>
          </div>
        ) : error ? (
          <div className={styles.errorState}>
            <p>{error}</p>
            <button className={styles.retryBtn} onClick={onClose}>Go Back</button>
          </div>
        ) : (
          <div className={styles.content}>
            {/* Hero info */}
            <div className={styles.heroSection}>
              <h2 className={styles.name}>{hospital.name}</h2>
              {hospital.tagline && <p className={styles.tagline}>"{hospital.tagline}"</p>}
              

            </div>

            {/* General Meta Section */}
            <div className={styles.metaSection}>
              <div className={styles.metaItem}>
                <span className={styles.metaIcon}>📍</span>
                <div>
                  <div className={styles.metaLabel}>Address</div>
                  <div className={styles.metaValue}>{hospital.address}</div>
                </div>
              </div>

              <div className={styles.metaItem}>
                <span className={styles.metaIcon}>⏰</span>
                <div>
                  <div className={styles.metaLabel}>Operating Hours</div>
                  <div className={styles.metaValue}>{hospital.open_hours || '24 Hours'}</div>
                </div>
              </div>

              <div className={styles.metaItem}>
                <span className={styles.metaIcon}>📞</span>
                <div>
                  <div className={styles.metaLabel}>Contact Number</div>
                  <div className={styles.metaValue}>{hospital.phone || '+91 98000 00000'}</div>
                </div>
              </div>

              <div className={styles.metaItem}>
                <span className={styles.metaIcon}>📅</span>
                <div>
                  <div className={styles.metaLabel}>Established Year</div>
                  <div className={styles.metaValue}>{hospital.established || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Available Services Listing */}
            <div className={styles.servicesSection}>
              <h3 className={styles.sectionTitle}>Tests & Pricing</h3>
              <p className={styles.sectionDesc}>Book any available diagnostic procedure below:</p>

              <div className={styles.servicesGrid}>
                {hospital.services && hospital.services.map((svc) => {
                  const matchingMock = SERVICES.find(s => s.id === svc.service_id);
                  const isActive = svc.service_id === activeServiceId;
                  
                  return (
                    <div 
                      key={svc.id} 
                      className={`${styles.serviceCard} ${isActive ? styles.activeServiceCard : ''}`}
                    >
                      <div className={styles.serviceInfo}>
                        <span className={styles.serviceIcon}>{matchingMock?.icon || '◈'}</span>
                        <div>
                          <div className={styles.serviceName}>{svc.service_name}</div>
                          <div className={styles.serviceDetails}>
                            ⏱ {svc.duration_minutes || svc.duration || 15} mins · 📄 Report in {svc.report_time || svc.report || '2 hrs'}
                          </div>
                        </div>
                      </div>
                      
                      <div className={styles.serviceAction}>
                        <div className={styles.price}>₹{svc.price.toLocaleString()}</div>
                        <button 
                          className={styles.bookBtn}
                          disabled={!svc.available}
                          onClick={() => onBook(hospital, svc.service_id)}
                        >
                          {svc.available ? 'Book' : 'N/A'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
