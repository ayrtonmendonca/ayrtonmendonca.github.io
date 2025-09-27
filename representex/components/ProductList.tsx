import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { PRODUCTS } from '../constants';

interface ProductListProps {
  onAddToCart: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ onAddToCart }) => {
  return (
    <>
        <div className="text-center my-12 py-16 bg-white rounded-lg shadow-lg">
            <h1 className="text-5xl md:text-6xl font-extrabold text-theme-red tracking-wider uppercase">RESISTEX</h1>
            <p className="mt-4 text-2xl md:text-3xl text-gray-700 font-light">
                O sol da vida confinada.
            </p>
            <p className="mt-2 text-xl md:text-2xl text-gray-600 font-semibold">
                Sinônimo de saúde.
            </p>
        </div>
        
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800">Nossos Produtos</h2>
            <p className="text-lg text-gray-600 mt-2">Qualidade e confiança desde 1987</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PRODUCTS.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
        </div>
    </>
  );
};

export default ProductList;
