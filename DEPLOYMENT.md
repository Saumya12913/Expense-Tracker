# FinanceFlow — Deployment Guide

This project is configured for automated deployment using **GitHub Pages** (via GitHub Actions), **Render** (Full-Stack), and **Vercel**.

---

## 1. Automated Deployment via GitHub Pages (Recommended)

The repository includes a ready-to-use GitHub Actions workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

### Live Production URL:
👉 **`https://saumya12913.github.io/Expense-Tracker/`**

### Steps to activate GitHub Pages on your repository:
1. Open your repository on GitHub: **`https://github.com/Saumya12913/Expense-Tracker`**
2. Click on **Settings** (top tab).
3. In the left sidebar, click on **Pages** (under the "Code and automation" section).
4. Under **Build and deployment**:
   - **Source**: Select **GitHub Actions** from the dropdown menu.
5. Go to the **Actions** tab in your repository — you will see the **"Deploy FinanceFlow to GitHub Pages"** workflow automatically running.
6. Once the checkmark turns green (usually in 30–60 seconds), your application is live at:
   - **`https://saumya12913.github.io/Expense-Tracker/`**

---

## 2. Cloud Full-Stack Deployment via Render (Backend + Frontend)

A pre-configured [`render.yaml`](render.yaml) is included in the root directory.

1. Go to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** $\rightarrow$ **Blueprint**.
3. Connect your GitHub repository: `Saumya12913/Expense-Tracker`.
4. Render will automatically detect `render.yaml`, install dependencies, build the React frontend, and launch the Node.js Express server.
5. Your full-stack application will be live at `https://financeflow-tracker.onrender.com`.

---

## 3. Deployment via Vercel

A pre-configured [`vercel.json`](vercel.json) is included in the root directory.

1. Go to [Vercel](https://vercel.com/new).
2. Import repository: `Saumya12913/Expense-Tracker`.
3. Framework Preset: **Vite**.
4. Root Directory: `./` (or `frontend`).
5. Click **Deploy**.

---

## 4. Key Deployment Enhancements Added

- **Relative Asset Base (`base: './'`)**: In `frontend/vite.config.js`, ensuring all CSS, JS bundles, and WebM video assets resolve correctly under GitHub repository subpaths (`/Expense-Tracker/`).
- **Hybrid Client Fallback Engine**: In `frontend/src/services/api.js`, the frontend automatically detects whether a live backend is available. If running as a static site on GitHub Pages, it smoothly uses the embedded client storage engine in `localStorage` so that:
  - 1-Click Demo Login works immediately.
  - Adding, editing, and deleting transactions work with persistent storage.
  - Category budgets, 50/30/20 Wealth Framework, and Financial Health Score calculate dynamically.
  - Multilingual language switching (8 languages) is fully operational.
  - All real moving WebM video animations play continuously.
- **Continuous Deployment (CI/CD)**: Every `git push` to branch `main` automatically builds and updates the live site.
