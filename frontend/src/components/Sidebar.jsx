import React from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Target, 
  Award,
  FileSpreadsheet
} from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { useLanguage } from '../context/LanguageContext';

const Sidebar = ({ activeTab, setActiveTab, onOpenExportModal }) => {
  const { transactions, budgetsData } = useExpense();
  const { t } = useLanguage();

  const navItems = [
    {
      id: 'dashboard',
      label: t('dashboard'),
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'transactions',
      label: t('transactions'),
      icon: Receipt,
      badge: transactions.length,
    },
    {
      id: 'budgets',
      label: t('budgets'),
      icon: Target,
      badge: budgetsData.budgets?.length || null,
    },
    {
      id: 'analytics',
      label: t('analytics'),
      icon: PieChart,
      badge: '50/30/20',
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-nav">
        <div className="nav-section-title">{t('navigation')}</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <div className="link-left">
                <Icon size={18} className={isActive ? 'icon-active' : 'icon-normal'} />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && (
                <span className={`link-badge ${isActive ? 'badge-active' : ''}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="nav-section-title" style={{ marginTop: '2rem' }}>{t('reportsExport')}</div>
        <button
          onClick={onOpenExportModal}
          className="sidebar-link"
        >
          <div className="link-left">
            <FileSpreadsheet size={18} className="icon-normal" />
            <span>{t('export')}</span>
          </div>
          <span className="link-badge">CSV/PDF</span>
        </button>
      </div>

      {/* Auspify Internship Status Widget */}
      <div className="auspify-status-box">
        <div className="status-header">
          <Award size={16} className="text-warning" />
          <span>{t('auspifyTitle')}</span>
        </div>
        <p className="status-desc">
          {t('auspifyDesc')}
        </p>
        <div className="status-tags">
          <span className="status-pill">#Auspify</span>
          <span className="status-pill">#FullStack</span>
        </div>
      </div>

      <style>{`
        .sidebar {
          width: 260px;
          background: #0f1523;
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1.5rem 1rem;
          flex-shrink: 0;
        }
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .nav-section-title {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-dim);
          font-weight: 700;
          padding: 0 0.75rem 0.5rem;
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0.75rem 0.85rem;
          border-radius: var(--radius-md);
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-muted);
          font-family: inherit;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }
        .sidebar-link:hover {
          color: var(--text-main);
          background: rgba(255, 255, 255, 0.03);
        }
        .sidebar-link.active {
          color: white;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(99, 102, 241, 0.08));
          border-color: rgba(99, 102, 241, 0.4);
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.15);
        }
        .link-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .icon-normal {
          color: var(--text-dim);
        }
        .icon-active {
          color: #818cf8;
        }
        .link-badge {
          font-size: 0.7rem;
          padding: 0.15rem 0.5rem;
          border-radius: 9999px;
          background: var(--bg-subtle);
          color: var(--text-dim);
          font-weight: 700;
        }
        .badge-active {
          background: rgba(99, 102, 241, 0.3);
          color: #c7d2fe;
        }
        .auspify-status-box {
          background: linear-gradient(180deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8));
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 1rem;
          margin-top: 1.5rem;
        }
        .status-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.825rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.35rem;
        }
        .status-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
          line-height: 1.4;
          margin-bottom: 0.75rem;
        }
        .status-tags {
          display: flex;
          gap: 0.35rem;
          flex-wrap: wrap;
        }
        .status-pill {
          font-size: 0.68rem;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.05);
          color: #a5b4fc;
          font-weight: 600;
        }
        @media (max-width: 900px) {
          .sidebar {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
