import React from 'react';
import { 
  HeartPulse, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Info, 
  TrendingUp, 
  Compass, 
  Coins
} from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency } from '../utils/currency';

const AnalyticsPage = () => {
  const { analytics, currency } = useExpense();
  const { t } = useLanguage();

  const health = analytics?.financialHealth || {
    score: 82,
    rating: 'Good',
    color: '#10b981',
    breakdown: { savingsScore: 32, budgetScore: 25, runwayScore: 25 },
  };

  const budget503020 = analytics?.budget503020 || {
    needs: { amount: 52000, percentage: 48, targetPercentage: 50 },
    wants: { amount: 22000, percentage: 22, targetPercentage: 30 },
    savings: { amount: 31000, percentage: 30, targetPercentage: 20 },
  };

  const insights = analytics?.insights || [];
  const monthlyTrends = analytics?.monthlyTrends || [];

  return (
    <div className="page-wrapper">
      {/* Header Banner with Real Video Backdrop */}
      <div className="hero-video-banner card-glow" style={{ padding: '1.75rem 2rem', marginBottom: '1.5rem' }}>
        <div className="cinematic-video-wrapper">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="cinematic-video-bg"
            style={{ opacity: 0.32 }}
          >
            <source src="/videos/analytics-growth.webm" type="video/webm" />
            <source src="/videos/hero-fintech.webm" type="video/webm" />
          </video>
          <div className="cinematic-dark-overlay" />
        </div>

        <div className="cinematic-content dashboard-header" style={{ marginBottom: 0 }}>
          <div>
            <div className="floating-rupee-pill" style={{ marginBottom: '0.5rem' }}>
              <Coins size={13} className="coin-icon-spinning text-warning" />
              <span>Predictive Financial AI &amp; Trajectory</span>
            </div>
            <h1 className="title-hero">
              {t('analyticsTitle')}
            </h1>
            <p className="subtitle">
              {t('analyticsSubtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Top Split: Health Score + 50/30/20 Rule */}
      <div className="grid-2">
        {/* Financial Health Score */}
        <div className="card card-glow">
          <div className="card-top-title">
            <HeartPulse size={20} className="text-primary-accent" />
            <h3>{t('healthIndex')}</h3>
          </div>

          <div className="health-score-container">
            <div className="score-radial-box">
              <span className="score-number" style={{ color: health.color }}>
                {health.score}
              </span>
              <span className="score-max">/100</span>
              <span className="score-badge" style={{ backgroundColor: `${health.color}20`, color: health.color }}>
                {health.rating}
              </span>
            </div>

            <div className="score-breakdown-list">
              <div className="score-sub-item">
                <div className="sub-item-header">
                  <span>{t('savingsVelocity')}</span>
                  <span className="font-mono">{health.breakdown?.savingsScore || 32}/40 pts</span>
                </div>
                <div className="mini-progress-track">
                  <div className="mini-progress-fill" style={{ width: `${((health.breakdown?.savingsScore || 32) / 40) * 100}%`, backgroundColor: '#10b981' }} />
                </div>
              </div>

              <div className="score-sub-item">
                <div className="sub-item-header">
                  <span>{t('budgetCompliance')}</span>
                  <span className="font-mono">{health.breakdown?.budgetScore || 25}/30 pts</span>
                </div>
                <div className="mini-progress-track">
                  <div className="mini-progress-fill" style={{ width: `${((health.breakdown?.budgetScore || 25) / 30) * 100}%`, backgroundColor: '#6366f1' }} />
                </div>
              </div>

              <div className="score-sub-item">
                <div className="sub-item-header">
                  <span>{t('runwayCushion')}</span>
                  <span className="font-mono">{health.breakdown?.runwayScore || 25}/30 pts</span>
                </div>
                <div className="mini-progress-track">
                  <div className="mini-progress-fill" style={{ width: `${((health.breakdown?.runwayScore || 25) / 30) * 100}%`, backgroundColor: '#06b6d4' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 50 / 30 / 20 Framework */}
        <div className="card">
          <div className="card-top-title">
            <Compass size={20} className="text-cyan" />
            <div>
              <h3>{t('wealthFramework')}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                {t('wealthFrameworkDesc')}
              </p>
            </div>
          </div>

          <div className="framework-stack">
            {/* Needs */}
            <div className="framework-item">
              <div className="framework-meta">
                <span className="fw-label">{t('essentialNeeds')}</span>
                <span className="fw-values">
                  <strong>{budget503020.needs.percentage}%</strong> ({t('targetBenchmark')}: ≤50%)
                </span>
              </div>
              <div className="framework-bar-track">
                <div
                  className="framework-bar-fill"
                  style={{
                    width: `${Math.min(100, budget503020.needs.percentage)}%`,
                    backgroundColor: budget503020.needs.percentage > 55 ? '#f43f5e' : '#3b82f6',
                  }}
                />
              </div>
              <span className="fw-amount">{formatCurrency(budget503020.needs.amount, currency)}</span>
            </div>

            {/* Wants */}
            <div className="framework-item">
              <div className="framework-meta">
                <span className="fw-label">{t('lifestyleWants')}</span>
                <span className="fw-values">
                  <strong>{budget503020.wants.percentage}%</strong> ({t('targetBenchmark')}: ≤30%)
                </span>
              </div>
              <div className="framework-bar-track">
                <div
                  className="framework-bar-fill"
                  style={{
                    width: `${Math.min(100, budget503020.wants.percentage)}%`,
                    backgroundColor: budget503020.wants.percentage > 35 ? '#f59e0b' : '#ec4899',
                  }}
                />
              </div>
              <span className="fw-amount">{formatCurrency(budget503020.wants.amount, currency)}</span>
            </div>

            {/* Savings */}
            <div className="framework-item">
              <div className="framework-meta">
                <span className="fw-label">{t('growthSavings')}</span>
                <span className="fw-values">
                  <strong>{budget503020.savings.percentage}%</strong> ({t('targetBenchmark')}: ≥20%)
                </span>
              </div>
              <div className="framework-bar-track">
                <div
                  className="framework-bar-fill"
                  style={{
                    width: `${Math.min(100, budget503020.savings.percentage)}%`,
                    backgroundColor: budget503020.savings.percentage >= 20 ? '#10b981' : '#f59e0b',
                  }}
                />
              </div>
              <span className="fw-amount">{formatCurrency(budget503020.savings.amount, currency)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Anomaly & Recommendation Cards */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-top-title" style={{ marginBottom: '1.25rem' }}>
          <Sparkles size={20} className="text-primary-accent" />
          <h3>{t('algorithmicInsights')}</h3>
        </div>

        <div className="insights-grid">
          {insights.map((item, idx) => (
            <div key={idx} className={`insight-card insight-${item.type}`}>
              <div className="insight-icon-box">
                {item.type === 'positive' && <ShieldCheck size={20} className="text-emerald" />}
                {item.type === 'warning' && <AlertTriangle size={20} className="text-warning" />}
                {item.type === 'danger' && <AlertTriangle size={20} className="text-rose" />}
                {item.type === 'info' && <Info size={20} className="text-indigo" />}
              </div>
              <div className="insight-content">
                <div className="insight-title">{item.title}</div>
                <div className="insight-message">{item.message}</div>
              </div>
            </div>
          ))}

          {insights.length === 0 && (
            <div style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>
              Add more transaction logs to populate deep algorithmic financial insights.
            </div>
          )}
        </div>
      </div>

      {/* Historical Monthly Ledger Breakdown */}
      <div className="card">
        <div className="card-top-title" style={{ marginBottom: '1rem' }}>
          <TrendingUp size={20} className="text-emerald" />
          <h3>{t('monthlyTrajectory')}</h3>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>{t('billingCycle')}</th>
                <th>{t('inflow')}</th>
                <th>{t('outflow')}</th>
                <th>{t('net')}</th>
                <th>{t('savingsMargin')}</th>
              </tr>
            </thead>
            <tbody>
              {monthlyTrends.map((m, idx) => {
                const margin = m.income > 0 ? ((m.netSavings / m.income) * 100).toFixed(1) : 0;
                return (
                  <tr key={idx}>
                    <td style={{ fontWeight: 700 }}>{m.label}</td>
                    <td className="font-mono text-emerald">+{formatCurrency(m.income, currency)}</td>
                    <td className="font-mono text-rose">-{formatCurrency(m.expense, currency)}</td>
                    <td className="font-mono" style={{ color: m.netSavings >= 0 ? '#818cf8' : '#fb7185', fontWeight: 700 }}>
                      {formatCurrency(m.netSavings, currency)}
                    </td>
                    <td>
                      <span className={`badge ${margin >= 20 ? 'badge-income' : margin > 0 ? 'badge-neutral' : 'badge-expense'}`}>
                        {margin}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .card-top-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .card-top-title h3 {
          font-size: 1.1rem;
          font-weight: 700;
        }
        .health-score-container {
          display: flex;
          align-items: center;
          gap: 2rem;
          padding: 1rem 0;
        }
        @media (max-width: 600px) {
          .health-score-container {
            flex-direction: column;
            text-align: center;
          }
        }
        .score-radial-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          border: 3px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.25);
          position: relative;
          flex-shrink: 0;
        }
        .score-number {
          font-size: 2.75rem;
          font-weight: 800;
          font-family: var(--font-mono);
          line-height: 1;
        }
        .score-max {
          font-size: 0.75rem;
          color: var(--text-dim);
          font-weight: 600;
        }
        .score-badge {
          margin-top: 0.35rem;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.15rem 0.6rem;
          border-radius: 999px;
        }
        .score-breakdown-list {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          width: 100%;
        }
        .score-sub-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .sub-item-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .mini-progress-track {
          height: 6px;
          background: #1e293b;
          border-radius: 999px;
          overflow: hidden;
        }
        .mini-progress-fill {
          height: 100%;
          border-radius: 999px;
        }

        .framework-stack {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
        }
        .framework-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .framework-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.825rem;
        }
        .fw-label {
          color: var(--text-muted);
          font-weight: 500;
        }
        .fw-values {
          font-size: 0.8rem;
          color: var(--text-main);
        }
        .framework-bar-track {
          height: 8px;
          background: #0d131f;
          border-radius: 999px;
          overflow: hidden;
        }
        .framework-bar-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.3s ease;
        }
        .fw-amount {
          font-size: 0.72rem;
          color: var(--text-dim);
          font-family: var(--font-mono);
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
        }
        .insight-card {
          padding: 1.15rem;
          border-radius: var(--radius-md);
          display: flex;
          gap: 0.85rem;
          border: 1px solid var(--border-color);
          background: rgba(255, 255, 255, 0.02);
        }
        .insight-positive {
          border-left: 3px solid #10b981;
        }
        .insight-warning {
          border-left: 3px solid #f59e0b;
        }
        .insight-danger {
          border-left: 3px solid #f43f5e;
        }
        .insight-info {
          border-left: 3px solid #6366f1;
        }
        .insight-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.2rem;
        }
        .insight-message {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.45;
        }
      `}</style>
    </div>
  );
};

export default AnalyticsPage;
