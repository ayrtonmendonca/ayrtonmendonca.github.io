
import React, { useMemo } from 'react';
import { CartItem } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, cart, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  
  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <aside 
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-heading"
      >
        <header className="flex justify-between items-center p-4 border-b">
          <h2 id="cart-heading" className="text-2xl font-bold text-gray-800">Seu Carrinho</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl" aria-label="Fechar carrinho">&times;</button>
        </header>

        {cart.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
            <p className="text-gray-600 text-lg">Seu carrinho está vazio.</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-4">
            <div className="divide-y divide-gray-200">
              {cart.map(item => (
                <div key={item.id} className="flex items-start py-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                  <div className="ml-4 flex-grow">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-500 text-sm">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center border rounded-md">
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100" aria-label={`Diminuir quantidade de ${item.name}`}>-</button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value, 10) || 1)}
                          className="w-10 text-center border-l border-r text-sm"
                          aria-label={`Quantidade de ${item.name}`}
                        />
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100" aria-label={`Aumentar quantidade de ${item.name}`}>+</button>
                      </div>
                    </div>
                  </div>
                  <div className="ml-2 text-right">
                     <p className="font-bold text-gray-800">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                     <button onClick={() => onRemoveItem(item.id)} className="text-red-500 hover:text-red-700 text-xs mt-2" aria-label={`Remover ${item.name} do carrinho`}>
                        Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <footer className="p-4 border-t bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-800">Subtotal:</span>
            <span className="text-xl font-bold text-theme-red">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
          </div>
          <button
            onClick={onCheckout}
            disabled={cart.length === 0}
            className="w-full bg-theme-red text-white font-bold py-3 rounded-lg hover:bg-red-500 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Finalizar Compra
          </button>
        </footer>
      </aside>
    </>
  );
};

export default CartSidebar;
