import React from 'react';
import { useApp } from '../context/AppContext';

export default function BottomNavBar() {
  const { activeTab, setActiveTab } = useApp();

  const navItems = [
    { id: 'menu', name: 'Menu', icon: 'local_cafe' },
    { id: 'orders', name: 'Orders', icon: 'list_alt' },
    { id: 'rewards', name: 'Rewards', icon: 'stars' }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 py-3 pb-safe bg-surface dark:bg-surface-container-high shadow-[0_-4px_12px_rgba(75,54,33,0.08)] border-t border-outline-variant/10 rounded-t-xl">
      {navItems.map((item) => {
        const isActive = activeTab === item.id || (item.id === 'orders' && activeTab === 'checkout');
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`cursor-pointer flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all duration-200 active:scale-90 ${
              isActive 
                ? 'text-secondary font-bold bg-secondary-container/20' 
                : 'text-on-surface-variant hover:bg-surface-variant/30'
            }`}
          >
            <span className={`material-symbols-outlined text-2xl ${isActive ? 'fill-icon' : ''}`}>
              {item.icon}
            </span>
            <span className="font-vietnam text-[10px] font-bold tracking-wider mt-1">
              {item.name}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
