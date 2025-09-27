
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  brand: 'Resistex' | 'Bactex';
}

export interface CartItem extends Product {
  quantity: number;
}
