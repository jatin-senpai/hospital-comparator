import { useState, useRef, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { QUICK_SEARCHES, SERVICES, CITIES } from '../services/mockData'
import styles from './SearchPage.module.css'

export default function SearchPage({ onSearch, onLogin, onHistory }) {
  const { user, logout } = useContext(AuthContext)
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [selectedCity, setSelectedCity] = useState(CITIES[0]) // Default to first city
  const inputRef = useRef(null)

  useEffect(() => {
    if (query.length > 1) {
      const q = query.toLowerCase()
      const matches = SERVICES.filter(s =>
        s.label.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
      )
      setSuggestions(matches.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }, [query])

  const handleSearch = (q = query) => {
    if (!q.trim()) return
    const matched = SERVICES.find(s => s.label.toLowerCase().includes(q.toLowerCase()))
    onSearch(q, matched?.id || 'blood', selectedCity)
  }

  return (
    <div className={styles.page}>
      {/* Auth Topbar */}
      <div className={styles.topbar}>
        {user ? (
          <div className={styles.authInfo}>
            <span className={styles.userName}>Hi, {user.name}</span>
            <button className={styles.authBtn} onClick={onHistory}>History</button>
            <button className={styles.authBtnOut} onClick={logout}>Logout</button>
          </div>
        ) : (
          <button className={styles.authBtn} onClick={onLogin}>Log In</button>
        )}
      </div>

      {/* Diagonal accent strip */}
      <div className={styles.strip} />

      {/* Left column */}
      <div className={styles.left}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          India's smartest hospital finder
        </div>

        <h1 className={styles.headline}>
          Find the right<br />
          <em>diagnostic test</em><br />
          near you.
        </h1>

        <p className={styles.sub}>
          Compare prices, ratings &amp; book appointments at top hospitals — all in one place.
        </p>

        <div className={styles.stats}>
          {[['4,200+', 'Hospitals'], ['18', 'Services'], ['₹99', 'Lowest price'], ['2 min', 'Avg booking']].map(([n, l]) => (
            <div key={l} className={styles.stat}>
              <span className={styles.statNum}>{n}</span>
              <span className={styles.statLabel}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right column — search card */}
      <div className={styles.right}>
        <div className={styles.card}>
          <div className={styles.cardLabel}>
            <span className={styles.cardLabelIcon}>◈</span>
            Search any test
          </div>

          {/* City Selector */}
          <div className={styles.citySelector}>
            <label className={styles.cityLabel}>Select City:</label>
            <select 
              className={styles.citySelect}
              value={selectedCity.id}
              onChange={(e) => {
                const city = CITIES.find(c => c.id === e.target.value)
                setSelectedCity(city)
              }}
            >
              {CITIES.map(city => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
          </div>

          <div className={`${styles.searchWrap} ${focused ? styles.focused : ''}`}>
            <svg className={styles.searchIcon} viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              ref={inputRef}
              className={styles.searchInput}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="X-ray, MRI, Blood test..."
            />
            {query && (
              <button className={styles.clearBtn} onClick={() => setQuery('')}>✕</button>
            )}
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && focused && (
            <div className={styles.suggestions}>
              {suggestions.map(s => (
                <button
                  key={s.id}
                  className={styles.suggestion}
                  onClick={() => { setQuery(s.label); handleSearch(s.label) }}
                >
                  <span className={styles.suggIcon}>{s.icon}</span>
                  <span>{s.label}</span>
                  <span className={styles.suggCat}>{s.category}</span>
                </button>
              ))}
            </div>
          )}

          <button className={styles.searchBtn} onClick={() => handleSearch()}>
            <span>Find hospitals near me</span>
            <span className={styles.searchBtnArrow}>→</span>
          </button>

          <div className={styles.quickLabel}>Quick searches</div>
          <div className={styles.pills}>
            {QUICK_SEARCHES.map(q => (
              <button
                key={q}
                className={styles.pill}
                onClick={() => { setQuery(q); handleSearch(q) }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Floating accent cards */}
        <div className={styles.floatCard1}>
          <span className={styles.floatIcon}>◆</span>
          <div>
            <div className={styles.floatTitle}>₹180</div>
            <div className={styles.floatSub}>Blood Test • 0.8 km</div>
          </div>
        </div>
        <div className={styles.floatCard2}>
          <span className={styles.floatIcon2}>◉</span>
          <div>
            <div className={styles.floatTitle2}>4.9 ★</div>
            <div className={styles.floatSub2}>Apollo • NABL</div>
          </div>
        </div>
      </div>
    </div>
  )
}
