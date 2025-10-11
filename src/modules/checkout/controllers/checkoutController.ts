import { Request, Response } from 'express';
import { ResponseHandler } from '../../../shared/utils/responseHandler';
import { stripe } from '../../../shared/config/stripeConfig';
import { UserRepository } from '../../auth/repositories/UserRepository';

/**
 * Creates a Stripe Checkout Session for a purchase.
 *
 * Expected request body (JSON):
 * {
 *   "amount": number,               // amount in the smallest currency unit (e.g., pence)
 *   "productId": string,            // optional identifier of the product being purchased
 *   "productName": string,          // optional human‑readable name
 *   "shipping": {                   // optional shipping address details
 *     "address": {
 *       "line1": string,
 *       "line2": string,
 *       "city": string,
 *       "state": string,
 *       "postal_code": string,
 *       "country": string
 *     },
 *     "name": string
 *   }
 * }
 *
 * Returns the Checkout Session ID for the client to redirect via Stripe.js.
 */
export const createCheckoutSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const firebaseUid = user?.uid;
    if (!firebaseUid) {
      ResponseHandler.unauthorized(res, 'User not authenticated');
      return;
    }

    const userRepo = new UserRepository();
    const dbUser = await userRepo.getByFirebaseUid(firebaseUid);
    if (!dbUser) {
      ResponseHandler.notFound(res, 'User not found');
      return;
    }
    const email = dbUser.email;

    const { amount, productId, productName, shipping } = req.body;
    if (!amount) {
      ResponseHandler.badRequest(res, 'Amount is required');
      return;
    }

    const lineItem = {
      price_data: {
        currency: 'gbp',
        product_data: {
          name: productName ?? (productId ? `Product ${productId}` : 'Custom Product')
        },
        unit_amount: amount
      },
      quantity: 1
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [lineItem],
      success_url: `${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/cancel`,
      customer_email: email,
      ...(shipping && {
        shipping_address_collection: {
          allowed_countries: [shipping.address?.country ?? 'GB']
        },
        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: { amount: 0, currency: 'gbp' },
              display_name: 'Free shipping',
              delivery_estimate: {
                minimum: { unit: 'business_day', value: 2 },
                maximum: { unit: 'business_day', value: 5 }
              }
            }
          }
        ]
      })
    });

    ResponseHandler.success(res, { sessionId: session.id }, 'Checkout session created');
  } catch (err) {
    console.error('Error creating checkout session:', err);
    ResponseHandler.internalServerError(
      res,
      'Failed to create checkout session',
      err instanceof Error ? err.message : 'Unknown error'
    );
  }
};