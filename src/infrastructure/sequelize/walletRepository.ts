import { Sequelize, Model, DataTypes } from 'sequelize';
import { WalletRepository } from '../../domain/interfaces/walletRepository';
import { Wallet } from '../../domain/entities/wallet';

class WalletModel extends Model implements Wallet {
  public userId!: string;
  public balance!: number;
  public updatedAt!: Date;
}

export class SequelizeWalletRepository implements WalletRepository {
  constructor(private sequelize: Sequelize) {
    WalletModel.init(
      {
        userId: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        balance: {
          type: DataTypes.DECIMAL(10, 2),
          defaultValue: 0,
        },
        updatedAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        modelName: 'Wallet',
        tableName: 'wallets',
        timestamps: false,
      }
    );
  }

  async create(wallet: Omit<Wallet, 'updatedAt'>): Promise<Wallet> {
    const newWallet = await WalletModel.create({ ...wallet, updatedAt: new Date() });
    return newWallet.toJSON() as Wallet;
  }

  async findByUserId(userId: string): Promise<Wallet | null> {
    const wallet = await WalletModel.findByPk(userId);
    return wallet ? (wallet.toJSON() as Wallet) : null;
  }

  async update(wallet: Wallet): Promise<Wallet> {
    await WalletModel.update(wallet, { where: { userId: wallet.userId } });
    const updatedWallet = await this.findByUserId(wallet.userId);
    if (!updatedWallet) throw new Error('Wallet not found');
    return updatedWallet;
  }
}