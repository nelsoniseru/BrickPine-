import { TransactionRepository } from '../../domain/interfaces/transactionRepository';
import { Transaction } from '../../domain/entities/transaction';

export class TransactionService {
  constructor(private transactionRepository: TransactionRepository) {}

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.findByUserId(userId);
  }
}