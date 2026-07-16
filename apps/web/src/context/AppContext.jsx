import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'orders' | 'rewards' | 'checkout'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]); // Cart starts empty for production
  const [cartOpen, setCartOpen] = useState(false);
  const [points, setPoints] = useState(0); // Starts with 0 points for production

  const [orders, setOrders] = useState(() => {
    // Clear legacy local storage values if they contain dummy data on first load
    const saved = localStorage.getItem('kopi_senja_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Filter out any mock order records from active local storage database
        const clean = parsed.filter(
          (order) => !['KS-1082', 'KS-1081', 'KS-1079', 'KS-8201', 'KS-7945'].includes(order.id)
        );
        return clean;
      } catch (e) {
        console.error('Failed to parse orders from localStorage', e);
      }
    }
    return []; // Starts empty for production
  });

  // Cumulative statistics for production KPIs
  const [completedRevenue, setCompletedRevenue] = useState(() => {
    const saved = localStorage.getItem('kopi_senja_revenue');
    if (saved) {
      const val = parseFloat(saved);
      // Clean up legacy dummy stats offset if present
      if (val === 1240.50) {
        localStorage.setItem('kopi_senja_revenue', '0');
        return 0;
      }
      return val;
    }
    return 0;
  });

  const [completedCustomers, setCompletedCustomers] = useState(() => {
    const saved = localStorage.getItem('kopi_senja_customers');
    if (saved) {
      const val = parseInt(saved, 10);
      // Clean up legacy dummy stats offset if present
      if (val === 1284) {
        localStorage.setItem('kopi_senja_customers', '0');
        return 0;
      }
      return val;
    }
    return 0;
  });

  // Save to localStorage whenever orders change
  useEffect(() => {
    localStorage.setItem('kopi_senja_orders', JSON.stringify(orders));
  }, [orders]);

  // Save statistics to localStorage
  useEffect(() => {
    localStorage.setItem('kopi_senja_revenue', completedRevenue.toString());
  }, [completedRevenue]);

  useEffect(() => {
    localStorage.setItem('kopi_senja_customers', completedCustomers.toString());
  }, [completedCustomers]);

  // Sync state across browser tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'kopi_senja_orders') {
        try {
          if (e.newValue) {
            const parsed = JSON.parse(e.newValue);
            const clean = parsed.filter(
              (order) => !['KS-1082', 'KS-1081', 'KS-1079', 'KS-8201', 'KS-7945'].includes(order.id)
            );
            setOrders(clean);
          } else {
            setOrders([]);
          }
        } catch (err) {
          console.error('Sync parsing failed', err);
        }
      } else if (e.key === 'kopi_senja_revenue') {
        if (e.newValue) setCompletedRevenue(parseFloat(e.newValue));
      } else if (e.key === 'kopi_senja_customers') {
        if (e.newValue) setCompletedCustomers(parseInt(e.newValue, 10));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { id: item.id, name: item.name, price: item.price, quantity: 1, image: item.image }];
    });
    setActiveTab('checkout'); // Navigate directly to checkout page
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map((cartItem) =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      }
      return prevCart.filter((cartItem) => cartItem.id !== itemId);
    });
  };

  const deleteFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((cartItem) => cartItem.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      deleteFromCart(itemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.id === itemId ? { ...cartItem, quantity } : cartItem
      )
    );
  };

  const checkout = (customerName, tableNumber) => {
    if (cart.length === 0) return false;

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const pointsEarned = Math.floor(total);

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder = {
      id: `KS-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customerName || 'Guest Customer',
      tableNumber: tableNumber ? `Table ${tableNumber}` : 'Takeaway',
      date: `Today, ${formattedTime}`,
      status: 'Pending', // Order starts as Pending in admin portal
      items: cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
      total: parseFloat((total * 1.08).toFixed(2)),
      pointsEarned
    };

    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    setPoints(prevPoints => prevPoints + pointsEarned);
    setCart([]);
    return true;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) => {
      const orderToProgress = prevOrders.find((order) => order.id === orderId);
      if (newStatus === 'Completed') {
        if (orderToProgress) {
          // Increment completed stats for KPIs
          setCompletedRevenue((prev) => prev + orderToProgress.total);
          setCompletedCustomers((prev) => prev + 1);
        }
        // Completed orders are deleted immediately
        return prevOrders.filter((order) => order.id !== orderId);
      }
      return prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AppContext.Provider value={{
      activeTab,
      setActiveTab,
      selectedCategory,
      setSelectedCategory,
      cart,
      addToCart,
      removeFromCart,
      deleteFromCart,
      updateQuantity,
      cartOpen,
      setCartOpen,
      points,
      orders,
      checkout,
      updateOrderStatus,
      cartCount,
      cartSubtotal,
      completedRevenue,
      completedCustomers
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
