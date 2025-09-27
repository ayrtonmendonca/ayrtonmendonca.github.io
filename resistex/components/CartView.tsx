
import React, { useMemo } from 'react';
import { CartItem, View } from '../types';

interface CartViewProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onNavigate: (view: View) => void;
}

const CartView: React.FC<CartViewProps> = ({ cart, onUpdateQuantity, onRemoveItem, onNavigate }) => {
  
  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  if (cart.length === 0) {
    return (
      <div className="text-center bg-white p-12 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Seu carrinho está vazio</h2>
        <p className="text-gray-600 mb-6">Adicione produtos para continuar sua compra.</p>
        <button
          onClick={() => onNavigate('home')}
          className="bg-theme-red text-white font-bold py-3 px-6 rounded-lg hover:bg-red-500 transition duration-300"
        >
          Ver Produtos
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Carrinho de Compras</h1>
      <div className="divide-y divide-gray-200">
        {cart.map(item => (
          <div key={item.id} className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
              <div>
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-gray-600">R$ {item.price.toFixed(2).replace('.', ',')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-lg">
                <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-100">-</button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value, 10) || 1)}
                  className="w-12 text-center border-l border-r"
                />
                <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-100">+</button>
              </div>
              <p className="font-bold w-24 text-right">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
              <button onClick={() => onRemoveItem(item.id)} className="text-red-500 hover:text-red-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 pt-4 border-t text-right">
        <h2 className="text-2xl font-bold">Subtotal: R$ {subtotal.toFixed(2).replace('.', ',')}</h2>
        <button
          onClick={() => onNavigate('checkout')}
          className="mt-4 bg-theme-red text-white font-bold py-3 px-8 rounded-lg hover:bg-red-500 transition duration-300"
        >
          Finalizar Compra
        </button>
      </div>
    </div>
  );
};

export default CartView;