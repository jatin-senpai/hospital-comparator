import { useState, useEffect } from 'react'
import { HOSPITALS, SERVICES, CITIES } from '../services/mockData'
import { api } from '../services/api'
import HospitalCard from '../components/HospitalCard'
import MapPanel from '../components/MapPanel'
import styles from './ResultsPage.module.css'

export default function ResultsPage({ query, serviceId, city, onBook, onBack }) {
  const [hospitals, setHospitals] = useState([])
  const [selected, setSelected] = useState(null)
  const [sortBy, setSortBy] = useState('distance')
  const [activeService, setActiveService] = useState(serviceId || 'blood')
  const [loaded, setLoaded] = useState(false)
  const [hoveredId, setHoveredId] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Get city info, default to Jaipur if not provided
  const cityData = city || CITIES[0]

  useEffect(() => {
    const fetchHospitals = async () => {
      setLoading(true)
      try {
        const data = await api.searchHospitals(activeService, cityData.latitude, cityData.longitude)
        // Backend returns: { results: [{ hospital: {...}, distance: 1.2, price: {...} }] }
        // We need to map it to match the component props format
        const formatted = data.results.map(r => ({
          ...r.hospital,
          distance: r.distance,
          // Convert the array of services or single price to what HospitalCard expects
          services: {
            [activeService]: {
              price: r.price ? r.price.price : 0,
              duration: r.price ? r.price.duration_min : 15,
              available: r.price ? r.price.available : false,
              report: r.price ? r.price.report_time : '2 hrs'
            }
          }
        }))
        setHospitals(formatted)
      } catch (err) {
        console.error("Failed to fetch hospitals:", err)
        setHospitals([])
      } finally {
        setLoading(false)
        setLoaded(true)
      }
    }
    fetchHospitals()
  }, [activeService, cityData])

  const service = SERVICES.find(s => s.id === activeService)

  const sorted = [...hospitals].sort((a, b) => {
    if (sortBy === 'distance') return a.distance - b.distance
    if (sortBy === 'price') return (a.services[activeService]?.price || 0) - (b.services[activeService]?.price || 0)
    if (sortBy === 'rating') return b.rating - a.rating
    return 0
  })

  const cheapest = Math.min(...hospitals.map(h => h.services[activeService]?.price || Infinity))

  return (
    <div className={styles.page}>
      {/* Top bar */}
      <div className={styles.topbar}>
        <button className={styles.backBtn} onClick={onBack}>
          <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
            <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Back
        </button>

        <div className={styles.queryInfo}>
          <span className={styles.queryText}>"{query}"</span>
          <span className={styles.queryCount}>{hospitals.length} hospitals found</span>
        </div>

        <div className={styles.topRight}>
          <div className={styles.locBadge}>
            <svg viewBox="0 0 16 16" fill="none" width="12" height="12">
              <circle cx="8" cy="7" r="3" stroke="currentColor" strokeWidth="1.2" />
              <path d="M8 2C5.24 2 3 4.24 3 7c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5z" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            {cityData.name}
          </div>
        </div>
      </div>

      {/* Service filter strip */}
      <div className={styles.serviceStrip}>
        <div className={styles.serviceScroll}>
          {SERVICES.map(s => (
            <button
              key={s.id}
              className={`${styles.serviceTab} ${activeService === s.id ? styles.serviceActive : ''}`}
              onClick={() => setActiveService(s.id)}
            >
              <span className={styles.serviceTabIcon}>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.main}>
        {/* Left — list */}
        <div className={styles.listCol}>
          {/* Sort + info bar */}
          <div className={styles.listHeader}>
            <div className={styles.priceAlert}>
              <span className={styles.priceAlertIcon}>◆</span>
              Lowest: <strong>₹{cheapest}</strong> for {service?.label}
            </div>
            <div className={styles.sortWrap}>
              <span className={styles.sortLabel}>Sort by</span>
              <select
                className={styles.sortSelect}
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="distance">Distance</option>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {/* Cards */}
          <div className={styles.cards}>
            {sorted.map((hospital, i) => (
              <div
                key={hospital.id}
                style={{ animationDelay: `${i * 0.08}s` }}
                className={`${styles.cardWrap} ${loaded ? styles.cardVisible : ''}`}
              >
                <HospitalCard
                  hospital={hospital}
                  serviceId={activeService}
                  cheapest={cheapest}
                  isSelected={selected?.id === hospital.id}
                  isHovered={hoveredId === hospital.id}
                  onClick={() => setSelected(hospital)}
                  onHover={setHoveredId}
                  onBook={() => onBook(hospital, activeService)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right — map */}
        <div className={styles.mapCol}>
          <MapPanel
            hospitals={sorted}
            serviceId={activeService}
            selected={selected}
            hoveredId={hoveredId}
            city={cityData}
            onSelect={setSelected}
            onBook={(h) => onBook(h, activeService)}
          />
        </div>
      </div>
    </div>
  )
}
