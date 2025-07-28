import Joi from 'joi';

export const createUserSchema = Joi.object({
  name: Joi.string().required().min(1).max(255),
});

export const fundWalletSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
});

export const transferFundsSchema = Joi.object({
  fromUserId: Joi.string().uuid().required(),
  toUserId: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
});

export const getTransactionsSchema = Joi.object({
  userId: Joi.string().uuid().required(),
});