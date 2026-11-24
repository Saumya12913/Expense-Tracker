# FinanceFlow — Smart Expense & Wealth Intelligence Tracker
### Auspify Full Stack Development Internship | Task 3 (Medium)

[![Auspify Internship](https://img.shields.io/badge/Auspify-Task%203%20(Medium)-6366f1?style=for-the-badge&logo=react)](https://auspify.com)
[![MERN Stack](https://img.shields.io/badge/Stack-MERN%20(React%20%7C%20Node%20%7C%20Express%20%7C%20MongoDB)-10b981?style=for-the-badge)](https://nodejs.org)
[![Status](https://img.shields.io/badge/Status-100%25%20Completed-brightgreen?style=for-the-badge)](#)

FinanceFlow is a full-stack **MERN** web application developed for **Task 3 (Medium)** of the Auspify Technologies Full Stack Development Internship Program. It provides intelligent personal finance tracking, algorithmic financial health evaluation, automated category recognition, multi-currency conversion, and interactive visualizations.

---

LIVE DEPLOYED URL: https://saumya12913.github.io/Expense-Tracker/
## 🌟 Unique Placement & Standout Features

- 🧠 **Dynamic Financial Health Score (0–100)**: Proprietary algorithmic index calculating financial wellness based on savings rate (40 pts), budget compliance (30 pts), and cash runway (30 pts).
- 📊 **50/30/20 Budgeting Rule Engine**: Automatically groups expenses into **Needs (50%)**, **Wants (30%)**, and **Savings (20%)** and visualizes actual split versus the benchmark.
- ⚡ **Smart Auto-Categorization (NLP Keyword Engine)**: Automatically suggests category and transaction type as you type (e.g. typing *"Swiggy"* auto-selects *Food & Dining* and *Expense*).
- 🎯 **Category Spending Caps & Real-Time Alerts**: Progress bars with visual threshold alerts (<80% Safe, 80–99% Warning, ≥100% Exceeded) and celebratory confetti upon meeting targets.
- 🔄 **Subscription & Recurring Outflow Manager**: Tracks monthly streaming, rent, and utility commitments with automated annualized burn-rate forecasts.
- 🌐 **Live Multi-Currency Converter**: Instant real-time recalculation across **INR (₹)**, **USD ($)**, **EUR (€)**, **GBP (£)**, **JPY (¥)**, **CAD ($)**, and **AUD ($)**.
- 📑 **Export Statement Suite**: One-click download of auditable **CSV spreadsheets** and formatted **Print/PDF financial statements**.
- 🚀 **1-Click Demo Reviewer Login**: Pre-populates 60 days of rich, realistic financial data so evaluators can inspect every feature in seconds without signing up.
- 🛡️ **Dual-Mode Persistence Architecture**: Runs natively with **MongoDB (Mongoose)** and features an embedded persistent JSON engine fallback, ensuring zero environment crashes.

---

## 📂 Project Directory Structure

```
Expense/
├── backend/
│   ├── config/
│   │   └── db.js                 # Dual-mode MongoDB / Embedded fallback connection
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, demo login, seed data
│   │   ├── transactionController.js # CRUD, filtering, search, pagination, summary
│   │   ├── budgetController.js   # Monthly category caps & utilization calculation
│   │   └── analyticsController.js# Cashflow trends, 50/30/20 rule, health score
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT Bearer token validation
│   ├── models/
│   │   ├── User.js               # Mongoose User model with bcrypt pre-save hook
│   │   ├── Transaction.js        # Mongoose Transaction model with indexing
│   │   ├── Budget.js             # Mongoose Budget model with unique compound index
│   │   └── storageAdapter.js     # Embedded JSON database fallback engine
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   ├── transactionRoutes.js  # /api/transactions routes
│   │   ├── budgetRoutes.js       # /api/budgets routes
│   │   └── analyticsRoutes.js    # /api/analytics routes
│   ├── utils/
│   │   └── seedHelper.js         # Realistic starter dataset generator
│   ├── .env                      # Environment configuration
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Express server & static frontend serving
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Top header with currency switcher & quick add
│   │   │   ├── Sidebar.jsx       # Navigation tabs with Auspify status widget
│   │   │   ├── StatCard.jsx      # Metric card with dynamic borders & typography
│   │   │   ├── TransactionModal.jsx # Smart auto-categorizing entry modal
│   │   │   ├── BudgetModal.jsx   # Spending cap setter with color palette
│   │   │   ├── ExportModal.jsx   # CSV & Print statement generator
│   │   │   ├── AnalyticsCharts.jsx # Chart.js Cashflow & Category Doughnut charts
│   │   │   └── Toast.jsx         # Floating feedback notifications
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Centralized authentication state
│   │   │   └── ExpenseContext.jsx# Centralized financial data & actions
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx # Executive overview & quick metrics
│   │   │   ├── TransactionsPage.jsx # Full searchable ledger with filtering
│   │   │   ├── BudgetsPage.jsx   # Monthly category limits & status
│   │   │   ├── AnalyticsPage.jsx # 50/30/20 breakdown & health score
│   │   │   ├── SubscriptionsPage.jsx # Recurring bill audit & burn rate
│   │   │   ├── LoginPage.jsx     # Login with 1-click Demo Evaluator button
│   │   │   └── RegisterPage.jsx  # Account creation with currency choice
│   │   ├── utils/
│   │   │   └── currency.js       # Currencies, exchange rates & NLP dictionary
│   │   ├── App.jsx               # Main application router & layout
│   │   ├── index.css             # Dark Slate Fintech Design System
│   │   └── main.jsx              # React 18 root
│   ├── dist/                     # Production compiled frontend bundle
│   ├── package.json              # Frontend dependencies
│   └── vite.config.js            # Vite configuration with proxy to port 5000
├── docs/
│   ├── AUSPIFY_TASK3_SUBMISSION_REPORT.md # Official submission & compliance report
│   ├── PLACEMENT_INTERVIEW_GUIDE.md      # Placement Q&A, system design & pitch
│   └── API_DOCUMENTATION.md              # Complete REST endpoint specifications
├── package.json                  # Root runner script
└── README.md                     # Project documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18 or higher installed)
- **MongoDB** (Optional: application connects to MongoDB at `mongodb://127.0.0.1:27017` or automatically switches to the zero-config embedded storage engine)

### Option 1: Quick Start (Production Server + Built UI)
Run both the backend API and the compiled React frontend together on port 5000:
```bash
npm run server
```
Then open your browser at:
👉 **[http://localhost:5000](http://localhost:5000)**

### Option 2: Full Development Mode (Hot-Reloading)
Run backend and Vite dev server concurrently:
```bash
npm start
```
- Frontend (Vite Dev Server): **[http://localhost:5173](http://localhost:5173)**
- Backend REST API: **[http://localhost:5000](http://localhost:5000)**

---

## 🧪 Testing the Application (For Evaluators)

1. Open **[http://localhost:5000](http://localhost:5000)** in your web browser.
2. Click the **"1-Click Demo Login"** button on the login screen.
3. You will immediately access the dashboard pre-loaded with **23 transactions**, **6 category budgets**, cash flow charts, and a **Financial Health Score**.
4. Test key features:
   - Click **"+ Add Record"** and type *"Uber"* or *"Swiggy"* to watch the Smart Auto-Tagger detect the category.
   - Switch currency using the top-right currency dropdown (e.g. switch to USD `$` or EUR `€`).
   - Navigate to **"Budgets & Limits"** to see active utilization bars.
   - Click **"Export Financials"** in the sidebar to download an instant CSV report.

---

## 📚 Auspify Internship Submission Compliance

- **Task**: Task 3 (Medium) – Expense Tracker Web Application
- **Workflow**: 
  - Step 1: Design dashboard screens ✅
  - Step 2: Create expense management APIs ✅
  - Step 3: Store financial records in database ✅
  - Step 4: Display reports and summaries ✅
  - Step 5: Implement authentication ✅
- **Social / Showcase Hashtags**:  
  `#Auspify #AuspifyTechnologies #AuspifyInternship #AuspifyProjects`
- **Documentation**: See detailed report in [`docs/AUSPIFY_TASK3_SUBMISSION_REPORT.md`](file:///c:/Users/hp/OneDrive/Desktop/Expense/docs/AUSPIFY_TASK3_SUBMISSION_REPORT.md)
- **Placement Guide**: See interview cheat sheet in [`docs/PLACEMENT_INTERVIEW_GUIDE.md`](file:///c:/Users/hp/OneDrive/Desktop/Expense/docs/PLACEMENT_INTERVIEW_GUIDE.md)
