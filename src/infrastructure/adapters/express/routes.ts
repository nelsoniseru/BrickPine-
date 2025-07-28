import express, { Request, Response, NextFunction } from 'express';
import { UserService } from '../../../application/service/userService';
import { WalletService } from '../../../application/service/walletService';
import { TransactionService } from '../../../application/service/transactionService';
import Joi from 'joi';
import {
  createUserSchema,
  fundWalletSchema,
  transferFundsSchema,
  getTransactionsSchema,
} from '../../../shared/validation/schemas';
import logger from '../../../infrastructure/logger/logger';

export function setupRoutes(
  userService: UserService,
  walletService: WalletService,
  transactionService: TransactionService
) {
  const router = express.Router();

  // Middleware for Joi validation
  const validate = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.body || req.params);
      if (error) {
        logger.error(`Validation error: ${error.message}`);
        return res.status(400).json({ error: error.message });
      }
      next();
    };
  };

  /**
   * @swagger
   * /users:
   *   post:
   *     summary: Create a new user
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *             properties:
   *               name:
   *                 type: string
   *                 example: John Doe
   *     responses:
   *       201:
   *         description: User created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                 name:
   *                   type: string
   *                 createdAt:
   *                   type: string
   *                   format: date-time
   *       400:
   *         description: Invalid input
   */
  router.post(
    '/users',
    validate(createUserSchema),
    async (req: Request, res: Response) => {
      try {
        const user = await userService.createUser(req.body.name);
        logger.info(`User created: ${user.id}`);
        res.status(201).json(user);
      } catch (error: any) {
        logger.error(`Error creating user: ${error.message}`);
        res.status(400).json({ error: error.message });
      }
    }
  );

  /**
   * @swagger
   * /wallets/fund:
   *   post:
   *     summary: Fund a user's wallet
   *     tags: [Wallets]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - userId
   *               - amount
   *             properties:
   *               userId:
   *                 type: string
   *                 format: uuid
   *                 example: 123e4567-e89b-12d3-a456-426614174000
   *               amount:
   *                 type: number
   *                 example: 100
   *     responses:
   *       200:
   *         description: Wallet funded successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 userId:
   *                   type: string
   *                 balance:
   *                   type: number
   *                 updatedAt:
   *                   type: string
   *                   format: date-time
   *       400:
   *         description: Invalid input or user not found
   */
  router.post(
    '/wallets/fund',
    validate(fundWalletSchema),
    async (req: Request, res: Response) => {
      try {
        const { userId, amount } = req.body;
        const wallet = await walletService.fundWallet(userId, amount);
        logger.info(`Wallet funded: userId=${userId}, amount=${amount}`);
        res.status(200).json(wallet);
      } catch (error: any) {
        logger.error(`Error funding wallet: ${error.message}`);
        res.status(400).json({ error: error.message });
      }
    }
  );

  /**
   * @swagger
   * /wallets/transfer:
   *   post:
   *     summary: Transfer funds between users
   *     tags: [Wallets]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - fromUserId
   *               - toUserId
   *               - amount
   *             properties:
   *               fromUserId:
   *                 type: string
   *                 format: uuid
   *                 example: 123e4567-e89b-12d3-a456-426614174000
   *               toUserId:
   *                 type: string
   *                 format: uuid
   *                 example: 987fcdeb-12d3-4b56-7890-426614174000
   *               amount:
   *                 type: number
   *                 example: 50
   *     responses:
   *       200:
   *         description: Transfer successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Transfer successful
   *       400:
   *         description: Invalid input, insufficient balance, or user not found
   */
  router.post(
    '/wallets/transfer',
    validate(transferFundsSchema),
    async (req: Request, res: Response) => {
      try {
        const { fromUserId, toUserId, amount } = req.body;
        await walletService.transferFunds(fromUserId, toUserId, amount);
        logger.info(
          `Transfer completed: from=${fromUserId}, to=${toUserId}, amount=${amount}`
        );
        res.status(200).json({ message: 'Transfer successful' });
      } catch (error: any) {
        logger.error(`Error transferring funds: ${error.message}`);
        res.status(400).json({ error: error.message });
      }
    }
  );

  /**
   * @swagger
   * /users/{userId}/transactions:
   *   get:
   *     summary: Get a user's transaction history
   *     tags: [Transactions]
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The ID of the user
   *         example: 123e4567-e89b-12d3-a456-426614174000
   *     responses:
   *       200:
   *         description: List of transactions
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                   fromUserId:
   *                     type: string
   *                     nullable: true
   *                   toUserId:
   *                     type: string
   *                   amount:
   *                     type: number
   *                   type:
   *                     type: string
   *                     enum: [FUND, TRANSFER]
   *                   createdAt:
   *                     type: string
   *                     format: date-time
   *       400:
   *         description: Invalid userId
   */
  router.get(
    '/users/:userId/transactions',
    validate(getTransactionsSchema),
    async (req: Request, res: Response) => {
      try {
        const transactions = await transactionService.getUserTransactions(
          req.params.userId
        );
        logger.info(`Fetched transactions for userId=${req.params.userId}`);
        res.status(200).json(transactions);
      } catch (error: any) {
        logger.error(`Error fetching transactions: ${error.message}`);
        res.status(400).json({ error: error.message });
      }
    }
  );

  return router;
}
