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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const transaction_1 = require("../../domain/entities/transaction");
class WalletService {
    constructor(userRepository, walletRepository, transactionRepository) {
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
    }
    fundWallet(userId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findById(userId);
            if (!user)
                throw new Error('User not found');
            let wallet = yield this.walletRepository.findByUserId(userId);
            if (!wallet) {
                wallet = yield this.walletRepository.create({ userId, balance: 0 });
            }
            wallet.balance += amount;
            wallet.updatedAt = new Date();
            yield this.walletRepository.update(wallet);
            yield this.transactionRepository.create({
                fromUserId: null,
                toUserId: userId,
                amount,
                type: transaction_1.TransactionType.FUND,
            });
            return wallet;
        });
    }
    transferFunds(fromUserId, toUserId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            if (fromUserId === toUserId)
                throw new Error('Cannot transfer to self');
            const fromUser = yield this.userRepository.findById(fromUserId);
            const toUser = yield this.userRepository.findById(toUserId);
            if (!fromUser || !toUser)
                throw new Error('User not found');
            const fromWallet = yield this.walletRepository.findByUserId(fromUserId);
            if (!fromWallet)
                throw new Error('Sender wallet not found');
            if (fromWallet.balance < amount)
                throw new Error('Insufficient balance');
            const toWallet = yield this.walletRepository.findByUserId(toUserId);
            if (!toWallet) {
                yield this.walletRepository.create({ userId: toUserId, balance: 0 });
            }
            fromWallet.balance -= amount;
            fromWallet.updatedAt = new Date();
            yield this.walletRepository.update(fromWallet);
            const updatedToWallet = yield this.walletRepository.findByUserId(toUserId);
            if (updatedToWallet) {
                updatedToWallet.balance += amount;
                updatedToWallet.updatedAt = new Date();
                yield this.walletRepository.update(updatedToWallet);
            }
            yield this.transactionRepository.create({
                fromUserId,
                toUserId,
                amount,
                type: transaction_1.TransactionType.TRANSFER,
            });
        });
    }
}
exports.WalletService = WalletService;
