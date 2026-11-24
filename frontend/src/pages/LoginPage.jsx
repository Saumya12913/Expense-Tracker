import React, { useState } from 'react';
import { 
  TrendingUp, 
  Lock, 
  Mail, 
  Sparkles, 
  AlertCircle, 
  ShieldCheck,
  Award,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Coins
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage, LanguageSelector } from '../context/LanguageContext';

const LoginPage = ({ onSwitchToRegister, onSwitchToIntro }) => {
  const { login, demoLogin, loading } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (!res.success) {
      setError(res.message || 'Login failed. Please check credentials.');
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    const res = await demoLogin();
    if (!res.success) {
      setError(res.message || 'Demo login failed');
    }
  };

  return (
    <div className="login-page-wrapper">
      {/* Background Real HD Video */}
      <div className="cinematic-video-wrapper">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="cinematic-video-bg"
        >
          <source src="./videos/login-coins.webm" type="video/webm" />
          <source src="./videos/hero-fintech.webm" type="video/webm" />
        </video>
        <div className="cinematic-dark-overlay" />
      </div>

      {/* Content */}
      <div className="cinematic-content login-inner">
        {/* Top Controls */}
        <div className="login-top-bar">
          <button
            type="button"
            onClick={onSwitchToIntro}
            className="btn-back-intro"
          >
            <ArrowLeft size={16} />
            <span>{t('backToIntro')}</span>
          </button>

          <div className="login-top-right">
            <LanguageSelector />
          </div>
        </div>

        {/* Card */}
        <div className="login-card card card-glow">
          {/* Brand */}
          <div className="login-brand">
            <div className="login-brand-icon">
              <TrendingUp size={28} className="text-primary-accent" />
            </div>
            <h1 className="title-hero" style={{ fontSize: '1.65rem' }}>
              {t('welcomeBack')}
            </h1>
            <p className="login-subtitle">
              {t('signInPrompt')}
            </p>
            <div className="floating-rupee-pill" style={{ marginTop: '0.65rem' }}>
              <Coins size={13} className="coin-icon-spinning text-warning" />
              <span>{t('taskBadge')}</span>
            </div>
          </div>

          {error && (
            <div className="error-alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* 1-Click Demo Reviewer Button */}
          <div className="demo-highlight-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Sparkles size={16} className="text-primary-accent" />
              <strong style={{ fontSize: '0.85rem' }}>{t('demoEvaluatorPrompt')}</strong>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              {t('demoEvaluatorDesc')}
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem' }}
            >
              <ShieldCheck size={16} />
              <span>{loading ? t('authenticating') : t('oneClickDemo')}</span>
            </button>
          </div>

          <div className="auth-divider">
            <span>{t('orSignInWithEmail')}</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">{t('emailAddress')}</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  className="form-control login-input"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('password')}</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control login-input"
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-secondary btn-login-submit"
            >
              <span>{loading ? t('authenticating') : t('signIn')}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="login-footer">
            <span>{t('dontHaveAccount')}</span>{' '}
            <button onClick={onSwitchToRegister} className="auth-link">
              {t('signUpNow')}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .login-page-wrapper {
          min-height: 100vh;
          position: relative;
          background: #080c16;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
          overflow-x: hidden;
        }
        .login-inner {
          width: 100%;
          max-width: 480px;
        }
        .login-top-bar {
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
        .login-card {
          background: rgba(17, 24, 39, 0.88);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: var(--radius-xl);
          padding: 2.25rem 2.25rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(99, 102, 241, 0.15);
        }
        @media (max-width: 500px) {
          .login-card {
            padding: 1.75rem 1.25rem;
          }
        }
        .login-brand {
          text-align: center;
          margin-bottom: 1.75rem;
        }
        .login-brand-icon {
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
        .login-subtitle {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-top: 0.35rem;
          line-height: 1.45;
        }
        .demo-highlight-box {
          background: linear-gradient(180deg, rgba(99, 102, 241, 0.12), rgba(15, 23, 42, 0.5));
          border: 1px solid rgba(99, 102, 241, 0.35);
          border-radius: var(--radius-md);
          padding: 1rem;
          margin-bottom: 1.25rem;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.1);
        }
        .auth-divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 1.25rem 0;
          color: var(--text-dim);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid var(--border-color);
        }
        .auth-divider::before { margin-right: 0.75rem; }
        .auth-divider::after { margin-left: 0.75rem; }
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
        .login-input {
          padding-left: 2.5rem;
          padding-right: 2.5rem;
          background: rgba(13, 19, 31, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        .login-input:focus {
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
        .btn-login-submit {
          width: 100%;
          margin-top: 0.75rem;
          padding: 0.85rem;
          font-size: 0.95rem;
        }
        .login-footer {
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
        .error-alert {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(244, 63, 94, 0.15);
          border: 1px solid rgba(244, 63, 94, 0.3);
          color: #fda4af;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          margin-bottom: 1.25rem;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
