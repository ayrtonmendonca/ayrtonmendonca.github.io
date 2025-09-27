
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { CartItem } from '../types';

interface CheckoutFormProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onConfirm: (customerData: { 
      name: string; 
      phone: string; 
      email: string; 
      cep: string;
      cidade: string;
      estado: string;
    }) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ isOpen, onClose, cart, onConfirm }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [cep, setCep] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cepError, setCepError] = useState('');

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setPhone('');
      setEmail('');
      setCep('');
      setCidade('');
      setEstado('');
      setCepError('');
    }
  }, [isOpen]);
  
  const handleCepSearch = useCallback(async (cepValue: string) => {
    const formattedCep = cepValue.replace(/\D/g, '');
    if (formattedCep.length !== 8) {
        setCidade('');
        setEstado('');
        return;
    }

    try {
        setCepError('');
        const response = await fetch(`https://viacep.com.br/ws/${formattedCep}/json/`);
        const data = await response.json();
        if (data.erro) {
            setCepError('CEP não encontrado.');
            setCidade('');
            setEstado('');
        } else {
            setCidade(data.localidade);
            setEstado(data.uf);
            setCepError('');
        }
    } catch (error) {
        setCepError('Erro ao buscar CEP. Verifique sua conexão.');
        setCidade('');
        setEstado('');
    }
  }, []);

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCep = e.target.value;
    setCep(newCep);
    if (newCep.replace(/\D/g, '').length === 8) {
      handleCepSearch(newCep);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && phone && email && cep && cidade && estado) {
      onConfirm({ name, phone, email, cep, cidade, estado });
    }
  };

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-heading"
    >
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-start">
            <h2 id="checkout-heading" className="text-2xl font-bold text-gray-800 mb-4">Informações para Contato</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl" aria-label="Fechar formulário">&times;</button>
        </div>
        <p className="text-gray-600 mb-6">Preencha seus dados e endereço para que possamos entrar em contato sobre seu pedido.</p>
        
        <div className="overflow-y-auto pr-2 flex-grow">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-theme-red focus:border-theme-red" />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone (WhatsApp)</label>
                    <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-theme-red focus:border-theme-red" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
                    <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-theme-red focus:border-theme-red" />
                </div>
                <div>
                    <label htmlFor="cep" className="block text-sm font-medium text-gray-700">CEP</label>
                    <input type="text" id="cep" value={cep} onChange={handleCepChange} required maxLength={9} placeholder="00000-000" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-theme-red focus:border-theme-red" />
                     {cepError && <p className="text-red-500 text-xs mt-1">{cepError}</p>}
                </div>
                 <div>
                    <label htmlFor="cidade" className="block text-sm font-medium text-gray-700">Cidade</label>
                    <input type="text" id="cidade" value={cidade} readOnly required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed" />
                </div>
                 <div>
                    <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado (UF)</label>
                    <input type="text" id="estado" value={estado} readOnly required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed" />
                </div>
            </form>
            <div className="mt-6 pt-4 border-t">
                <h3 className="font-semibold mb-2 text-gray-800">Resumo do Pedido</h3>
                <div className="space-y-1 text-sm text-gray-600 max-h-32 overflow-y-auto">
                    {cart.map(item => (
                        <div key={item.id} className="flex justify-between">
                            <span>{item.name} x{item.quantity}</span>
                            <span>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                    <span>Subtotal</span>
                    <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>
        </div>
        
        <div className="mt-6 pt-4 border-t flex justify-end space-x-4">
          <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition">
            Cancelar
          </button>
          <button type="submit" form="checkout-form" className="py-2 px-6 bg-theme-red text-white font-bold rounded-lg hover:bg-red-500 transition">
            Enviar Pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;