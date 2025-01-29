# Ionic API v2

A NestJS-based API server for interacting with Ionic and Morpho protocols.

## Features

- Morpho position retrieval
- Ionic market operations (supply, withdraw, borrow, repay)
- Swagger API documentation
- TypeScript support
- Docker deployment support

## Prerequisites

- Node.js 20.x or later
- npm 9.x or later
- Docker (optional, for containerized deployment)

## Installation

```bash
# Install dependencies
npm install
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
NODE_ENV=development
```

## Development

```bash
# Start development server
npm run start:dev

# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Run linting
npm run lint

# Run formatting
npm run format
```

## API Documentation

Once the server is running, visit http://localhost:3000/api-docs to view the Swagger documentation.

## Docker Deployment

```bash
# Build Docker image
docker build -t ionic-api-v2 .

# Run Docker container
docker run -p 3000:3000 ionic-api-v2
```

## API Endpoints

### Morpho

- `GET /beta/v0/morpho/position/:chain/:positionId/:account` - Get Morpho position details

### Ionic

- `GET /beta/v0/ionic/market-address/:chain/:asset` - Get Ionic market address
- `POST /beta/v0/ionic/supply/:chain` - Supply to Ionic pool
- `POST /beta/v0/ionic/withdraw/:chain` - Withdraw from Ionic pool
- `POST /beta/v0/ionic/borrow/:chain` - Borrow from Ionic pool
- `POST /beta/v0/ionic/repay/:chain` - Repay to Ionic pool

## License

[MIT](LICENSE)
