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
exports.SequelizeTransactionRepository = void 0;
const sequelize_1 = require("sequelize"); // Add Op to the import
const uuid_1 = require("uuid");
class TransactionModel extends sequelize_1.Model {
}
class SequelizeTransactionRepository {
    constructor(sequelize) {
        this.sequelize = sequelize;
        TransactionModel.init({
            id: {
                type: sequelize_1.DataTypes.STRING,
                primaryKey: true,
                defaultValue: uuid_1.v4,
            },
            fromUserId: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            toUserId: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            amount: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            type: {
                type: sequelize_1.DataTypes.ENUM('FUND', 'TRANSFER'),
                allowNull: false,
            },
            createdAt: {
                type: sequelize_1.DataTypes.DATE,
                defaultValue: sequelize_1.DataTypes.NOW,
            },
        }, {
            sequelize,
            modelName: 'Transaction',
            tableName: 'transactions',
            timestamps: false,
        });
    }
    create(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const newTransaction = yield TransactionModel.create(Object.assign(Object.assign({}, transaction), { id: (0, uuid_1.v4)() }));
            return newTransaction.toJSON();
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const transactions = yield TransactionModel.findAll({
                where: {
                    [sequelize_1.Op.or]: [{ fromUserId: userId }, { toUserId: userId }],
                },
            });
            return transactions.map((t) => t.toJSON());
        });
    }
}
exports.SequelizeTransactionRepository = SequelizeTransactionRepository;
