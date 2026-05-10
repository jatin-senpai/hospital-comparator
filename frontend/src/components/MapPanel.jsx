import { useEffect, useRef, useState } from 'react'
import styles from './MapPanel.module.css'

export default function MapPanel({ hospitals, serviceId, selected, hoveredId, city, onSelect, onBook }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef({})
  const [mapReady, setMapReady] = useState(false)

  // Use city coordinates if available, otherwise default to Jaipur
  const CENTER = city ? [city.latitude, city.longitude] : [26.9124, 75.7873]

  useEffect(() => {
    if (mapInstanceRef.current) return

    // Load Leaflet
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => {
      const L = window.L

      const map = L.map(mapRef.current, {
        center: CENTER,
        zoom: 13,
        zoomControl: false,
      })

      // Light tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO',
        maxZoom: 19,
      }).addTo(map)

      L.control.zoom({ position: 'bottomright' }).addTo(map)

      mapInstanceRef.current = map
      setMapReady(true)
    }
    document.head.appendChild(script)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return
    const L = window.L
    const map = mapInstanceRef.current

    // Clear old markers
    Object.values(markersRef.current).forEach(m => m.remove())
    markersRef.current = {}

    hospitals.forEach(h => {
      // Use coordinates from the database model
      const coords = [h.latitude, h.longitude]
      if (!coords[0] || !coords[1]) return

      const price = h.services[serviceId]?.price
      const isSelected = selected?.id === h.id
      const isHovered = hoveredId === h.id

      const icon = L.divIcon({
        className: '',
        html: `
          <div style="
            background: ${isSelected ? '#10b981' : isHovered ? '#38bdf8' : '#0ea5e9'};
            color: #ffffff;
            border: 1.5px solid ${isSelected ? '#047857' : isHovered ? '#0284c7' : '#0284c7'};
            border-radius: 8px;
            padding: 5px 10px;
            font-family: 'Inter', sans-serif;
            font-size: 12px;
            font-weight: 600;
            white-space: nowrap;
            box-shadow: 0 4px 16px rgba(0,0,0,0.15);
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 5px;
          ">
            <span style="font-size:10px;">₹</span>${price?.toLocaleString() || '?'}
          </div>
          <div style="
            width: 8px; height: 8px;
            background: ${isSelected ? '#10b981' : isHovered ? '#38bdf8' : '#0ea5e9'};
            border: 1.5px solid ${isSelected ? '#047857' : '#0284c7'};
            border-radius: 50%;
            margin: 3px auto 0;
          "></div>
        `,
        iconSize: [80, 40],
        iconAnchor: [40, 40],
      })

      const marker = L.marker(coords, { icon })
        .addTo(map)
        .on('click', () => onSelect(h))

      markersRef.current[h.id] = marker
    })

    // User location marker based on city center
    const userIcon = L.divIcon({
      className: '',
      html: `
        <div style="position:relative; width:20px; height:20px;">
          <div style="
            width:20px; height:20px; border-radius:50%;
            background: rgba(14, 165, 233, 0.2);
            border: 2px solid #0ea5e9;
            animation: pulse-accent 2s infinite;
          "></div>
          <div style="
            position:absolute; inset:4px;
            border-radius:50%;
            background:#0ea5e9;
          "></div>
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    })
    L.marker(CENTER, { icon: userIcon }).addTo(map)

    // Center map if city changed
    map.setView(CENTER, 13)

  }, [mapReady, hospitals, serviceId, selected, hoveredId, city])

  // Pan to selected
  useEffect(() => {
    if (!mapReady || !selected || !mapInstanceRef.current) return
    const coords = [selected.latitude, selected.longitude]
    if (coords[0] && coords[1]) {
      mapInstanceRef.current.flyTo(coords, 14, { duration: 0.8 })
    }
  }, [selected, mapReady])

  return (
    <div className={styles.wrap}>
      <div ref={mapRef} className={styles.map} />

      {/* Selected hospital overlay */}
      {selected && (
        <div className={styles.overlay}>
          <div className={styles.overlayName}>{selected.name}</div>
          <div className={styles.overlaySub}>{selected.distance} km away · {selected.rating} ★</div>
          <div className={styles.overlayPrice}>
            ₹{selected.services[serviceId]?.price?.toLocaleString()} for {serviceId}
          </div>
          <button className={styles.overlayBtn} onClick={() => onBook(selected)}>
            Book appointment →
          </button>
        </div>
      )}

      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ background: '#C8F04D' }} />
          <span>Selected</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ background: '#2DD4A0' }} />
          <span>Hovered</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ background: '#C8F04D', width: '8px', height: '8px', borderRadius: '50%', border: '2px solid #C8F04D' }} />
          <span>You</span>
        </div>
      </div>
    </div>
  )
}
