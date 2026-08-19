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
        setMapReady(false)
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
      const coords = [h.latitude, h.longitude]
      if (!coords[0] || !coords[1]) return

      const svc = h.services ? h.services[serviceId] : null;
      const price = svc ? svc.price : null;
      const report = svc ? svc.report : '24 hrs';
      const isSelected = selected?.id === h.id
      const isHovered = hoveredId === h.id

      // Pricing tag markers
      const bg = isSelected ? '#059669' : isHovered ? '#2563eb' : '#ffffff';
      const color = isSelected || isHovered ? '#ffffff' : '#0f172a';
      const border = isSelected ? '#047857' : isHovered ? '#1d4ed8' : '#cbd5e1';
      const scale = isSelected || isHovered ? 'scale(1.08)' : 'scale(1)';
      const zIndex = isSelected ? 1000 : isHovered ? 900 : 100;

      const icon = L.divIcon({
        className: '',
        html: `
          <div style="
            transform: ${scale};
            z-index: ${zIndex};
            background: ${bg};
            color: ${color};
            border: 1.5px solid ${border};
            border-radius: 20px;
            padding: 4px 10px;
            font-family: 'Inter', sans-serif;
            font-size: 12px;
            font-weight: 700;
            white-space: nowrap;
            box-shadow: 0 4px 12px rgba(15,23,42,0.08);
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            display: flex;
            align-items: center;
            gap: 2px;
          ">
            <span style="font-size:10px; font-weight: 500;">₹</span>${price?.toLocaleString() || '?'}
          </div>
        `,
        iconSize: [60, 26],
        iconAnchor: [30, 13],
      })

      // Popup content card
      const popupHtml = `
        <div style="
          padding: 4px;
          font-family: 'Inter', sans-serif;
          min-width: 150px;
          display: flex;
          flex-direction: column;
          gap: 3px;
        ">
          <strong style="font-size: 12px; color: var(--chalk);">${h.name}</strong>
          <span style="font-size: 13px; font-weight: 700; color: var(--accent);">₹${price?.toLocaleString() || '?'}</span>
          <span style="font-size: 11px; color: var(--chalk-2);">📍 ${h.distance} km away</span>
          <span style="font-size: 11px; color: var(--chalk-2);">⏰ ${report} report</span>
          <button 
            id="popup-btn-${h.id}"
            style="
              margin-top: 6px;
              background: var(--primary);
              color: white;
              border: none;
              border-radius: 4px;
              padding: 4px 8px;
              font-size: 10px;
              font-weight: 600;
              cursor: pointer;
              width: 100%;
              text-align: center;
            "
          >
            Select provider
          </button>
        </div>
      `;

      const marker = L.marker(coords, { icon })
        .addTo(map)
        .bindPopup(popupHtml, { closeButton: false, offset: [0, -10] })
        .on('click', () => onSelect(h))

      markersRef.current[h.id] = marker

      // Auto open popup if hovered/selected from left list
      if (isHovered || isSelected) {
        setTimeout(() => {
          if (marker && map.hasLayer(marker)) {
            marker.openPopup();
          }
        }, 50);
      }
    })

    // User location marker
    const userIcon = L.divIcon({
      className: '',
      html: `
        <div style="position:relative; width:16px; height:16px;">
          <div style="
            width:16px; height:16px; border-radius:50%;
            background: rgba(37, 99, 235, 0.15);
            border: 1.5px solid #2563eb;
          "></div>
          <div style="
            position:absolute; inset:4px;
            border-radius:50%;
            background:#2563eb;
          "></div>
        </div>
      `,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    })
    L.marker(CENTER, { icon: userIcon }).addTo(map)

    map.setView(CENTER, 13)

  }, [mapReady, hospitals, serviceId, selected, hoveredId, city])

  // Click event delegation to handle popup button selections
  useEffect(() => {
    const handlePopupClick = (e) => {
      const btn = e.target.closest('[id^="popup-btn-"]');
      if (btn) {
        const id = parseInt(btn.id.replace('popup-btn-', ''));
        const hospital = hospitals.find(x => x.id === id);
        if (hospital) {
          onSelect(hospital);
        }
      }
    };

    const container = mapRef.current;
    if (container) {
      container.addEventListener('click', handlePopupClick);
    }
    return () => {
      if (container) {
        container.removeEventListener('click', handlePopupClick);
      }
    };
  }, [hospitals, mapReady])

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

      {/* Selected hospital overlay card */}
      {selected && (
        <div className={styles.overlay}>
          <div className={styles.overlayText}>
            <div className={styles.overlayName}>{selected.name}</div>
            <div className={styles.overlaySub}>{selected.distance} km away · ★ {selected.rating}</div>
          </div>
          <div className={styles.overlayAction}>
            <div className={styles.overlayPrice}>
              ₹{selected.services ? selected.services[serviceId]?.price?.toLocaleString() : ''}
            </div>
            <button className={styles.overlayBtn} onClick={() => onBook(selected)}>
              Book slot
            </button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ background: '#059669', border: '1px solid #047857' }} />
          <span>Selected</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ background: '#2563eb', border: '1px solid #1d4ed8' }} />
          <span>Hovered</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ background: '#ffffff', border: '1px solid #cbd5e1' }} />
          <span>Other</span>
        </div>
      </div>
    </div>
  )
}
