import express from 'express';
import { Sequelize } from 'sequelize';
import { UserService } from './application/service/userService';
import { WalletService } from './application/service/walletService';
import { TransactionService } from './application/service/transactionService';
import { SequelizeUserRepository } from './infrastructure/sequelize/userRepository';
import { SequelizeWalletRepository } from './infrastructure/sequelize/walletRepository';
import { SequelizeTransactionRepository } from './infrastructure/sequelize/transactionRepository';
import { setupRoutes } from './infrastructure/adapters/express/routes';
import logger from './infrastructure/logger/logger';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './infrastructure/swagger/swaggerConfig';

const app = express();
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const sequelize = new Sequelize('sqlite::memory:');
sequelize.sync({ force: true }).then(() => {
  logger.info('Database synced');
});

const userRepository = new SequelizeUserRepository(sequelize);
const walletRepository = new SequelizeWalletRepository(sequelize);
const transactionRepository = new SequelizeTransactionRepository(sequelize);

const userService = new UserService(userRepository);
const walletService = new WalletService(userRepository, walletRepository, transactionRepository);
const transactionService = new TransactionService(transactionRepository);

app.use('/api', setupRoutes(userService, walletService, transactionService));

const PORT = 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});