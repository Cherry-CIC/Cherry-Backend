export interface ShippingAddress {
    name: string;
    street: string;
    city: string;
    postcode: string;
    country: string;
    phone: string;
}

export interface CheckoutSession {
    id?: string; // sessionId
    userId: string;
    shippingAddress?: ShippingAddress;
    createdAt?: Date;
    updatedAt?: Date;
}