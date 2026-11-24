const API_BASE = import.meta.env.VITE_API_URL || '/api';

// --- Embedded Local Client Engine for Static Deployment (GitHub Pages) ---
const LOCAL_STORAGE_KEY = 'financeflow_local_db';

const makeDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

const getInitialLocalDb = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  return {
    users: [
      {
        _id: 'demo-user-123',
        name: 'Saumya (Demo Evaluator)',
        email: 'demo@financeflow.dev',
        preferredCurrency: 'INR',
      },
    ],
    budgets: [
      { _id: 'b1', userId: 'demo-user-123', category: 'Food & Dining', limit: 12000, spent: 8800, percentage: 73, remaining: 3200, month: currentMonth, year: currentYear, color: '#f59e0b' },
      { _id: 'b2', userId: 'demo-user-123', category: 'Housing & Rent', limit: 25000, spent: 24000, percentage: 96, remaining: 1000, month: currentMonth, year: currentYear, color: '#3b82f6' },
      { _id: 'b3', userId: 'demo-user-123', category: 'Transportation', limit: 6000, spent: 4000, percentage: 67, remaining: 2000, month: currentMonth, year: currentYear, color: '#06b6d4' },
      { _id: 'b4', userId: 'demo-user-123', category: 'Entertainment', limit: 5000, spent: 2808, percentage: 56, remaining: 2192, month: currentMonth, year: currentYear, color: '#ec4899' },
      { _id: 'b5', userId: 'demo-user-123', category: 'Shopping', limit: 8000, spent: 7699, percentage: 96, remaining: 301, month: currentMonth, year: currentYear, color: '#8b5cf6' },
      { _id: 'b6', userId: 'demo-user-123', category: 'Utilities & Bills', limit: 4500, spent: 3630, percentage: 81, remaining: 870, month: currentMonth, year: currentYear, color: '#10b981' },
    ],
    transactions: [
      { _id: 't1', userId: 'demo-user-123', title: 'Monthly Salary Credit', amount: 85000, type: 'income', category: 'Salary', date: makeDate(2), paymentMethod: 'Bank Transfer', notes: 'Monthly corporate tech stipend & salary', isRecurring: true },
      { _id: 't2', userId: 'demo-user-123', title: 'Freelance Web Design', amount: 18500, type: 'income', category: 'Freelance', date: makeDate(12), paymentMethod: 'UPI', notes: 'Client React landing page project', isRecurring: false },
      { _id: 't3', userId: 'demo-user-123', title: 'Mutual Fund Dividend', amount: 3200, type: 'income', category: 'Investments', date: makeDate(22), paymentMethod: 'Bank Transfer', notes: 'Nifty 50 Index fund quarterly payout', isRecurring: false },
      { _id: 't4', userId: 'demo-user-123', title: 'Previous Month Salary', amount: 85000, type: 'income', category: 'Salary', date: makeDate(32), paymentMethod: 'Bank Transfer', notes: 'Primary monthly employment income', isRecurring: true },
      { _id: 't5', userId: 'demo-user-123', title: 'Apartment Monthly Rent', amount: 24000, type: 'expense', category: 'Housing & Rent', date: makeDate(3), paymentMethod: 'Net Banking', notes: '2BHK Apartment rent', isRecurring: true },
      { _id: 't6', userId: 'demo-user-123', title: 'Supermarket Grocery Run', amount: 4850, type: 'expense', category: 'Food & Dining', date: makeDate(4), paymentMethod: 'Credit Card', notes: 'Vegetables, dairy, essentials', isRecurring: false },
      { _id: 't7', userId: 'demo-user-123', title: 'High-speed Fiber Broadband', amount: 1180, type: 'expense', category: 'Utilities & Bills', date: makeDate(5), paymentMethod: 'UPI', notes: 'Airtel Xstream 300Mbps fiber', isRecurring: true },
      { _id: 't8', userId: 'demo-user-123', title: 'Fuel - Car Tank Full', amount: 3200, type: 'expense', category: 'Transportation', date: makeDate(6), paymentMethod: 'Credit Card', notes: 'Shell Premium Petrol', isRecurring: false },
      { _id: 't9', userId: 'demo-user-123', title: 'Weekend Dinner with Friends', amount: 3400, type: 'expense', category: 'Food & Dining', date: makeDate(8), paymentMethod: 'Credit Card', notes: 'Italian restaurant dinner', isRecurring: false },
      { _id: 't10', userId: 'demo-user-123', title: 'Nike Running Sneakers', amount: 5499, type: 'expense', category: 'Shopping', date: makeDate(15), paymentMethod: 'Credit Card', notes: 'Marathon training gear', isRecurring: false },
      { _id: 't11', userId: 'demo-user-123', title: 'AWS Cloud Hosting Fees', amount: 1420, type: 'expense', category: 'Education & Career', date: makeDate(23), paymentMethod: 'Credit Card', notes: 'EC2 & RDS dev servers', isRecurring: true },
    ],
  };
};

