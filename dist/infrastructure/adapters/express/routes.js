"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = setupRoutes;
const express_1 = __importDefault(require("express"));
const schemas_1 = require("../../../shared/validation/schemas");
const logger_1 = __importDefault(require("../../../infrastructure/logger/logger"));
function setupRoutes(userService, walletService, transactionService) {
    const router = express_1.default.Router();
    // Middleware for Joi validation
    const validate = (schema) => {
        return (req, res, next) => {
            const { error } = schema.validate(req.body || req.params);
            if (error) {
                logger_1.default.error(`Validation error: ${error.message}`);
                return res.status(400).json({ error: error.message });
            }
            next();
        };
    };
    // POST /users
    router.post('/users', validate(schemas_1.createUserSchema), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield userService.createUser(req.body.name);
            logger_1.default.info(`User created: ${user.id}`);
            res.status(201).json(user);
        }
        catch (error) {
            logger_1.default.error(`Error creating user: ${error.message}`);
            res.status(400).json({ error: error.message });
        }
    }));
    // POST /wallets/fund
    router.post('/wallets/fund', validate(schemas_1.fundWalletSchema), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId, amount } = req.body;
            const wallet = yield walletService.fundWallet(userId, amount);
            logger_1.default.info(`Wallet funded: userId=${userId}, amount=${amount}`);
            res.status(200).json(wallet);
        }
        catch (error) {
            logger_1.default.error(`Error funding wallet: ${error.message}`);
            res.status(400).json({ error: error.message });
        }
    }));
    // POST /wallets/transfer
    router.post('/wallets/transfer', validate(schemas_1.transferFundsSchema), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { fromUserId, toUserId, amount } = req.body;
            yield walletService.transferFunds(fromUserId, toUserId, amount);
            logger_1.default.info(`Transfer completed: from=${fromUserId}, to=${toUserId}, amount=${amount}`);
            res.status(200).json({ message: 'Transfer successful' });
        }
        catch (error) {
            logger_1.default.error(`Error transferring funds: ${error.message}`);
            res.status(400).json({ error: error.message });
        }
    }));
    // GET /users/:userId/transactions
    router.get('/users/:userId/transactions', validate(schemas_1.getTransactionsSchema), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const transactions = yield transactionService.getUserTransactions(req.params.userId);
            logger_1.default.info(`Fetched transactions for userId=${req.params.userId}`);
            res.status(200).json(transactions);
        }
        catch (error) {
            logger_1.default.error(`Error fetching transactions: ${error.message}`);
            res.status(400).json({ error: error.message });
        }
    }));
    return router;
}
