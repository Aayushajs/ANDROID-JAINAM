import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product, selectedUnit, quantity = 1) => {
    // Check if already in cart (by id and unit)
    const idx = cart.findIndex(
      item => item.id === product.id && item.selectedUnit === selectedUnit
    );
    if (idx > -1) {
      // Update quantity
      const updated = [...cart];
      updated[idx].quantity += quantity;
      setCart(updated);
    } else {
      setCart([...cart, { ...product, selectedUnit, quantity }]);
    }
  };

  const removeFromCart = (id, selectedUnit) => {
    setCart(cart.filter(item => !(item.id === id && item.selectedUnit === selectedUnit)));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
