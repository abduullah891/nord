import React from 'react';
import { useApp } from '../context/AppContext';

export default function OrdersTab() {
  const { orders } = useApp();

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      
      {/* Title */}
      <div className="border-b border-outline-variant/20 pb-4 text-center md:text-left">
        <h2 className="font-garamond text-3xl text-primary font-medium">Order History</h2>
        <p className="text-on-surface-variant font-vietnam text-sm mt-1">
          Keep track of your morning rituals and previous pickups.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-surface-container rounded-xl border border-outline-variant/10 space-y-4">
          <span className="material-symbols-outlined text-5xl text-outline-variant">receipt_long</span>
          <div>
            <p className="font-vietnam font-semibold text-primary text-lg">No orders yet</p>
            <p className="text-sm text-on-surface-variant mt-1">
              Your previous orders and active tickets will show up here.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="bg-surface-container-low rounded-xl border border-outline-variant/10 shadow-xs overflow-hidden"
            >
              
              {/* Order Header info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-surface-container border-b border-outline-variant/10 gap-3">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="font-vietnam font-bold text-primary">{order.id}</span>
                  <span className="text-xs text-on-surface-variant font-vietnam">{order.date}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Status chip */}
                  <span className={`px-3 py-1 rounded-full text-xs font-bold font-vietnam ${
                    order.status === 'Completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-amber-100 text-amber-800 animate-pulse'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Items list */}
              <div className="p-6 space-y-4">
                <div className="divide-y divide-outline-variant/10">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <span className="text-secondary font-bold text-sm bg-secondary/5 px-2 py-0.5 rounded">
                          {item.quantity}x
                        </span>
                        <span className="font-vietnam text-primary font-medium text-sm">
                          {item.name}
                        </span>
                      </div>
                      <span className="font-vietnam font-semibold text-on-surface-variant text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Footer Summary */}
                <div className="border-t border-outline-variant/10 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="text-xs text-on-surface-variant font-vietnam flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary fill-icon text-base">stars</span>
                    <span>Earned <strong className="text-secondary font-bold">+{order.pointsEarned}</strong> points</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-on-surface-variant font-vietnam">Paid Total:</span>
                    <span className="font-vietnam font-bold text-primary text-lg">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
