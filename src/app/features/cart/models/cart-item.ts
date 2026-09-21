export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  availableStock: number;
  primaryImageUrl: string | null;
}