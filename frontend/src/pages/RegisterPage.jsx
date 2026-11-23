import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Lock, 
  Mail, 
  User, 
  Globe, 
  AlertCircle, 
  Award,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Coins
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage, LanguageSelector } from '../context/LanguageContext';
import { CURRENCIES } from '../utils/currency';

const AVATAR_COLORS = [
  { id: 'indigo', bg: 'linear-gradient(135deg, #6366f1, #818cf8)', ring: '#6366f1' },
  { id: 'emerald', bg: 'linear-gradient(135deg, #10b981, #34d399)', ring: '#10b981' },
  { id: 'amber', bg: 'linear-gradient(135deg, #f59e0b, #fbbf24)', ring: '#f59e0b' },
  { id: 'rose', bg: 'linear-gradient(135deg, #f43f5e, #fb7185)', ring: '#f43f5e' },
  { id: 'cyan', bg: 'linear-gradient(135deg, #06b6d4, #22d3ee)', ring: '#06b6d4' },
  { id: 'purple', bg: 'linear-gradient(135deg, #a855f7, #c084fc)', ring: '#a855f7' },
];

const RegisterPage = ({ onSwitchToLogin, onSwitchToIntro }) => {
  const { register, loading } = useAuth();
  const { t } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [preferredCurrency, setPreferredCurrency] = useState('INR');
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0].id);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Password Strength Algorithm
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: '', bars: 0, colorClass: '' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score, label: 'Weak', bars: 1, colorClass: 'weak' };
    if (score === 2) return { score, label: 'Fair', bars: 2, colorClass: 'fair' };
    if (score <= 4) return { score, label: 'Good', bars: 3, colorClass: 'good' };
    return { score, label: 'Strong', bars: 4, colorClass: 'strong' };
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError(t('passwordLengthError'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('passwordMatchError'));
      return;
    }

    if (!agreeTerms) {
      setError(t('agreeTermsError'));
      return;
    }

    const res = await register(name, email, password, preferredCurrency);
    if (!res.success) {
      setError(res.message || 'Registration failed');
    }
  };

  return (
    <div className="register-page-wrapper">
      {/* Background Real HD Video */}
      <div className="cinematic-video-wrapper">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="cinematic-video-bg"
        >
          <source src="/videos/register-coins.webm" type="video/webm" />
          <source src="/videos/hero-fintech.webm" type="video/webm" />
        </video>
        <div className="cinematic-dark-overlay" />
      </div>

      {/* Content */}
      <div className="cinematic-content register-inner">
        {/* Top Floating Header */}
        <div className="register-top-bar">
          <button
            type="button"
            onClick={onSwitchToIntro}
            className="btn-back-intro"
          >
            <ArrowLeft size={16} />
            <span>{t('backToIntro')}</span>
          </button>

          <div className="register-top-right">
            <LanguageSelector />
          </div>
        </div>

        {/* Registration Card */}
        <div className="register-card card card-glow">
          {/* Brand Header */}
          <div className="register-brand">
            <div className="register-brand-icon">
              <TrendingUp size={28} className="text-primary-accent" />
            </div>
            <h1 className="title-hero" style={{ fontSize: '1.65rem' }}>
              {t('createAccount')}
            </h1>
            <p className="register-subtitle">
              {t('registerPrompt')}
            </p>
            <div className="floating-rupee-pill" style={{ marginTop: '0.65rem' }}>
              <Coins size={13} className="coin-icon-spinning text-warning" />
              <span>Auspify Task 3 &bull; MERN Security</span>
            </div>
          </div>

          {error && (
            <div className="error-alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">{t('fullName')}</label>
              <div className="input-with-icon">
                <User size={16} className="input-icon" />
                <input
                  type="text"
                  className="form-control register-input"
                  placeholder="e.g. Alex Mercer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label className="form-label">{t('emailAddress')}</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  className="form-control register-input"
                  placeholder="alex@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">{t('password')}</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control register-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn-toggle-pw"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {password && (
                <div className="strength-meter-container">
                  <div className="strength-meter-bars">
                    {[1, 2, 3, 4].map((barIndex) => (
                      <div
                        key={barIndex}
                        className={`strength-bar ${
                          barIndex <= passwordStrength.bars ? passwordStrength.colorClass : ''
                        }`}
                      />
                    ))}
                  </div>
                  <div className="strength-label-text">
                    <span>Password Security: <strong style={{ textTransform: 'capitalize' }}>{passwordStrength.label}</strong></span>
                    <span>Min 6+ characters</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">{t('confirmPassword')}</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control register-input"
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {confirmPassword && password === confirmPassword && (
                  <CheckCircle2 size={16} className="pw-match-icon text-emerald" />
                )}
              </div>
            </div>

            {/* Preferred Currency & Profile Accent Color Row */}
            <div className="register-row-2">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{t('preferredCurrency')}</label>
                <div className="input-with-icon">
                  <Globe size={16} className="input-icon" />
                  <select
                    className="form-control register-input"
                    value={preferredCurrency}
                    onChange={(e) => setPreferredCurrency(e.target.value)}
                  >
                    {Object.keys(CURRENCIES).map((code) => (
                      <option key={code} value={code}>
                        {code} ({CURRENCIES[code].symbol}) &bull; {CURRENCIES[code].name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{t('chooseAvatar')}</label>
                <div className="color-picker-row">
                  {AVATAR_COLORS.map((col) => (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => setSelectedColor(col.id)}
                      className={`color-dot-btn ${selectedColor === col.id ? 'active' : ''}`}
                      style={{ background: col.bg }}
                      title={`Accent: ${col.id}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Terms Checkbox */}
            <label className="terms-checkbox-label">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="terms-checkbox"
              />
              <span className="terms-text">{t('termsAgreement')}</span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-register-submit"
            >
              <Sparkles size={16} />
              <span>{loading ? t('creatingAccount') : t('createAccount')}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Switch to Login Footer */}
          <div className="register-footer">
            <span>{t('alreadyHaveAccount')}</span>{' '}
            <button onClick={onSwitchToLogin} className="auth-link">
              {t('signInHere')}
            </button>
          </div>

          {/* Security Assurance Badge */}
          <div className="register-security-badge">
            <ShieldCheck size={14} className="text-emerald" />
            <span>256-Bit Bank Grade Encryption &bull; Zero-Knowledge Ledger Architecture</span>
          </div>
        </div>
      </div>

      <style>{`
        .register-page-wrapper {
          min-height: 100vh;
          position: relative;
          background: #080c16;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
          overflow-x: hidden;
        }
        .register-inner {
          width: 100%;
          max-width: 520px;
        }
        .register-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        .btn-back-intro {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(8px);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          color: var(--text-muted);
          padding: 0.4rem 0.85rem;
          font-size: 0.825rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-back-intro:hover {
          color: white;
          border-color: rgba(99, 102, 241, 0.4);
          background: rgba(30, 41, 59, 0.8);
        }
        .register-card {
          background: rgba(17, 24, 39, 0.88);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: var(--radius-xl);
          padding: 2.25rem 2.5rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(99, 102, 241, 0.15);
        }
        @media (max-width: 540px) {
          .register-card {
            padding: 1.75rem 1.25rem;
          }
        }
        .register-brand {
          text-align: center;
          margin-bottom: 1.75rem;
        }
        .register-brand-icon {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(236, 72, 153, 0.25));
          border: 1px solid rgba(99, 102, 241, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.75rem;
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
        }
        .register-subtitle {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-top: 0.35rem;
          line-height: 1.45;
        }
        .register-form {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
        }
        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 0.95rem;
          color: var(--text-dim);
          pointer-events: none;
        }
        .register-input {
          padding-left: 2.5rem;
          padding-right: 2.5rem;
          background: rgba(13, 19, 31, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        .register-input:focus {
          border-color: #818cf8;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
          background: rgba(13, 19, 31, 0.95);
        }
        .btn-toggle-pw {
          position: absolute;
          right: 0.85rem;
          background: transparent;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        .btn-toggle-pw:hover {
          color: var(--text-main);
        }
        .pw-match-icon {
          position: absolute;
          right: 0.85rem;
        }
        .register-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          align-items: flex-end;
        }
        @media (max-width: 500px) {
          .register-row-2 {
            grid-template-columns: 1fr;
          }
        }
        .color-picker-row {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          height: 42px;
          padding: 0 0.25rem;
        }
        .color-dot-btn {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
        }
        .color-dot-btn:hover {
          transform: scale(1.15);
        }
        .color-dot-btn.active {
          border-color: white;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
          transform: scale(1.15);
        }
        .terms-checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          cursor: pointer;
          user-select: none;
          margin-top: 0.25rem;
        }
        .terms-checkbox {
          accent-color: #6366f1;
          width: 16px;
          height: 16px;
        }
        .btn-register-submit {
          width: 100%;
          padding: 0.85rem;
          font-size: 0.95rem;
          margin-top: 0.5rem;
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
        }
        .register-footer {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .auth-link {
          background: transparent;
          border: none;
          color: #818cf8;
          font-weight: 700;
          cursor: pointer;
          font-size: inherit;
        }
        .auth-link:hover {
          text-decoration: underline;
        }
        .register-security-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 0.7rem;
          color: var(--text-dim);
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
