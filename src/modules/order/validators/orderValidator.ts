import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { ResponseHandler } from '../../../shared/utils/responseHandler';

const addressSchema = Joi.object({
  line1: Joi.string().optional(),
  line2: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  postal_code: Joi.string().optional(),
  country: Joi.string().optional()
}).optional();

export const orderSchema = Joi.object({
  amount: Joi.number().integer().positive().required()
    .messages({
      'number.base': `"amount" should be a number`,
      'number.integer': `"amount" should be an integer`,
      'number.positive': `"amount" must be greater than 0`,
      'any.required': `"amount" is required`,
    }),
  productId: Joi.string().optional(),
  productName: Joi.string().optional(),
  shipping: Joi.object({
    address: addressSchema,
    name: Joi.string().optional()
  }).optional()
});

export function validateOrder(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { error } = orderSchema.validate(req.body);
  if (error) {
    ResponseHandler.badRequest(res, 'Validation failed', error.details[0].message);
    return;
  }
  next();
}