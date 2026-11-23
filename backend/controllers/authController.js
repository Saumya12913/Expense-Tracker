const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getDBStatus } = require('../config/db');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Storage = require('../models/storageAdapter');
const { getSampleDataset } = require('../utils/seedHelper');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'auspify_super_secret_jwt_key_2026_finflow_secure',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, preferredCurrency } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const { isMongoConnected } = getDBStatus();

    // Check if user already exists
    if (isMongoConnected) {
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists',
        });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        preferredCurrency: preferredCurrency || 'INR',
      });

      // Seed starter transactions and budgets into Mongo
      const { sampleBudgets, sampleTransactions } = getSampleDataset(user._id);
      await Budget.insertMany(sampleBudgets);
      await Transaction.insertMany(sampleTransactions);

      return res.status(201).json({
        success: true,
        message: 'User registered successfully with starter financial portfolio',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          preferredCurrency: user.preferredCurrency,
          monthlySavingsGoal: user.monthlySavingsGoal,
          token: generateToken(user._id),
        },
      });
    } else {
      // Local storage adapter
      const existing = await Storage.findUserByEmail(email);
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await Storage.createUser({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        preferredCurrency: preferredCurrency || 'INR',
        monthlySavingsGoal: 20000,
      });

      // Seed sample data for local storage
      await Storage.seedSampleData(newUser._id);

      return res.status(201).json({
        success: true,
        message: 'User registered successfully with initial starter data',
        data: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          preferredCurrency: newUser.preferredCurrency,
          monthlySavingsGoal: newUser.monthlySavingsGoal,
          token: generateToken(newUser._id),
        },
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration: ' + error.message,
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const { isMongoConnected } = getDBStatus();

    if (isMongoConnected) {
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      return res.json({
        success: true,
        message: 'Login successful',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          preferredCurrency: user.preferredCurrency,
          monthlySavingsGoal: user.monthlySavingsGoal,
          token: generateToken(user._id),
        },
      });
    } else {
      const user = await Storage.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      return res.json({
        success: true,
        message: 'Login successful',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          preferredCurrency: user.preferredCurrency,
          monthlySavingsGoal: user.monthlySavingsGoal,
          token: generateToken(user._id),
        },
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login: ' + error.message,
    });
  }
};

// @desc    Guest / Recruiter 1-Click Demo Login
// @route   POST /api/auth/demo
// @access  Public
const demoLogin = async (req, res) => {
  try {
    const demoEmail = 'demo.recruiter@auspify.com';
    const { isMongoConnected } = getDBStatus();

    if (isMongoConnected) {
      let user = await User.findOne({ email: demoEmail });
      if (!user) {
        user = await User.create({
          name: 'Demo Reviewer (Auspify)',
          email: demoEmail,
          password: 'Password123!',
          preferredCurrency: 'INR',
          monthlySavingsGoal: 25000,
        });
      }

      // Check if user has transactions in Mongo; if 0, seed them
      const txCount = await Transaction.countDocuments({ userId: user._id });
      if (txCount === 0) {
        const { sampleBudgets, sampleTransactions } = getSampleDataset(user._id);
        await Budget.deleteMany({ userId: user._id });
        await Budget.insertMany(sampleBudgets);
        await Transaction.insertMany(sampleTransactions);
      }

      return res.json({
        success: true,
        message: 'Logged in as Demo Reviewer',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          preferredCurrency: user.preferredCurrency,
          monthlySavingsGoal: user.monthlySavingsGoal,
          token: generateToken(user._id),
        },
      });
    } else {
      let user = await Storage.findUserByEmail(demoEmail);
      if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('DemoPass123!', salt);
        user = await Storage.createUser({
          name: 'Demo Reviewer (Auspify)',
          email: demoEmail,
          password: hashedPassword,
          preferredCurrency: 'INR',
          monthlySavingsGoal: 25000,
        });
        await Storage.seedSampleData(user._id);
      } else {
        const txs = await Storage.findTransactions({ userId: user._id });
        if (txs.length === 0) {
          await Storage.seedSampleData(user._id);
        }
      }

      return res.json({
        success: true,
        message: 'Logged in as Demo Reviewer',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          preferredCurrency: user.preferredCurrency,
          monthlySavingsGoal: user.monthlySavingsGoal,
          token: generateToken(user._id),
        },
      });
    }
  } catch (error) {
    console.error('Demo login error:', error);
    res.status(500).json({
      success: false,
      message: 'Demo login error: ' + error.message,
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
};

// @desc    Update user profile & preferences
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, preferredCurrency, monthlySavingsGoal } = req.body;
    const { isMongoConnected } = getDBStatus();

    if (isMongoConnected) {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      if (name) user.name = name;
      if (preferredCurrency) user.preferredCurrency = preferredCurrency;
      if (monthlySavingsGoal !== undefined) user.monthlySavingsGoal = Number(monthlySavingsGoal);

      await user.save();
      return res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          preferredCurrency: user.preferredCurrency,
          monthlySavingsGoal: user.monthlySavingsGoal,
        },
      });
    } else {
      const updated = await Storage.updateUser(req.user._id, {
        ...(name && { name }),
        ...(preferredCurrency && { preferredCurrency }),
        ...(monthlySavingsGoal !== undefined && { monthlySavingsGoal: Number(monthlySavingsGoal) }),
      });

      return res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          _id: updated._id,
          name: updated.name,
          email: updated.email,
          preferredCurrency: updated.preferredCurrency,
          monthlySavingsGoal: updated.monthlySavingsGoal,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile: ' + error.message,
    });
  }
};

// @desc    Reset / Seed Sample Data for Current User
// @route   POST /api/auth/seed
// @access  Private
const seedData = async (req, res) => {
  try {
    const { isMongoConnected } = getDBStatus();
    const userId = req.user._id;

    if (isMongoConnected) {
      const { sampleBudgets, sampleTransactions } = getSampleDataset(userId);
      await Transaction.deleteMany({ userId });
      await Budget.deleteMany({ userId });
      await Budget.insertMany(sampleBudgets);
      await Transaction.insertMany(sampleTransactions);

      return res.json({
        success: true,
        message: `Successfully populated ${sampleTransactions.length} transactions and ${sampleBudgets.length} budgets in MongoDB!`,
      });
    } else {
      const result = await Storage.seedSampleData(userId);
      return res.json({
        success: true,
        message: `Successfully loaded ${result.transactionsAdded} realistic transactions and ${result.budgetsAdded} budget targets!`,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error seeding data: ' + error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  demoLogin,
  getMe,
  updateProfile,
  seedData,
};
