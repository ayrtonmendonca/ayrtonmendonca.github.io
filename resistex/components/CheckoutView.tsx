
import React, { useState, useMemo } from 'react';
import { CartItem } from '../types';

interface CheckoutViewProps {
  cart: CartItem[];
  onPlaceOrder: () => void;
}

type PaymentMethod = 'pix' | 'boleto' | 'card';

const CheckoutView: React.FC<CheckoutViewProps> = ({ cart, onPlaceOrder }) => {
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const total = useMemo(() => {
    return subtotal + (shippingCost || 0);
  }, [subtotal, shippingCost]);

  const handleCalculateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate shipping calculation
    setShippingCost(25.50);
  };
  
  if (cart.length === 0) {
    return <div className="text-center p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold">Não há itens para finalizar a compra.</h2>
    </div>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Finalizar Pedido</h1>
        
        {/* Shipping Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Endereço de Entrega</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="CEP" className="p-2 border rounded col-span-2 md:col-span-1" />
            <button onClick={handleCalculateShipping} className="bg-gray-200 text-gray-800 p-2 rounded hover:bg-gray-300 transition col-span-2 md:col-span-1">Calcular Frete</button>
            <input type="text" placeholder="Rua / Avenida" className="p-2 border rounded col-span-2" />
            <input type="text" placeholder="Número" className="p-2 border rounded" />
            <input type="text" placeholder="Complemento" className="p-2 border rounded" />
            <input type="text" placeholder="Bairro" className="p-2 border rounded col-span-2" />
            <input type="text" placeholder="Cidade" className="p-2 border rounded" />
            <input type="text" placeholder="Estado" className="p-2 border rounded" />
          </form>
        </section>

        {/* Payment Section */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Pagamento</h2>
          <div className="flex space-x-4 mb-4">
            <button onClick={() => setPaymentMethod('card')} className={`p-3 rounded-lg flex-1 text-center font-semibold transition ${paymentMethod === 'card' ? 'bg-theme-red text-white' : 'bg-gray-200'}`}>Cartão de Crédito</button>
            <button onClick={() => setPaymentMethod('pix')} className={`p-3 rounded-lg flex-1 text-center font-semibold transition ${paymentMethod === 'pix' ? 'bg-theme-red text-white' : 'bg-gray-200'}`}>PIX</button>
            <button onClick={() => setPaymentMethod('boleto')} className={`p-3 rounded-lg flex-1 text-center font-semibold transition ${paymentMethod === 'boleto' ? 'bg-theme-red text-white' : 'bg-gray-200'}`}>Boleto</button>
          </div>
          
          {paymentMethod === 'card' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Número do Cartão" className="p-2 border rounded col-span-2" />
              <input type="text" placeholder="Nome no Cartão" className="p-2 border rounded col-span-2" />
              <input type="text" placeholder="Validade (MM/AA)" className="p-2 border rounded" />
              <input type="text" placeholder="CVV" className="p-2 border rounded" />
            </div>
          )}
          {paymentMethod === 'pix' && (
            <div className="text-center p-4 bg-gray-100 rounded">
                <p>Use o QR Code ou a chave para pagar com PIX.</p>
                <img src="https://picsum.photos/seed/qrcode/200/200" alt="QR Code PIX" className="mx-auto my-4"/>
                <button className="bg-gray-800 text-white py-2 px-4 rounded">Copiar Chave PIX</button>
            </div>
          )}
          {paymentMethod === 'boleto' && (
             <div className="text-center p-4 bg-gray-100 rounded">
                <p>O boleto será gerado após a finalização do pedido.</p>
                <button className="bg-gray-800 text-white py-2 px-4 rounded mt-4">Gerar Boleto</button>
            </div>
          )}
        </section>
      </div>
      
      {/* Order Summary */}
      <div className="lg:col-span-1 bg-white p-8 rounded-lg shadow-lg h-fit sticky top-28">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Resumo do Pedido</h2>
          <div className="space-y-2">
            {cart.map(item => (
                <div key={item.id} className="flex justify-between text-gray-600">
                    <span>{item.name} x{item.quantity}</span>
                    <span>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t space-y-2">
            <div className="flex justify-between"><span>Subtotal</span><span>R$ {subtotal.toFixed(2).replace('.', ',')}</span></div>
            <div className="flex justify-between"><span>Frete</span><span>{shippingCost ? `R$ ${shippingCost.toFixed(2).replace('.', ',')}` : 'A calcular'}</span></div>
            <div className="flex justify-between font-bold text-xl mt-2"><span>Total</span><span>R$ {total.toFixed(2).replace('.', ',')}</span></div>
          </div>
          <button onClick={onPlaceOrder} className="w-full bg-theme-red text-white font-bold text-lg py-3 mt-6 rounded-lg hover:bg-red-500 transition">
              Finalizar Pedido
          </button>
      </div>
    </div>
  );
};

export default CheckoutView;