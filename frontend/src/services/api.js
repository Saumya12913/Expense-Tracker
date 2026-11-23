const API_BASE = '/api';

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
    const data = await res.json();

    if (!res.ok) {
      if (res.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
        localStorage.removeItem('auspify_token');
        localStorage.removeItem('auspify_user');
        window.dispatchEvent(new Event('auth:logout'));
      }
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (error) {
    throw error;
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
