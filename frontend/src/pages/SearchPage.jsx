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
      const q = query.toLowerCase().replace(/[^a-z0-9]/g, '')
      const matches = SERVICES.filter(s =>
        s.label.toLowerCase().replace(/[^a-z0-9]/g, '').includes(q) || 
        s.category.toLowerCase().replace(/[^a-z0-9]/g, '').includes(q)
      )
      setSuggestions(matches.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }, [query])

  const handleSearch = (q = query) => {
    if (!q.trim()) return
    const normQ = q.toLowerCase().replace(/[^a-z0-9]/g, '')
    const matched = SERVICES.find(s => 
      s.label.toLowerCase().replace(/[^a-z0-9]/g, '').includes(normQ) ||
      (s.id && s.id.toLowerCase().replace(/[^a-z0-9]/g, '').includes(normQ))
    )
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

      <div className={styles.hero}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          India's smartest hospital finder
        </div>

        <h1 className={styles.headline}>
          Find the right <em>diagnostic test</em> near you.
        </h1>

        <p className={styles.sub}>
          Compare prices, ratings &amp; book appointments at top hospitals — all in one place.
        </p>
      </div>

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
            <button className={styles.clearBtn} onMouseDown={(e) => { e.preventDefault(); setQuery(''); }}>✕</button>
          )}
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && focused && (
          <div className={styles.suggestions}>
            {suggestions.map(s => (
              <button
                key={s.id}
                className={styles.suggestion}
                onMouseDown={(e) => { e.preventDefault(); setQuery(s.label); handleSearch(s.label); }}
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
    </div>
  )
}
