import React, { createContext, useContext, useState, useEffect } from 'react';
import { MENU_ITEMS } from '@kopi-senja/shared';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'orders' | 'rewards' | 'checkout'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]); // Cart starts empty for production
  const [cartOpen, setCartOpen] = useState(false);
  const [points, setPoints] = useState(0); // Starts with 0 points for production
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState(MENU_ITEMS); // Default to shared menu
  const [loading, setLoading] = useState(true);

  // Cumulative statistics for production KPIs
  const [completedRevenue, setCompletedRevenue] = useState(0);
  const [completedCustomers, setCompletedCustomers] = useState(0);

  // Fetch menu and orders from API
  const fetchData = async () => {
    try {
      // Try to fetch menu, if fails use default MENU_ITEMS
      try {
        const menuRes = await fetch('/.netlify/functions/menu');
        if (menuRes.ok) {
          const menuItemsData = await menuRes.json();
          if (menuItemsData && menuItemsData.length > 0) {
            setMenuItems(menuItemsData);
          }
        }
      } catch (menuErr) {
        console.warn('Failed to fetch menu, using default:', menuErr);
      }

      // Try to fetch orders
      try {
        const ordersRes = await fetch('/.netlify/functions/orders');
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData);
          
          // Calculate completed stats
          const completedOrders = ordersData.filter(order => order.status === 'Completed');
          const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
          setCompletedRevenue(totalRevenue);
          setCompletedCustomers(completedOrders.length);
        }
      } catch (ordersErr) {
        console.warn('Failed to fetch orders:', ordersErr);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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

  const checkout = async (customerName, tableNumber) => {
    if (cart.length === 0) return false;

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const pointsEarned = Math.floor(total);

    try {
      await fetch('/.netlify/functions/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName || 'Guest Customer',
          tableNumber: tableNumber ? `Table ${tableNumber}` : 'Takeaway',
          items: cart.map(item => ({ 
            name: item.name, 
            quantity: item.quantity, 
            price: item.price,
            menuItemId: item.id 
          })),
          total: parseFloat((total * 1.08).toFixed(2)),
        }),
      });
      
      await fetchData(); // Refresh orders
      setPoints(prevPoints => prevPoints + pointsEarned);
      setCart([]);
      return true;
    } catch (err) {
      console.error('Checkout failed', err);
      return false;
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await fetch(`/.netlify/functions/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      await fetchData(); // Refresh orders
    } catch (err) {
      console.error('Update order status failed', err);
    }
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
      menuItems,
      checkout,
      updateOrderStatus,
      cartCount,
      cartSubtotal,
      completedRevenue,
      completedCustomers,
      loading
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
