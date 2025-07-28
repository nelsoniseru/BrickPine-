import { Wallet } from '../entities/wallet';

export interface WalletRepository {
  create(wallet: Omit<Wallet, 'updatedAt'>): Promise<Wallet>;
  findByUserId(userId: string): Promise<Wallet | null>;
  update(wallet: Wallet): Promise<Wallet>;
}