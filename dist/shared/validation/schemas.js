"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionsSchema = exports.transferFundsSchema = exports.fundWalletSchema = exports.createUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createUserSchema = joi_1.default.object({
    name: joi_1.default.string().required().min(1).max(255),
});
exports.fundWalletSchema = joi_1.default.object({
    userId: joi_1.default.string().uuid().required(),
    amount: joi_1.default.number().positive().required(),
});
exports.transferFundsSchema = joi_1.default.object({
    fromUserId: joi_1.default.string().uuid().required(),
    toUserId: joi_1.default.string().uuid().required(),
    amount: joi_1.default.number().positive().required(),
});
exports.getTransactionsSchema = joi_1.default.object({
    userId: joi_1.default.string().uuid().required(),
});
