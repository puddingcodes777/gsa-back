# Backend Boilerplate

This repository serves as a backend boilerplate for building scalable Node.js applications using TypeScript, Express, and Mongoose. It includes essential packages and scripts for development, testing, and production environments.

## Features

- **TypeScript Support**: Fully typed codebase using TypeScript.
- **Express Framework**: Lightweight and flexible web framework.
- **Mongoose**: MongoDB object modeling for Node.js.
- **Authentication**: JWT-based authentication with Passport.js.
- **Redis Integration**: For caching and session management.
- **Stripe Integration**: Payment processing support.
- **Shippo Integration**: Shipping API support.
- **Cron Jobs**: Scheduled tasks using the `cron` package.
- **Security**: Helmet for securing HTTP headers.
- **Code Quality**: ESLint and Prettier for linting and formatting.

## Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd <repository-folder>
npm install
```

## Scripts

The following scripts are available:

- **Start Production**:
  ```bash
  npm run start
  ```
  Starts the application in production mode.

- **Start Admin Worker**:
  ```bash
  npm run start:admin
  ```
  Starts the admin worker on port `3004`.

- **Start Development**:
  ```bash
  npm run dev
  ```
  Starts the application in development mode.

- **Start Admin Worker in Development**:
  ```bash
  npm run dev:admin
  ```
  Starts the admin worker in development mode.

- **Linting**:
  ```bash
  npm run lint
  ```
  Runs ESLint to check for code issues.

- **Build**:
  ```bash
  npm run build
  ```
  Compiles TypeScript files into JavaScript and outputs them to the `dist` folder.

- **Format Code**:
  ```bash
  npm run format
  ```
  Formats the code using Prettier.

## Environment Variables

Create a `.env` file in the root directory and include the following variables:

```env
PORT=<application-port>
MONGO_URI=<mongodb-connection-string>
JWT_SECRET=<jwt-secret>
REDIS_URL=<redis-url>
STRIPE_SECRET=<stripe-secret>
SHIPPO_API_KEY=<shippo-api-key>
```

## Dependencies

### Production Dependencies
- `bcrypt`: Password hashing.
- `compression`: HTTP response compression.
- `cors`: Cross-Origin Resource Sharing.
- `cron`: Scheduled tasks.
- `cross-fetch`: Fetch API for Node.js.
- `dotenv`: Environment variable management.
- `express`: Web framework.
- `helmet`: HTTP header security.
- `jsonwebtoken`: JWT authentication.
- `moment`: Date manipulation.
- `mongoose`: MongoDB ORM.
- `multer`: File uploads.
- `nanoid`: Unique ID generation.
- `passport`: Authentication middleware.
- `passport-jwt`: JWT strategy for Passport.
- `redis`: Redis client.
- `shippo`: Shipping API client.
- `stripe`: Payment processing.
- `validator`: Input validation.

### Development Dependencies
- `@types/*`: Type definitions for various packages.
- `cross-env`: Environment variable management for cross-platform compatibility.
- `eslint`: Linting tool.
- `ts-node`: TypeScript execution environment.
- `ts-node-dev`: Development server for TypeScript.
- `tsconfig-paths`: Support for path mappings in TypeScript.
- `typescript`: TypeScript compiler.

## Folder Structure

```
├── src
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── services
│   └── index.ts
├── dist
├── .env
├── package.json
├── tsconfig.json
├── eslint.json
└── README.md
```

- **src**: Contains the application source code.
- **dist**: Compiled JavaScript code for production.
- **.env**: Environment variables.
- **package.json**: Project metadata and dependencies.
- **tsconfig.json**: TypeScript configuration.
- **eslint.json**: ESLint configuration.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License.

## Contact
For any questions or inquiries, please contact the project maintainers at [Lucas-coincodes0313](https://github.com/lucas-coincodes0313).

<!-- Security scan triggered at 2025-09-01 20:17:07 -->

<!-- Security scan triggered at 2025-09-09 05:53:29 -->

<!-- Security scan triggered at 2025-09-28 16:03:00 -->