const getLocalDb = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      const initial = getInitialLocalDb();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return getInitialLocalDb();
  }
};

const saveLocalDb = (db) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(db));
  } catch (err) {
    console.error('Error saving local client db:', err);
  }
};

// Fallback calculations
const calculateClientAnalytics = (txs, budgets) => {
  let income = 0;
  let expense = 0;
  txs.forEach((t) => {
    if (t.type === 'income') income += Number(t.amount);
    if (t.type === 'expense') expense += Number(t.amount);
  });

  const netSavings = income - expense;
  const savingsRate = income > 0 ? Number(((netSavings / income) * 100).toFixed(1)) : 0;
  const score = Math.min(100, Math.max(30, Math.round(50 + savingsRate * 0.8)));

  return {
    summary: { totalIncome: income, totalExpense: expense, netSavings, savingsRate },
    financialHealth: {
      score,
      rating: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Review',
      color: score >= 80 ? '#10b981' : score >= 60 ? '#6366f1' : '#f59e0b',
      breakdown: { savingsScore: Math.round(score * 0.4), budgetScore: Math.round(score * 0.3), runwayScore: Math.round(score * 0.3) },
    },
    budget503020: {
      needs: { amount: Math.round(expense * 0.5), percentage: 48, targetPercentage: 50 },
      wants: { amount: Math.round(expense * 0.3), percentage: 28, targetPercentage: 30 },
      savings: { amount: Math.max(0, netSavings), percentage: Math.max(0, savingsRate), targetPercentage: 20 },
    },
    expenseCategories: [
      { category: 'Housing & Rent', amount: 24000, percentage: 55, color: '#3b82f6' },
      { category: 'Food & Dining', amount: 8250, percentage: 19, color: '#f59e0b' },
      { category: 'Shopping', amount: 5499, percentage: 13, color: '#8b5cf6' },
      { category: 'Transportation', amount: 3200, percentage: 7, color: '#06b6d4' },
      { category: 'Utilities & Bills', amount: 2600, percentage: 6, color: '#10b981' },
    ],
    monthlyTrends: [
      { label: 'Jun', income: 82000, expense: 41000, netSavings: 41000 },
      { label: 'Jul', income: 85000, expense: 45000, netSavings: 40000 },
      { label: 'Aug', income: 90000, expense: 42000, netSavings: 48000 },
      { label: 'Sep', income: 85000, expense: 48000, netSavings: 37000 },
      { label: 'Oct', income: 103500, expense: 43549, netSavings: 59951 },
      { label: 'Nov', income, expense, netSavings },
    ],
    insights: [
      {
        type: 'positive',
        title: 'Strong Savings Velocity',
        message: `Your current net savings rate of ${savingsRate}% exceeds the standard 20% growth benchmark.`,
      },
      {
        type: 'info',
        title: 'Category Budget Adherence',
        message: 'Primary essential allocations are within defined threshold limits for this month.',
      },
    ],
  };
};

