
import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Product, CartItem } from './types';
import { CONTACT_EMAIL, CONTACT_PHONE } from './constants';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductList from './components/ProductList';
import ContactView from './components/ContactView';
import AboutView from './components/AboutView';
import ClientsView from './components/ClientsView';
import CartSidebar from './components/CartSidebar';
import CheckoutForm from './components/CheckoutForm';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutFormVisible, setCheckoutFormVisible] = useState(false);

  const homeRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const clientsRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const handleNavigate = useCallback((sectionId: string) => {
    let ref;
    switch (sectionId) {
      case 'home':
        ref = homeRef;
        break;
      case 'about':
        ref = aboutRef;
        break;
      case 'clients':
        ref = clientsRef;
        break;
      case 'contact':
        ref = contactRef;
        break;
      default:
        break;
    }
    ref?.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

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
    setIsCartOpen(true);
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

  const handlePlaceOrder = useCallback(({ name, phone, email, cep, cidade, estado }: { 
    name: string; 
    phone: string; 
    email: string;
    cep: string;
    cidade: string;
    estado: string;
  }) => {
      const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
      
      let orderSummary = `*Novo Pedido - Resistex Marketplace*\n\n`;
      orderSummary += `*Cliente:*\nNome: ${name}\nTelefone: ${phone}\nEmail: ${email}\n\n`;
      orderSummary += `*Endereço para Entrega:*\nCEP: ${cep}\nCidade: ${cidade}\nEstado: ${estado}\n\n`;
      orderSummary += `*Itens do Pedido:*\n`;
      cart.forEach(item => {
          orderSummary += `- ${item.name} (Qtd: ${item.quantity}) - R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}\n`;
      });
      orderSummary += `\n*Subtotal:* R$ ${subtotal.toFixed(2).replace('.', ',')}`;

      const whatsappUrl = `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent(orderSummary)}`;
      const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Novo Pedido - Resistex Marketplace')}&body=${encodeURIComponent(orderSummary.replace(/\*/g, ''))}`;

      window.open(whatsappUrl, '_blank');
      window.location.href = mailtoUrl;

      alert('Pedido de compra criado! Aguarde nosso contato para prosseguir com o pagamento e envio dos produtos.');

      setCart([]);
      setCheckoutFormVisible(false);
      setIsCartOpen(false);
  }, [cart]);
  
  const cartItemCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header cartItemCount={cartItemCount} onNavigate={handleNavigate} onCartClick={() => setIsCartOpen(true)} />
      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={() => {
            if (cart.length > 0) {
                setCheckoutFormVisible(true);
            }
        }}
      />
      <CheckoutForm
        isOpen={isCheckoutFormVisible}
        onClose={() => setCheckoutFormVisible(false)}
        cart={cart}
        onConfirm={handlePlaceOrder}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        <section ref={homeRef} id="home">
            <ProductList onAddToCart={handleAddToCart} />
        </section>
        <section ref={aboutRef} id="about" className="py-16">
            <AboutView />
        </section>
        <section ref={clientsRef} id="clients" className="py-16">
            <ClientsView />
        </section>
        <section ref={contactRef} id="contact" className="py-16">
            <ContactView />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default App;