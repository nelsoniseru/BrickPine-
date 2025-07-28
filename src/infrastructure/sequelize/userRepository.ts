import { Sequelize, Model, DataTypes } from 'sequelize';
import { UserRepository } from '../../domain/interfaces/userRepository';
import { User } from '../../domain/entities/user';
import { v4 as uuidv4 } from 'uuid';

class UserModel extends Model implements User {
  public id!: string;
  public name!: string;
  public createdAt!: Date;
}

export class SequelizeUserRepository implements UserRepository {
  constructor(private sequelize: Sequelize) {
    UserModel.init(
      {
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
          defaultValue: uuidv4,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: false,
      }
    );
  }

  async create(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const newUser = await UserModel.create({ ...user, id: uuidv4() });
    return newUser.toJSON() as User;
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findByPk(id);
    return user ? (user.toJSON() as User) : null;
  }
}