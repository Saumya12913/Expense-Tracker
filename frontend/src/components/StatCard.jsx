import React from 'react';
import { useExpense } from '../context/ExpenseContext';
import { formatCurrency } from '../utils/currency';

const StatCard = ({ title, amount, icon: Icon, type = 'neutral', subtitle, isRawValue = false }) => {
  const { currency } = useExpense();

  const formatted = isRawValue ? amount : formatCurrency(amount, currency);

  const getBorderColor = () => {
    switch (type) {
      case 'income':
        return 'rgba(16, 185, 129, 0.4)';
      case 'expense':
        return 'rgba(244, 63, 94, 0.4)';
      case 'savings':
        return 'rgba(99, 102, 241, 0.4)';
      case 'warning':
        return 'rgba(245, 158, 11, 0.4)';
      default:
        return 'var(--border-color)';
    }
  };

  const getIconBg = () => {
    switch (type) {
      case 'income':
        return 'rgba(16, 185, 129, 0.15)';
      case 'expense':
        return 'rgba(244, 63, 94, 0.15)';
      case 'savings':
        return 'rgba(99, 102, 241, 0.15)';
      case 'warning':
        return 'rgba(245, 158, 11, 0.15)';
      default:
        return 'var(--bg-subtle)';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'income':
        return '#34d399';
      case 'expense':
        return '#fb7185';
      case 'savings':
        return '#818cf8';
      case 'warning':
        return '#fbbf24';
      default:
        return 'var(--text-muted)';
    }
  };

  return (
    <div className="stat-card card" style={{ borderTop: `2px solid ${getBorderColor()}` }}>
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        <div className="stat-card-icon" style={{ backgroundColor: getIconBg(), color: getIconColor() }}>
          {Icon && <Icon size={20} />}
        </div>
      </div>
      <div className="stat-card-value">{formatted}</div>
      {subtitle && <div className="stat-card-subtitle">{subtitle}</div>}

      <style>{`
        .stat-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1.35rem 1.5rem;
        }
        .stat-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        .stat-card-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .stat-card-icon {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-card-value {
          font-size: 1.75rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--text-main);
          font-family: var(--font-mono);
          margin-bottom: 0.35rem;
        }
        .stat-card-subtitle {
          font-size: 0.775rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};

export default StatCard;
