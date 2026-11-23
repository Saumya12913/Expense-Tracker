const { getDBStatus } = require('../config/db');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Storage = require('../models/storageAdapter');

// Category classification for 50/30/20 Rule
const NEEDS_CATEGORIES = [
  'housing & rent',
  'rent',
  'groceries',
  'utilities & bills',
  'electricity',
  'water',
  'wifi',
  'transportation',
  'fuel',
  'healthcare',
  'medical',
  'insurance',
  'education & career',
];

const WANTS_CATEGORIES = [
  'food & dining',
  'dining',
  'entertainment',
  'movies',
  'shopping',
  'hobbies',
  'travel & vacations',
  'electronics',
  'personal care',
  'subscriptions',
];

// Helper to determine Month Name
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// @desc    Get comprehensive financial analytics & health score
// @route   GET /api/analytics/overview
// @access  Private
const getOverviewAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const { isMongoConnected } = getDBStatus();

    let allTransactions = [];
    let allBudgets = [];

    if (isMongoConnected) {
      allTransactions = await Transaction.find({ userId });
      allBudgets = await Budget.find({ userId });
    } else {
      allTransactions = await Storage.findTransactions({ userId });
      allBudgets = await Storage.findBudgets(userId);
    }

    // 1. Calculate Monthly Cash Flow for the last 6 months
    const now = new Date();
    const monthlyTrends = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const monthLabel = `${MONTH_NAMES[month - 1]} ${year.toString().slice(-2)}`;

      const monthStr = month < 10 ? `0${month}` : `${month}`;
      const prefix = `${year}-${monthStr}`;

      let income = 0;
      let expense = 0;

      allTransactions.forEach((t) => {
        if (t.date && t.date.startsWith(prefix)) {
          if (t.type === 'income') income += Number(t.amount);
          if (t.type === 'expense') expense += Number(t.amount);
        }
      });

      monthlyTrends.push({
        label: monthLabel,
        year,
        month,
        income,
        expense,
        netSavings: income - expense,
      });
    }

    // 2. Category-wise Expense Breakdown (Current Month or All-time)
    let totalExpenseAll = 0;
    let totalIncomeAll = 0;
    const expenseByCategoryMap = {};
    const incomeByCategoryMap = {};

    allTransactions.forEach((t) => {
      const amt = Number(t.amount);
      if (t.type === 'expense') {
        totalExpenseAll += amt;
        expenseByCategoryMap[t.category] = (expenseByCategoryMap[t.category] || 0) + amt;
      } else if (t.type === 'income') {
        totalIncomeAll += amt;
        incomeByCategoryMap[t.category] = (incomeByCategoryMap[t.category] || 0) + amt;
      }
    });

    const categoryColors = [
      '#6366f1', '#ec4899', '#f59e0b', '#10b981', '#06b6d4',
      '#8b5cf6', '#ef4444', '#14b8a6', '#f97316', '#64748b'
    ];

    const expenseCategories = Object.keys(expenseByCategoryMap).map((cat, idx) => ({
      category: cat,
      amount: expenseByCategoryMap[cat],
      percentage: totalExpenseAll > 0 ? Number(((expenseByCategoryMap[cat] / totalExpenseAll) * 100).toFixed(1)) : 0,
      color: categoryColors[idx % categoryColors.length],
    })).sort((a, b) => b.amount - a.amount);

    const incomeCategories = Object.keys(incomeByCategoryMap).map((cat, idx) => ({
      category: cat,
      amount: incomeByCategoryMap[cat],
      percentage: totalIncomeAll > 0 ? Number(((incomeByCategoryMap[cat] / totalIncomeAll) * 100).toFixed(1)) : 0,
      color: categoryColors[idx % categoryColors.length],
    })).sort((a, b) => b.amount - a.amount);

    // 3. 50/30/20 Budgeting Rule Calculation
    let needsTotal = 0;
    let wantsTotal = 0;

    allTransactions.filter((t) => t.type === 'expense').forEach((t) => {
      const catLower = t.category.toLowerCase();
      const isNeed = NEEDS_CATEGORIES.some((c) => catLower.includes(c));
      const isWant = WANTS_CATEGORIES.some((c) => catLower.includes(c));

      if (isNeed) {
        needsTotal += Number(t.amount);
      } else if (isWant) {
        wantsTotal += Number(t.amount);
      } else {
        // default split
        needsTotal += Number(t.amount) * 0.5;
        wantsTotal += Number(t.amount) * 0.5;
      }
    });

    const actualSavings = Math.max(0, totalIncomeAll - totalExpenseAll);
    const totalAllocated = needsTotal + wantsTotal + actualSavings;

    const budget503020 = {
      needs: {
        amount: Math.round(needsTotal),
        percentage: totalAllocated > 0 ? Number(((needsTotal / totalAllocated) * 100).toFixed(1)) : 50,
        targetPercentage: 50,
      },
      wants: {
        amount: Math.round(wantsTotal),
        percentage: totalAllocated > 0 ? Number(((wantsTotal / totalAllocated) * 100).toFixed(1)) : 30,
        targetPercentage: 30,
      },
      savings: {
        amount: Math.round(actualSavings),
        percentage: totalAllocated > 0 ? Number(((actualSavings / totalAllocated) * 100).toFixed(1)) : 20,
        targetPercentage: 20,
      },
    };

    // 4. Financial Health Score Algorithm (0-100)
    // Factor A: Savings Rate (0 - 40 points)
    const savingsRatio = totalIncomeAll > 0 ? (totalIncomeAll - totalExpenseAll) / totalIncomeAll : 0;
    let savingsScore = 0;
    if (savingsRatio >= 0.3) savingsScore = 40;
    else if (savingsRatio >= 0.2) savingsScore = 32;
    else if (savingsRatio >= 0.1) savingsScore = 24;
    else if (savingsRatio > 0) savingsScore = 15;
    else savingsScore = 5;

    // Factor B: Budget Discipline (0 - 30 points)
    let budgetScore = 25; // default positive baseline
    const exceededCount = allBudgets.filter((b) => {
      const catSpend = expenseByCategoryMap[b.category] || 0;
      return catSpend > b.limit;
    }).length;
    budgetScore = Math.max(5, budgetScore - exceededCount * 7);

    // Factor C: Cashflow Runway & Stability (0 - 30 points)
    const averageMonthlyExpense = (totalExpenseAll / 2) || 1;
    const runwayMonths = actualSavings / averageMonthlyExpense;
    let runwayScore = 15;
    if (runwayMonths >= 3) runwayScore = 30;
    else if (runwayMonths >= 1.5) runwayScore = 22;
    else if (runwayMonths >= 0.5) runwayScore = 15;
    else runwayScore = 8;

    const totalHealthScore = Math.min(100, Math.max(10, Math.round(savingsScore + budgetScore + runwayScore)));

    let healthRating = 'Good';
    let healthColor = '#10b981';
    if (totalHealthScore >= 85) {
      healthRating = 'Excellent';
      healthColor = '#10b981';
    } else if (totalHealthScore >= 70) {
      healthRating = 'Good';
      healthColor = '#6366f1';
    } else if (totalHealthScore >= 50) {
      healthRating = 'Fair';
      healthColor = '#f59e0b';
    } else {
      healthRating = 'Needs Attention';
      healthColor = '#ef4444';
    }

    // 5. Smart Financial Insights & Anomaly Detection
    const insights = [];

    if (savingsRatio >= 0.25) {
      insights.push({
        type: 'positive',
        title: 'Strong Savings Momentum',
        message: `You are saving ${(savingsRatio * 100).toFixed(0)}% of your total earnings, comfortably surpassing the 20% national recommendation!`,
      });
    } else if (savingsRatio < 0.1) {
      insights.push({
        type: 'warning',
        title: 'Low Savings Cushion',
        message: 'Your current savings rate is below 10%. Consider trimming discretionary entertainment or shopping to build emergency buffer.',
      });
    }

    if (exceededCount > 0) {
      insights.push({
        type: 'danger',
        title: 'Budget Alert',
        message: `You have ${exceededCount} category budget(s) that have exceeded their set spending caps this period.`,
      });
    }

    const highestExpense = expenseCategories[0];
    if (highestExpense) {
      insights.push({
        type: 'info',
        title: 'Top Expenditure Sector',
        message: `${highestExpense.category} represents your largest expense footprint at ${highestExpense.percentage}% of all outflows.`,
      });
    }

    // Recurring subscriptions check
    const recurringTxs = allTransactions.filter((t) => t.isRecurring && t.type === 'expense');
    const recurringMonthlyBurn = recurringTxs.reduce((sum, t) => sum + Number(t.amount), 0);
    if (recurringTxs.length > 0) {
      insights.push({
        type: 'info',
        title: 'Subscription & Recurring Commitments',
        message: `You maintain ${recurringTxs.length} active recurring commitments totaling ~₹${recurringMonthlyBurn.toLocaleString()}/month (₹${(recurringMonthlyBurn * 12).toLocaleString()}/year).`,
      });
    }

    res.json({
      success: true,
      data: {
        summary: {
          totalIncome: totalIncomeAll,
          totalExpense: totalExpenseAll,
          netSavings: totalIncomeAll - totalExpenseAll,
          savingsRate: totalIncomeAll > 0 ? Number(((totalIncomeAll - totalExpenseAll) / totalIncomeAll * 100).toFixed(1)) : 0,
        },
        financialHealth: {
          score: totalHealthScore,
          rating: healthRating,
          color: healthColor,
          breakdown: {
            savingsScore,
            budgetScore,
            runwayScore,
          },
        },
        budget503020,
        monthlyTrends,
        expenseCategories,
        incomeCategories,
        insights,
        recurringMonthlyBurn,
      },
    });
  } catch (error) {
    console.error('getOverviewAnalytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to compute analytics: ' + error.message,
    });
  }
};

module.exports = {
  getOverviewAnalytics,
};
