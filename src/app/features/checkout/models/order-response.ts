export interface OrderResponse {
  orderId: string;
  subtotal: number;
  shippingAmount: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItemResponse[];
}

export interface OrderItemResponse {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}