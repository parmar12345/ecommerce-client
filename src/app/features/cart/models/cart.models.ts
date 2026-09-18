export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CartItemResponse {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  availableStock: number;
  primaryImageUrl: string | null;
}

export interface CartResponse {
  id: string;
  items: CartItemResponse[];
  totalItems: number;
  subtotal: number;
}