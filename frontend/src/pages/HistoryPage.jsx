import { useState, useEffect } from 'react';
import { api } from '../services/api';
import styles from './HistoryPage.module.css';

export default function HistoryPage({ onBack }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await api.getBookingHistory();
        setBookings(data.bookings || []);
      } catch (err) {
        setError(err.message || 'Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Your Bookings</h1>
        <button className={styles.backBtn} onClick={onBack}>Back to Search</button>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading history...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : bookings.length === 0 ? (
        <div className={styles.empty}>You have no past bookings.</div>
      ) : (
        <div className={styles.list}>
          {bookings.map((b) => (
            <div key={b.id} className={styles.card}>
              <div className={styles.info}>
                <span className={styles.ref}>{b.booking_ref}</span>
                <span className={styles.service}>{b.service_id.toUpperCase()}</span>
                <span className={styles.patient}>Patient: {b.patient_name} ({b.patient_age})</span>
              </div>
              <div className={styles.meta}>
                <span className={styles.amount}>₹{b.amount.toLocaleString()}</span>
                <span className={styles.status}>{b.status.replace('_', ' ')}</span>
                {b.status === 'confirmed' && (
                  <button 
                    className={styles.downloadBtn}
                    onClick={() => api.downloadReport(b.booking_ref)}
                  >
                    Download Report
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
