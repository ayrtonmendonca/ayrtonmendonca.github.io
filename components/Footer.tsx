
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-8">
      <div className="container mx-auto py-4 px-4 md:px-8 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Simulador de Remuneração. Todos os valores são estimativas e podem não refletir a realidade com precisão.</p>
        <p>Desenvolvido apenas para fins de demonstração.</p>
      </div>
    </footer>
  );
};
