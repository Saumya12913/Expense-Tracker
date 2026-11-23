import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import BudgetsPage from './pages/BudgetsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import IntroPage from './pages/IntroPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TransactionModal from './components/TransactionModal';
import ExportModal from './components/ExportModal';
import Toast from './components/Toast';

const MainLayout = () => {
  const { isAuthenticated, initialCheckDone } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authView, setAuthView] = useState('intro'); // 'intro', 'login', or 'register'

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleOpenAdd = () => {
    setEditingTransaction(null);
    setIsAddModalOpen(true);
  };

  const handleEditTransaction = (tx) => {
    setEditingTransaction(tx);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingTransaction(null);
  };

  if (!initialCheckDone) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b0f19', color: '#94a3b8' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>FinanceFlow</div>
          <div>Initializing financial environment...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        {authView === 'intro' && (
          <IntroPage
            onNavigateToLogin={() => setAuthView('login')}
            onNavigateToRegister={() => setAuthView('register')}
          />
        )}
        {authView === 'login' && (
          <LoginPage
            onSwitchToRegister={() => setAuthView('register')}
            onSwitchToIntro={() => setAuthView('intro')}
          />
        )}
        {authView === 'register' && (
          <RegisterPage
            onSwitchToLogin={() => setAuthView('login')}
            onSwitchToIntro={() => setAuthView('intro')}
          />
        )}
        <Toast />
      </>
    );
  }

  return (
    <div className="app-container">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      <div className="main-content">
        <Navbar onOpenAddModal={handleOpenAdd} />

        {activeTab === 'dashboard' && (
          <DashboardPage
            onOpenAddModal={handleOpenAdd}
            setActiveTab={setActiveTab}
            onEditTransaction={handleEditTransaction}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsPage
            onOpenAddModal={handleOpenAdd}
            onEditTransaction={handleEditTransaction}
            onOpenExportModal={() => setIsExportModalOpen(true)}
          />
        )}

        {activeTab === 'budgets' && <BudgetsPage />}

        {activeTab === 'analytics' && <AnalyticsPage />}
      </div>

      {/* Global Modals */}
      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        initialData={editingTransaction}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      <Toast />
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ExpenseProvider>
          <MainLayout />
        </ExpenseProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
