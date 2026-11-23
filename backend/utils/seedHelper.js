const { v4: uuidv4 } = require('uuid');

const makeDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

const getSampleDataset = (userId) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const sampleBudgets = [
    { userId, category: 'Food & Dining', limit: 12000, month: currentMonth, year: currentYear, color: '#f59e0b' },
    { userId, category: 'Housing & Rent', limit: 25000, month: currentMonth, year: currentYear, color: '#3b82f6' },
    { userId, category: 'Transportation', limit: 6000, month: currentMonth, year: currentYear, color: '#06b6d4' },
    { userId, category: 'Entertainment', limit: 5000, month: currentMonth, year: currentYear, color: '#ec4899' },
    { userId, category: 'Shopping', limit: 8000, month: currentMonth, year: currentYear, color: '#8b5cf6' },
    { userId, category: 'Utilities & Bills', limit: 4500, month: currentMonth, year: currentYear, color: '#10b981' },
  ];

  const sampleTransactions = [
    // Income
    { userId, title: 'Monthly Salary Credit', amount: 85000, type: 'income', category: 'Salary', date: makeDate(2), paymentMethod: 'Bank Transfer', notes: 'Monthly corporate tech stipend & salary', isRecurring: true },
    { userId, title: 'Freelance Web Design', amount: 18500, type: 'income', category: 'Freelance', date: makeDate(12), paymentMethod: 'UPI', notes: 'Client React landing page project', isRecurring: false },
    { userId, title: 'Mutual Fund Dividend', amount: 3200, type: 'income', category: 'Investments', date: makeDate(22), paymentMethod: 'Bank Transfer', notes: 'Nifty 50 Index fund quarterly payout', isRecurring: false },
    { userId, title: 'Previous Month Salary', amount: 85000, type: 'income', category: 'Salary', date: makeDate(32), paymentMethod: 'Bank Transfer', notes: 'Primary monthly employment income', isRecurring: true },
    { userId, title: 'Tech Consultation Gig', amount: 12000, type: 'income', category: 'Freelance', date: makeDate(42), paymentMethod: 'UPI', notes: 'MERN stack architecture review', isRecurring: false },

    // Expenses - Essential Needs
    { userId, title: 'Apartment Monthly Rent', amount: 24000, type: 'expense', category: 'Housing & Rent', date: makeDate(3), paymentMethod: 'Net Banking', notes: '2BHK Apartment rent', isRecurring: true },
    { userId, title: 'Previous Month Apartment Rent', amount: 24000, type: 'expense', category: 'Housing & Rent', date: makeDate(33), paymentMethod: 'Net Banking', notes: '2BHK Apartment rent', isRecurring: true },
    { userId, title: 'Supermarket Grocery Run', amount: 4850, type: 'expense', category: 'Food & Dining', date: makeDate(4), paymentMethod: 'Credit Card', notes: 'Vegetables, pantry essentials, dairy', isRecurring: false },
    { userId, title: 'High-speed Fiber Broadband', amount: 1180, type: 'expense', category: 'Utilities & Bills', date: makeDate(5), paymentMethod: 'UPI', notes: 'Airtel Xstream 300Mbps fiber', isRecurring: true },
    { userId, title: 'Electricity & Water Bill', amount: 2450, type: 'expense', category: 'Utilities & Bills', date: makeDate(7), paymentMethod: 'Net Banking', notes: 'Monthly utility billing', isRecurring: true },
    { userId, title: 'Fuel - Car Tank Full', amount: 3200, type: 'expense', category: 'Transportation', date: makeDate(6), paymentMethod: 'Credit Card', notes: 'Shell Premium Petrol', isRecurring: false },
    { userId, title: 'Metro Smart Card Recharge', amount: 800, type: 'expense', category: 'Transportation', date: makeDate(9), paymentMethod: 'UPI', notes: 'Weekly metro travel', isRecurring: false },

    // Expenses - Lifestyle Wants
    { userId, title: 'Weekend Dinner with Friends', amount: 3400, type: 'expense', category: 'Food & Dining', date: makeDate(8), paymentMethod: 'Credit Card', notes: 'Italian restaurant dinner', isRecurring: false },
    { userId, title: 'Artisan Coffee & Bakery', amount: 550, type: 'expense', category: 'Food & Dining', date: makeDate(10), paymentMethod: 'UPI', notes: 'Blue Tokai cold brew and croissant', isRecurring: false },
    { userId, title: 'IMAX Movie Tickets', amount: 980, type: 'expense', category: 'Entertainment', date: makeDate(11), paymentMethod: 'Debit Card', notes: 'Weekend 3D movie with snacks', isRecurring: false },
    { userId, title: 'Netflix 4K Ultra Subscription', amount: 649, type: 'expense', category: 'Entertainment', date: makeDate(13), paymentMethod: 'Credit Card', notes: 'Monthly entertainment streaming', isRecurring: true },
    { userId, title: 'Spotify Premium Family Plan', amount: 179, type: 'expense', category: 'Entertainment', date: makeDate(14), paymentMethod: 'Credit Card', notes: 'Audio subscription', isRecurring: true },
    { userId, title: 'Nike Running Sneakers', amount: 5499, type: 'expense', category: 'Shopping', date: makeDate(15), paymentMethod: 'Credit Card', notes: 'Sale purchase for marathon training', isRecurring: false },
    { userId, title: 'Ergonomic Desk Accessories', amount: 2200, type: 'expense', category: 'Shopping', date: makeDate(18), paymentMethod: 'UPI', notes: 'Monitor riser and cable organizers', isRecurring: false },
    { userId, title: 'Health Insurance Premium', amount: 1800, type: 'expense', category: 'Healthcare', date: makeDate(19), paymentMethod: 'Net Banking', notes: 'Star Health monthly health cover', isRecurring: true },
    { userId, title: 'Pharmacy & Multivitamins', amount: 1250, type: 'expense', category: 'Healthcare', date: makeDate(21), paymentMethod: 'UPI', notes: 'Supplements & prescription items', isRecurring: false },
    { userId, title: 'AWS Cloud Hosting Fees', amount: 1420, type: 'expense', category: 'Education & Career', date: makeDate(23), paymentMethod: 'Credit Card', notes: 'EC2 & RDS backend dev servers', isRecurring: true },
    { userId, title: 'Udemy Full Stack Masterclass', amount: 499, type: 'expense', category: 'Education & Career', date: makeDate(25), paymentMethod: 'UPI', notes: 'Advanced System Design course', isRecurring: false },
  ];

  return { sampleBudgets, sampleTransactions };
};

module.exports = { getSampleDataset };
