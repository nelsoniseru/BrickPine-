"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sequelize_1 = require("sequelize");
const userService_1 = require("./application/service/userService");
const walletService_1 = require("./application/service/walletService");
const transactionService_1 = require("./application/service/transactionService");
const userRepository_1 = require("./infrastructure/sequelize/userRepository");
const walletRepository_1 = require("./infrastructure/sequelize/walletRepository");
const transactionRepository_1 = require("./infrastructure/sequelize/transactionRepository");
const routes_1 = require("./infrastructure/adapters/express/routes");
const logger_1 = __importDefault(require("./infrastructure/logger/logger"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const sequelize = new sequelize_1.Sequelize('sqlite::memory:');
sequelize.sync({ force: true }).then(() => {
    logger_1.default.info('Database synced');
});
const userRepository = new userRepository_1.SequelizeUserRepository(sequelize);
const walletRepository = new walletRepository_1.SequelizeWalletRepository(sequelize);
const transactionRepository = new transactionRepository_1.SequelizeTransactionRepository(sequelize);
const userService = new userService_1.UserService(userRepository);
const walletService = new walletService_1.WalletService(userRepository, walletRepository, transactionRepository);
const transactionService = new transactionService_1.TransactionService(transactionRepository);
app.use('/api', (0, routes_1.setupRoutes)(userService, walletService, transactionService));
const PORT = 3000;
app.listen(PORT, () => {
    logger_1.default.info(`Server running on port ${PORT}`);
});
