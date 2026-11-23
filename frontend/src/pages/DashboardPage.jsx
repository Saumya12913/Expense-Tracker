import React from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  HeartPulse,
  Target,
  Clock,
  ChevronRight,
  Sparkles,
  Coins,
  ShieldCheck
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { MonthlyCashFlowChart, CategoryDoughnutChart } from '../components/AnalyticsCharts';
import { useExpense } from '../context/ExpenseContext';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency } from '../utils/currency';

const DashboardPage = ({ onOpenAddModal, setActiveTab, onEditTransaction }) => {
  const { summary, transactions, budgetsData, analytics, currency } = useExpense();
  const { t } = useLanguage();

  const recentTransactions = transactions.slice(0, 5);
  const health = analytics?.financialHealth || { score: 85, rating: 'Good', color: '#10b981' };

  return (
    <div className="page-wrapper">
      {/* Cinematic Hero Video Banner with Real Moving Video */}
      <div className="hero-video-banner card-glow">
        <div className="cinematic-video-wrapper">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="cinematic-video-bg"
          >
            <source src="/videos/hero-fintech.webm" type="video/webm" />
            <source src="/videos/coins-stream.webm" type="video/webm" />
          </video>
          <div className="cinematic-dark-overlay" />
        </div>

        <div className="cinematic-content dashboard-hero-content">
          <div>
            <div className="floating-rupee-pill" style={{ marginBottom: '0.75rem' }}>
              <span className="coin-icon-spinning">₹</span>
              <Coins size={13} className="text-warning" />
              <span>Real HD Video Telemetry Active</span>
            </div>
            <h1 className="title-hero" style={{ fontSize: '2.1rem' }}>
              Financial <span className="text-gradient">{t('commandCenter')}</span>
            </h1>
            <p className="subtitle" style={{ maxWidth: '640px' }}>
              {t('commandCenterDesc')}
            </p>
          </div>

          <div className="dashboard-hero-cta">
            <button onClick={onOpenAddModal} className="btn btn-primary" style={{ padding: '0.85rem 1.4rem' }}>
              <Sparkles size={16} />
              <span>{t('recordTransaction')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards with Animated Glow & Counters */}
      <div className="grid-4">
        <StatCard
          title={t('netCashBalance')}
          amount={summary.netSavings}
          icon={Wallet}
          type="savings"
          subtitle={`${t('savingsRate')}: ${summary.savingsRate || 0}% ${t('ofEarnings')}`}
        />
        <StatCard
          title={t('totalInflows')}
          amount={summary.totalIncome}
          icon={ArrowUpRight}
          type="income"
          subtitle={`${transactions.filter((t) => t.type === 'income').length} ${t('incomeDeposits')}`}
        />
        <StatCard
          title={t('totalOutflows')}
          amount={summary.totalExpense}
          icon={ArrowDownRight}
          type="expense"
          subtitle={`${transactions.filter((t) => t.type === 'expense').length} ${t('expenseDeductions')}`}
        />
        <StatCard
          title={t('healthScore')}
          amount={`${health.score}/100`}
          isRawValue={true}
          icon={HeartPulse}
          type="warning"
          subtitle={`Status: ${health.rating}`}
        />
      </div>

      {/* Visual Analytics Grid: Trends & Category Breakdown */}
      <div className="grid-3-2">
        <div className="card">
          <div className="card-header-row">
            <div>
              <h3 className="card-title">{t('cashFlowDynamics')}</h3>
              <p className="card-subtitle">{t('cashFlowSubtitle')}</p>
            </div>
          </div>
          <MonthlyCashFlowChart trends={analytics?.monthlyTrends || []} />
        </div>

        <div className="card">
          <div className="card-header-row">
            <div>
              <h3 className="card-title">{t('expenseDistribution')}</h3>
              <p className="card-subtitle">{t('expenseDistSubtitle')}</p>
            </div>
          </div>
          <CategoryDoughnutChart categories={analytics?.expenseCategories || []} />
        </div>
      </div>

      {/* Bottom Grid: Recent Transactions & Active Budget Caps */}
      <div className="grid-3-2">
        {/* Recent Transactions */}
        <div className="card">
          <div className="card-header-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} className="text-primary-accent" />
              <h3 className="card-title">{t('recentTransactions')}</h3>
            </div>
            <button
              onClick={() => setActiveTab('transactions')}
              className="btn btn-outline btn-sm"
            >
              {t('viewAll')} <ChevronRight size={14} />
            </button>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>{t('colTitle')}</th>
                  <th>{t('colCategory')}</th>
                  <th>{t('colDate')}</th>
                  <th>{t('colAmount')}</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem' }}>
                      {t('noTxFound')}
                    </td>
                  </tr>
                ) : (
                  recentTransactions.map((tx) => (
                    <tr key={tx._id} style={{ cursor: 'pointer' }} onClick={() => onEditTransaction(tx)}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{tx.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{tx.paymentMethod}</div>
                      </td>
                      <td>
                        <span className="badge badge-category">{tx.category}</span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {tx.date}
                      </td>
                      <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                        <span style={{ color: tx.type === 'income' ? '#34d399' : '#fb7185' }}>
                          {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount, currency)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Budget Health Highlights */}
        <div className="card">
          <div className="card-header-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={18} className="text-warning" />
              <h3 className="card-title">{t('budgetThresholds')}</h3>
            </div>
            <button
              onClick={() => setActiveTab('budgets')}
              className="btn btn-outline btn-sm"
            >
              {t('manageBudgets')} <ChevronRight size={14} />
            </button>
          </div>

          <div className="budget-quick-list">
            {budgetsData.budgets?.slice(0, 4).map((b) => (
              <div key={b._id} className="budget-mini-item">
                <div className="budget-mini-top">
                  <span className="budget-cat-name">{b.category}</span>
                  <span className="budget-percent-tag" style={{
                    color: b.percentage >= 100 ? '#f43f5e' : b.percentage >= 80 ? '#f59e0b' : '#10b981'
                  }}>
                    {b.percentage}%
                  </span>
                </div>
                <div className="budget-bar-track">
                  <div
                    className="budget-bar-fill"
                    style={{
                      width: `${Math.min(100, b.percentage)}%`,
                      backgroundColor: b.percentage >= 100 ? '#f43f5e' : b.percentage >= 80 ? '#f59e0b' : b.color || '#6366f1'
                    }}
                  />
                </div>
                <div className="budget-mini-bottom">
                  <span>{t('spent')}: {formatCurrency(b.spent, currency)}</span>
                  <span>{t('limit')}: {formatCurrency(b.limit, currency)}</span>
                </div>
              </div>
            ))}

            {(!budgetsData.budgets || budgetsData.budgets.length === 0) && (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                {t('noBudgetsDesc')}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-hero-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.5rem;
        }
        .card-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }
        .card-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .card-subtitle {
          font-size: 0.775rem;
          color: var(--text-dim);
          margin-top: 0.15rem;
        }
        .budget-quick-list {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
          margin-top: 0.5rem;
        }
        .budget-mini-item {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .budget-mini-top {
          display: flex;
          justify-content: space-between;
          font-size: 0.825rem;
          font-weight: 600;
        }
        .budget-cat-name {
          color: var(--text-main);
        }
        .budget-bar-track {
          height: 7px;
          background: #1e293b;
          border-radius: 999px;
          overflow: hidden;
        }
        .budget-bar-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.4s ease;
        }
        .budget-mini-bottom {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          color: var(--text-dim);
          font-family: var(--font-mono);
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;
