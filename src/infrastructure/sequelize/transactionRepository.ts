import { Sequelize, Model, DataTypes, Op } from 'sequelize'; // Add Op to the import
import { TransactionRepository } from '../../domain/interfaces/transactionRepository';
import { Transaction, TransactionType } from '../../domain/entities/transaction';
import { v4 as uuidv4 } from 'uuid';

class TransactionModel extends Model implements Transaction {
  public id!: string;
  public fromUserId!: string | null;
  public toUserId!: string;
  public amount!: number;
  public type!: TransactionType;
  public createdAt!: Date;
}

export class SequelizeTransactionRepository implements TransactionRepository {
  constructor(private sequelize: Sequelize) {
    TransactionModel.init(
      {
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
          defaultValue: uuidv4,
        },
        fromUserId: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        toUserId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        amount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        type: {
          type: DataTypes.ENUM('FUND', 'TRANSFER'),
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        modelName: 'Transaction',
        tableName: 'transactions',
        timestamps: false,
      }
    );
  }

  async create(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
    const newTransaction = await TransactionModel.create({ ...transaction, id: uuidv4() });
    return newTransaction.toJSON() as Transaction;
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    const transactions = await TransactionModel.findAll({
      where: {
        [Op.or]: [{ fromUserId: userId }, { toUserId: userId }],
      },
    });
    return transactions.map((t) => t.toJSON() as Transaction);
  }
}