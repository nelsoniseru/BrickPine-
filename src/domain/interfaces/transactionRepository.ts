import { Transaction } from '../entities/transaction';

export interface TransactionRepository {
  create(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction>;
  findByUserId(userId: string): Promise<Transaction[]>;
}