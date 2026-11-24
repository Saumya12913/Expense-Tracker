import React from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Award, 
  HeartPulse, 
  Compass, 
  Zap, 
  Target, 
  Globe, 
  FileSpreadsheet, 
  CheckCircle2, 
  Play,
  Lock,
  Coins
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage, LanguageSelector } from '../context/LanguageContext';

const IntroPage = ({ onNavigateToLogin, onNavigateToRegister }) => {
  const { demoLogin, loading } = useAuth();
  const { t } = useLanguage();

  const handleDemoReview = async () => {
    await demoLogin();
  };

  return (
    <div className="intro-container">
      {/* Fixed Background Video */}
      <div className="cinematic-video-wrapper">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="cinematic-video-bg"
          poster=""
        >
          <source src="./videos/hero-fintech.webm" type="video/webm" />
          <source src="./videos/login-coins.webm" type="video/webm" />
        </video>
        <div className="cinematic-dark-overlay" />
      </div>

      {/* Main Content */}
      <div className="cinematic-content intro-inner">
        {/* Top Navbar */}
        <header className="intro-navbar">
          <div className="intro-brand">
            <div className="intro-logo-icon">
              <TrendingUp size={22} className="text-primary-accent" />
            </div>
            <div>
              <span className="intro-logo-text">
                Finance<span className="text-gradient">Flow</span>
              </span>
              <div className="intro-badge-sub">
                <Award size={11} className="text-warning" />
                <span>{t('taskBadge')}</span>
              </div>
            </div>
          </div>

          <div className="intro-nav-actions">
            <LanguageSelector />

            <button
              type="button"
              onClick={onNavigateToLogin}
              className="btn btn-outline btn-sm hide-on-mobile"
            >
              {t('signIn')}
            </button>

            <button
              type="button"
              onClick={onNavigateToRegister}
              className="btn btn-primary btn-sm"
            >
              <span>{t('getStarted')}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="intro-hero">
          <div className="floating-rupee-pill" style={{ marginBottom: '1.25rem' }}>
            <span className="coin-icon-spinning">₹</span>
            <Sparkles size={13} className="text-warning" />
            <span>{t('introHeroTag')}</span>
          </div>

          <h1 className="intro-hero-title">
            {t('introHeroTitle1')}{' '}
            <span className="text-gradient">{t('introHeroTitle2')}</span>
          </h1>

          <p className="intro-hero-desc">
            {t('introHeroDesc')}
          </p>

          <div className="intro-hero-cta-group">
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="btn btn-primary btn-hero-main"
            >
              <span>{t('getStarted')}</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={onNavigateToLogin}
              className="btn btn-secondary btn-hero-secondary"
            >
              <span>{t('signIn')}</span>
            </button>

            <button
              type="button"
              onClick={handleDemoReview}
              disabled={loading}
              className="btn btn-demo-quick"
            >
              <ShieldCheck size={17} className="text-emerald" />
              <span>{loading ? t('authenticating') : t('exploreDemo')}</span>
            </button>
          </div>
        </section>

        {/* Live Platform Telemetry Bar */}
        <section className="telemetry-bar-card card">
          <div className="telemetry-header">
            <div className="telemetry-pulse-dot" />
            <span className="telemetry-title">{t('liveOverview')}</span>
            <span className="telemetry-live-tag">LIVE MERN STACK</span>
          </div>

          <div className="telemetry-metrics-grid">
            <div className="telemetry-metric-item">
              <div className="metric-icon-box text-emerald">
                <HeartPulse size={22} />
              </div>
              <div className="metric-info">
                <span className="metric-label">{t('healthScoreLabel')}</span>
                <span className="metric-val text-emerald">88 / 100</span>
                <span className="metric-sub">Optimal Liquidity Runway</span>
              </div>
            </div>

            <div className="telemetry-metric-item">
              <div className="metric-icon-box text-indigo">
                <TrendingUp size={22} />
              </div>
              <div className="metric-info">
                <span className="metric-label">{t('netSurplusLabel')}</span>
                <span className="metric-val text-indigo">+₹1,42,850</span>
                <span className="metric-sub">+34.2% Savings Velocity</span>
              </div>
            </div>

            <div className="telemetry-metric-item">
              <div className="metric-icon-box text-cyan">
                <Compass size={22} />
              </div>
              <div className="metric-info">
                <span className="metric-label">{t('savingsMarginLabel')}</span>
                <span className="metric-val text-cyan">32.5%</span>
                <span className="metric-sub">50/30/20 Rule Compliant</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Matrix Grid */}
        <section className="intro-features-section">
          <div className="section-title-wrap">
            <h2 className="title-hero" style={{ fontSize: '1.65rem', textAlign: 'center' }}>
              Engineered for <span className="text-gradient">Financial Autonomy</span>
            </h2>
            <p className="subtitle" style={{ textAlign: 'center', maxWidth: '600px', margin: '0.4rem auto 2.5rem' }}>
              Everything developers and financial planners need to eliminate capital leakage and scale wealth.
            </p>
          </div>

          <div className="features-grid">
            <div className="card feature-card">
              <div className="feature-icon-circle icon-heart">
                <HeartPulse size={22} />
              </div>
              <h3 className="feature-title">{t('feature1Title')}</h3>
              <p className="feature-desc">{t('feature1Desc')}</p>
            </div>

            <div className="card feature-card">
              <div className="feature-icon-circle icon-compass">
                <Compass size={22} />
              </div>
              <h3 className="feature-title">{t('feature2Title')}</h3>
              <p className="feature-desc">{t('feature2Desc')}</p>
            </div>

            <div className="card feature-card">
              <div className="feature-icon-circle icon-zap">
                <Zap size={22} />
              </div>
              <h3 className="feature-title">{t('feature3Title')}</h3>
              <p className="feature-desc">{t('feature3Desc')}</p>
            </div>

            <div className="card feature-card">
              <div className="feature-icon-circle icon-target">
                <Target size={22} />
              </div>
              <h3 className="feature-title">{t('feature4Title')}</h3>
              <p className="feature-desc">{t('feature4Desc')}</p>
            </div>

            <div className="card feature-card">
              <div className="feature-icon-circle icon-globe">
                <Globe size={22} />
              </div>
              <h3 className="feature-title">{t('feature5Title')}</h3>
              <p className="feature-desc">{t('feature5Desc')}</p>
            </div>

            <div className="card feature-card">
              <div className="feature-icon-circle icon-sheet">
                <FileSpreadsheet size={22} />
              </div>
              <h3 className="feature-title">{t('feature6Title')}</h3>
              <p className="feature-desc">{t('feature6Desc')}</p>
            </div>
          </div>
        </section>

        {/* Video Showcase Card */}
        <section className="cinematic-showcase-card card card-glow">
          <div className="showcase-content">
            <div className="floating-rupee-pill">
              <Coins size={14} className="text-warning coin-icon-spinning" />
              <span>Real-Time Moving Visual Experience</span>
            </div>
            <h2 className="title-hero" style={{ fontSize: '1.75rem', marginTop: '0.85rem' }}>
              Real HD Video Motion &amp; Live Financial Telemetry
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', margin: '0.75rem 0 1.5rem', lineHeight: '1.6' }}>
              Continuous moving money particles, 3D rotating golden rupee coins, glowing budget meters, and automated multi-currency recalculations built for modern fintech excellence.
            </p>
            <div className="showcase-badges-row">
              <div className="showcase-pill"><CheckCircle2 size={15} className="text-emerald" /> 8 Global Languages Supported</div>
              <div className="showcase-pill"><CheckCircle2 size={15} className="text-emerald" /> 7 Live Currency Conversions</div>
              <div className="showcase-pill"><CheckCircle2 size={15} className="text-emerald" /> 1-Click Recruiter Evaluation</div>
            </div>
          </div>

          <div className="showcase-video-box">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="showcase-video-element"
            >
              <source src="./videos/coins-stream.webm" type="video/webm" />
              <source src="./videos/hero-fintech.webm" type="video/webm" />
            </video>
            <div className="showcase-video-badge">
              <span className="coin-icon-spinning">₹</span> 3D Continuous Coin Motion
            </div>
          </div>
        </section>

        {/* Bottom CTA Card */}
        <section className="intro-bottom-cta card">
          <div className="bottom-cta-inner">
            <h2 className="title-hero" style={{ fontSize: '1.85rem' }}>
              Start Mastering Your Capital Today
            </h2>
            <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem', maxWidth: '540px' }}>
              Join forward-thinking developers and professionals with algorithmic cashflow intelligence.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={onNavigateToRegister}
                className="btn btn-primary"
                style={{ padding: '0.85rem 1.75rem', fontSize: '0.95rem' }}
              >
                <span>{t('getStarted')}</span>
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={handleDemoReview}
                disabled={loading}
                className="btn btn-secondary"
                style={{ padding: '0.85rem 1.5rem', fontSize: '0.95rem' }}
              >
                <ShieldCheck size={16} className="text-primary-accent" />
                <span>{t('oneClickDemo')}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="intro-footer">
          <div className="footer-left">
            <span>FinanceFlow &bull; Auspify Internship Task 3 (Medium)</span>
            <span className="footer-dim">Full Stack MERN Architecture &bull; 2026</span>
          </div>
          <div className="footer-right">
            <span className="tech-badge">React 18</span>
            <span className="tech-badge">Node.js</span>
            <span className="tech-badge">Express</span>
            <span className="tech-badge">Vite</span>
            <span className="tech-badge">WebM HD</span>
          </div>
        </footer>
      </div>

      <style>{`
        .intro-container {
          position: relative;
          min-height: 100vh;
          background: #070a12;
          overflow-x: hidden;
        }
        .intro-inner {
          max-width: 1240px;
          margin: 0 auto;
          padding: 1.5rem 2rem 3rem;
        }
        .intro-navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 0 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 3.5rem;
        }
        .intro-brand {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .intro-logo-icon {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(236, 72, 153, 0.3));
          border: 1px solid rgba(99, 102, 241, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 16px rgba(99, 102, 241, 0.3);
        }
        .intro-logo-text {
          font-size: 1.35rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .intro-badge-sub {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.7rem;
          color: var(--text-dim);
          font-weight: 600;
        }
        .intro-nav-actions {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        @media (max-width: 640px) {
          .hide-on-mobile {
            display: none;
          }
        }

        .intro-hero {
          text-align: center;
          max-width: 860px;
          margin: 0 auto 3.5rem;
          padding: 1rem 0;
        }
        .intro-hero-title {
          font-size: 3.4rem;
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.03em;
          margin-bottom: 1.5rem;
        }
        @media (max-width: 768px) {
          .intro-hero-title {
            font-size: 2.35rem;
          }
        }
        .intro-hero-desc {
          font-size: 1.15rem;
          color: var(--text-muted);
          line-height: 1.65;
          margin-bottom: 2.25rem;
          max-width: 740px;
          margin-left: auto;
          margin-right: auto;
        }
        .intro-hero-cta-group {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .btn-hero-main {
          padding: 0.95rem 1.85rem;
          font-size: 1rem;
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.45);
        }
        .btn-hero-secondary {
          padding: 0.95rem 1.5rem;
          font-size: 1rem;
        }
        .btn-demo-quick {
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: #6ee7b7;
          padding: 0.95rem 1.4rem;
          font-size: 0.95rem;
          border-radius: var(--radius-md);
          cursor: pointer;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }
        .btn-demo-quick:hover {
          background: rgba(16, 185, 129, 0.22);
          border-color: rgba(16, 185, 129, 0.6);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.25);
        }

        .telemetry-bar-card {
          padding: 1.5rem 2rem;
          margin-bottom: 4rem;
          background: linear-gradient(180deg, rgba(17, 24, 39, 0.85), rgba(15, 23, 42, 0.95));
          border: 1px solid rgba(99, 102, 241, 0.25);
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.6);
        }
        .telemetry-header {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          margin-bottom: 1.25rem;
          padding-bottom: 0.85rem;
          border-bottom: 1px solid var(--border-color);
        }
        .telemetry-pulse-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 10px #10b981;
          animation: neonEmeraldPulse 2s infinite;
        }
        .telemetry-title {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-dim);
        }
        .telemetry-live-tag {
          font-size: 0.68rem;
          font-weight: 800;
          color: #a5b4fc;
          background: rgba(99, 102, 241, 0.2);
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
        }
        .telemetry-metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 768px) {
          .telemetry-metrics-grid {
            grid-template-columns: 1fr;
          }
        }
        .telemetry-metric-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
        }
        .metric-icon-box {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .metric-info {
          display: flex;
          flex-direction: column;
        }
        .metric-label {
          font-size: 0.75rem;
          color: var(--text-dim);
          font-weight: 600;
          text-transform: uppercase;
        }
        .metric-val {
          font-size: 1.45rem;
          font-weight: 800;
          font-family: var(--font-mono);
          line-height: 1.2;
          margin: 0.15rem 0;
        }
        .metric-sub {
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .text-emerald { color: #34d399; }
        .text-indigo { color: #818cf8; }
        .text-cyan { color: #22d3ee; }

        .intro-features-section {
          margin-bottom: 4rem;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 900px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
        }
        .feature-card {
          padding: 1.75rem;
          transition: all 0.25s ease;
        }
        .feature-card:hover {
          transform: translateY(-4px);
          border-color: rgba(99, 102, 241, 0.4);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(99, 102, 241, 0.15);
        }
        .feature-icon-circle {
          width: 46px;
          height: 46px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.15rem;
        }
        .icon-heart { background: rgba(16, 185, 129, 0.15); color: #34d399; }
        .icon-compass { background: rgba(6, 182, 212, 0.15); color: #22d3ee; }
        .icon-zap { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
        .icon-target { background: rgba(244, 63, 94, 0.15); color: #fb7185; }
        .icon-globe { background: rgba(99, 102, 241, 0.15); color: #818cf8; }
        .icon-sheet { background: rgba(168, 85, 247, 0.15); color: #c084fc; }

        .feature-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.5rem;
        }
        .feature-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.55;
        }

        .cinematic-showcase-card {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 2rem;
          align-items: center;
          padding: 2.5rem;
          margin-bottom: 4rem;
        }
        @media (max-width: 860px) {
          .cinematic-showcase-card {
            grid-template-columns: 1fr;
          }
        }
        .showcase-badges-row {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .showcase-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
        }
        .showcase-video-box {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid rgba(99, 102, 241, 0.35);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6);
          aspect-ratio: 16 / 9;
        }
        .showcase-video-element {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .showcase-video-badge {
          position: absolute;
          bottom: 0.75rem;
          right: 0.75rem;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(245, 158, 11, 0.4);
          color: #fbbf24;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.3rem 0.65rem;
          border-radius: 999px;
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .intro-bottom-cta {
          padding: 3.5rem 2rem;
          text-align: center;
          margin-bottom: 3.5rem;
          background: radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15), rgba(15, 23, 42, 0.9));
        }
        .bottom-cta-inner {
          max-width: 600px;
          margin: 0 auto;
        }

        .intro-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 2rem;
          border-top: 1px solid var(--border-color);
          font-size: 0.8rem;
          color: var(--text-muted);
          flex-wrap: wrap;
          gap: 1rem;
        }
        .footer-left {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .footer-dim {
          color: var(--text-dim);
          font-size: 0.72rem;
        }
        .footer-right {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .tech-badge {
          font-size: 0.7rem;
          padding: 0.2rem 0.5rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          color: var(--text-dim);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default IntroPage;
