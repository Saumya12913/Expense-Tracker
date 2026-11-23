import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';

const Toast = () => {
  const { toasts, removeToast } = useExpense();

  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => {
        return (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.type === 'success' && <CheckCircle2 size={18} className="text-emerald" />}
            {t.type === 'error' && <AlertTriangle size={18} className="text-rose" />}
            {t.type === 'info' && <Info size={18} className="text-indigo" />}
            <span style={{ flex: 1 }}>{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
