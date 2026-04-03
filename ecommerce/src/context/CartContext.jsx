import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { CartContext } from './cart-context';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, amount = 1) => {
    const quantityToAdd = Math.max(1, Number(amount));

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ?
            { ...item, quantity: item.quantity + quantityToAdd } :
            item
        );
      }

      return [...prevCart, { ...product, quantity: quantityToAdd }];
    });

    toast.success(`${quantityToAdd} x ${product.name} added!`);
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    toast.error('Item removed from cart');
  };

  const updateQty = (id, newQty) => {
    const qty = Number(newQty);
    if (qty < 1) return;

    setCart((prevCart) =>
      prevCart.map((item) => item.id === id ? { ...item, quantity: qty } : item)
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const subtotal = cart.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        subtotal,
        cartCount
      }}>

      {children}
    </CartContext.Provider>);

};
