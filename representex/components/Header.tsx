import React from 'react';

interface HeaderProps {
  cartItemCount: number;
  onNavigate: (sectionId: string) => void;
  onCartClick: () => void;
}

const ShoppingCartIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const Header: React.FC<HeaderProps> = ({ cartItemCount, onNavigate, onCartClick }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="cursor-pointer" onClick={() => onNavigate('home')}>
            <img src="./images/logo_empresa.jpg" alt="Resistex Logo" className="h-14" />
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <button onClick={() => onNavigate('home')} className="text-gray-600 hover:text-theme-red transition duration-300 font-medium">Produtos</button>
          <button onClick={() => onNavigate('about')} className="text-gray-600 hover:text-theme-red transition duration-300 font-medium">Sobre Nós</button>
          <button onClick={() => onNavigate('clients')} className="text-gray-600 hover:text-theme-red transition duration-300 font-medium">Nossos Clientes</button>
          <button onClick={() => onNavigate('contact')} className="text-gray-600 hover:text-theme-red transition duration-300 font-medium">Contato</button>
        </nav>
        <div className="flex items-center">
            <button onClick={onCartClick} className="relative text-gray-600 hover:text-theme-red transition duration-300">
                <ShoppingCartIcon />
                {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-theme-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                </span>
                )}
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;