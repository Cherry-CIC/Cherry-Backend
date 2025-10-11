export interface Order {
  id: string;
  userId: string; // ID of the user who placed the order
  amount: number; // amount in the smallest currency unit (e.g., pence)
  productId?: string;
  productName?: string;
  shipping?: {
    address: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    };
    name?: string;
  };
  createdAt: Date;
}