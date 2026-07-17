import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import CartDrawer from './components/CartDrawer';
import MenuTab from './components/MenuTab';
import OrdersTab from './components/OrdersTab';
import RewardsTab from './components/RewardsTab';

import CheckoutTab from './components/CheckoutTab';
import AdminDashboard from './components/AdminDashboard';
import { useAntiInspect } from './hooks/useAntiInspect';

function AppContent() {
  useAntiInspect();
  const { activeTab, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <span className="material-symbols-outlined text-secondary text-6xl animate-spin">refresh</span>
          <p className="text-on-surface-variant font-vietnam">Loading...</p>
        </div>
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'menu':
        return <MenuTab />;
      case 'orders':
        return <OrdersTab />;
      case 'rewards':
        return <RewardsTab />;
      case 'checkout':
        return <CheckoutTab />;
      default:
        return <MenuTab />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col justify-between selection:bg-secondary/20 font-vietnam">
      <div>
        {/* Top Navbar */}
        <Header />
        
        {/* Main Content Area */}
        <main className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-8 md:py-16">
          {renderActiveTab()}
        </main>
      </div>

      {/* Cart Slider Drawer */}
      <CartDrawer />
    </div>
  );
}

export default function App() {
  // Debug: log pathname and token
  console.log('App.jsx: window.location.pathname', window.location.pathname);
  console.log('App.jsx: VITE_ADMIN_SECRET_TOKEN', import.meta.env.VITE_ADMIN_SECRET_TOKEN);
  
  const ADMIN_PATH = `/${import.meta.env.VITE_ADMIN_SECRET_TOKEN}`;
  const isAdmin = window.location.pathname === ADMIN_PATH; // Match exact path

  console.log('App.jsx: ADMIN_PATH', ADMIN_PATH);
  console.log('App.jsx: isAdmin', isAdmin);

  if (isAdmin) {
    return (
      <AppProvider>
        <AdminDashboard />
      </AppProvider>
    );
  }

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
