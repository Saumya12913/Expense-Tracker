import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';

const ExpenseContext = createContext(null);

export const ExpenseProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netSavings: 0,
    savingsRate: 0,
    transactionCount: 0,
  });
  const [budgetsData, setBudgetsData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    totalBudgeted: 0,
    totalSpent: 0,
    overallPercentage: 0,
    budgets: [],
  });
  const [analytics, setAnalytics] = useState(null);
  const [currency, setCurrency] = useState(user?.preferredCurrency || 'INR');
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast notification dispatcher
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fireConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
      });
    } catch {
      // ignore
    }
  };

  // Sync currency when user changes
  useEffect(() => {
    if (user?.preferredCurrency) {
      setCurrency(user.preferredCurrency);
    }
  }, [user]);

  // Fetch all primary datasets
  const fetchAllData = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const [txRes, sumRes, budRes, anaRes] = await Promise.all([
        api.getTransactions({ limit: 100 }),
        api.getSummary(),
        api.getBudgets(),
        api.getAnalyticsOverview(),
      ]);

      if (txRes.success) setTransactions(txRes.data || []);
      if (sumRes.success) setSummary(sumRes.data || {});
      if (budRes.success) setBudgetsData(budRes.data || { budgets: [] });
      if (anaRes.success) setAnalytics(anaRes.data || null);
    } catch (err) {
      console.error('Error fetching expense datasets:', err);
      showToast('Error syncing latest financial data: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, showToast]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated, fetchAllData]);

  // Add Transaction
  const addTransaction = async (formData) => {
    try {
      const res = await api.createTransaction(formData);
      if (res.success) {
        showToast(`Transaction "${formData.title}" added successfully!`, 'success');
        if (formData.type === 'income') fireConfetti();
        await fetchAllData();
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (err) {
      showToast(err.message || 'Failed to add transaction', 'error');
      return { success: false, message: err.message };
    }
  };

  // Update Transaction
  const updateTransaction = async (id, formData) => {
    try {
      const res = await api.updateTransaction(id, formData);
      if (res.success) {
        showToast('Transaction updated successfully!', 'success');
        await fetchAllData();
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (err) {
      showToast(err.message || 'Failed to update transaction', 'error');
      return { success: false, message: err.message };
    }
  };

  // Delete Transaction
  const deleteTransaction = async (id) => {
    try {
      const res = await api.deleteTransaction(id);
      if (res.success) {
        showToast('Transaction removed', 'info');
        await fetchAllData();
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (err) {
      showToast(err.message || 'Failed to delete transaction', 'error');
      return { success: false, message: err.message };
    }
  };

  // Upsert Budget
  const saveBudget = async (budgetData) => {
    try {
      const res = await api.upsertBudget(budgetData);
      if (res.success) {
        showToast(`Budget for ${budgetData.category} updated!`, 'success');
        await fetchAllData();
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (err) {
      showToast(err.message || 'Failed to set budget', 'error');
      return { success: false, message: err.message };
    }
  };

  // Delete Budget
  const deleteBudget = async (id) => {
    try {
      const res = await api.deleteBudget(id);
      if (res.success) {
        showToast('Budget target removed', 'info');
        await fetchAllData();
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (err) {
      showToast(err.message || 'Failed to delete budget', 'error');
      return { success: false, message: err.message };
    }
  };

  return (
    <ExpenseContext.Provider
      value={{
        transactions,
        summary,
        budgetsData,
        analytics,
        currency,
        setCurrency,
        loading,
        toasts,
        showToast,
        removeToast,
        refreshData: fetchAllData,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        saveBudget,
        deleteBudget,
        fireConfetti,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
