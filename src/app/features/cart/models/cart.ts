import { CartItem } from '../models/cart-item';

export interface Cart {
  id: string;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}