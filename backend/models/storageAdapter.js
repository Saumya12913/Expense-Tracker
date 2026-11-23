const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { getDBStatus } = require('../config/db');

const DATA_DIR = path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial DB template
const initialData = {
  users: [],
  transactions: [],
  budgets: [],
};

const readLocalData = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf8');
      return initialData;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local JSON DB, returning blank slate:', err);
    return initialData;
  }
};

const writeLocalData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to local JSON DB:', err);
  }
};

// Storage interface
const Storage = {
  // Users
  findUserByEmail: async (email) => {
    const data = readLocalData();
    return data.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  findUserById: async (id) => {
    const data = readLocalData();
    return data.users.find((u) => u._id === id) || null;
  },

  createUser: async (userData) => {
    const data = readLocalData();
    const newUser = {
      _id: uuidv4(),
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.users.push(newUser);
    writeLocalData(data);
    return newUser;
  },

  updateUser: async (id, updateData) => {
    const data = readLocalData();
    const idx = data.users.findIndex((u) => u._id === id);
    if (idx === -1) return null;
    data.users[idx] = {
      ...data.users[idx],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    writeLocalData(data);
    return data.users[idx];
  },

  // Transactions
  findTransactions: async (filter = {}) => {
    const data = readLocalData();
    let results = [...data.transactions];

    if (filter.userId) {
      results = results.filter((t) => t.userId === filter.userId);
    }
    if (filter.type) {
      results = results.filter((t) => t.type === filter.type);
    }
    if (filter.category) {
      results = results.filter((t) => t.category.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter.startDate) {
      results = results.filter((t) => new Date(t.date) >= new Date(filter.startDate));
    }
    if (filter.endDate) {
      results = results.filter((t) => new Date(t.date) <= new Date(filter.endDate));
    }
    if (filter.isRecurring !== undefined) {
      results = results.filter((t) => Boolean(t.isRecurring) === Boolean(filter.isRecurring));
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      results = results.filter((t) => 
        (t.title && t.title.toLowerCase().includes(q)) ||
        (t.notes && t.notes.toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q))
      );
    }

    // Default sort: latest date first
    results.sort((a, b) => new Date(b.date) - new Date(a.date));
    return results;
  },

  findTransactionById: async (id, userId) => {
    const data = readLocalData();
    return data.transactions.find((t) => t._id === id && t.userId === userId) || null;
  },

  createTransaction: async (txData) => {
    const data = readLocalData();
    const newTx = {
      _id: uuidv4(),
      ...txData,
      amount: Number(txData.amount),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.transactions.push(newTx);
    writeLocalData(data);
    return newTx;
  },

  updateTransaction: async (id, userId, updateData) => {
    const data = readLocalData();
    const idx = data.transactions.findIndex((t) => t._id === id && t.userId === userId);
    if (idx === -1) return null;
    data.transactions[idx] = {
      ...data.transactions[idx],
      ...updateData,
      amount: updateData.amount !== undefined ? Number(updateData.amount) : data.transactions[idx].amount,
      updatedAt: new Date().toISOString(),
    };
    writeLocalData(data);
    return data.transactions[idx];
  },

  deleteTransaction: async (id, userId) => {
    const data = readLocalData();
    const idx = data.transactions.findIndex((t) => t._id === id && t.userId === userId);
    if (idx === -1) return false;
    data.transactions.splice(idx, 1);
    writeLocalData(data);
    return true;
  },

  // Budgets
  findBudgets: async (userId, month, year) => {
    const data = readLocalData();
    return data.budgets.filter((b) => {
      const matchUser = b.userId === userId;
      const matchMonth = month !== undefined ? b.month === Number(month) : true;
      const matchYear = year !== undefined ? b.year === Number(year) : true;
      return matchUser && matchMonth && matchYear;
    });
  },

  upsertBudget: async (userId, budgetData) => {
    const data = readLocalData();
    const category = budgetData.category.trim();
    const month = Number(budgetData.month);
    const year = Number(budgetData.year);
    const limit = Number(budgetData.limit);

    const idx = data.budgets.findIndex(
      (b) => b.userId === userId && b.category.toLowerCase() === category.toLowerCase() && b.month === month && b.year === year
    );

    if (idx !== -1) {
      data.budgets[idx] = {
        ...data.budgets[idx],
        limit,
        color: budgetData.color || data.budgets[idx].color || '#6366f1',
        updatedAt: new Date().toISOString(),
      };
      writeLocalData(data);
      return data.budgets[idx];
    } else {
      const newBudget = {
        _id: uuidv4(),
        userId,
        category,
        month,
        year,
        limit,
        color: budgetData.color || '#6366f1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      data.budgets.push(newBudget);
      writeLocalData(data);
      return newBudget;
    }
  },

  deleteBudget: async (id, userId) => {
    const data = readLocalData();
    const idx = data.budgets.findIndex((b) => b._id === id && b.userId === userId);
    if (idx === -1) return false;
    data.budgets.splice(idx, 1);
    writeLocalData(data);
    return true;
  },

  // Reset or seed sample data for demo/testing
  seedSampleData: async (userId) => {
    const data = readLocalData();
    // remove current user's existing records
    data.transactions = data.transactions.filter((t) => t.userId !== userId);
    data.budgets = data.budgets.filter((b) => b.userId !== userId);

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // Budgets
    const sampleBudgets = [
      { _id: uuidv4(), userId, category: 'Food & Dining', limit: 12000, month: currentMonth, year: currentYear, color: '#f59e0b', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { _id: uuidv4(), userId, category: 'Housing & Rent', limit: 25000, month: currentMonth, year: currentYear, color: '#3b82f6', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { _id: uuidv4(), userId, category: 'Transportation', limit: 6000, month: currentMonth, year: currentYear, color: '#06b6d4', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { _id: uuidv4(), userId, category: 'Entertainment', limit: 5000, month: currentMonth, year: currentYear, color: '#ec4899', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { _id: uuidv4(), userId, category: 'Shopping', limit: 8000, month: currentMonth, year: currentYear, color: '#8b5cf6', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { _id: uuidv4(), userId, category: 'Utilities & Bills', limit: 4500, month: currentMonth, year: currentYear, color: '#10b981', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ];
    data.budgets.push(...sampleBudgets);

    // Realistic Transactions for the past 60 days
    const makeDate = (daysAgo) => {
      const d = new Date();
      d.setDate(d.getDate() - daysAgo);
      return d.toISOString().split('T')[0];
    };

    const sampleTx = [
      // Income
      { title: 'Monthly Salary Credit', amount: 85000, type: 'income', category: 'Salary', date: makeDate(2), paymentMethod: 'Bank Transfer', notes: 'Monthly corporate tech stipend & salary', isRecurring: true },
      { title: 'Freelance Web Design', amount: 18500, type: 'income', category: 'Freelance', date: makeDate(12), paymentMethod: 'UPI', notes: 'Client React landing page project', isRecurring: false },
      { title: 'Mutual Fund Dividend', amount: 3200, type: 'income', category: 'Investments', date: makeDate(22), paymentMethod: 'Bank Transfer', notes: 'Nifty 50 Index fund quarterly payout', isRecurring: false },
      { title: 'Previous Month Salary', amount: 85000, type: 'income', category: 'Salary', date: makeDate(32), paymentMethod: 'Bank Transfer', notes: 'Primary monthly employment income', isRecurring: true },
      { title: 'Tech Consultation Gig', amount: 12000, type: 'income', category: 'Freelance', date: makeDate(42), paymentMethod: 'UPI', notes: 'MERN stack architecture review', isRecurring: false },

      // Expenses - Needs (Housing, Utilities, Groceries)
      { title: 'Apartment Monthly Rent', amount: 24000, type: 'expense', category: 'Housing & Rent', date: makeDate(3), paymentMethod: 'Net Banking', notes: '2BHK Apartment rent', isRecurring: true },
      { title: 'Previous Month Apartment Rent', amount: 24000, type: 'expense', category: 'Housing & Rent', date: makeDate(33), paymentMethod: 'Net Banking', notes: '2BHK Apartment rent', isRecurring: true },
      { title: 'Supermarket Grocery Run', amount: 4850, type: 'expense', category: 'Food & Dining', date: makeDate(4), paymentMethod: 'Credit Card', notes: 'Vegetables, pantry essentials, dairy', isRecurring: false },
      { title: 'High-speed Fiber Broadband', amount: 1180, type: 'expense', category: 'Utilities & Bills', date: makeDate(5), paymentMethod: 'UPI', notes: 'Airtel Xstream 300Mbps fiber', isRecurring: true },
      { title: 'Electricity & Water Bill', amount: 2450, type: 'expense', category: 'Utilities & Bills', date: makeDate(7), paymentMethod: 'Net Banking', notes: 'Monthly utility billing', isRecurring: true },
      { title: 'Fuel - Car Tank Full', amount: 3200, type: 'expense', category: 'Transportation', date: makeDate(6), paymentMethod: 'Credit Card', notes: 'Shell Premium Petrol', isRecurring: false },
      { title: 'Metro Smart Card Recharge', amount: 800, type: 'expense', category: 'Transportation', date: makeDate(9), paymentMethod: 'UPI', notes: 'Weekly metro travel', isRecurring: false },

      // Expenses - Wants (Dining, Entertainment, Shopping)
      { title: 'Weekend Dinner with Friends', amount: 3400, type: 'expense', category: 'Food & Dining', date: makeDate(8), paymentMethod: 'Credit Card', notes: 'Italian restaurant dinner', isRecurring: false },
      { title: 'Artisan Coffee & Bakery', amount: 550, type: 'expense', category: 'Food & Dining', date: makeDate(10), paymentMethod: 'UPI', notes: 'Blue Tokai cold brew and croissant', isRecurring: false },
      { title: 'IMAX Movie Tickets', amount: 980, type: 'expense', category: 'Entertainment', date: makeDate(11), paymentMethod: 'Debit Card', notes: 'Weekend 3D movie with snacks', isRecurring: false },
      { title: 'Netflix 4K Ultra Subscription', amount: 649, type: 'expense', category: 'Entertainment', date: makeDate(13), paymentMethod: 'Credit Card', notes: 'Monthly entertainment streaming', isRecurring: true },
      { title: 'Spotify Premium Family Plan', amount: 179, type: 'expense', category: 'Entertainment', date: makeDate(14), paymentMethod: 'Credit Card', notes: 'Audio subscription', isRecurring: true },
      { title: 'Nike Running Sneakers', amount: 5499, type: 'expense', category: 'Shopping', date: makeDate(15), paymentMethod: 'Credit Card', notes: 'Sale purchase for marathon training', isRecurring: false },
      { title: 'Ergonomic Desk Accessories', amount: 2200, type: 'expense', category: 'Shopping', date: makeDate(18), paymentMethod: 'UPI', notes: 'Monitor riser and cable organizers', isRecurring: false },
      { title: 'Health Insurance Premium', amount: 1800, type: 'expense', category: 'Healthcare', date: makeDate(19), paymentMethod: 'Net Banking', notes: 'Star Health monthly health cover', isRecurring: true },
      { title: 'Pharmacy & Multivitamins', amount: 1250, type: 'expense', category: 'Healthcare', date: makeDate(21), paymentMethod: 'UPI', notes: 'Supplements & prescription items', isRecurring: false },
      { title: 'AWS Cloud Hosting Fees', amount: 1420, type: 'expense', category: 'Education & Career', date: makeDate(23), paymentMethod: 'Credit Card', notes: 'EC2 & RDS backend dev servers', isRecurring: true },
      { title: 'Udemy Full Stack Masterclass', amount: 499, type: 'expense', category: 'Education & Career', date: makeDate(25), paymentMethod: 'UPI', notes: 'Advanced System Design course', isRecurring: false },
    ];

    sampleTx.forEach((tx) => {
      data.transactions.push({
        _id: uuidv4(),
        userId,
        ...tx,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });

    writeLocalData(data);
    return { budgetsAdded: sampleBudgets.length, transactionsAdded: sampleTx.length };
  },
};

module.exports = Storage;
