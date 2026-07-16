import React from 'react';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const { setActiveTab } = useApp();

  return (
    <footer className="hidden md:block bg-surface-container-low border-t border-outline-variant/20 py-16 mt-20">
      <div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-4 gap-12 font-vietnam">
        
        {/* Info Column */}
        <div className="col-span-2 space-y-6">
          <button 
            onClick={() => setActiveTab('menu')}
            className="font-display-lg text-headline-md text-secondary font-bold tracking-tight text-left cursor-pointer"
          >
            Kopi Senja
          </button>
          <p className="text-on-surface-variant max-w-sm text-sm leading-relaxed">
            Crafting moments of peace in the heart of the city. Join our community of coffee lovers.
          </p>
          <div className="flex space-x-4">
            <a 
              className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary hover:bg-secondary hover:text-white transition-all" 
              href="#"
              aria-label="Email support"
            >
              <span className="material-symbols-outlined text-xl">alternate_email</span>
            </a>
            <a 
              className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary hover:bg-secondary hover:text-white transition-all" 
              href="#"
              aria-label="Share page"
            >
              <span className="material-symbols-outlined text-xl">share</span>
            </a>
          </div>
        </div>

        {/* Explore Links */}
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-primary mb-6">Explore</h5>
          <ul className="space-y-4 text-on-surface-variant font-semibold text-sm">
            <li><a className="hover:text-secondary transition-colors" href="#">Our Story</a></li>
            <li><a className="hover:text-secondary transition-colors" href="#">Sustainability</a></li>
            <li><a className="hover:text-secondary transition-colors" href="#">Locations</a></li>
            <li><a className="hover:text-secondary transition-colors" href="#">Careers</a></li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-primary mb-6">Support</h5>
          <ul className="space-y-4 text-on-surface-variant font-semibold text-sm">
            <li><a className="hover:text-secondary transition-colors" href="#">Help Center</a></li>
            <li><a className="hover:text-secondary transition-colors" href="#">Privacy Policy</a></li>
            <li><a className="hover:text-secondary transition-colors" href="#">Terms of Use</a></li>
            <li><a className="hover:text-secondary transition-colors" href="#">Cookie Settings</a></li>
          </ul>
        </div>

      </div>

      <div className="max-w-container-max mx-auto px-margin-desktop mt-16 pt-8 border-t border-outline-variant/10 text-center">
        <p className="text-[10px] font-bold uppercase tracking-wider text-outline">
          © 2026 Kopi Senja Coffee House. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
