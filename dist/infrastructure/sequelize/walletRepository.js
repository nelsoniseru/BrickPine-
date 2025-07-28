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
exports.SequelizeWalletRepository = void 0;
const sequelize_1 = require("sequelize");
class WalletModel extends sequelize_1.Model {
}
class SequelizeWalletRepository {
    constructor(sequelize) {
        this.sequelize = sequelize;
        WalletModel.init({
            userId: {
                type: sequelize_1.DataTypes.STRING,
                primaryKey: true,
            },
            balance: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                defaultValue: 0,
            },
            updatedAt: {
                type: sequelize_1.DataTypes.DATE,
                defaultValue: sequelize_1.DataTypes.NOW,
            },
        }, {
            sequelize,
            modelName: 'Wallet',
            tableName: 'wallets',
            timestamps: false,
        });
    }
    create(wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            const newWallet = yield WalletModel.create(Object.assign(Object.assign({}, wallet), { updatedAt: new Date() }));
            return newWallet.toJSON();
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = yield WalletModel.findByPk(userId);
            return wallet ? wallet.toJSON() : null;
        });
    }
    update(wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            yield WalletModel.update(wallet, { where: { userId: wallet.userId } });
            const updatedWallet = yield this.findByUserId(wallet.userId);
            if (!updatedWallet)
                throw new Error('Wallet not found');
            return updatedWallet;
        });
    }
}
exports.SequelizeWalletRepository = SequelizeWalletRepository;
