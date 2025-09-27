import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Aquecedor de Ambientes Resistex',
    description: 'O sol da vida confinada. Ideal para tratamentos terapêuticos e de saúde, proporcionando calor profundo e alívio.',
    price: 149.90,
    image: './images/campanula.jpg',
    brand: 'Resistex',
  },
  {
    id: 2,
    name: 'Ebulidor Resistex',
    description: 'Solução prática e eficiente para aquecer água rapidamente em qualquer lugar.',
    price: 79.90,
    image: './images/ebulidor.jpg',
    brand: 'Resistex',
  },
  {
    id: 3,
    name: 'Fumigador Desinfetante Bactex',
    description: '100% contra bactérias. Elimina o desenvolvimento de vírus, fungos e bactérias em ambientes, garantindo um espaço seguro.',
    price: 189.90,
    image: './images/bactex.jpg',
    brand: 'Bactex',
  },
  {
    id: 4,
    name: 'Acendedor de churrasqueira',
    description: 'Fácil, prático e seguro, acenda sua churrasqueira sem se preocupar..',
    price: 139.90,
    image: './images/acendedor.jpg',
    brand: 'Resistex',
  }
];

export const CONTACT_EMAIL = 'resistexltda@gmail.com';
export const CONTACT_PHONE = '5531991036285';
export const CONTACT_PHONE_FORMATTED = '(31) 99103-6285';