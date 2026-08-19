import styles from './HospitalCard.module.css'

export default function HospitalCard({ hospital, serviceId, cheapest, isSelected, isHovered, onClick, onHover, onBook }) {
  const svc = hospital.services ? hospital.services[serviceId] : null
  const isCheapest = svc?.price && svc.price === cheapest



  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ''} ${isHovered ? styles.hovered : ''}`}
      onClick={onClick}
      onMouseEnter={() => onHover?.(hospital.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      <div className={styles.mainInfo}>
        <div className={styles.headerRow}>
          <div className={styles.leftMeta}>
            <span className={styles.hospitalName}>{hospital.name}</span>
          </div>
          
          {/* Price display */}
          <div className={styles.priceContainer}>
            {isCheapest && <span className={styles.lowestBadge}>LOWEST PRICE</span>}
            <div className={styles.price}>₹{svc?.price?.toLocaleString() || '—'}</div>
          </div>
        </div>



        {/* Core Comparison Metrics Grid */}
        <div className={styles.comparisonGrid}>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Price</span>
            <span className={styles.metricValue}>₹{svc?.price?.toLocaleString() || '—'}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Distance</span>
            <span className={styles.metricValue}>{hospital.distance || 0} km</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Report Turnaround</span>
            <span className={styles.metricValue}>{svc?.report_time || svc?.report || 'N/A'}</span>
          </div>
        </div>

        {/* Address and details */}
        <div className={styles.addressRow}>
          <span className={styles.icon}>📍</span>
          <span className={styles.addressText}>{hospital.address}</span>
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Footer row */}
        <div className={styles.cardFooter}>
          <div className={styles.tags}>
            <span className={`${styles.tag} ${hospital.openNow ? styles.tagOpen : styles.tagClosed}`}>
              <span className={styles.tagDot} />
              {hospital.openNow ? 'Open now' : 'Closed'}
            </span>
            <span className={styles.tag}>
              ⏱ {svc?.duration_minutes || svc?.duration || 15} mins
            </span>
            <span className={styles.tag}>
              📞 {hospital.phone}
            </span>
          </div>

          <div className={styles.actions}>
            <button 
              className={styles.viewProfileBtn}
              onClick={(e) => { e.stopPropagation(); onClick(); }}
            >
              View details
            </button>
            <button
              className={styles.bookBtn}
              onClick={e => { e.stopPropagation(); onBook(); }}
              disabled={!svc?.available}
            >
              {svc?.available ? 'Book slot →' : 'Unavailable'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

