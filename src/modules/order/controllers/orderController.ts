import { Request, Response } from 'express';
import { ResponseHandler } from '../../../shared/utils/responseHandler';
import { UserRepository } from '../../auth/repositories/UserRepository';
import { OrderRepository } from '../repositories/OrderRepository';

/**
 * Creates a Stripe Checkout Session (renamed as an Order).
 *
 * Expected request body (JSON):
 * {
 *   "amount": number,
 *   "productId": string,
 *   "productName": string,
 *   "shipping": { ... }
 * }
 *
 * Returns the Checkout Session ID for the client to redirect via Stripe.js.
 */
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const firebaseUid = user?.uid;
    if (!firebaseUid) {
      ResponseHandler.unauthorized(res, 'User not authenticated', 'Authentication required');
      return;
    }

    const userRepo = new UserRepository();
    const dbUser = await userRepo.getByFirebaseUid(firebaseUid);
    if (!dbUser) {
      ResponseHandler.notFound(res, 'User not found', `User with UID ${firebaseUid} does not exist`);
      return;
    }
    const email = dbUser.email;

    const { amount, productId, productName, shipping } = req.body;
    if (!amount) {
      ResponseHandler.badRequest(res, 'Invalid request', 'Amount is required');
      return;
    }

    const orderRepo = new OrderRepository();
    const savedOrder = await orderRepo.createOrder(
      firebaseUid,
      email,
      amount,
      productId,
      productName,
      shipping
    );

    ResponseHandler.success(res, { orderId: savedOrder.id }, 'Order created successfully');
  } catch (err) {
    console.error('Error creating order:', err);
    ResponseHandler.internalServerError(
      res,
      'Failed to create order',
      err instanceof Error ? err.message : 'Unknown error'
    );
  }
};

/**
 * Placeholder endpoint to fetch all orders.
 * In a real implementation this would query a database or Stripe's API.
 * For now it returns an empty array.
 */
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderRepo = new OrderRepository();
    const orders = await orderRepo.getAllOrders();
    ResponseHandler.success(res, { orders }, 'All orders fetched successfully');
  } catch (err) {
    console.error('Error fetching orders:', err);
    ResponseHandler.internalServerError(
      res,
      'Failed to fetch orders',
      err instanceof Error ? err.message : 'Unknown error'
    );
  }
};