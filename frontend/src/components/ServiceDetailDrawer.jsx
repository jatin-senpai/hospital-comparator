import { SERVICES } from '../services/mockData';
import styles from './ServiceDetailDrawer.module.css';

export default function ServiceDetailDrawer({ serviceId, hospitals, onClose, onBook }) {
  const service = SERVICES.find(s => s.id === serviceId);

  if (!serviceId || !service) return null;

  // Filter hospitals that offer this service and sort them by price
  const hospitalOffers = hospitals
    .filter(h => h.services && h.services[serviceId])
    .map(h => ({
      ...h,
      offer: h.services[serviceId]
    }))
    .sort((a, b) => a.offer.price - b.offer.price);

  const prices = hospitalOffers.map(h => h.offer.price);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;
  const avgPrice = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        {/* Header bar */}
        <div className={styles.header}>
          <button className={styles.closeBtn} onClick={onClose}>
            ← Back to search
          </button>
          <span className={styles.categoryBadge}>{service.category}</span>
        </div>

        <div className={styles.content}>
          {/* Hero Section */}
          <div className={styles.heroSection}>
            <div className={styles.iconCircle}>{service.icon}</div>
            <h2 className={styles.name}>{service.label} Comparison</h2>
            <p className={styles.description}>
              Compare pricing, reporting times, and ratings for {service.label} diagnostic testing across top centers in your area.
            </p>
          </div>

          {/* Pricing stats overview */}
          {hospitalOffers.length > 0 && (
            <div className={styles.statsCard}>
              <div className={styles.statCol}>
                <div className={styles.statLabel}>Lowest Price</div>
                <div className={styles.statValue} style={{ color: 'var(--success)' }}>₹{minPrice.toLocaleString()}</div>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statCol}>
                <div className={styles.statLabel}>Average Price</div>
                <div className={styles.statValue}>₹{avgPrice.toLocaleString()}</div>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statCol}>
                <div className={styles.statLabel}>Highest Price</div>
                <div className={styles.statValue}>₹{maxPrice.toLocaleString()}</div>
              </div>
            </div>
          )}

          {/* List of Hospitals offering this service */}
          <div className={styles.offersSection}>
            <h3 className={styles.sectionTitle}>Providers Offering This Test ({hospitalOffers.length})</h3>

            {hospitalOffers.length === 0 ? (
              <div className={styles.emptyState}>
                This test is not currently available at any hospitals in the selected area.
              </div>
            ) : (
              <div className={styles.offersList}>
                {hospitalOffers.map((hospital, idx) => {
                  const isLowest = hospital.offer.price === minPrice;
                  
                  return (
                    <div key={hospital.id} className={styles.offerCard}>
                      <div className={styles.offerMain}>
                        <div className={styles.hospitalMeta}>
                          <div className={styles.hospitalRow}>
                            <span className={styles.hospitalName}>{hospital.name}</span>
                            {isLowest && (
                              <span className={styles.lowestBadge}>LOWEST</span>
                            )}
                          </div>
                          
                          <div className={styles.ratingRow}>
                            <span className={styles.rating}>★ {hospital.rating}</span>
                            <span className={styles.reviewCount}>({hospital.reviews} reviews)</span>
                            <span className={styles.bullet}>·</span>
                            <span className={styles.distance}>{hospital.distance} km away</span>
                          </div>
                        </div>

                        <div className={styles.priceCol}>
                          <div className={styles.price}>₹{hospital.offer.price.toLocaleString()}</div>
                          <div className={styles.reportTime}>Report: {hospital.offer.report}</div>
                        </div>
                      </div>

                      <div className={styles.offerFooter}>
                        <div className={styles.chips}>
                          <span className={styles.chip}>⏱ {hospital.offer.duration} mins</span>
                          <span className={styles.chip}>⚡ Instant Booking</span>
                        </div>
                        
                        <button 
                          className={styles.bookBtn}
                          disabled={!hospital.offer.available}
                          onClick={() => onBook(hospital, serviceId)}
                        >
                          {hospital.offer.available ? 'Book Appointment' : 'Unavailable'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
