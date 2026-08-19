import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import styles from './AuthModal.module.css';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const { login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI State
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Clear state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setName('');
      setEmail('');
      setPassword('');
      setError('');
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login Flow
        const data = await api.login({ email, password });
        login(data.token, data.user);
        onSuccess?.();
        onClose();
      } else {
        // Signup Flow
        const data = await api.signup({ name, email, password });
        login(data.token, data.user);
        onSuccess?.();
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">✕</button>
        
        <div className={styles.header}>
          <h2 className={styles.title}>
            {isLogin ? 'Sign In to MediQ' : 'Create an Account'}
          </h2>
          <p className={styles.subtitle}>
            {isLogin 
              ? 'Enter your details to manage bookings and view reports.' 
              : 'Join MediQ to start booking your diagnostic tests instantly.'}
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

        <form onSubmit={handleSubmit} className={styles.form}>
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

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading 
              ? 'Processing...' 
              : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>
      </div>
    </div>
  );
}
