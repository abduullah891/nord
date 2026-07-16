import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function RewardsTab() {
  const { points, setPoints } = useApp();
  const [redeemedCode, setRedeemedCode] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const nextTierPoints = 300;
  const progressPercent = Math.min((points / nextTierPoints) * 100, 100);

  const vouchers = [
    { id: 'free-shot', name: 'Extra Espresso Shot', cost: 40, desc: 'Add an extra kick of espresso to any custom drink.' },
    { id: 'free-croissant', name: 'Free Butter Croissant', cost: 100, desc: 'Freshly baked buttery goodness, perfect pairing for coffee.' },
    { id: 'discount-beans', name: '15% Off Coffee Beans', cost: 140, desc: 'Receive discount on a 250g bag of our signature roasts.' },
    { id: 'free-drip', name: 'Free Artisanal Hand-Drip', cost: 200, desc: 'Enjoy any single-origin pour over, prepared by our master baristas.' }
  ];

  const handleRedeem = (voucher) => {
    if (points >= voucher.cost) {
      setPoints(prev => prev - voucher.cost);
      const code = `SENJA-${Math.floor(100000 + Math.random() * 900000)}`;
      setRedeemedCode({ voucher, code });
      setErrorMsg('');
    } else {
      setErrorMsg(`You need ${voucher.cost - points} more points to redeem this voucher.`);
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  const getTier = (pts) => {
    if (pts >= 300) return 'Gold Member';
    if (pts >= 150) return 'Silver Member';
    return 'Bronze Member';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-4 font-vietnam">
      
      {/* Overview Block */}
      <section className="bg-surface-container rounded-2xl p-8 border border-outline-variant/10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Profile Circle & Points Balance */}
        <div className="space-y-4 text-center md:text-left flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined fill-icon text-sm">workspace_premium</span>
            <span>{getTier(points)}</span>
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary">{points}</h2>
            <p className="text-on-surface-variant font-medium text-sm mt-1">Available Loyalty Points</p>
          </div>
        </div>

        {/* Progress Circle & Meter */}
        <div className="flex-1 w-full max-w-xs space-y-3">
          <div className="flex justify-between items-center text-xs font-semibold text-primary">
            <span>Progress to Gold Tier</span>
            <span>{points}/{nextTierPoints} Points</span>
          </div>
          
          {/* Progress bar */}
          <div className="h-3 w-full bg-background rounded-full overflow-hidden border border-outline-variant/10">
            <div 
              className="h-full bg-secondary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-on-surface-variant text-center md:text-right">
            Unlock Gold Tier for free refills and double reward points!
          </p>
        </div>

      </section>

      {/* Redeemable Vouchers Section */}
      <section className="space-y-6">
        <div className="border-b border-outline-variant/20 pb-4">
          <h3 className="font-garamond text-2xl text-primary font-medium">Redeem Vouchers</h3>
          <p className="text-on-surface-variant text-sm mt-1">
            Exchange your coffee points for premium drinks, food, and merch.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm font-semibold flex items-center gap-2 animate-pulse">
            <span className="material-symbols-outlined">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vouchers.map((voucher) => (
            <div 
              key={voucher.id} 
              className="bg-surface-container-low rounded-xl border border-outline-variant/10 p-6 flex flex-col justify-between hover:shadow-xs transition-shadow"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-4">
                  <h4 className="font-bold text-primary text-base">{voucher.name}</h4>
                  <span className="bg-secondary text-on-secondary px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                    {voucher.cost} pts
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">{voucher.desc}</p>
              </div>

              <div className="pt-5 border-t border-outline-variant/5 mt-4">
                <button
                  onClick={() => handleRedeem(voucher)}
                  className={`cursor-pointer w-full py-2.5 rounded-lg font-bold text-sm btn-press transition-colors ${
                    points >= voucher.cost
                      ? 'bg-secondary text-on-secondary hover:bg-on-secondary-fixed-variant'
                      : 'bg-primary/5 text-on-surface-variant/40 cursor-not-allowed'
                  }`}
                >
                  {points >= voucher.cost ? 'Redeem Now' : 'Insufficient Points'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Redemption Code Modal Overlay */}
      {redeemedCode && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/45 backdrop-blur-xs" onClick={() => setRedeemedCode(null)} />
          
          <div className="relative w-full max-w-sm bg-background rounded-2xl shadow-2xl p-6 border border-outline-variant/25 text-center space-y-6 z-10 animate-scale-up">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center text-secondary mx-auto">
              <span className="material-symbols-outlined text-4xl fill-icon">qr_code</span>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-bold text-primary text-lg">Voucher Redeemed</h4>
              <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
                Present this code to the cashier to claim your <strong>{redeemedCode.voucher.name}</strong>.
              </p>
            </div>

            <div className="bg-surface-container rounded-xl p-4 font-mono font-bold text-secondary text-xl tracking-widest border border-outline-variant/10 select-all">
              {redeemedCode.code}
            </div>

            <button
              onClick={() => setRedeemedCode(null)}
              className="cursor-pointer w-full bg-secondary text-on-secondary py-3 rounded-lg font-bold btn-press hover:bg-on-secondary-fixed-variant transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
