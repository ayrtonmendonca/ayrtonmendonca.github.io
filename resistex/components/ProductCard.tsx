
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col">
      <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4 flex-grow">{product.description}</p>
        <div className="flex justify-between items-center mt-auto">
            <span className="text-2xl font-bold text-theme-red">
                R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
            <button
                onClick={() => onAddToCart(product)}
                className="bg-theme-red text-white font-bold py-2 px-4 rounded-lg hover:bg-red-500 transition duration-300"
            >
                Adicionar
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;