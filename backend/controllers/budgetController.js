const { getDBStatus } = require('../config/db');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const Storage = require('../models/storageAdapter');

// @desc    Get all budgets for current/selected month with actual spent calculation
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res) => {
  try {
    const userId = req.user._id;
    const { isMongoConnected } = getDBStatus();

    const now = new Date();
    const month = req.query.month ? Number(req.query.month) : now.getMonth() + 1;
    const year = req.query.year ? Number(req.query.year) : now.getFullYear();

    let budgets = [];
    let transactions = [];

    if (isMongoConnected) {
      budgets = await Budget.find({ userId, month, year });
      // Find all transactions for this month/year
      const monthStr = month < 10 ? `0${month}` : `${month}`;
      const start = `${year}-${monthStr}-01`;
      const end = `${year}-${monthStr}-31`;

      transactions = await Transaction.find({
        userId,
        type: 'expense',
        date: { $gte: start, $lte: end },
      });
    } else {
      budgets = await Storage.findBudgets(userId, month, year);
      const monthStr = month < 10 ? `0${month}` : `${month}`;
      const start = `${year}-${monthStr}-01`;
      const end = `${year}-${monthStr}-31`;

      transactions = await Storage.findTransactions({
        userId,
        type: 'expense',
        startDate: start,
        endDate: end,
      });
    }

    // Aggregate spend per category
    const categorySpend = {};
    transactions.forEach((tx) => {
      const cat = tx.category.trim();
      categorySpend[cat] = (categorySpend[cat] || 0) + Number(tx.amount);
    });

    let totalBudgeted = 0;
    let totalSpent = 0;

    const enrichedBudgets = budgets.map((b) => {
      const spent = categorySpend[b.category] || 0;
      const limit = Number(b.limit);
      const remaining = Math.max(0, limit - spent);
      const percentage = limit > 0 ? Math.min(200, Math.round((spent / limit) * 100)) : 0;

      totalBudgeted += limit;
      totalSpent += spent;

      let status = 'safe';
      if (percentage >= 100) status = 'exceeded';
      else if (percentage >= 80) status = 'warning';

      return {
        _id: b._id,
        category: b.category,
        limit,
        month: b.month,
        year: b.year,
        color: b.color || '#6366f1',
        spent,
        remaining,
        percentage,
        status,
      };
    });

    res.json({
      success: true,
      data: {
        month,
        year,
        totalBudgeted,
        totalSpent,
        overallPercentage: totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0,
        budgets: enrichedBudgets,
      },
    });
  } catch (error) {
    console.error('getBudgets error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve budgets: ' + error.message,
    });
  }
};

// @desc    Create or update category budget
// @route   POST /api/budgets
// @access  Private
const upsertBudget = async (req, res) => {
  try {
    const userId = req.user._id;
    const { isMongoConnected } = getDBStatus();
    const { category, limit, month, year, color } = req.body;

    if (!category || !limit) {
      return res.status(400).json({
        success: false,
        message: 'Category and monthly budget limit are required',
      });
    }

    const now = new Date();
    const budgetMonth = month ? Number(month) : now.getMonth() + 1;
    const budgetYear = year ? Number(year) : now.getFullYear();
    const budgetLimit = Number(limit);

    if (budgetLimit <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Budget limit must be greater than zero',
      });
    }

    let budget;
    if (isMongoConnected) {
      budget = await Budget.findOneAndUpdate(
        { userId, category: category.trim(), month: budgetMonth, year: budgetYear },
        { limit: budgetLimit, color: color || '#6366f1' },
        { new: true, upsert: true, runValidators: true }
      );
    } else {
      budget = await Storage.upsertBudget(userId, {
        category: category.trim(),
        limit: budgetLimit,
        month: budgetMonth,
        year: budgetYear,
        color: color || '#6366f1',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Budget set successfully',
      data: budget,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error saving budget: ' + error.message,
    });
  }
};

// @desc    Delete a budget target
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { isMongoConnected } = getDBStatus();

    let deleted = false;
    if (isMongoConnected) {
      const resDel = await Budget.findOneAndDelete({ _id: id, userId });
      deleted = !!resDel;
    } else {
      deleted = await Storage.deleteBudget(id, userId);
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found',
      });
    }

    res.json({
      success: true,
      message: 'Budget deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting budget: ' + error.message,
    });
  }
};

module.exports = {
  getBudgets,
  upsertBudget,
  deleteBudget,
};
