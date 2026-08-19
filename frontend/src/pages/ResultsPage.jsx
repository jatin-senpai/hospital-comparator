import { useState, useEffect } from 'react'
import { SERVICES, CITIES } from '../services/mockData'
import { api } from '../services/api'
import HospitalCard from '../components/HospitalCard'
import MapPanel from '../components/MapPanel'
import styles from './ResultsPage.module.css'

export default function ResultsPage({ query, serviceId, city, onBook, onBack, onSelectHospital }) {
  const [hospitals, setHospitals] = useState([])
  const [selected, setSelected] = useState(null)
  const [sortBy, setSortBy] = useState('distance')
  const [activeService, setActiveService] = useState(serviceId || 'blood')
  const [loaded, setLoaded] = useState(false)
  const [hoveredId, setHoveredId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mobileView, setMobileView] = useState('list') // 'list' | 'map'
  
  const cityData = city || CITIES[0]

  useEffect(() => {
    const fetchHospitals = async () => {
      setLoading(true)
      try {
        const data = await api.searchHospitals(activeService, cityData.latitude, cityData.longitude)
        const formatted = data.results.map(r => ({
          ...r.hospital,
          distance: r.distance_km,
          reviews: r.hospital.review_count || 0,
          hours: r.hospital.open_hours || 'N/A',
          openNow: true,
          services: {
            [activeService]: {
              price: r.service_price ? r.service_price.price : 0,
              duration: r.service_price ? r.service_price.duration_minutes : 15,
              available: r.service_price ? r.service_price.available : false,
              report: r.service_price ? r.service_price.report_time : '2 hrs'
            }
          }
        }))
        setHospitals(formatted)
        
        // Reset selected when results change
        setSelected(null)
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
      {/* Top search & status header bar */}
      <div className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <button className={styles.backBtn} onClick={onBack} aria-label="Go back to search">
            <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
              <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Back
          </button>
          
          <div className={styles.divider} />
          
          <div className={styles.queryInfo}>
            <span className={styles.queryText}>{service?.label || query}</span>
            <span className={styles.queryCount}>({hospitals.length} providers found)</span>
          </div>
        </div>

        <div className={styles.topRight}>
          <div className={styles.locBadge}>
            <span className={styles.locIcon}>📍</span>
            {cityData.name}
          </div>
        </div>
      </div>

      {/* Dynamic service category horizontal filter strip */}
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
        {/* Left Column — Listings */}
        <div className={`${styles.listCol} ${mobileView === 'map' ? styles.hiddenOnMobile : ''}`}>
          {/* Pricing notification and sort criteria dropdown */}
          <div className={styles.listHeader}>
            {hospitals.length > 0 && cheapest !== Infinity ? (
              <div className={styles.priceAlert}>
                <span className={styles.priceAlertIcon}>◆</span>
                Lowest rate: <strong>₹{cheapest}</strong> for {service?.label}
              </div>
            ) : (
              <div className={styles.priceAlert}>No rates available</div>
            )}
            
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

          {/* Cards list */}
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner} />
              <p>Scanning local centers...</p>
            </div>
          ) : sorted.length === 0 ? (
            <div className={styles.emptyContainer}>
              <h3>No diagnostic centers found</h3>
              <p>Try exploring another test procedure or changing your selected city location.</p>
            </div>
          ) : (
            <div className={styles.cards}>
              {sorted.map((hospital, i) => (
                <div
                  key={hospital.id}
                  style={{ animationDelay: `${i * 0.05}s` }}
                  className={`${styles.cardWrap} ${loaded ? styles.cardVisible : ''}`}
                >
                  <HospitalCard
                    hospital={hospital}
                    serviceId={activeService}
                    cheapest={cheapest}
                    isSelected={selected?.id === hospital.id}
                    isHovered={hoveredId === hospital.id}
                    onClick={() => {
                      setSelected(hospital);
                      onSelectHospital?.(hospital.id);
                    }}
                    onHover={setHoveredId}
                    onBook={() => onBook(hospital, activeService)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column — Map view */}
        <div className={`${styles.mapCol} ${mobileView === 'list' ? styles.hiddenOnMobile : ''}`}>
          <MapPanel
            hospitals={sorted}
            serviceId={activeService}
            selected={selected}
            hoveredId={hoveredId}
            city={cityData}
            onSelect={(h) => {
              setSelected(h);
              onSelectHospital?.(h.id);
            }}
            onBook={(h) => onBook(h, activeService)}
          />
        </div>
      </div>

      {/* Floating Action Button for mobile map/list view toggle */}
      <button 
        className={styles.mobileFloatingToggle}
        onClick={() => setMobileView(mobileView === 'list' ? 'map' : 'list')}
      >
        {mobileView === 'list' ? (
          <>
            <span className={styles.toggleIcon}>🗺</span> Show Map
          </>
        ) : (
          <>
            <span className={styles.toggleIcon}>📋</span> Show List
          </>
        )}
      </button>
    </div>
  )
}

