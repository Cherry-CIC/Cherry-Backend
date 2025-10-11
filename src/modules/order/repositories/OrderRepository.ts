import { firestore } from '../../../shared/config/firebaseConfig';
import { Order } from '../model/Order';

/**
 * Repository handling persistence of orders in Firestore.
 */
export class OrderRepository {
  /**
   * Saves a new order document.
   *
   * @param userId - UID of the user placing the order.
   * @param email - User's email address (stored for reference).
   * @param amount - Amount in the smallest currency unit.
   * @param productId - Optional product identifier.
   * @param productName - Optional product name.
   * @param shipping - Optional shipping information.
   * @returns The saved Order, including its generated ID.
   */
  async createOrder(
    userId: string,
    email: string,
    amount: number,
    productId?: string,
    productName?: string,
    shipping?: any
  ): Promise<Order> {
    const orderData: Partial<Order> = {
      userId,
      amount,
      productId,
      productName,
      shipping,
      createdAt: new Date(),
    };

    const docRef = await firestore.collection('orders').add({
      ...orderData,
      email,
    });

    const savedOrder: Order = {
      id: docRef.id,
      userId,
      amount,
      productId,
      productName,
      shipping,
      createdAt: orderData.createdAt!,
    };

    return savedOrder;
  }

  /**
   * Retrieves all orders from Firestore.
   */
  async getAllOrders(): Promise<Order[]> {
    const snapshot = await firestore.collection('orders').get();
    return snapshot.docs.map(doc => {
      const data = doc.data() as Omit<Order, 'id'>;
      return { id: doc.id, ...data };
    });
  }
}