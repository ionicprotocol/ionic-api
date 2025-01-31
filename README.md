# 🌊 Ionic API v2

A robust and secure REST API for interacting with Ionic and Morpho protocols across multiple chains. Built with TypeScript, NestJS, and Viem.

## 🌟 Features

- **Multi-Chain Support**: Seamlessly interact with Ionic Protocol on:
  - ⚡ Mode Network
  - 🔵 Base 
  - 🔴 Optimism
  - 🟣 Bob
  - 🟡 Fraxtal
  - 🟢 Lisk
  - 🔷 Ink
  - 🟨 SuperSeed
  - 🟦 WorldChain
  - 🟩 Swell
  - 🟪 Soneium

- **Core Operations**:
  - 📊 Get market information
  - 💼 View user positions
  - 💰 Supply assets
  - 🏦 Withdraw funds
  - 💸 Borrow assets
  - 💳 Repay loans

- **Security First**:
  - ✅ Input validation with class-validator
  - 🛡️ CORS protection
  - 🔐 Environment variable protection
  - 📝 Comprehensive request logging

## 🚀 Quick Start

1. **Clone & Install**
   ```bash
   git clone <repository-url>
   cd ionic-api-v2
   pnpm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Add your credentials:
   # SUPABASE_URL=your_supabase_url
   # SUPABASE_KEY=your_supabase_key
   ```

3. **Start Development Server**
   ```bash
   pnpm run start:dev
   ```

## 📚 API Documentation

### Swagger UI
Access our interactive API documentation at `/api-docs` to:
- Explore all available endpoints
- Test API calls directly from your browser
- View request/response schemas
- Download OpenAPI specification

### Available Endpoints

#### Ionic Protocol Endpoints

<details>
<summary><b>Get Market Information</b></summary>

```http
GET /beta/v0/ionic/market/:chain
```
Get detailed market information with optional filters:
- `asset`: Asset symbol (e.g., "WETH")
- `address`: Market address
- `poolAddress`: Pool address
- `underlyingAddress`: Underlying token address
- `underlyingName`: Underlying token name
- `underlyingSymbol`: Underlying token symbol
</details>

<details>
<summary><b>Get User Positions</b></summary>

```http
GET /beta/v0/ionic/position/:chain/:address
```
Get user positions across all markets, including:
- Pool information
- Asset balances
- Supply/borrow amounts
- Health factors
- Reward information
</details>

<details>
<summary><b>Supply Assets</b></summary>

```http
POST /beta/v0/ionic/supply/:chain
```
Supply assets to an Ionic pool. Request body:
```json
{
  "sender": "0x...",
  "call_data": {
    "asset": "WETH",
    "amount": 1.5,
    "on_behalf_of": "0x..."
  }
}
```
</details>

<details>
<summary><b>Withdraw Assets</b></summary>

```http
POST /beta/v0/ionic/withdraw/:chain
```
Withdraw your supplied assets. Request body:
```json
{
  "sender": "0x...",
  "call_data": {
    "asset": "WETH",
    "amount": 1.0,
    "on_behalf_of": "0x..."
  }
}
```
</details>

<details>
<summary><b>Borrow Assets</b></summary>

```http
POST /beta/v0/ionic/borrow/:chain
```
Borrow assets from a pool. Request body:
```json
{
  "sender": "0x...",
  "call_data": {
    "asset": "WETH",
    "amount": 0.5,
    "on_behalf_of": "0x..."
  }
}
```
</details>

<details>
<summary><b>Repay Loan</b></summary>

```http
POST /beta/v0/ionic/repay/:chain
```
Repay your borrowed assets. Request body:
```json
{
  "sender": "0x...",
  "call_data": {
    "asset": "WETH",
    "amount": 0.5,
    "on_behalf_of": "0x..."
  }
}
```
</details>

#### Morpho Protocol Endpoints

<details>
<summary><b>Get Position Details</b></summary>

```http
GET /beta/v0/morpho/position/:chain/:marketId/:sender
```
Get detailed position information for a specific market and user.
</details>

<details>
<summary><b>Get Market Details</b></summary>

```http
GET /beta/v0/morpho/market/:chain
```
Get market details with optional filters:
- `marketId`: Market ID
- `collateralToken`: Collateral token address
- `collateralTokenSymbol`: Collateral token symbol
- `borrowToken`: Borrow token address
- `borrowTokenSymbol`: Borrow token symbol
</details>

## 🛠️ Tech Stack

- **TypeScript** - Type safety and better developer experience
- **NestJS** - Progressive Node.js framework
- **Viem** - Modern Ethereum library
- **Supabase** - Backend infrastructure
- **Swagger** - API documentation
- **Jest** - Testing framework

## 🔐 Security

This API implements several security measures:
- Request validation with class-validator
- Comprehensive request logging
- Environment variable protection
- Proper error handling and logging

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚡ Performance

- Built on NestJS for optimal performance
- Efficient error handling with global filters
- Fast response times with proper caching
- Minimal dependencies

## 🔗 Related Links

- [Ionic Protocol Documentation](https://docs.ionic.money/)
- [Mode Network](https://mode.network/)
- [Base](https://base.org/)
- [Optimism](https://optimism.io/)
- [Lisk](https://lisk.com/)
- [Swell Network](https://swellnetwork.io/)

---

<p align="center">Built with ❤️ for the DeFi community</p>
