// Currency formats and conversion rates (base: INR)
export const CURRENCIES = {
  INR: { symbol: '₹', name: 'Indian Rupee (INR)', rate: 1.0 },
  USD: { symbol: '$', name: 'US Dollar (USD)', rate: 0.012 },
  EUR: { symbol: '€', name: 'Euro (EUR)', rate: 0.011 },
  GBP: { symbol: '£', name: 'British Pound (GBP)', rate: 0.0095 },
  JPY: { symbol: '¥', name: 'Japanese Yen (JPY)', rate: 1.8 },
  CAD: { symbol: 'C$', name: 'Canadian Dollar (CAD)', rate: 0.016 },
  AUD: { symbol: 'A$', name: 'Australian Dollar (AUD)', rate: 0.018 },
};

export const formatCurrency = (amountInINR, currencyCode = 'INR') => {
  const curr = CURRENCIES[currencyCode] || CURRENCIES.INR;
  const converted = (amountInINR || 0) * curr.rate;
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode,
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: curr.rate < 0.1 ? 2 : 0,
  }).format(converted);
};

// Smart Categorization Dictionary for Auto-Tagging
export const SMART_CATEGORIES = [
  {
    category: 'Food & Dining',
    type: 'expense',
    keywords: ['food', 'swiggy', 'zomato', 'restaurant', 'cafe', 'coffee', 'starbucks', 'dinner', 'lunch', 'breakfast', 'burger', 'pizza', 'groceries', 'supermarket', 'blinkit', 'zepto', 'instamart', 'snack', 'drink', 'beer', 'bar'],
  },
  {
    category: 'Housing & Rent',
    type: 'expense',
    keywords: ['rent', 'maintenance', 'housing', 'apartment', 'flat', 'landlord', 'furniture', 'plumber', 'repair'],
  },
  {
    category: 'Transportation',
    type: 'expense',
    keywords: ['uber', 'ola', 'rapido', 'metro', 'fuel', 'petrol', 'diesel', 'taxi', 'bus', 'train', 'flight', 'parking', 'toll', 'irctc'],
  },
  {
    category: 'Utilities & Bills',
    type: 'expense',
    keywords: ['electricity', 'water', 'wifi', 'internet', 'broadband', 'airtel', 'jio', 'recharge', 'mobile bill', 'gas', 'cylinder'],
  },
  {
    category: 'Entertainment',
    type: 'expense',
    keywords: ['netflix', 'spotify', 'movie', 'cinema', 'theatre', 'gaming', 'steam', 'playstation', 'concert', 'party', 'disney', 'prime'],
  },
  {
    category: 'Shopping',
    type: 'expense',
    keywords: ['amazon', 'flipkart', 'myntra', 'shoes', 'clothes', 'nike', 'zara', 'mall', 'electronics', 'watch', 'shopping', 'store'],
  },
  {
    category: 'Healthcare',
    type: 'expense',
    keywords: ['doctor', 'hospital', 'medicine', 'pharmacy', 'health', 'clinic', 'dentist', 'vitamins', 'lab test'],
  },
  {
    category: 'Education & Career',
    type: 'expense',
    keywords: ['udemy', 'coursera', 'course', 'books', 'tuition', 'aws', 'certification', 'training', 'college', 'school', 'seminar'],
  },
  {
    category: 'Salary',
    type: 'income',
    keywords: ['salary', 'stipend', 'payroll', 'wages', 'compensation', 'bonus'],
  },
  {
    category: 'Freelance',
    type: 'income',
    keywords: ['freelance', 'client', 'gig', 'upwork', 'fiverr', 'consultation', 'project payment'],
  },
  {
    category: 'Investments',
    type: 'income',
    keywords: ['dividend', 'stocks', 'mutual fund', 'crypto', 'interest', 'capital gains', 'returns', 'fd interest'],
  },
];

export const detectCategory = (title = '') => {
  if (!title) return null;
  const lower = title.toLowerCase();

  for (const item of SMART_CATEGORIES) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      return { category: item.category, type: item.type };
    }
  }
  return null;
};
