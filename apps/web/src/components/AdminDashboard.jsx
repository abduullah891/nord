import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAntiInspect } from '../hooks/useAntiInspect';

export default function AdminDashboard() {
  useAntiInspect();
  const { orders, updateOrderStatus, completedRevenue, completedCustomers } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('orders'); // Admin sidebar active tab: 'orders' | 'menu' | 'staff' | 'analytics'
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);

  // All orders in the state are active (since they are deleted when Completed)
  const activeOrders = orders;

  const totalCustomers = completedCustomers;
  const totalRevenue = completedRevenue;
  const avgSpend = completedCustomers > 0 ? completedRevenue / completedCustomers : 0;

  const preparingCount = orders.filter(order => order.status === 'Preparing').length;
  const readyCount = orders.filter(order => order.status === 'Ready').length;

  // Filter history table rows based on search
  const filteredHistory = orders.filter(order => {
    const term = searchTerm.toLowerCase();
    return (
      order.customerName.toLowerCase().includes(term) ||
      order.tableNumber.toLowerCase().includes(term) ||
      order.id.toLowerCase().includes(term)
    );
  });

  // Calculate top active table
  const getTopTable = () => {
    if (orders.length === 0) return '#00';
    const counts = {};
    orders.forEach(o => {
      counts[o.tableNumber] = (counts[o.tableNumber] || 0) + 1;
    });
    let topTable = '#00';
    let maxCount = 0;
    Object.keys(counts).forEach(table => {
      if (counts[table] > maxCount && table !== 'Takeaway') {
        maxCount = counts[table];
        topTable = table.replace('Table ', '#');
      }
    });
    return topTable;
  };

  // Get initials for profile initials circle badge
  const getInitials = (name) => {
    if (!name) return 'GS';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Colors for initials circle based on initials character code
  const getAvatarBg = (initials) => {
    const code = initials.charCodeAt(0) + (initials.charCodeAt(1) || 0);
    const options = [
      'bg-primary-fixed text-primary',
      'bg-secondary-fixed text-on-secondary-fixed',
      'bg-tertiary-fixed text-on-tertiary-fixed',
      'bg-surface-container-highest text-primary'
    ];
    return options[code % options.length];
  };

  // Status progression action triggers
  const handleProgressStatus = (orderId, currentStatus) => {
    let nextStatus = '';
    if (currentStatus === 'Pending') nextStatus = 'Preparing';
    else if (currentStatus === 'Preparing') nextStatus = 'Ready';
    else if (currentStatus === 'Ready') nextStatus = 'Completed';
    
    if (nextStatus) {
      updateOrderStatus(orderId, nextStatus);
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-error-container text-on-error-container';
      case 'Preparing':
        return 'bg-secondary-fixed text-on-secondary-fixed-variant';
      case 'Ready':
        return 'bg-tertiary-fixed text-on-tertiary-fixed-variant';
      default:
        return 'bg-on-tertiary-fixed-variant/10 text-on-tertiary-fixed-variant';
    }
  };

  const handlePrintLog = () => {
    window.print();
  };

  const triggerPrintReceipt = () => {
    window.print();
  };

  const generatePDF = () => {
    const doc = new jsPDF({
      unit: 'mm',
      format: [80, 200]
    });

    const order = selectedReceiptOrder;
    let y = 10;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Kopi Senja', 40, y, { align: 'center' });

    y += 5;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Artisanal Coffee & Pastry', 40, y, { align: 'center' });

    y += 4;
    doc.text('Sunset Boulevard No. 64, Jakarta', 40, y, { align: 'center' });

    y += 4;
    doc.text('Telp: (021) 555-8940', 40, y, { align: 'center' });

    y += 6;
    doc.setLineWidth(0.1);
    doc.line(5, y, 75, y);

    y += 6;
    doc.setFontSize(7);
    doc.text(`ORDER ID: ${order.id}`, 5, y);
    y += 4;
    doc.text(`DATE: ${order.date}`, 5, y);
    y += 4;
    doc.text(`CUST NAME: ${order.customerName}`, 5, y);
    y += 4;
    doc.text(`TABLE ID: ${order.tableNumber}`, 5, y);
    y += 4;
    doc.text(`STATUS: ${order.status.toUpperCase()}`, 5, y);

    y += 6;
    doc.line(5, y, 75, y);

    y += 4;
    const tableData = order.items.map(item => [
      `${item.quantity}x ${item.name}`,
      `$${(item.price * item.quantity).toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: y,
      head: [],
      body: tableData,
      theme: 'plain',
      styles: {
        fontSize: 7,
        cellPadding: 1
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 20, halign: 'right' }
      },
      margin: { left: 5, right: 5 }
    });

    y = (doc.lastAutoTable.finalY || y) + 4;
    doc.line(5, y, 75, y);

    y += 4;
    const subtotal = order.total / 1.08;
    const tax = order.total - subtotal;
    doc.text('SUBTOTAL:', 5, y);
    doc.text(`$${subtotal.toFixed(2)}`, 75, y, { align: 'right' });
    y += 4;
    doc.text('TAX (8%):', 5, y);
    doc.text(`$${tax.toFixed(2)}`, 75, y, { align: 'right' });
    y += 4;
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', 5, y);
    doc.text(`$${order.total.toFixed(2)}`, 75, y, { align: 'right' });

    y += 6;
    doc.line(5, y, 75, y);

    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('THANK YOU FOR YOUR VISIT', 40, y, { align: 'center' });
    y += 3;
    doc.setFontSize(6);
    doc.text('Please come back again soon', 40, y, { align: 'center' });

    doc.save(`receipt-${order.id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-background font-vietnam text-on-background flex">
      {/* Sidebar Navigation */}
      <aside className="flex flex-col h-screen w-64 fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant/20 p-6 space-y-4 z-50">
        <div className="mb-8">
          <h1 className="font-display-lg text-secondary text-2xl font-bold tracking-tight mb-1">Kopi Senja</h1>
          <p className="font-label-caps text-[10px] text-on-surface-variant opacity-70 tracking-widest font-bold uppercase">
            Admin Portal
          </p>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all active:translate-x-1 ${
              activeTab === 'orders' 
                ? 'bg-secondary text-on-secondary shadow-md' 
                : 'text-on-surface-variant hover:bg-surface-variant/50'
            }`}
          >
            <span className="material-symbols-outlined fill-icon text-xl">dashboard</span>
            <span className="font-title-lg text-sm">Orders & Insights</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('menu')}
            className={`cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all active:translate-x-1 ${
              activeTab === 'menu' 
                ? 'bg-secondary text-on-secondary shadow-md' 
                : 'text-on-surface-variant hover:bg-surface-variant/50'
            }`}
          >
            <span className="material-symbols-outlined text-xl">restaurant_menu</span>
            <span className="font-title-lg text-sm">Menu Editor</span>
          </button>
        </nav>

        <div className="pt-6 border-t border-outline-variant/20 space-y-2">
          <a 
            href="/"
            className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-error-container/20 rounded-lg transition-all"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            <span className="font-title-lg text-sm">Logout</span>
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-12 min-h-screen">
        
        {/* Header Section */}
        <div className="max-w-container-max mx-auto mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-label-caps text-xs font-bold text-secondary mb-2 block uppercase tracking-widest">
              Panel Utama
            </span>
            <h2 className="font-garamond text-3xl text-primary font-bold">Dashboard Terpadu</h2>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-on-surface-variant font-medium">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">list_alt</span>
                <span>{activeOrders.length} Active Orders</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">payments</span>
                <span>${totalRevenue.toFixed(2)} Revenue</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">restaurant</span>
                <span>Top Table: {getTopTable()}</span>
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={handlePrintLog}
              className="cursor-pointer flex items-center gap-2 px-6 py-3 border-[1.5px] border-primary text-primary font-bold rounded-lg hover:bg-primary/5 transition-colors active:scale-95 text-sm"
            >
              <span className="material-symbols-outlined text-lg">print</span>
              <span>Print Log</span>
            </button>
            <button 
              onClick={() => window.open('/', '_blank')}
              className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-secondary text-on-secondary font-bold rounded-lg hover:opacity-90 transition-all active:scale-95 text-sm"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              <span>New Order</span>
            </button>
          </div>
        </div>

        {/* KPI Stats Grid */}
        <div className="max-w-container-max mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/10 shadow-xs flex flex-col justify-between">
            <p className="font-label-caps text-[10px] text-on-surface-variant opacity-70 font-bold uppercase tracking-wider">
              TOTAL CUSTOMERS
            </p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-2xl font-bold text-primary">{totalCustomers}</p>
              <span className="material-symbols-outlined text-secondary opacity-60 text-2xl">groups</span>
            </div>
          </div>

          <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/10 shadow-xs flex flex-col justify-between">
            <p className="font-label-caps text-[10px] text-on-surface-variant opacity-70 font-bold uppercase tracking-wider">
              AVG. SPEND
            </p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-2xl font-bold text-primary">${avgSpend.toFixed(2)}</p>
              <span className="material-symbols-outlined text-secondary opacity-60 text-2xl">payments</span>
            </div>
          </div>

          <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/10 shadow-xs flex flex-col justify-between">
            <p className="font-label-caps text-[10px] text-on-surface-variant opacity-70 font-bold uppercase tracking-wider">
              PREPARING
            </p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-2xl font-bold text-primary">{preparingCount}</p>
              <span className="material-symbols-outlined text-secondary opacity-60 text-2xl">soup_kitchen</span>
            </div>
          </div>

          <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/10 shadow-xs flex flex-col justify-between">
            <p className="font-label-caps text-[10px] text-on-surface-variant opacity-70 font-bold uppercase tracking-wider">
              READY TO SERVE
            </p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-2xl font-bold text-primary">{readyCount}</p>
              <span className="material-symbols-outlined text-secondary opacity-60 text-2xl">check_circle</span>
            </div>
          </div>
        </div>

        {/* active orders horizontal scroll */}
        <div className="max-w-container-max mx-auto mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-vietnam font-semibold text-primary flex items-center gap-2 text-lg">
              Pesanan Aktif
              <span className="bg-error-container text-on-error-container text-[10px] px-2.5 py-0.5 rounded-full font-bold animate-pulse">
                LIVE
              </span>
            </h3>
            <button className="text-sm text-secondary hover:underline font-bold">Lihat Semua</button>
          </div>

          {activeOrders.length === 0 ? (
            <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/15 text-center space-y-2 shadow-xs">
              <span className="material-symbols-outlined text-4xl text-outline-variant">coffee</span>
              <p className="font-vietnam font-medium text-primary text-sm">No active orders right now</p>
              <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
                Orders placed by customers from the menu checkout will appear here in real-time.
              </p>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
              {activeOrders.map((order) => (
                <div 
                  key={order.id} 
                  className="min-w-[280px] max-w-[280px] bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/20 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200 flex flex-col justify-between h-[190px]"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-primary font-bold text-sm">{order.id}</p>
                        <p className="text-xs text-on-surface-variant font-medium">{order.tableNumber}</p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${getStatusBadgeStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-1 mb-4 h-12 overflow-hidden text-xs">
                      {order.items.map((item, idx) => (
                        <p key={idx} className="text-on-surface font-medium truncate">
                          {item.quantity}x {item.name}
                        </p>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => handleProgressStatus(order.id, order.status)}
                    className="cursor-pointer w-full py-2 bg-secondary text-on-secondary text-xs font-bold rounded-lg hover:opacity-90 transition-all btn-press capitalize"
                  >
                    {order.status === 'Pending' ? 'Start Prep' : order.status === 'Preparing' ? 'Mark Ready' : 'Complete'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* customer list table */}
        <div className="max-w-container-max mx-auto bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-lg overflow-hidden mb-10">
          <div className="p-6 border-b border-outline-variant/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="font-vietnam font-semibold text-primary text-base">Data Pelanggan</h3>
            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-sm">
                search
              </span>
              <input 
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-full py-1.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-secondary/20 font-vietnam text-primary" 
                placeholder="Cari pelanggan atau meja..." 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-vietnam">
              <thead className="bg-surface-container-low border-b border-outline-variant/20">
                <tr>
                  <th className="px-6 py-4 font-label-caps text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 font-label-caps text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">
                    Table ID
                  </th>
                  <th className="px-6 py-4 font-label-caps text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 font-label-caps text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">
                    Total Spent
                  </th>
                  <th className="px-6 py-4 font-label-caps text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">
                    Visit Date
                  </th>
                  <th className="px-6 py-4 font-label-caps text-on-surface-variant text-[10px] uppercase font-bold tracking-wider text-right">
                    Action
                  </th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-outline-variant/5">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-sm text-on-surface-variant font-medium">
                      No active orders or matching records.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((order, index) => {
                    const initials = getInitials(order.customerName);
                    const email = `${order.customerName.toLowerCase().replace(/ /g, '.')}@example.com`;
                    const isActive = order.status !== 'Completed';

                    return (
                      <tr key={order.id + index} className="hover:bg-surface-container/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${getAvatarBg(initials)}`}>
                              {initials}
                            </div>
                            <div>
                              <p className="font-medium text-primary text-sm">{order.customerName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-secondary font-medium">
                          {order.tableNumber}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            isActive
                              ? 'bg-secondary-container/20 text-secondary'
                              : 'bg-on-tertiary-fixed-variant/10 text-on-tertiary-fixed-variant'
                          }`}>
                            {isActive ? 'Active' : 'Completed'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-primary">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-on-surface-variant font-semibold">
                            {order.date.includes(',') ? order.date.split(',')[0] : 'Today'}
                          </p>
                          <p className="text-[10px] text-on-surface-variant/60">
                            {order.date.includes(',') ? order.date.split(',')[1].trim() : order.date}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedReceiptOrder(order)}
                            className="cursor-pointer bg-primary/5 hover:bg-secondary/15 hover:text-secondary text-primary px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ml-auto active:scale-95"
                          >
                            <span className="material-symbols-outlined text-sm">receipt_long</span>
                            <span>Struk</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant/20 flex justify-between items-center">
            <p className="text-xs text-on-surface-variant">
              Showing {filteredHistory.length} of {orders.length} entries
            </p>
            <div className="flex gap-2">
              <button className="p-1 hover:bg-surface-variant/50 rounded-lg disabled:opacity-30" disabled>
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="p-1 hover:bg-surface-variant/50 rounded-lg">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

      </main>

      {/* Styled Thermal Receipt Modal */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop (hidden on print) */}
          <div 
            className="absolute inset-0 bg-primary/45 backdrop-blur-xs no-print" 
            onClick={() => setSelectedReceiptOrder(null)} 
          />

          <style dangerouslySetInnerHTML={{__html: `
            @media print {
              body * {
                visibility: hidden !important;
              }
              #print-receipt-modal, #print-receipt-modal * {
                visibility: visible !important;
              }
              #print-receipt-modal {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 10px !important;
                box-shadow: none !important;
                border: none !important;
                background: white !important;
                color: black !important;
              }
              .no-print {
                display: none !important;
              }
            }
          `}} />

          {/* Receipt Modal Content Container */}
          <div 
            id="print-receipt-modal" 
            className="relative w-full max-w-sm bg-white text-gray-800 rounded-xl shadow-2xl p-6 border border-gray-200 z-10 space-y-6 font-mono text-xs flex flex-col justify-between"
          >
            {/* Close Button (hidden on print) */}
            <button 
              onClick={() => setSelectedReceiptOrder(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 no-print cursor-pointer"
              aria-label="Close receipt"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            {/* Receipt Branding Header */}
            <div className="text-center space-y-1">
              <h4 className="font-garamond text-xl font-bold text-gray-900 tracking-tight">Kopi Senja</h4>
              <p className="text-[10px] text-gray-500">Artisanal Coffee & Pastry</p>
              <p className="text-[9px] text-gray-400">Sunset Boulevard No. 64, Jakarta</p>
              <p className="text-[9px] text-gray-400">Telp: (021) 555-8940</p>
            </div>

            {/* Separator */}
            <div className="border-t border-dashed border-gray-300 w-full my-2"></div>

            {/* Order Details Metadata */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>ORDER ID:</span>
                <span className="font-bold">{selectedReceiptOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span>DATE:</span>
                <span>{selectedReceiptOrder.date}</span>
              </div>
              <div className="flex justify-between">
                <span>CUST NAME:</span>
                <span className="font-bold truncate max-w-[150px]">{selectedReceiptOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>TABLE ID:</span>
                <span className="font-bold">{selectedReceiptOrder.tableNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>STATUS:</span>
                <span className="font-bold uppercase text-[9px]">{selectedReceiptOrder.status}</span>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-dashed border-gray-300 w-full my-2"></div>

            {/* Purchased items list */}
            <div className="space-y-2">
              {selectedReceiptOrder.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between font-bold">
                    <span>{item.name}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span>{item.quantity}x @ ${item.price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Separator */}
            <div className="border-t border-dashed border-gray-300 w-full my-2"></div>

            {/* Pricing Summary */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>SUBTOTAL:</span>
                <span>${(selectedReceiptOrder.total / 1.08).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>TAX (8%):</span>
                <span>${(selectedReceiptOrder.total - (selectedReceiptOrder.total / 1.08)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-dashed border-gray-300 pt-2 text-gray-900">
                <span>TOTAL:</span>
                <span>${selectedReceiptOrder.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Barcode & Closing Footer */}
            <div className="text-center space-y-3 pt-2">
              <div className="border-t border-dashed border-gray-300 w-full mb-3"></div>
              {/* Mock Barcode visual */}
              <div className="flex justify-center items-center gap-0.5 h-8 bg-gray-150 rounded px-4 mx-auto w-3/4">
                <span className="w-0.5 h-6 bg-gray-800"></span>
                <span className="w-1.5 h-6 bg-gray-800"></span>
                <span className="w-0.5 h-6 bg-gray-800"></span>
                <span className="w-1 h-6 bg-gray-800"></span>
                <span className="w-0.5 h-6 bg-gray-800"></span>
                <span className="w-2 h-6 bg-gray-800"></span>
                <span className="w-1 h-6 bg-gray-800"></span>
                <span className="w-0.5 h-6 bg-gray-800"></span>
                <span className="w-1.5 h-6 bg-gray-800"></span>
                <span className="w-0.5 h-6 bg-gray-800"></span>
              </div>
              <p className="text-[10px] font-bold text-gray-600">THANK YOU FOR YOUR VISIT</p>
              <p className="text-[8px] text-gray-400">Please come back again soon</p>
            </div>

            {/* Print Action Buttons (hidden on print) */}
            <div className="flex gap-2 pt-4 border-t border-gray-100 mt-2 no-print">
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="cursor-pointer flex-1 border border-gray-300 text-gray-600 font-bold py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-center text-xs"
              >
                Close
              </button>
              <button
                onClick={generatePDF}
                className="cursor-pointer flex-1 bg-primary text-on-primary font-bold py-2.5 rounded-lg hover:opacity-90 transition-colors flex items-center justify-center gap-1.5 text-xs text-center"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>PDF</span>
              </button>
              <button
                onClick={triggerPrintReceipt}
                className="cursor-pointer flex-1 bg-secondary text-on-secondary font-bold py-2.5 rounded-lg hover:opacity-90 transition-colors flex items-center justify-center gap-1.5 text-xs text-center"
              >
                <span className="material-symbols-outlined text-sm">print</span>
                <span>Print</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
