import { UserRepository } from '../../domain/interfaces/userRepository';
import { WalletRepository } from '../../domain/interfaces/walletRepository';
import { TransactionRepository } from '../../domain/interfaces/transactionRepository';
import { Wallet } from '../../domain/entities/wallet';
import { Transaction, TransactionType } from '../../domain/entities/transaction';
import { v4 as uuidv4 } from 'uuid';

export class WalletService {
  constructor(
    private userRepository: UserRepository,
    private walletRepository: WalletRepository,
    private transactionRepository: TransactionRepository
  ) {}

  async fundWallet(userId: string, amount: number): Promise<Wallet> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    let wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) {
      wallet = await this.walletRepository.create({ userId, balance: 0 });
    }

    wallet.balance += amount;
    wallet.updatedAt = new Date();
    await this.walletRepository.update(wallet);

    await this.transactionRepository.create({
      fromUserId: null,
      toUserId: userId,
      amount,
      type: TransactionType.FUND,
    });

    return wallet;
  }

  async transferFunds(fromUserId: string, toUserId: string, amount: number): Promise<void> {
    if (fromUserId === toUserId) throw new Error('Cannot transfer to self');

    const fromUser = await this.userRepository.findById(fromUserId);
    const toUser = await this.userRepository.findById(toUserId);
    if (!fromUser || !toUser) throw new Error('User not found');

    const fromWallet = await this.walletRepository.findByUserId(fromUserId);
    if (!fromWallet) throw new Error('Sender wallet not found');
    if (fromWallet.balance < amount) throw new Error('Insufficient balance');

    const toWallet = await this.walletRepository.findByUserId(toUserId);
    if (!toWallet) {
      await this.walletRepository.create({ userId: toUserId, balance: 0 });
    }

    fromWallet.balance -= amount;
    fromWallet.updatedAt = new Date();
    await this.walletRepository.update(fromWallet);

    const updatedToWallet = await this.walletRepository.findByUserId(toUserId);
    if (updatedToWallet) {
      updatedToWallet.balance += amount;
      updatedToWallet.updatedAt = new Date();
      await this.walletRepository.update(updatedToWallet);
    }

    await this.transactionRepository.create({
      fromUserId,
      toUserId,
      amount,
      type: TransactionType.TRANSFER,
    });
  }
}