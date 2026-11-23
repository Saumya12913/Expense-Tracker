import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { useLanguage } from '../context/LanguageContext';

const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Housing & Rent',
  'Transportation',
  'Utilities & Bills',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Education & Career',
  'Personal Care',
  'Other Expense',
];

const COLOR_OPTIONS = [
  '#6366f1', '#ec4899', '#f59e0b', '#10b981', '#06b6d4',
  '#8b5cf6', '#ef4444', '#14b8a6', '#f97316', '#3b82f6'
];

const BudgetModal = ({ isOpen, onClose, existingBudget = null }) => {
  const { saveBudget } = useExpense();
  const { t } = useLanguage();
  const now = new Date();

  const [category, setCategory] = useState(existingBudget?.category || 'Food & Dining');
  const [limit, setLimit] = useState(existingBudget?.limit || '');
  const [month, setMonth] = useState(existingBudget?.month || now.getMonth() + 1);
  const [year, setYear] = useState(existingBudget?.year || now.getFullYear());
  const [color, setColor] = useState(existingBudget?.color || '#6366f1');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!limit || Number(limit) <= 0) {
      setError('Please provide a positive budget cap');
      return;
    }

    setSubmitting(true);
    const res = await saveBudget({
      category,
      limit: Number(limit),
      month: Number(month),
      year: Number(year),
      color,
    });
    setSubmitting(false);

    if (res.success) {
      onClose();
    } else {
      setError(res.message || 'Failed to save budget');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="title-hero" style={{ fontSize: '1.35rem' }}>
              {existingBudget ? t('adjustBudgetTarget') : t('setSpendingCap')}
            </h3>
            <p className="subtitle">
              {t('budgetModalSubtitle')}
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="error-alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t('category')}</label>
            <select
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={!!existingBudget}
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">{t('monthlySpendingLimit')}</label>
            <input
              type="number"
              step="any"
              className="form-control"
              placeholder="e.g. 15000"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('categoryColorTag')}</label>
            <div className="color-palette-grid">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`color-swatch-btn ${color === c ? 'active' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              {t('cancel')}
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? t('saving') : t('setBudgetBtn')}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .color-palette-grid {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .color-swatch-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
        }
        .color-swatch-btn:hover {
          transform: scale(1.15);
        }
        .color-swatch-btn.active {
          border-color: white;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default BudgetModal;
