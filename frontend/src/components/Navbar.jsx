import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useExpense } from '../context/ExpenseContext';
import { useLanguage, LanguageSelector } from '../context/LanguageContext';
import { CURRENCIES } from '../utils/currency';
import { 
  Sparkles, 
  LogOut, 
  Globe, 
  RotateCcw,
  TrendingUp,
  Coins
} from 'lucide-react';

const Navbar = ({ onOpenAddModal }) => {
  const { user, logout, seedSampleData } = useAuth();
  const { currency, setCurrency, refreshData, showToast } = useExpense();
  const { t } = useLanguage();

  const handleSeed = async () => {
    try {
      const res = await seedSampleData();
      showToast(res.message || 'Demo data loaded successfully!', 'success');
      refreshData();
    } catch (err) {
      showToast('Error seeding demo data', 'error');
    }
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Brand & Auspify Task 3 Tag */}
        <div className="nav-brand">
          <div className="brand-icon">
            <TrendingUp size={22} className="text-primary-accent" />
          </div>
          <div>
            <div className="brand-name">
              Finance<span className="text-gradient">Flow</span>
            </div>
            <div className="brand-tag">
              {t('taskBadge')}
            </div>
          </div>
        </div>

        {/* Global Controls */}
        <div className="nav-actions">
          {/* Multilingual Selector */}
          <LanguageSelector />

          {/* Currency Switcher */}
          <div className="currency-selector">
            <Coins size={14} className="currency-icon text-warning coin-icon-spinning" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="currency-dropdown"
              title="Select display currency"
            >
              {Object.keys(CURRENCIES).map((code) => (
                <option key={code} value={code}>
                  {code} ({CURRENCIES[code].symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Seed Demo Data Button */}
          <button
            onClick={handleSeed}
            className="btn btn-secondary btn-sm"
            title="Reload 60 days of realistic sample transactions and budgets for testing"
          >
            <RotateCcw size={14} />
            <span className="hide-mobile">{t('loadDemo')}</span>
          </button>

          {/* Quick Add CTA */}
          <button
            onClick={onOpenAddModal}
            className="btn btn-primary btn-sm"
          >
            <Sparkles size={15} />
            <span>{t('addRecord')}</span>
          </button>

          {/* User profile & Logout */}
          <div className="user-profile-badge">
            <div className="avatar-circle">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-details hide-mobile">
              <span className="user-name">{user?.name || 'User'}</span>
              <span className="user-role">{t('internRole')}</span>
            </div>
            <button
              onClick={logout}
              className="btn-logout"
              title={t('signOut')}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .navbar {
          height: 70px;
          background: rgba(17, 24, 39, 0.88);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--border-color);
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          padding: 0 2rem;
        }
        .nav-container {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .brand-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.2));
          border: 1px solid rgba(99, 102, 241, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #818cf8;
        }
        .brand-name {
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .brand-tag {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .currency-selector {
          display: flex;
          align-items: center;
          background: var(--bg-subtle);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 0.3rem 0.6rem;
          gap: 0.4rem;
        }
        .currency-icon {
          color: var(--text-dim);
        }
        .currency-dropdown {
          background: transparent;
          border: none;
          color: var(--text-main);
          font-size: 0.825rem;
          font-weight: 600;
          cursor: pointer;
          outline: none;
        }
        .currency-dropdown option {
          background: #111827;
          color: white;
        }
        .user-profile-badge {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding-left: 0.75rem;
          border-left: 1px solid var(--border-color);
        }
        .avatar-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: white;
          font-weight: 700;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 12px rgba(99, 102, 241, 0.4);
        }
        .user-details {
          display: flex;
          flex-direction: column;
        }
        .user-name {
          font-size: 0.825rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .user-role {
          font-size: 0.68rem;
          color: var(--text-dim);
        }
        .btn-logout {
          background: transparent;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          padding: 0.4rem;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          transition: all 0.2s;
        }
        .btn-logout:hover {
          color: var(--danger);
          background: var(--danger-light);
        }
        @media (max-width: 768px) {
          .navbar {
            padding: 0 1rem;
          }
          .hide-mobile {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
