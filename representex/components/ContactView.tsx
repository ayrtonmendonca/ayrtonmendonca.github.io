import React from 'react';
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_FORMATTED, INSTAGRAM_URL } from '../constants';

const ContactView: React.FC = () => {
  const whatsappLink = `https://wa.me/${CONTACT_PHONE}?text=Ol%C3%A1%2C%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20os%20produtos%20Resistex.`;
  const emailLink = `mailto:${CONTACT_EMAIL}`;
  const instagramLink = INSTAGRAM_URL;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    // Here you would typically handle form submission
    const form = e.target as HTMLFormElement;
    form.reset();
  };

  return (
    <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800">Entre em Contato</h1>
            <p className="text-lg text-gray-600 mt-2">Estamos aqui para ajudar. Fale conosco!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-xl font-semibold mb-2">WhatsApp</h3>
                <p className="text-gray-600 mb-4">{CONTACT_PHONE_FORMATTED}</p>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-block bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition">
                    Iniciar Conversa
                </a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-xl font-semibold mb-2">E-mail</h3>
                <p className="text-gray-600 mb-4">{CONTACT_EMAIL}</p>
                <a href={emailLink} className="inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                    Enviar E-mail
                </a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-xl font-semibold mb-2">Instagram</h3>
                <p className="text-gray-600 mb-4">@representex</p>
                <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="inline-block bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition">
                    Seguir
                </a>
            </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Ou nos envie uma mensagem</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome / Empresa</label>
                    <input type="text" id="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-theme-red focus:border-theme-red" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
                    <input type="email" id="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-theme-red focus:border-theme-red" />
                </div>
                 <div>
                    <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">Celular (WhatsApp)</label>
                    <input type="tel" id="whatsapp" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-theme-red focus:border-theme-red" />
                </div>
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Assunto</label>
                    <input type="text" id="subject" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-theme-red focus:border-theme-red" />
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensagem</label>
                    <textarea id="message" rows={4} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-theme-red focus:border-theme-red"></textarea>
                </div>
                <div className="text-center">
                    <button type="submit" className="w-full md:w-auto bg-theme-red text-white font-bold py-3 px-8 rounded-lg hover:bg-red-500 transition duration-300">
                        Enviar Mensagem
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default ContactView;
