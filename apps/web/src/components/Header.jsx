import React from 'react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { activeTab, setActiveTab, cartCount, setCartOpen } = useApp();

  const navItems = [
    { id: 'menu', name: 'Menu' },
    { id: 'orders', name: 'Orders' },
    { id: 'rewards', name: 'Rewards' }
  ];

  return (
    <header className="w-full sticky top-0 bg-background/95 dark:bg-surface-container-low/95 backdrop-blur-md border-b border-outline-variant/10 shadow-sm z-50 transition-all duration-300">
      <div className="flex justify-between items-center px-4 md:px-margin-desktop py-4 max-w-container-max mx-auto">
        
        {/* Logo */}
        <button 
          onClick={() => setActiveTab('menu')}
          className="font-display-lg text-display-lg-mobile md:text-display-lg text-secondary hover:opacity-90 transition-opacity font-bold tracking-tight cursor-pointer"
        >
          Nord Cafe
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`cursor-pointer font-vietnam pb-1 transition-all duration-200 ${
                  activeTab === item.id || (item.id === 'orders' && activeTab === 'checkout')
                    ? 'text-secondary font-bold border-b-2 border-secondary'
                    : 'text-on-surface-variant font-medium hover:text-secondary'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <button 
              onClick={() => setActiveTab('checkout')}
              className="relative p-2 text-primary active:scale-95 transition-transform cursor-pointer"
              aria-label="Open Shopping Cart"
            >
              <span className="material-symbols-outlined text-2xl">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary-container text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
            
            {/* Profile Avatar */}
            <button 
              onClick={() => setActiveTab('rewards')}
              className="p-2 text-primary active:scale-95 transition-transform cursor-pointer"
              aria-label="User Profile"
            >
              <span className="material-symbols-outlined text-2xl">account_circle</span>
            </button>
          </div>
        </div>

        {/* Mobile Cart Option */}
        <div className="flex md:hidden items-center space-x-2">
          <button 
            onClick={() => setActiveTab('checkout')}
            className="relative p-2 text-primary active:scale-95 transition-transform cursor-pointer"
            aria-label="Open Shopping Cart"
          >
            <span className="material-symbols-outlined text-2xl">shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary-container text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
