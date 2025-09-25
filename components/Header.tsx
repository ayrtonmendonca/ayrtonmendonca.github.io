
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 md:px-8 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 mr-3" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.5 2.5 0 00-1.134 0v-1.43zM8.433 12.582c.155.103.346.196.567.267v-1.698a2.5 2.5 0 00-1.134 0v1.43z" />
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0 2a10 10 0 100-20 10 10 0 000 20z" clipRule="evenodd" />
        </svg>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Simulador de Remuneração</h1>
          <p className="text-sm text-gray-500">Auditor Fiscal da Receita Estadual - MG</p>
        </div>
      </div>
    </header>
  );
};
