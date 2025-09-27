
import React from 'react';
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_FORMATTED } from '../constants';

const WhatsAppIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01s-.521.074-.792.372c-.272.296-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
);
const MailIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const Footer: React.FC = () => {
  const whatsappLink = `https://wa.me/${CONTACT_PHONE}`;
  const emailLink = `mailto:${CONTACT_EMAIL}`;

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-lg font-bold mb-4">Resistex Ltda.</h3>
            <p className="text-gray-400">Desde 1987, trazendo saúde e praticidade para sua vida.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contato</h3>
            <div className="flex flex-col items-center md:items-start space-y-2 text-gray-400">
                <p>Email: {CONTACT_EMAIL}</p>
                <p>WhatsApp: {CONTACT_PHONE_FORMATTED}</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Fale Conosco</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300">
                <WhatsAppIcon />
              </a>
              <a href={emailLink} className="text-gray-400 hover:text-white transition duration-300">
                <MailIcon />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Resistex. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
