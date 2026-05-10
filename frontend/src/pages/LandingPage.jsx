import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import styles from './LandingPage.module.css';

export default function LandingPage({ onSuccess }) {
  const { login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI State
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login Flow
        const data = await api.login({ email, password });
        login(data.token, data.user);
        onSuccess();
      } else {
        // Signup Flow
        const data = await api.signup({ name, email, password });
        login(data.token, data.user);
        onSuccess();
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.blob} />
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            The smartest way to find <span className={styles.highlight}>Diagnostic Tests</span>.
          </h1>
          <p className={styles.subtitle}>
            Search across top-rated hospitals near you. Compare prices instantly. Book your appointment securely in under 60 seconds.
          </p>
          
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🔍</div>
              <span>Find exactly what you need with our medical search engine.</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>💸</div>
              <span>Compare prices across verified NABH & NABL hospitals.</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>⚡</div>
              <span>Book real-time slots instantly without waiting on hold.</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.authSide}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <h2 className={styles.authTitle}>
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className={styles.authSubtitle}>
              {isLogin 
                ? 'Enter your details to access your account.' 
                : 'Join MediQ to start booking your health appointments.'}
            </p>
          </div>

          <div className={styles.tabContainer}>
            <button 
              className={`${styles.tab} ${isLogin ? styles.activeTab : ''}`}
              onClick={() => { setIsLogin(true); setError(''); }}
            >
              Sign In
            </button>
            <button 
              className={`${styles.tab} ${!isLogin ? styles.activeTab : ''}`}
              onClick={() => { setIsLogin(false); setError(''); }}
            >
              Sign Up
            </button>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name</label>
                <input
                  type="text"
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button type="submit" className={styles.btn} disabled={loading}>
              {loading 
                ? 'Please wait...' 
                : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
