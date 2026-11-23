const { getDBStatus } = require('../config/db');
const Transaction = require('../models/Transaction');
const Storage = require('../models/storageAdapter');

// @desc    Get all transactions with filtering, search, sorting & pagination
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const { isMongoConnected } = getDBStatus();
    const userId = req.user._id;

    const {
      type,
      category,
      startDate,
      endDate,
      search,
      isRecurring,
      sortBy = 'date',
      sortOrder = 'desc',
      page = 1,
      limit = 50,
    } = req.query;

    let transactions = [];

    if (isMongoConnected) {
      const query = { userId };
      if (type) query.type = type;
      if (category && category !== 'All') query.category = category;
      if (isRecurring !== undefined) query.isRecurring = isRecurring === 'true';

      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = startDate;
        if (endDate) query.date.$lte = endDate;
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { notes: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
        ];
      }

      const sort = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      const skip = (Number(page) - 1) * Number(limit);
      const total = await Transaction.countDocuments(query);
      transactions = await Transaction.find(query).sort(sort).skip(skip).limit(Number(limit));

      return res.json({
        success: true,
        count: transactions.length,
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        data: transactions,
      });
    } else {
      // Storage adapter
      const filter = {
        userId,
        ...(type && { type }),
        ...(category && category !== 'All' && { category }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(search && { search }),
        ...(isRecurring !== undefined && { isRecurring: isRecurring === 'true' }),
      };

      let list = await Storage.findTransactions(filter);

      // Sorting
      list.sort((a, b) => {
        if (sortBy === 'amount') {
          return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
        } else if (sortBy === 'title') {
          return sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
        } else {
          // date
          return sortOrder === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
        }
      });

      const total = list.length;
      const skip = (Number(page) - 1) * Number(limit);
      const paginated = list.slice(skip, skip + Number(limit));

      return res.json({
        success: true,
        count: paginated.length,
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)) || 1,
        data: paginated,
      });
    }
  } catch (error) {
    console.error('getTransactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve transactions: ' + error.message,
    });
  }
};

// @desc    Get single transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
const getTransactionById = async (req, res) => {
  try {
    const { isMongoConnected } = getDBStatus();
    const userId = req.user._id;
    const { id } = req.params;

    let transaction;
    if (isMongoConnected) {
      transaction = await Transaction.findOne({ _id: id, userId });
    } else {
      transaction = await Storage.findTransactionById(id, userId);
    }

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    res.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching transaction: ' + error.message,
    });
  }
};

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res) => {
  try {
    const {
      title,
      amount,
      type,
      category,
      date,
      paymentMethod,
      notes,
      isRecurring,
      recurrenceInterval,
      tags,
    } = req.body;

    if (!title || !amount || !type || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, amount, type, and category are required',
      });
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a valid positive number',
      });
    }

    const { isMongoConnected } = getDBStatus();
    const userId = req.user._id;

    const payload = {
      userId,
      title: title.trim(),
      amount: parseFloat(amount),
      type,
      category: category.trim(),
      date: date || new Date().toISOString().split('T')[0],
      paymentMethod: paymentMethod || 'UPI',
      notes: notes ? notes.trim() : '',
      isRecurring: Boolean(isRecurring),
      recurrenceInterval: recurrenceInterval || 'none',
      tags: Array.isArray(tags) ? tags : [],
    };

    let newTx;
    if (isMongoConnected) {
      newTx = await Transaction.create(payload);
    } else {
      newTx = await Storage.createTransaction(payload);
    }

    res.status(201).json({
      success: true,
      message: 'Transaction logged successfully',
      data: newTx,
    });
  } catch (error) {
    console.error('createTransaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record transaction: ' + error.message,
    });
  }
};

// @desc    Update an existing transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { isMongoConnected } = getDBStatus();

    let updated;
    if (isMongoConnected) {
      updated = await Transaction.findOneAndUpdate(
        { _id: id, userId },
        { ...req.body },
        { new: true, runValidators: true }
      );
    } else {
      updated = await Storage.updateTransaction(id, userId, req.body);
    }

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found or unauthorized to update',
      });
    }

    res.json({
      success: true,
      message: 'Transaction updated successfully',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating transaction: ' + error.message,
    });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { isMongoConnected } = getDBStatus();

    let deleted = false;
    if (isMongoConnected) {
      const resDel = await Transaction.findOneAndDelete({ _id: id, userId });
      deleted = !!resDel;
    } else {
      deleted = await Storage.deleteTransaction(id, userId);
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found or already deleted',
      });
    }

    res.json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting transaction: ' + error.message,
    });
  }
};

// @desc    Get high-level financial summary (Total Income, Total Expense, Net Balance)
// @route   GET /api/transactions/summary
// @access  Private
const getFinancialSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const { isMongoConnected } = getDBStatus();

    let all = [];
    if (isMongoConnected) {
      all = await Transaction.find({ userId });
    } else {
      all = await Storage.findTransactions({ userId });
    }

    let totalIncome = 0;
    let totalExpense = 0;

    all.forEach((t) => {
      if (t.type === 'income') {
        totalIncome += Number(t.amount);
      } else if (t.type === 'expense') {
        totalExpense += Number(t.amount);
      }
    });

    const netSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : 0;

    res.json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        netSavings,
        savingsRate: Number(savingsRate),
        transactionCount: all.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error computing financial summary: ' + error.message,
    });
  }
};

module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getFinancialSummary,
};
