import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function CheckoutTab() {
  const { 
    cart, 
    updateQuantity, 
    deleteFromCart, 
    cartSubtotal, 
    checkout, 
    points, 
    setActiveTab 
  } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedTable, setConfirmedTable] = useState('');

  // Calculate dynamic preparation time based on items in cart
  const calculatePrepTime = () => {
    if (cart.length === 0) return '0 min';
    let hasCoffee = cart.some(item => item.id.includes('cappuccino') || item.id.includes('brew') || item.id.includes('white') || item.id.includes('latte') || item.id.includes('tea'));
    if (hasCoffee) return '8-12 min';
    return '3-5 min';
  };

  const handlePlaceOrder = () => {
    if (!customerName.trim() || !tableNumber.trim()) {
      alert('Please fill in your name and table number.');
      return;
    }

    setIsProcessing(true);
    setConfirmedTable(tableNumber);

    setTimeout(() => {
      const success = checkout(customerName, tableNumber);
      setIsProcessing(false);
      if (success) {
        setOrderConfirmed(true);
      }
    }, 1500);
  };

  const resetAfterSuccess = () => {
    setOrderConfirmed(false);
    setCustomerName('');
    setTableNumber('');
    setActiveTab('orders');
  };

  // If order is placed successfully, show the success state screen
  if (orderConfirmed) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-6 animate-fade-in font-vietnam">
        <div className="w-20 h-20 bg-tertiary-fixed text-secondary rounded-full flex items-center justify-center mx-auto shadow-md">
          <span className="material-symbols-outlined text-5xl fill-icon">check_circle</span>
        </div>
        <div className="space-y-2">
          <h2 className="font-garamond text-3xl text-primary font-bold">Order Confirmed!</h2>
          <p className="text-body-sm text-on-surface-variant max-w-sm mx-auto">
            Thank you, {customerName}! We will bring your artisanal coffee selection to table <strong className="text-secondary">{confirmedTable}</strong> shortly.
          </p>
        </div>
        <button
          onClick={resetAfterSuccess}
          className="cursor-pointer w-full bg-secondary text-on-secondary py-4 rounded-xl font-bold btn-press hover:bg-on-secondary-fixed-variant transition-colors"
        >
          Track My Order
        </button>
      </div>
    );
  }

  return (
    <div className="font-vietnam animate-fade-in">
      {/* Back button on mobile */}
      <div className="flex items-center gap-2 mb-6 md:hidden">
        <button 
          onClick={() => setActiveTab('menu')}
          className="text-primary flex items-center justify-center p-1"
          aria-label="Back to Menu"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <span className="font-bold text-primary">Back to Menu</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Order Summary & Item List */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-2">
            <span className="font-label-caps text-xs font-bold text-secondary uppercase tracking-widest block">
              Review Your Items
            </span>
            <h2 className="font-garamond text-3xl text-primary font-medium">Your Selection</h2>
          </div>

          {/* Order List */}
          <div className="space-y-4">
            {cart.length === 0 ? (
              <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/10 text-center space-y-4 shadow-sm">
                <span className="material-symbols-outlined text-5xl text-outline-variant">coffee</span>
                <div>
                  <h3 className="font-semibold text-primary">No items selected</h3>
                  <p className="text-sm text-on-surface-variant mt-1">
                    Your shopping cart is currently empty. Go back to the menu to add some delights!
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('menu')}
                  className="cursor-pointer bg-secondary text-on-secondary font-bold px-6 py-2 rounded-full hover:bg-on-secondary-fixed-variant transition-colors"
                >
                  View Menu
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 flex gap-6 items-center shadow-md hover:-translate-y-0.5 transition-transform duration-200"
                >
                  {/* Item Image */}
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-24 h-24 rounded-lg object-cover shrink-0"
                  />
                  
                  {/* Item Details */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-vietnam font-semibold text-primary text-base md:text-lg">
                          {item.name}
                        </h3>
                        <p className="text-xs text-on-surface-variant font-medium mt-1">
                          {item.id.includes('cappuccino') || item.id.includes('latte') || item.id.includes('white') 
                            ? 'Oat Milk, Extra Hot, Double Shot' 
                            : item.id.includes('croissant') 
                            ? 'Served Warm' 
                            : 'Standard Preparation'}
                        </p>
                      </div>
                      <span className="font-vietnam font-semibold text-secondary text-base md:text-lg">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {/* Quantity selectors & Remove */}
                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex items-center bg-surface-container-high rounded-full px-3 py-1 border border-outline-variant/20">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:text-secondary transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <span className="px-3 font-bold text-primary text-sm">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:text-secondary transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => deleteFromCart(item.id)}
                        className="text-on-surface-variant hover:text-error transition-colors font-semibold text-xs uppercase tracking-wider cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bento-style details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/20">
              <span className="font-label-caps text-xs font-bold text-on-tertiary-fixed-variant uppercase tracking-wider">
                Est. Preparation Time
              </span>
              <div className="flex items-center gap-2 mt-2">
                <span className="material-symbols-outlined text-secondary">schedule</span>
                <span className="font-garamond text-2xl text-primary font-medium">
                  {calculatePrepTime()}
                </span>
              </div>
            </div>
            
            <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/20">
              <span className="font-label-caps text-xs font-bold text-on-tertiary-fixed-variant uppercase tracking-wider">
                Current Rewards
              </span>
              <div className="flex items-center gap-2 mt-2">
                <span className="material-symbols-outlined text-secondary fill-icon">stars</span>
                <span className="font-garamond text-2xl text-primary font-medium">
                  {points} pts
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Details */}
        <div className="lg:col-span-5">
          <div className="bg-surface-container-high p-8 rounded-2xl sticky top-24 space-y-8 border border-outline-variant/20">
            <h2 className="font-garamond text-2xl md:text-3xl text-primary border-b border-outline-variant/20 pb-4 font-semibold">
              Checkout
            </h2>
            
            {/* Customer Information Inputs */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="font-label-caps text-xs font-bold text-on-surface-variant block uppercase tracking-wider" htmlFor="customer_name">
                  Customer Name
                </label>
                <input 
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-4 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all placeholder:text-outline-variant/60 font-vietnam text-primary shadow-inner" 
                  id="customer_name" 
                  placeholder="Enter your name" 
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="font-label-caps text-xs font-bold text-on-surface-variant block uppercase tracking-wider" htmlFor="table_number">
                  Table Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">
                    restaurant
                  </span>
                  <input 
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-4 pl-12 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all placeholder:text-outline-variant/60 font-vietnam text-primary shadow-inner" 
                    id="table_number" 
                    placeholder="00" 
                    type="number"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-center text-on-surface-variant text-sm">
                <span>Subtotal</span>
                <span className="font-semibold">${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant text-sm">
                <span>Tax (8%)</span>
                <span className="font-semibold">${(cartSubtotal * 0.08).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-outline-variant/30">
                <span className="font-vietnam font-semibold text-primary">Total Amount</span>
                <span className="font-garamond text-2xl font-bold text-secondary">
                  ${(cartSubtotal * 1.08).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button 
              onClick={handlePlaceOrder}
              disabled={isProcessing || cart.length === 0}
              className={`cursor-pointer w-full bg-secondary-container hover:bg-secondary text-white font-bold py-5 rounded-xl shadow-lg hover:shadow-xl active:translate-y-1 transition-all flex items-center justify-center gap-3 ${
                isProcessing ? 'opacity-85 pointer-events-none' : ''
              }`}
              id="place-order-btn"
            >
              {isProcessing ? (
                <>
                  <span className="animate-spin material-symbols-outlined">sync</span>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Place Order</span>
                  <span className="material-symbols-outlined">trending_flat</span>
                </>
              )}
            </button>
            <p className="text-center font-vietnam text-xs text-on-surface-variant opacity-70 leading-relaxed">
              By placing this order, you agree to our Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
