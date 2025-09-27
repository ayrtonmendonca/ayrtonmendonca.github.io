
import React, { useState, useCallback, useMemo } from 'react';
import { Product, CartItem, View } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductList from './components/ProductList';
import CartView from './components/CartView';
import CheckoutView from './components/CheckoutView';
import ContactView from './components/ContactView';
import AboutView from './components/AboutView';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [cart, setCart] = useState<CartItem[]>([]);

  const handleAddToCart = useCallback((product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    alert(`${product.name} adicionado ao carrinho!`);
  }, []);

  const handleUpdateCartQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const handleRemoveFromCart = useCallback((productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  }, []);

  const handlePlaceOrder = useCallback(() => {
    alert('Pedido realizado com sucesso! Agradecemos a sua preferência.');
    setCart([]);
    setView('home');
  }, []);
  
  const cartItemCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const renderView = () => {
    switch (view) {
      case 'cart':
        return <CartView cart={cart} onUpdateQuantity={handleUpdateCartQuantity} onRemoveItem={handleRemoveFromCart} onNavigate={setView} />;
      case 'checkout':
        return <CheckoutView cart={cart} onPlaceOrder={handlePlaceOrder} />;
      case 'contact':
        return <ContactView />;
      case 'about':
        return <AboutView />;
      case 'home':
      default:
        return <ProductList onAddToCart={handleAddToCart} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header cartItemCount={cartItemCount} onNavigate={setView} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderView()}
      </main>
      <Footer />
    </div>
  );
};

export default App;