import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function CartDrawer() {
  const { 
    cart, 
    cartOpen, 
    setCartOpen, 
    updateQuantity, 
    deleteFromCart, 
    cartSubtotal, 
    checkout,
    setActiveTab
  } = useApp();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [lastOrderId, setLastOrderId] = useState('');
  const [earnedPoints, setEarnedPoints] = useState(0);

  if (!cartOpen) return null;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    
    // Calculate values before clearing cart
    const points = Math.floor(cartSubtotal);
    
    setTimeout(() => {
      const success = checkout();
      setIsCheckingOut(false);
      if (success) {
        setCheckoutComplete(true);
        setEarnedPoints(points);
        // We'll generate a random-like ID for visual display
        setLastOrderId(`KS-${Math.floor(1000 + Math.random() * 9000)}`);
      }
    }, 1500);
  };

  const closeAndReset = () => {
    setCartOpen(false);
    // Add small delay to prevent layout flicker
    setTimeout(() => {
      setCheckoutComplete(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-primary/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeAndReset}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md h-full bg-background shadow-2xl flex flex-col z-10 transition-transform duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/20">
          <h2 className="font-display-lg text-title-lg text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">shopping_basket</span>
            Your Cart
          </h2>
          <button 
            onClick={closeAndReset}
            className="p-1 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {checkoutComplete ? (
            /* Checkout Success screen */
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
              <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-5xl fill-icon animate-pulse">check_circle</span>
              </div>
              <div className="space-y-2">
                <h3 className="font-display-lg text-headline-md text-primary">Order Placed!</h3>
                <p className="text-body-sm text-on-surface-variant max-w-xs mx-auto">
                  Your artisanal order is being carefully prepared by our barista.
                </p>
              </div>
              
              <div className="bg-surface-container rounded-xl p-4 w-full text-left space-y-2">
                <div className="flex justify-between text-body-sm">
                  <span className="text-on-surface-variant">Order Code:</span>
                  <span className="font-bold text-primary">{lastOrderId}</span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-on-surface-variant">Estimated Pickup:</span>
                  <span className="font-bold text-primary">10 - 15 mins</span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-on-surface-variant">Rewards Earned:</span>
                  <span className="font-bold text-secondary">+{earnedPoints} points</span>
                </div>
              </div>

              <div className="w-full space-y-3">
                <button
                  onClick={() => {
                    closeAndReset();
                    setActiveTab('orders');
                  }}
                  className="w-full bg-secondary text-on-secondary font-bold py-3.5 rounded-lg btn-press hover:bg-on-secondary-fixed-variant transition-colors cursor-pointer"
                >
                  Track Order
                </button>
                <button
                  onClick={closeAndReset}
                  className="w-full border border-outline-variant text-primary font-bold py-3 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Back to Menu
                </button>
              </div>
            </div>
          ) : cart.length === 0 ? (
            /* Empty Cart */
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <span className="material-symbols-outlined text-6xl text-outline-variant">coffee</span>
              <div>
                <p className="font-title-lg text-primary">Your cart is empty</p>
                <p className="text-body-sm text-on-surface-variant mt-1">
                  Explore our artisanal roasts and pastries to start your morning ritual.
                </p>
              </div>
              <button
                onClick={closeAndReset}
                className="bg-secondary text-on-secondary font-bold px-6 py-2.5 rounded-full btn-press hover:bg-on-secondary-fixed-variant transition-all cursor-pointer"
              >
                Explore Menu
              </button>
            </div>
          ) : (
            /* Cart Items List */
            <div className="space-y-4">
              {cart.map((item) => (
                <div 
                  key={item.id}
                  className="flex gap-4 p-3 bg-surface-container-low rounded-xl border border-outline-variant/10 hover:shadow-xs transition-shadow"
                >
                  {/* Item Image */}
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-title-lg text-body-lg text-primary line-clamp-1">{item.name}</h4>
                      <p className="text-secondary font-bold text-body-sm">${item.price.toFixed(2)}</p>
                    </div>
                    
                    {/* Quantity selectors */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-outline-variant/30 rounded-lg bg-background overflow-hidden">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="px-2.5 py-1 text-on-surface-variant hover:bg-surface-container transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <span className="px-3 font-semibold text-primary text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-on-surface-variant hover:bg-surface-container transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                      </div>
                      
                      {/* Delete button */}
                      <button
                        onClick={() => deleteFromCart(item.id)}
                        className="text-on-surface-variant hover:text-error transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions when cart has items */}
        {cart.length > 0 && !checkoutComplete && (
          <div className="p-6 border-t border-outline-variant/20 space-y-4 bg-background">
            <div className="space-y-1.5">
              <div className="flex justify-between text-body-sm text-on-surface-variant">
                <span>Subtotal</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-body-sm text-on-surface-variant">
                <span>Estimated Tax (8%)</span>
                <span>${(cartSubtotal * 0.08).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-title-lg font-bold border-t border-outline-variant/10 pt-2 text-primary">
                <span>Total</span>
                <span>${(cartSubtotal * 1.08).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className={`w-full bg-secondary text-on-secondary font-bold py-3.5 rounded-lg flex items-center justify-center space-x-2 btn-press transition-colors hover:bg-on-secondary-fixed-variant cursor-pointer ${
                isCheckingOut ? 'opacity-85 pointer-events-none' : ''
              }`}
            >
              {isCheckingOut ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Processing Ritual...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-xl">payments</span>
                  <span>Confirm and Order</span>
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
