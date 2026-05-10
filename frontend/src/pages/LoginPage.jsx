import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import styles from './LoginPage.module.css';

export default function LoginPage({ onBack, onSuccess }) {
  const { login } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('+91');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await api.sendOTP(phone);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const data = await api.verifyOTP(phone, otp);
      login(data.token, data.user);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>
          {step === 1 ? 'Sign in with your phone number' : `Enter OTP sent to ${phone}`}
        </p>

        {error && <div className={styles.error}>{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleSendOTP}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone Number</label>
              <input
                type="tel"
                className={styles.input}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                required
              />
            </div>
            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? 'Sending OTP...' : 'Get OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <div className={styles.formGroup}>
              <label className={styles.label}>6-Digit OTP</label>
              <input
                type="text"
                className={styles.input}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                maxLength={6}
                required
              />
              <p className={styles.hint}>For demo purposes, the OTP is 123456</p>
            </div>
            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Sign In'}
            </button>
            <button 
              type="button" 
              className={styles.backBtn} 
              onClick={() => { setStep(1); setOtp(''); }}
              style={{ marginTop: '1rem', width: '100%' }}
            >
              Change Phone Number
            </button>
          </form>
        )}

        {step === 1 && (
          <button className={styles.backBtn} onClick={onBack}>
            ← Back to Search
          </button>
        )}
      </div>
    </div>
  );
}
