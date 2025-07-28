A Node.js, TypeScript, and Express-based API for managing users, wallets, and transactions. The API supports creating users, funding wallets, transferring funds between users, and retrieving transaction history. It uses hexagonal architecture for modularity, Sequelize with SQLite for persistence, Joi for input validation, Winston for logging, and Swagger for API documentation.

**Author**: Iseru Nelson  
**Email**: nelsoniseru08@gmail.com  
**Phone**: 09026915561  
**Last Updated**: 02:35 PM CAT, Monday, July 28, 2025  
**Repository**: [https://github.com/nelsoniseru/BrickPine-.git](https://github.com/nelsoniseru/BrickPine-.git) (default branch: `master`)

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)


## Features
- **Create User**: Register a new user with a default wallet balance of 0.
- **Fund Wallet**: Add funds to a user's wallet.
- **Transfer Funds**: Transfer funds between users with balance validation.
- **Transaction History**: Retrieve a user's transaction history.
- **Input Validation**: Uses Joi to validate API inputs.
- **Persistence**: SQLite database via Sequelize (in-memory for development).
- **Logging**: Winston for logging to console and file (`logs/app.log`).
- **API Documentation**: Swagger UI for interactive API documentation.

## Architecture
The project follows **Hexagonal Architecture** (Ports and Adapters pattern) to ensure modularity, testability, and separation of concerns. The architecture is divided into three main layers:

1. **Domain Layer**:
   - Contains core business entities (`User`, `Wallet`, `Transaction`) and interfaces (`UserRepository`, `WalletRepository`, `TransactionRepository`).
   - Defines the business logic and contracts without dependencies on external systems.
   - Ensures the core logic is independent of frameworks or databases.

2. **Application Layer**:
   - Implements use cases through services (`UserService`, `WalletService`, `TransactionService`).
   - Orchestrates business logic by interacting with domain entities and repository interfaces.
   - Handles operations like creating users, funding wallets, transferring funds, and fetching transactions.

3. **Infrastructure Layer**:
   - Provides adapters to connect the application to external systems:
     - **Express Adapter**: Implements REST API routes using Express.
     - **Sequelize Adapter**: Provides repository implementations for SQLite database access.
     - **Logger**: Uses Winston for logging to console and file (`logs/app.log`).
   - Includes Swagger configuration for API documentation.

**Benefits of Hexagonal Architecture**:
- **Modularity**: Business logic is isolated from infrastructure, making it easy to swap out databases or frameworks.
- **Testability**: Interfaces allow mocking repositories for unit testing.
- **Scalability**: New adapters (e.g., for a different database or API framework) can be added without changing the core logic.

## Technologies
- **Node.js**: Runtime environment.
- **TypeScript**: For type safety and better developer experience.
- **Express**: Web framework for building REST APIs.
- **Sequelize**: ORM for SQLite database interactions.
- **SQLite**: In-memory database for development.
- **Joi**: Input validation for API requests.
- **Winston**: Logging library.
- **UUID**: For generating unique identifiers.
- **Swagger**: For API documentation (via `swagger-ui-express` and `swagger-jsdoc`).

Install Dependencies:
npm install

Running the Application
Compile TypeScript:
npm run build

This compiles TypeScript files to JavaScript in the dist/ directory.
Start the Server:
npm start


Or, for development:
npm run dev

Verify Server:
The server runs on http://localhost:3000. You should see logs indicating:

Server running on port 3000
Swagger UI available at http://localhost:3000/api-docs

API Documentation
Interactive API documentation is available via Swagger UI at:

http://localhost:3000/api-docs/
