import styles from './HospitalCard.module.css'

const BADGE_COLORS = {
  teal: { bg: 'rgba(16,185,129,0.1)', color: '#047857', border: 'rgba(16,185,129,0.2)' },
  amber: { bg: 'rgba(245,158,11,0.1)', color: '#b45309', border: 'rgba(245,158,11,0.2)' },
  chalk: { bg: 'rgba(100,116,139,0.1)', color: '#334155', border: 'rgba(100,116,139,0.2)' },
}

export default function HospitalCard({ hospital, serviceId, cheapest, isSelected, onClick, onHover, onBook }) {
  const svc = hospital.services[serviceId]
  const isCheapest = svc?.price === cheapest
  const colors = BADGE_COLORS[hospital.badgeColor] || BADGE_COLORS.chalk

  const renderStars = (rating) => {
    const full = Math.floor(rating)
    const half = rating % 1 >= 0.5
    return (
      <span className={styles.stars}>
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={styles.star}
            style={{ color: i < full || (i === full && half) ? '#F5A623' : '#e2e8f0' }}
          >
            ★
          </span>
        ))}
        <span className={styles.ratingNum}>{rating}</span>
        <span className={styles.reviewCount}>({hospital.reviews.toLocaleString()})</span>
      </span>
    )
  }

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
      onMouseEnter={() => onHover(hospital.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Top row */}
      <div className={styles.top}>
        <div className={styles.avatar}>
          <span className={styles.avatarText}>{hospital.name[0]}</span>
        </div>

        <div className={styles.info}>
          <div className={styles.nameRow}>
            <span className={styles.name}>{hospital.name}</span>
            <span
              className={styles.badge}
              style={{ background: colors.bg, color: colors.color, border: `1px solid ${colors.border}` }}
            >
              {hospital.badge}
            </span>
          </div>
          <div className={styles.meta}>
            {renderStars(hospital.rating)}
          </div>
          <div className={styles.address}>
            <svg viewBox="0 0 12 12" fill="none" width="10" height="10">
              <circle cx="6" cy="5" r="2" stroke="currentColor" strokeWidth="1" />
              <path d="M6 1C3.79 1 2 2.79 2 5c0 2.81 4 7 4 7s4-4.19 4-7c0-2.21-1.79-4-4-4z" stroke="currentColor" strokeWidth="1" />
            </svg>
            {hospital.address} · {hospital.distance} km
          </div>
        </div>

        <div className={styles.priceBox}>
          {isCheapest && <div className={styles.cheapTag}>LOWEST</div>}
          <div className={styles.price}>₹{svc?.price?.toLocaleString() || '—'}</div>
          <div className={styles.priceSub}>{svc?.report ? `Report in ${svc.report}` : 'N/A'}</div>
        </div>
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Bottom row */}
      <div className={styles.bottom}>
        <div className={styles.chips}>
          <span className={`${styles.chip} ${hospital.openNow ? styles.chipGreen : styles.chipRed}`}>
            <span className={styles.chipDot} />
            {hospital.openNow ? 'Open now' : 'Closed'}
          </span>
          <span className={styles.chip}>
            <svg viewBox="0 0 12 12" fill="none" width="10" height="10">
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
              <path d="M6 3.5V6l1.5 1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
            {svc?.duration || '—'} min
          </span>
          <span className={styles.chip}>
            {hospital.hours}
          </span>
        </div>

        <button
          className={styles.bookBtn}
          onClick={e => { e.stopPropagation(); onBook() }}
          disabled={!svc?.available}
        >
          {svc?.available ? 'Book slot →' : 'Unavailable'}
        </button>
      </div>
    </div>
  )
}
