export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  isFavorite: boolean;
  tags?: string[];
}
