const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a transaction description or title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Please add a valid positive transaction amount'],
      min: [0.01, 'Amount must be greater than zero'],
    },
    type: {
      type: String,
      required: [true, 'Please specify transaction type (income or expense)'],
      enum: ['income', 'expense'],
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      trim: true,
    },
    date: {
      type: String, // Stored in YYYY-MM-DD format for timezone neutrality
      required: [true, 'Please provide the transaction date'],
      default: () => new Date().toISOString().split('T')[0],
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'Credit Card', 'Debit Card', 'Cash', 'Net Banking', 'Bank Transfer', 'Crypto', 'Other'],
      default: 'UPI',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurrenceInterval: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly', 'none'],
      default: 'none',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
