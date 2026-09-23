export interface CheckoutResponse {
  orderId: string;
  subtotal: number;
  shippingAmount: number;
  totalAmount: number;
}