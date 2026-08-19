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
      <div className={styles.container}>
        {/* Header bar */}
        <div className={styles.header}>
          <div className={styles.headerTitleCol}>
            <h1 className={styles.title}>Your Appointments</h1>
            <p className={styles.subtitle}>Track diagnostic procedures and download reports.</p>
          </div>
          <button className={styles.backBtn} onClick={onBack} aria-label="Go back to home page">
            ← Back to home
          </button>
        </div>

        {/* Content wrapper */}
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <p>Retrieving your appointment records...</p>
          </div>
        ) : error ? (
          <div className={styles.errorState}>
            <p>{error}</p>
            <button className={styles.retryBtn} onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : bookings.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📅</div>
            <h3>No appointments booked yet</h3>
            <p>You haven't scheduled any diagnostic tests with us yet. Compare rates and schedule a test from the home screen.</p>
            <button className={styles.searchBtn} onClick={onBack}>Find a test</button>
          </div>
        ) : (
          <div className={styles.list}>
            {bookings.map((b) => {
              const isConfirmed = b.status === 'confirmed' || b.status === 'completed';
              const isPending = b.status === 'pending' || b.status === 'pending_payment';
              
              const statusClass = isConfirmed 
                ? styles.statusConfirmed 
                : isPending 
                  ? styles.statusPending 
                  : styles.statusCancelled;

              return (
                <div key={b.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.bookingRefRow}>
                      <span className={styles.refIcon}>◈</span>
                      <span className={styles.ref}>{b.booking_ref}</span>
                    </div>
                    <span className={`${styles.statusBadge} ${statusClass}`}>
                      {b.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.infoCol}>
                      <div className={styles.testName}>{b.service_id.toUpperCase()} TEST</div>
                      <div className={styles.patient}>Patient: <strong>{b.patient_name}</strong> ({b.patient_age} yrs, {b.patient_gender})</div>
                      {b.notes && <div className={styles.notes}>📝 Note: "{b.notes}"</div>}
                    </div>

                    <div className={styles.priceCol}>
                      <div className={styles.amount}>₹{b.amount.toLocaleString()}</div>
                      <div className={styles.payMethod}>via {b.payment_method?.toUpperCase() || 'UPI'}</div>
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <span className={styles.dateLabel}>Booked on {new Date(b.created_at || Date.now()).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    
                    {isConfirmed ? (
                      <button 
                        className={styles.downloadBtn}
                        onClick={() => api.downloadReport(b.booking_ref)}
                      >
                        ⬇ Download Report PDF
                      </button>
                    ) : (
                      <span className={styles.pendingActionLabel}>Pending hospital verification</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

