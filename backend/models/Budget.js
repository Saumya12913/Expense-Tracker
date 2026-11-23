const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Please specify a budget category'],
      trim: true,
    },
    limit: {
      type: Number,
      required: [true, 'Please specify a monthly spending limit'],
      min: [1, 'Limit must be greater than zero'],
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      default: '#6366f1',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only have one budget per category per month/year
budgetSchema.index({ userId: 1, category: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.models.Budget || mongoose.model('Budget', budgetSchema);
