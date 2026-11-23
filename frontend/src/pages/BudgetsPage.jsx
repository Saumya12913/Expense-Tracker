import React, { useState } from 'react';
import { Target, Plus, AlertCircle, Trash2, Edit2, ShieldAlert, Award, Coins } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency } from '../utils/currency';
import BudgetModal from '../components/BudgetModal';

const BudgetsPage = () => {
  const { budgetsData, deleteBudget, currency, fireConfetti } = useExpense();
  const { t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const budgets = budgetsData.budgets || [];
  const totalBudgeted = budgetsData.totalBudgeted || 0;
  const totalSpent = budgetsData.totalSpent || 0;
  const overallPercentage = budgetsData.overallPercentage || 0;

  const exceededCount = budgets.filter((b) => b.percentage >= 100).length;
  const warningCount = budgets.filter((b) => b.percentage >= 80 && b.percentage < 100).length;

  const handleOpenAdd = () => {
    setEditingBudget(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (b) => {
    setEditingBudget(b);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('deleteBudgetConfirm'))) {
      await deleteBudget(id);
    }
  };

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
            style={{ opacity: 0.3 }}
          >
            <source src="/videos/budget-coins.webm" type="video/webm" />
            <source src="/videos/hero-fintech.webm" type="video/webm" />
          </video>
          <div className="cinematic-dark-overlay" />
        </div>

        <div className="cinematic-content dashboard-header" style={{ marginBottom: 0 }}>
          <div>
            <div className="floating-rupee-pill" style={{ marginBottom: '0.5rem' }}>
              <Coins size={13} className="coin-icon-spinning text-warning" />
              <span>Capital Preservation &amp; Limits</span>
            </div>
            <h1 className="title-hero">
              {t('budgetsTitle')}
            </h1>
            <p className="subtitle">
              {t('budgetsSubtitle')}
            </p>
          </div>
          <button onClick={handleOpenAdd} className="btn btn-primary">
            <Plus size={16} />
            <span>{t('setCategoryBudget')}</span>
          </button>
        </div>
      </div>

      {/* Overview Card */}
      <div className="card card-glow" style={{ marginBottom: '2rem' }}>
        <div className="budget-overview-header">
          <div>
            <span className="overview-title">{t('monthlyBudgetAlloc')}</span>
            <div className="overview-amount-row">
              <span className="overview-main-val">{formatCurrency(totalSpent, currency)}</span>
              <span className="overview-sub-val">{t('ofBudgeted')} {formatCurrency(totalBudgeted, currency)}</span>
            </div>
          </div>
          <div className="budget-status-pills">
            {exceededCount > 0 && (
              <span className="status-pill status-pill-danger">
                <ShieldAlert size={14} /> {exceededCount} {t('overLimit')}
              </span>
            )}
            {warningCount > 0 && (
              <span className="status-pill status-pill-warning">
                <AlertCircle size={14} /> {warningCount} {t('nearingCap')}
              </span>
            )}
            {exceededCount === 0 && (
              <button onClick={fireConfetti} className="status-pill status-pill-success" style={{ cursor: 'pointer', border: 'none' }}>
                <Award size={14} /> {t('allBudgetsOnTrack')}
              </button>
            )}
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="progress-track" style={{ height: '10px', marginTop: '1.25rem' }}>
          <div
            className="progress-fill"
            style={{
              width: `${Math.min(100, overallPercentage)}%`,
              backgroundColor: overallPercentage > 100 ? '#f43f5e' : overallPercentage > 80 ? '#f59e0b' : '#10b981',
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
          <span>{t('overallMonthlyConsumption')}: {overallPercentage}%</span>
          <span>{totalBudgeted > totalSpent ? `${formatCurrency(totalBudgeted - totalSpent, currency)} ${t('cushionRemaining')}` : t('ceilingBreached')}</span>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div className="budgets-cards-grid">
        {budgets.map((b) => {
          const isExceeded = b.percentage >= 100;
          const isWarning = b.percentage >= 80 && !isExceeded;

          return (
            <div key={b._id} className="card budget-card">
              <div className="budget-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div className="cat-bullet" style={{ backgroundColor: b.color || '#6366f1' }} />
                  <span className="budget-cat-title">{b.category}</span>
                </div>
                <div className="budget-card-actions">
                  <button onClick={() => handleOpenEdit(b)} className="btn-icon-budget" title="Adjust limit">
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => handleDelete(b._id)} className="btn-icon-budget btn-icon-delete" title="Delete target">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div className="budget-values-row">
                <div className="val-block">
                  <span className="val-lbl">{t('spent')}</span>
                  <span className="val-num" style={{ color: isExceeded ? '#fb7185' : 'white' }}>
                    {formatCurrency(b.spent, currency)}
                  </span>
                </div>
                <div className="val-block" style={{ textAlign: 'right' }}>
                  <span className="val-lbl">{t('monthlyCap')}</span>
                  <span className="val-num">{formatCurrency(b.limit, currency)}</span>
                </div>
              </div>

              {/* Progress */}
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min(100, b.percentage)}%`,
                    backgroundColor: isExceeded ? '#f43f5e' : isWarning ? '#f59e0b' : b.color || '#6366f1',
                  }}
                />
              </div>

              <div className="budget-card-footer">
                <span className="pct-tag" style={{ color: isExceeded ? '#fb7185' : isWarning ? '#fbbf24' : '#34d399' }}>
                  {b.percentage}% {t('used')}
                </span>
                <span className="rem-tag">
                  {isExceeded
                    ? `${t('overBy')} ${formatCurrency(b.spent - b.limit, currency)}`
                    : `${formatCurrency(b.remaining, currency)} ${t('left')}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {budgets.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <Target size={40} style={{ color: 'var(--text-dim)', marginBottom: '1rem' }} />
          <h3>{t('noBudgetsConfigured')}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0.5rem auto 1.5rem' }}>
            {t('noBudgetsDesc')}
          </p>
          <button onClick={handleOpenAdd} className="btn btn-primary">
            <Plus size={16} /> {t('createFirstBudget')}
          </button>
        </div>
      )}

      {/* Modal */}
      <BudgetModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        existingBudget={editingBudget}
      />

      <style>{`
        .budget-overview-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .overview-title {
          font-size: 0.8rem;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--text-dim);
          letter-spacing: 0.05em;
        }
        .overview-amount-row {
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
          margin-top: 0.35rem;
        }
        .overview-main-val {
          font-size: 2rem;
          font-weight: 800;
          font-family: var(--font-mono);
          color: white;
        }
        .overview-sub-val {
          font-size: 0.95rem;
          color: var(--text-muted);
        }
        .budget-status-pills {
          display: flex;
          gap: 0.65rem;
          flex-wrap: wrap;
        }
        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.78rem;
          font-weight: 700;
          padding: 0.35rem 0.75rem;
          border-radius: 999px;
        }
        .status-pill-danger {
          background: rgba(244, 63, 94, 0.15);
          color: #fb7185;
          border: 1px solid rgba(244, 63, 94, 0.3);
        }
        .status-pill-warning {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }
        .status-pill-success {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .progress-track {
          height: 8px;
          background: #0d131f;
          border-radius: 999px;
          overflow: hidden;
          margin: 0.75rem 0;
        }
        .progress-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.35s ease-out;
        }

        .budgets-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
          gap: 1.25rem;
        }
        .budget-card {
          padding: 1.35rem;
        }
        .budget-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .cat-bullet {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .budget-cat-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .budget-card-actions {
          display: flex;
          gap: 0.35rem;
        }
        .btn-icon-budget {
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-dim);
          padding: 0.3rem;
          border-radius: 4px;
          cursor: pointer;
        }
        .btn-icon-budget:hover {
          background: var(--bg-subtle);
          color: white;
        }
        .budget-values-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.35rem;
        }
        .val-block {
          display: flex;
          flex-direction: column;
        }
        .val-lbl {
          font-size: 0.72rem;
          color: var(--text-dim);
          text-transform: uppercase;
        }
        .val-num {
          font-family: var(--font-mono);
          font-size: 1.15rem;
          font-weight: 700;
          margin-top: 0.15rem;
        }
        .budget-card-footer {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--text-dim);
          margin-top: 0.35rem;
        }
        .pct-tag {
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};

export default BudgetsPage;
