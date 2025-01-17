# 🌊 Ionic API

A robust and secure REST API for interacting with Ionic Protocol across multiple chains. Built with TypeScript, Express, and Viem.

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
  - 🔘 OzeanTest
  - 🔶 CampTest

- **Core Operations**:
  - 💰 Supply assets
  - 🏦 Withdraw funds
  - 💸 Borrow assets
  - 💳 Repay loans

- **Security First**:
  - 🔒 Helmet security headers
  - ✅ Input validation
  - 🛡️ CORS protection
  - 🔐 Environment variable protection

## 🚀 Quick Start

1. **Clone & Install**
   ```bash
   git clone <repository-url>
   cd ionic-api
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Add your credentials:
   # SUPABASE_API_URL=your_supabase_url
   # SUPABASE_API_KEY=your_supabase_key
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📚 API Endpoints

### Supply Assets
POST /beta/v0/ionic/supply/:chain
Supply assets to an Ionic pool.

### Withdraw Assets
POST /beta/v0/ionic/withdraw/:chain
Withdraw your supplied assets.

### Borrow Assets
POST /beta/v0/ionic/borrow/:chain
Borrow assets from a pool.

### Repay Loan
POST /beta/v0/ionic/repay/:chain
Repay your borrowed assets.

### Get Pool Address
GET /beta/v0/ionic/pool-address/:chain/:asset
Retrieve the pool address for a specific asset.

## 🛠️ Tech Stack

- **TypeScript** - Type safety and better developer experience
- **Express** - Fast, unopinionated web framework
- **Viem** - Modern Ethereum library
- **Supabase** - Backend infrastructure
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## 🔐 Security

This API implements several security measures:
- Request validation
- Secure HTTP headers
- Environment variable protection
- Error handling

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚡ Performance

- Optimized for high throughput
- Efficient error handling
- Fast response times
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
