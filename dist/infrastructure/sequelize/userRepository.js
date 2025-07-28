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
exports.SequelizeUserRepository = void 0;
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
class UserModel extends sequelize_1.Model {
}
class SequelizeUserRepository {
    constructor(sequelize) {
        this.sequelize = sequelize;
        UserModel.init({
            id: {
                type: sequelize_1.DataTypes.STRING,
                primaryKey: true,
                defaultValue: uuid_1.v4,
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            createdAt: {
                type: sequelize_1.DataTypes.DATE,
                defaultValue: sequelize_1.DataTypes.NOW,
            },
        }, {
            sequelize,
            modelName: 'User',
            tableName: 'users',
            timestamps: false,
        });
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = yield UserModel.create(Object.assign(Object.assign({}, user), { id: (0, uuid_1.v4)() }));
            return newUser.toJSON();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserModel.findByPk(id);
            return user ? user.toJSON() : null;
        });
    }
}
exports.SequelizeUserRepository = SequelizeUserRepository;
