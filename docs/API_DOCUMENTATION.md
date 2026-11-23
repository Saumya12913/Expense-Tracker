# FinanceFlow REST API Documentation
### Auspify Full Stack Development Internship — Task 3 (Medium)

Base URL: `http://localhost:5000/api`

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 Register User
- **Method**: `POST`
- **Endpoint**: `/api/auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123!",
  "preferredCurrency": "INR"
}
```
- **Response** (201 Created):
```json
{
  "success": true,
  "message": "User registered successfully with starter financial portfolio",
  "data": {
    "_id": "6741b2e4f012a4b87c123456",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "preferredCurrency": "INR",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 1.2 Login User
- **Method**: `POST`
- **Endpoint**: `/api/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "jane@example.com",
  "password": "Password123!"
}
```

### 1.3 1-Click Demo / Evaluator Login
- **Method**: `POST`
- **Endpoint**: `/api/auth/demo`
- **Access**: Public
- **Description**: Pro-feature that logs in as a pre-configured Evaluator/Demo user with realistic 60-day historical data.

### 1.4 Get Current User Profile
- **Method**: `GET`
- **Endpoint**: `/api/auth/me`
- **Access**: Private (Bearer Token)

### 1.5 Seed / Reload Demo Data
- **Method**: `POST`
- **Endpoint**: `/api/auth/seed`
- **Access**: Private (Bearer Token)
- **Description**: Resets/reloads 23 transactions and 6 budget caps.

---

## 2. Transactions Endpoints (`/api/transactions`)

### 2.1 Get All Transactions
- **Method**: `GET`
- **Endpoint**: `/api/transactions`
- **Access**: Private
- **Query Parameters**:
  - `type`: `income` | `expense`
  - `category`: string (e.g. `Food & Dining`)
  - `search`: string (matches title, notes, category)
  - `startDate`: `YYYY-MM-DD`
  - `endDate`: `YYYY-MM-DD`
  - `isRecurring`: `true` | `false`
  - `sortBy`: `date` | `amount` | `title`
  - `sortOrder`: `desc` | `asc`
  - `page`: integer (default: 1)
  - `limit`: integer (default: 50)

### 2.2 Create Transaction
- **Method**: `POST`
- **Endpoint**: `/api/transactions`
- **Access**: Private
- **Request Body**:
```json
{
  "title": "Monthly Salary Credit",
  "amount": 85000,
  "type": "income",
  "category": "Salary",
  "date": "2026-11-20",
  "paymentMethod": "Bank Transfer",
  "notes": "Corporate tech salary",
  "isRecurring": true,
  "recurrenceInterval": "monthly"
}
```

### 2.3 Update Transaction
- **Method**: `PUT`
- **Endpoint**: `/api/transactions/:id`
- **Access**: Private

### 2.4 Delete Transaction
- **Method**: `DELETE`
- **Endpoint**: `/api/transactions/:id`
- **Access**: Private

### 2.5 Get Financial Summary
- **Method**: `GET`
- **Endpoint**: `/api/transactions/summary`
- **Access**: Private
- **Response**:
```json
{
  "success": true,
  "data": {
    "totalIncome": 203700,
    "totalExpense": 78906,
    "netSavings": 124794,
    "savingsRate": 61.3,
    "transactionCount": 23
  }
}
```

---

## 3. Budgets & Spending Caps (`/api/budgets`)

### 3.1 Get Monthly Budgets
- **Method**: `GET`
- **Endpoint**: `/api/budgets?month=11&year=2026`
- **Access**: Private
- **Description**: Returns all category budgets with real-time calculated actual expenditures, remaining limits, and alert status (`safe`, `warning`, `exceeded`).

### 3.2 Upsert Budget Target
- **Method**: `POST`
- **Endpoint**: `/api/budgets`
- **Access**: Private
- **Request Body**:
```json
{
  "category": "Food & Dining",
  "limit": 12000,
  "month": 11,
  "year": 2026,
  "color": "#f59e0b"
}
```

### 3.3 Delete Budget
- **Method**: `DELETE`
- **Endpoint**: `/api/budgets/:id`
- **Access**: Private

---

## 4. Analytics & AI Financial Health (`/api/analytics`)

### 4.1 Overview Analytics
- **Method**: `GET`
- **Endpoint**: `/api/analytics/overview`
- **Access**: Private
- **Returns**:
  - `financialHealth`: Score (0-100), rating (`Excellent`, `Good`, `Fair`, `Needs Attention`), and scoring breakdown.
  - `budget503020`: Breakdown into Needs (50%), Wants (30%), and Savings (20%).
  - `monthlyTrends`: Cashflow trends across the last 6 months.
  - `expenseCategories`: Category breakdown with percentages and hex colors.
  - `insights`: Algorithmic anomaly and financial wellness tips.
  - `recurringMonthlyBurn`: Total fixed subscription liabilities.

---

## 5. System Health Check (`/api/health`)
- **Method**: `GET`
- **Endpoint**: `/api/health`
- **Access**: Public
- **Returns server status, DB connection state, and uptime.**
