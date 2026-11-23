import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Trash2, 
  Edit3, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight,
  Repeat,
  Download,
  Coins
} from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency } from '../utils/currency';

const TransactionsPage = ({ onOpenAddModal, onEditTransaction, onOpenExportModal }) => {
  const { transactions, deleteTransaction, currency } = useExpense();
  const { t } = useLanguage();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // all, income, expense
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set();
    transactions.forEach((t) => t.category && set.add(t.category));
    return ['All', ...Array.from(set)];
  }, [transactions]);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Type
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
      // Category
      if (categoryFilter !== 'All' && tx.category !== categoryFilter) return false;
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = tx.title?.toLowerCase().includes(q);
        const matchNotes = tx.notes?.toLowerCase().includes(q);
        const matchCat = tx.category?.toLowerCase().includes(q);
        if (!matchTitle && !matchNotes && !matchCat) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });
  }, [transactions, typeFilter, categoryFilter, search, sortBy]);

  // Financial totals for current filter view
  const filterStats = useMemo(() => {
    let inc = 0;
    let exp = 0;
    filteredTransactions.forEach((t) => {
      if (t.type === 'income') inc += Number(t.amount);
      if (t.type === 'expense') exp += Number(t.amount);
    });
    return { income: inc, expense: exp, net: inc - exp };
  }, [filteredTransactions]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm(t('deleteTxConfirm'))) {
      await deleteTransaction(id);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Header Banner with Real Video Accent */}
      <div className="hero-video-banner card-glow" style={{ padding: '1.75rem 2rem', marginBottom: '1.5rem' }}>
        <div className="cinematic-video-wrapper">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="cinematic-video-bg"
            style={{ opacity: 0.28 }}
          >
            <source src="/videos/transactions-coins.webm" type="video/webm" />
            <source src="/videos/coins-stream.webm" type="video/webm" />
          </video>
          <div className="cinematic-dark-overlay" />
        </div>

        <div className="cinematic-content dashboard-header" style={{ marginBottom: 0 }}>
          <div>
            <div className="floating-rupee-pill" style={{ marginBottom: '0.5rem' }}>
              <Coins size={13} className="coin-icon-spinning text-warning" />
              <span>Real-Time Currency Ledger</span>
            </div>
            <h1 className="title-hero">
              {t('txLedger')}
            </h1>
            <p className="subtitle">
              {t('txLedgerDesc')}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={onOpenExportModal} className="btn btn-secondary">
              <Download size={16} />
              <span>{t('exportCSV')}</span>
            </button>
            <button onClick={onOpenAddModal} className="btn btn-primary">
              <Plus size={16} />
              <span>{t('addRecordBtn')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div className="controls-grid">
          {/* Search box */}
          <div className="search-input-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-field"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="pill-group">
            <button
              onClick={() => setTypeFilter('all')}
              className={`pill-btn ${typeFilter === 'all' ? 'pill-active' : ''}`}
            >
              {t('all')} ({transactions.length})
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`pill-btn ${typeFilter === 'expense' ? 'pill-active' : ''}`}
            >
              {t('expenses')}
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`pill-btn ${typeFilter === 'income' ? 'pill-active' : ''}`}
            >
              {t('incomes')}
            </button>
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-dropdown"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? `${t('colCategory')}: ${t('all')}` : `${t('colCategory')}: ${c}`}
              </option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-dropdown"
          >
            <option value="date-desc">{t('newestFirst')}</option>
            <option value="date-asc">{t('oldestFirst')}</option>
            <option value="amount-desc">{t('amountHighToLow')}</option>
            <option value="amount-asc">{t('amountLowToHigh')}</option>
          </select>
        </div>

        {/* Dynamic Filter Quick Bar */}
        <div className="filter-summary-bar">
          <span>{t('showing')} <strong>{filteredTransactions.length}</strong> {t('records')}</span>
          <div className="filter-summary-amounts">
            <span>{t('inflow')}: <strong className="text-emerald">+{formatCurrency(filterStats.income, currency)}</strong></span>
            <span>{t('outflow')}: <strong className="text-rose">-{formatCurrency(filterStats.expense, currency)}</strong></span>
            <span>{t('net')}: <strong className="text-indigo">{formatCurrency(filterStats.net, currency)}</strong></span>
          </div>
        </div>
      </div>

      {/* Transactions Data Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>{t('colTitle')}</th>
                <th>{t('colType')}</th>
                <th>{t('colCategory')}</th>
                <th>{t('colDate')}</th>
                <th>{t('colPayment')}</th>
                <th>{t('colAmount')}</th>
                <th style={{ textAlign: 'right' }}>{t('colActions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                    {t('noTxFound')}
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx._id} className="tx-row">
                    <td>
                      <div className="tx-title-box">
                        <div className="tx-title">{tx.title}</div>
                        {tx.isRecurring && (
                          <span className="badge badge-neutral" title="Recurring item">
                            <Repeat size={10} /> recurring
                          </span>
                        )}
                      </div>
                      {tx.notes && <div className="tx-notes">{tx.notes}</div>}
                    </td>
                    <td>
                      <span className={`badge ${tx.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                        {tx.type === 'income' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {tx.type}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-category">{tx.category}</span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {tx.date}
                    </td>
                    <td>
                      <span className="badge badge-neutral">{tx.paymentMethod || 'UPI'}</span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      <span style={{ color: tx.type === 'income' ? '#34d399' : '#fb7185' }}>
                        {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount, currency)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-buttons-group">
                        <button
                          onClick={() => onEditTransaction(tx)}
                          className="btn-icon-action"
                          title="Edit transaction"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(tx._id, e)}
                          className="btn-icon-action btn-icon-delete"
                          title="Delete transaction"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .controls-grid {
          display: grid;
          grid-template-columns: 2fr auto auto auto;
          gap: 1rem;
          align-items: center;
        }
        @media (max-width: 1024px) {
          .controls-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 640px) {
          .controls-grid {
            grid-template-columns: 1fr;
          }
        }
        .search-input-box {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-icon {
          position: absolute;
          left: 0.85rem;
          color: var(--text-dim);
        }
        .search-field {
          width: 100%;
          padding: 0.65rem 0.85rem 0.65rem 2.35rem;
          background: #0d131f;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          color: white;
          font-size: 0.85rem;
        }
        .search-field:focus {
          outline: none;
          border-color: var(--primary);
        }
        .pill-group {
          display: flex;
          background: #0d131f;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 0.2rem;
        }
        .pill-btn {
          padding: 0.45rem 0.85rem;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 600;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s;
        }
        .pill-active {
          background: var(--bg-subtle);
          color: white;
        }
        .filter-dropdown {
          background: #0d131f;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          color: var(--text-main);
          padding: 0.65rem 0.85rem;
          font-size: 0.825rem;
          font-weight: 600;
          outline: none;
        }
        .filter-summary-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1rem;
          margin-top: 1rem;
          border-top: 1px solid var(--border-color);
          font-size: 0.825rem;
          color: var(--text-muted);
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .filter-summary-amounts {
          display: flex;
          gap: 1.25rem;
        }
        .text-emerald { color: #34d399; }
        .text-rose { color: #fb7185; }
        .text-indigo { color: #818cf8; }

        .tx-title-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .tx-title {
          font-weight: 600;
          color: var(--text-main);
        }
        .tx-notes {
          font-size: 0.75rem;
          color: var(--text-dim);
          margin-top: 0.2rem;
        }
        .action-buttons-group {
          display: flex;
          justify-content: flex-end;
          gap: 0.4rem;
        }
        .btn-icon-action {
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-dim);
          padding: 0.45rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
        }
        .btn-icon-action:hover {
          color: var(--text-main);
          background: var(--bg-subtle);
          border-color: var(--border-color);
        }
        .btn-icon-delete:hover {
          color: var(--danger);
          background: var(--danger-light);
        }
      `}</style>
    </div>
  );
};

export default TransactionsPage;
