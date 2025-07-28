import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wallet and Transaction API',
      version: '1.0.0',
      description: 'A simple wallet and transaction API with user management, funding, transfers, and transaction history.',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/infrastructure/adapters/express/routes.ts'], // Path to files with JSDoc comments
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;