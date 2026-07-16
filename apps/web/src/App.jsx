import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import CartDrawer from './components/CartDrawer';
import MenuTab from './components/MenuTab';
import OrdersTab from './components/OrdersTab';
import RewardsTab from './components/RewardsTab';
import BottomNavBar from './components/BottomNavBar';
import Footer from './components/Footer';

import CheckoutTab from './components/CheckoutTab';
import AdminDashboard from './components/AdminDashboard';

function AppContent() {
  const { activeTab } = useApp();

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
        <main className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-8 md:py-16 pb-28 md:pb-16">
          {renderActiveTab()}
        </main>
      </div>

      {/* Cart Slider Drawer */}
      <CartDrawer />

      {/* Bottom Navbar (Mobile Only) */}
      <BottomNavBar />

      {/* Footer (Desktop Only) */}
      <Footer />
    </div>
  );
}

export default function App() {
  const ADMIN_PATH = `/${import.meta.env.VITE_ADMIN_SECRET_TOKEN}`;
  const isAdmin = window.location.pathname.startsWith(ADMIN_PATH);

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
