import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'orders' | 'rewards' | 'checkout'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]); // Cart starts empty for production
  const [cartOpen, setCartOpen] = useState(false);
  const [points, setPoints] = useState(0); // Starts with 0 points for production
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cumulative statistics for production KPIs
  const [completedRevenue, setCompletedRevenue] = useState(0);
  const [completedCustomers, setCompletedCustomers] = useState(0);

  // Fetch orders and menu from API
  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
      
      // Calculate completed stats
      const completedOrders = data.filter(order => order.status === 'Completed');
      const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
      setCompletedRevenue(totalRevenue);
      setCompletedCustomers(completedOrders.length);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      setMenuItems(data);
    } catch (err) {
      console.error('Failed to fetch menu', err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchMenuItems();
    setLoading(false);
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
      await fetch('/api/orders', {
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
      
      await fetchOrders(); // Refresh orders
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
      await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      await fetchOrders(); // Refresh orders
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
