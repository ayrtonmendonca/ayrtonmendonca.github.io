
import React from 'react';
import { CLIENTS } from '../constants';

const ClientsView: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800">Nossos Clientes</h2>
            <p className="text-lg text-gray-600 mt-2">Empresas que confiam na nossa qualidade</p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8">
            {CLIENTS.map((client, index) => (
                <div key={index} className="p-4" title={client.name}>
                    <img src={client.image} alt={client.name} className="h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition duration-300" />
                </div>
            ))}
        </div>
    </div>
  );
};

export default ClientsView;
