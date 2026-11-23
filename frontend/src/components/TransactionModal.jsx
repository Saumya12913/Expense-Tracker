import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { useLanguage } from '../context/LanguageContext';
import { detectCategory } from '../utils/currency';

const CATEGORIES = {
  expense: [
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
  ],
  income: [
    'Salary',
    'Freelance',
    'Investments',
    'Business',
    'Gift / Grants',
    'Refund',
    'Other Income',
  ],
};

const PAYMENT_METHODS = [
  'UPI',
  'Credit Card',
  'Debit Card',
  'Net Banking',
  'Cash',
  'Bank Transfer',
  'Crypto',
  'Other',
];

const TransactionModal = ({ isOpen, onClose, initialData = null }) => {
  const { addTransaction, updateTransaction } = useExpense();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: 'Food & Dining',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'UPI',
    notes: '',
    isRecurring: false,
    recurrenceInterval: 'monthly',
  });

  const [autoDetected, setAutoDetected] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount || '',
        type: initialData.type || 'expense',
        category: initialData.category || 'Food & Dining',
        date: initialData.date ? initialData.date.split('T')[0] : new Date().toISOString().split('T')[0],
        paymentMethod: initialData.paymentMethod || 'UPI',
        notes: initialData.notes || '',
        isRecurring: initialData.isRecurring || false,
        recurrenceInterval: initialData.recurrenceInterval || 'monthly',
      });
      setAutoDetected(false);
    } else {
      setFormData({
        title: '',
        amount: '',
        type: 'expense',
        category: 'Food & Dining',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'UPI',
        notes: '',
        isRecurring: false,
        recurrenceInterval: 'monthly',
      });
      setAutoDetected(false);
    }
    setError('');
  }, [initialData, isOpen]);

  // Handle title change with Smart Keyword Auto-Tagging
  const handleTitleChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => {
      const next = { ...prev, title: val };
      if (!initialData && val.length > 2) {
        const detected = detectCategory(val);
        if (detected) {
          next.category = detected.category;
          next.type = detected.type;
          setAutoDetected(true);
        }
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please provide a transaction title');
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      setError('Please provide a positive amount');
      return;
    }

    setSubmitting(true);
    let res;
    if (initialData?._id) {
      res = await updateTransaction(initialData._id, formData);
    } else {
      res = await addTransaction(formData);
    }
    setSubmitting(false);

    if (res.success) {
      onClose();
    } else {
      setError(res.message || 'Operation failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="title-hero" style={{ fontSize: '1.35rem' }}>
              {initialData ? t('editTx') : t('recordNewTx')}
            </h3>
            <p className="subtitle">
              {t('txModalSubtitle')}
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
          {/* Income vs Expense Pill Toggle */}
          <div className="type-toggle-container">
            <button
              type="button"
              className={`type-toggle-btn ${formData.type === 'expense' ? 'active-expense' : ''}`}
              onClick={() => {
                setFormData((p) => ({
                  ...p,
                  type: 'expense',
                  category: CATEGORIES.expense[0],
                }));
              }}
            >
              <ArrowDownRight size={16} />
              <span>{t('expenses')}</span>
            </button>
            <button
              type="button"
              className={`type-toggle-btn ${formData.type === 'income' ? 'active-income' : ''}`}
              onClick={() => {
                setFormData((p) => ({
                  ...p,
                  type: 'income',
                  category: CATEGORIES.income[0],
                }));
              }}
            >
              <ArrowUpRight size={16} />
              <span>{t('incomes')}</span>
            </button>
          </div>

          {/* Title */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>
                {t('txTitleDesc')}
              </label>
              {autoDetected && (
                <span className="auto-detect-pill">
                  <Sparkles size={12} /> {t('autoSuggestedCat')}
                </span>
              )}
            </div>
            <input
              type="text"
              className="form-control"
              placeholder={t('titlePlaceholder')}
              value={formData.title}
              onChange={handleTitleChange}
              required
            />
          </div>

          {/* Amount & Date */}
          <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">{t('amount')}</label>
              <input
                type="number"
                step="any"
                className="form-control"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">{t('date')}</label>
              <input
                type="date"
                className="form-control"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Category & Payment Method */}
          <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">{t('category')}</label>
              <select
                className="form-control"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES[formData.type].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">{t('paymentMethod')}</label>
              <select
                className="form-control"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm} value={pm}>
                    {pm}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">{t('notesOptional')}</label>
            <input
              type="text"
              className="form-control"
              placeholder={t('notesPlaceholder')}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          {/* Modal Actions */}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              {t('cancel')}
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? t('saving') : initialData ? t('updateRecord') : t('saveTransaction')}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .type-toggle-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          background: #0d131f;
          padding: 0.35rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          margin-bottom: 1.25rem;
        }
        .type-toggle-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.65rem;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-weight: 700;
          font-size: 0.85rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s;
        }
        .active-expense {
          background: rgba(244, 63, 94, 0.15);
          color: #fb7185;
          border: 1px solid rgba(244, 63, 94, 0.3);
        }
        .active-income {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .auto-detect-pill {
          font-size: 0.68rem;
          font-weight: 700;
          color: #a5b4fc;
          background: rgba(99, 102, 241, 0.15);
          padding: 0.15rem 0.5rem;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 1.75rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }
      `}</style>
    </div>
  );
};

export default TransactionModal;