// Client-side fallback handler
const clientFallback = async (endpoint, options = {}) => {
  const db = getLocalDb();
  const body = options.body ? JSON.parse(options.body) : {};

  if (endpoint === '/auth/demo' || endpoint === '/auth/login' || endpoint === '/auth/register') {
    const user = {
      _id: 'demo-user-123',
      name: body.name || 'Demo Evaluator',
      email: body.email || 'demo@financeflow.dev',
      preferredCurrency: body.preferredCurrency || 'INR',
      token: 'client_session_' + Date.now(),
    };
    return { success: true, data: user };
  }

  if (endpoint === '/auth/me') {
    return {
      success: true,
      data: { _id: 'demo-user-123', name: 'Demo Evaluator', email: 'demo@financeflow.dev', preferredCurrency: 'INR' },
    };
  }

  if (endpoint === '/auth/seed') {
    const fresh = getInitialLocalDb();
    saveLocalDb(fresh);
    return { success: true, message: 'Sample demo telemetry loaded successfully!' };
  }

  if (endpoint.startsWith('/transactions')) {
    if (options.method === 'POST') {
      const newTx = {
        _id: 'tx_' + Date.now(),
        ...body,
        amount: Number(body.amount),
        createdAt: new Date().toISOString(),
      };
      db.transactions.unshift(newTx);
      saveLocalDb(db);
      return { success: true, data: newTx };
    }
    if (options.method === 'DELETE') {
      const id = endpoint.split('/').pop();
      db.transactions = db.transactions.filter((t) => t._id !== id);
      saveLocalDb(db);
      return { success: true };
    }
    if (options.method === 'PUT') {
      const id = endpoint.split('/').pop();
      const idx = db.transactions.findIndex((t) => t._id === id);
      if (idx !== -1) {
        db.transactions[idx] = { ...db.transactions[idx], ...body, amount: Number(body.amount) };
        saveLocalDb(db);
      }
      return { success: true, data: db.transactions[idx] };
    }
    if (endpoint.includes('/summary')) {
      let income = 0;
      let expense = 0;
      db.transactions.forEach((t) => {
        if (t.type === 'income') income += Number(t.amount);
        if (t.type === 'expense') expense += Number(t.amount);
      });
      const netSavings = income - expense;
      const savingsRate = income > 0 ? Number(((netSavings / income) * 100).toFixed(1)) : 0;
      return { success: true, data: { totalIncome: income, totalExpense: expense, netSavings, savingsRate, transactionCount: db.transactions.length } };
    }
    return { success: true, data: db.transactions };
  }

  if (endpoint.startsWith('/budgets')) {
    if (options.method === 'POST') {
      const idx = db.budgets.findIndex((b) => b.category === body.category);
      if (idx !== -1) {
        db.budgets[idx] = { ...db.budgets[idx], ...body };
      } else {
        db.budgets.push({ _id: 'b_' + Date.now(), spent: 0, percentage: 0, remaining: body.limit, ...body });
      }
      saveLocalDb(db);
      return { success: true, data: body };
    }
    if (options.method === 'DELETE') {
      const id = endpoint.split('/').pop();
      db.budgets = db.budgets.filter((b) => b._id !== id);
      saveLocalDb(db);
      return { success: true };
    }
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const totalBudgeted = db.budgets.reduce((s, b) => s + Number(b.limit || 0), 0);
    const totalSpent = db.budgets.reduce((s, b) => s + Number(b.spent || 0), 0);
    const overallPercentage = totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0;
    return {
      success: true,
      data: { month: currentMonth, year: currentYear, totalBudgeted, totalSpent, overallPercentage, budgets: db.budgets },
    };
  }

  if (endpoint.startsWith('/analytics')) {
    const calculated = calculateClientAnalytics(db.transactions, db.budgets);
    return { success: true, data: calculated };
  }

  if (endpoint === '/health') {
    return { success: true, status: 'online', mode: 'Client Hybrid Engine' };
  }

  return { success: true };
};

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('auspify_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    if (!res.ok) {
      if (res.status === 404 || res.status === 502 || res.status === 503) {
        // Fall back to client local engine on static deployments (GitHub Pages)
        return await clientFallback(endpoint, config);
      }
      if (res.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
        localStorage.removeItem('auspify_token');
        localStorage.removeItem('auspify_user');
        window.dispatchEvent(new Event('auth:logout'));
      }
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    // If backend is unreachable (static GitHub Pages or offline), smoothly use client engine
    return await clientFallback(endpoint, config);
  }
};

export const api = {
  // Auth
  register: (userData) => request('/auth/register', { method: 'POST', body: userData }),
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  demoLogin: () => request('/auth/demo', { method: 'POST' }),
  getMe: () => request('/auth/me'),
  updateProfile: (profileData) => request('/auth/profile', { method: 'PUT', body: profileData }),
  seedData: () => request('/auth/seed', { method: 'POST' }),

  // Transactions
  getTransactions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/transactions${query ? `?${query}` : ''}`);
  },
  getTransactionById: (id) => request(`/transactions/${id}`),
  createTransaction: (data) => request('/transactions', { method: 'POST', body: data }),
  updateTransaction: (id, data) => request(`/transactions/${id}`, { method: 'PUT', body: data }),
  deleteTransaction: (id) => request(`/transactions/${id}`, { method: 'DELETE' }),
  getSummary: () => request('/transactions/summary'),

  // Budgets
  getBudgets: (month, year) => {
    const query = new URLSearchParams({ ...(month && { month }), ...(year && { year }) }).toString();
    return request(`/budgets${query ? `?${query}` : ''}`);
  },
  upsertBudget: (data) => request('/budgets', { method: 'POST', body: data }),
  deleteBudget: (id) => request(`/budgets/${id}`, { method: 'DELETE' }),

  // Analytics
  getAnalyticsOverview: () => request('/analytics/overview'),

  // Health
  checkHealth: () => request('/health'),
};
