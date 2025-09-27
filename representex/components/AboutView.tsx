
import React from 'react';

const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Sobre Nós</h1>
        <p className="text-lg text-gray-600 mt-2">Nossa história e compromisso com a qualidade</p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
          <p>
            Estamos há mais de 30 anos no mercado, oferendo produtos de qualidade e durabilidade.
          </p>
          <p>
            Nossos aquecedores contam com resistências elétricas blindadas em aço inox, inscritas em campânulas difusoras de alumínio, obtendo assim uma maior e mais eficiente área de aquecimento.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutView;
