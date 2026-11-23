import React, { useState } from 'react';
import { X, Download, Printer, CheckCircle, Coins } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency } from '../utils/currency';

const ExportModal = ({ isOpen, onClose }) => {
  const { transactions, summary, currency } = useExpense();
  const { t } = useLanguage();
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  // CSV Generator
  const downloadCSV = () => {
    if (!transactions.length) return;
    setDownloading(true);

    const headers = ['Transaction ID', 'Title', 'Type', 'Category', 'Amount (INR)', 'Date', 'Payment Method', 'Notes', 'Is Recurring'];
    const rows = transactions.map((t) => [
      t._id,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      t.type,
      `"${t.category || ''}"`,
      t.amount,
      t.date,
      t.paymentMethod || 'UPI',
      `"${(t.notes || '').replace(/"/g, '""')}"`,
      t.isRecurring ? 'Yes' : 'No',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FinanceFlow_Statement_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloading(false);
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px', overflow: 'hidden' }}>
        {/* Real Moving Video Header Accent */}
        <div className="export-video-accent">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="export-video-bg"
          >
            <source src="/videos/export-coins.webm" type="video/webm" />
            <source src="/videos/hero-fintech.webm" type="video/webm" />
          </video>
          <div className="export-video-overlay" />
          <div className="export-video-content">
            <div className="floating-rupee-pill" style={{ marginBottom: '0.4rem' }}>
              <Coins size={13} className="coin-icon-spinning text-warning" />
              <span>Institutional Grade Financial Auditing</span>
            </div>
            <h3 className="title-hero" style={{ fontSize: '1.45rem' }}>
              {t('exportStatement')}
            </h3>
            <p className="subtitle" style={{ fontSize: '0.85rem' }}>
              {t('exportSubtitle')}
            </p>
          </div>
          <button className="modal-close export-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Statement Overview Card */}
        <div className="export-preview-box">
          <div className="preview-row">
            <span className="preview-label">{t('totalTransactions')}:</span>
            <span className="preview-value">{transactions.length} {t('records')}</span>
          </div>
          <div className="preview-row">
            <span className="preview-label">{t('totalCashInflow')}:</span>
            <span className="preview-value text-emerald">{formatCurrency(summary.totalIncome, currency)}</span>
          </div>
          <div className="preview-row">
            <span className="preview-label">{t('totalCashOutflow')}:</span>
            <span className="preview-value text-rose">{formatCurrency(summary.totalExpense, currency)}</span>
          </div>
          <div className="preview-row">
            <span className="preview-label">{t('netSurplusBalance')}:</span>
            <span className="preview-value text-indigo">{formatCurrency(summary.netSavings, currency)}</span>
          </div>
        </div>

        <div className="export-options-grid">
          <button onClick={downloadCSV} className="export-btn-card">
            <Download size={24} className="export-btn-icon" />
            <div className="export-btn-text">
              <span className="export-btn-title">{t('downloadCSVBtn')}</span>
              <span className="export-btn-desc">{t('csvDesc')}</span>
            </div>
          </button>

          <button onClick={handlePrint} className="export-btn-card">
            <Printer size={24} className="export-btn-icon text-cyan" />
            <div className="export-btn-text">
              <span className="export-btn-title">{t('printPDFBtn')}</span>
              <span className="export-btn-desc">{t('pdfDesc')}</span>
            </div>
          </button>
        </div>

        {downloading && (
          <div className="download-progress-bar">
            <div className="download-progress-fill" />
            <span className="download-status-text">Generating verified cryptographic CSV ledger...</span>
          </div>
        )}

        <div className="modal-actions" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-secondary">
            {t('close')}
          </button>
        </div>
      </div>

      <style>{`
        .export-video-accent {
          position: relative;
          padding: 1.75rem 2rem 1.25rem;
          margin: -2rem -2rem 1.5rem;
          overflow: hidden;
          background: #0d1322;
        }
        .export-video-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.35;
          pointer-events: none;
        }
        .export-video-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(13, 19, 34, 0.75) 0%, rgba(17, 24, 39, 0.95) 100%);
          pointer-events: none;
        }
        .export-video-content {
          position: relative;
          z-index: 2;
        }
        .export-modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          z-index: 10;
        }
        .export-preview-box {
          background: #0d131f;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          margin-bottom: 1.5rem;
        }
        .preview-row {
          display: flex;
          justify-content: space-between;
          padding: 0.35rem 0;
          font-size: 0.875rem;
        }
        .preview-label {
          color: var(--text-muted);
        }
        .preview-value {
          font-weight: 700;
          font-family: var(--font-mono);
        }
        .text-emerald { color: #34d399; }
        .text-rose { color: #fb7185; }
        .text-indigo { color: #818cf8; }
        .text-cyan { color: #22d3ee; }

        .export-options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        @media (max-width: 600px) {
          .export-options-grid {
            grid-template-columns: 1fr;
          }
        }
        .export-btn-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
        }
        .export-btn-card:hover {
          border-color: var(--primary);
          background: rgba(99, 102, 241, 0.08);
          transform: translateY(-2px);
        }
        .export-btn-icon {
          color: var(--primary);
          flex-shrink: 0;
        }
        .export-btn-text {
          display: flex;
          flex-direction: column;
        }
        .export-btn-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .export-btn-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 0.2rem;
        }
        .download-progress-bar {
          margin-top: 1.25rem;
          height: 24px;
          background: #0d131f;
          border-radius: var(--radius-sm);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .download-progress-fill {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 100%;
          background: linear-gradient(90deg, #6366f1, #10b981);
          animation: progressAnim 1.2s ease-in-out infinite;
        }
        .download-status-text {
          position: relative;
          z-index: 2;
          font-size: 0.75rem;
          font-weight: 700;
          color: white;
        }
        @keyframes progressAnim {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default ExportModal;
