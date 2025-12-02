# Aztec Dark Market

A privacy-preserving decentralized trading platform built on the Aztec Network, leveraging zero-knowledge proofs to enable encrypted order books and private trading.

## Project Overview

Aztec Dark Market is a proof-of-concept trading platform that demonstrates the power of zero-knowledge cryptography for financial privacy. Built on Aztec Network's Devnet, the platform allows users to:

- Place encrypted buy and sell orders that remain private on-chain
- Trade assets while preserving transaction confidentiality
- Manage portfolios without revealing holdings to the public
- Execute trades with gas-free transactions via sponsored Fee Payment Contracts (FPC)

The platform is deployed to Aztec Devnet v3.0.0-devnet.5 and serves as a demonstration of privacy-preserving DeFi applications.

## Deployed Contract Addresses (Devnet)

The following contracts are currently deployed on Aztec Devnet:

- **Token Contract**: `0x2731c1024ce94a508083fe50ae1b22a1274f0f7a4c7157e294899b366ea55816`
- **Escrow Contract**: `0x161fcf08c79d512031323bee0f49381ade4799a3b6b7b3470e9c5a43af9eebc2`
- **OrderBook Contract**: `0x23d2149ea91babceacc6e98fe5bef2dfd875622516ba182da53cb7f1b466aaac`

## Architecture

The application uses a client-server architecture to accommodate Aztec.js compatibility requirements:

### Frontend
- **Framework**: Next.js 14 with React
- **Styling**: Tailwind CSS
- **Aztec Integration**: Browser-safe API calls only (no direct Aztec.js usage)
- **Location**: Root directory

### Backend API
- **Runtime**: Node.js with Express.js
- **Aztec SDK**: @aztec/aztec.js@3.0.0-devnet.5
- **Purpose**: Handles all Aztec contract interactions
- **Location**: `/api` directory

### Why This Split?

Aztec.js requires Node.js-specific APIs (Buffer, crypto modules) that are not available in browser environments. The backend API serves as a bridge between the browser-based frontend and the Aztec Network, handling all cryptographic operations and contract interactions server-side.

## Quick Start (GitHub Codespaces - Recommended)

Aztec proof generation requires AVX2 CPU instructions, which may not be available on all development machines. GitHub Codespaces provides compatible hardware and a pre-configured development environment.

### Steps:

1. **Launch Codespace**
   - Navigate to the repository on GitHub
   - Click "Code" > "Codespaces" > "Create codespace on main"
   - Wait for the devcontainer setup to complete

2. **Start the Backend API**
   - Open a new terminal
   - Run the following commands:
     ```bash
     cd api
     npm install
     node server.js
     ```
   - The API will start on port 3001

3. **Configure Frontend Environment**
   - Open a second terminal (click the `+` icon in the terminal panel)
   - Navigate to the root directory (if not already there)
   - Install dependencies:
     ```bash
     npm install
     ```
   - Make port 3001 PUBLIC in the PORTS tab (important for API access)
   - Copy the public URL for port 3001
   - Create environment file:
     ```bash
     echo "NEXT_PUBLIC_API_URL=<your-3001-port-url>" > .env.local
     ```
   - Replace `<your-3001-port-url>` with the actual URL from the PORTS tab

4. **Start the Frontend**
   - In the same terminal, run:
     ```bash
     npm run dev
     ```
   - The frontend will start on port 3000

5. **Access the Application**
   - In the PORTS tab, click the globe icon next to port 3000
   - The application will open in your browser

## Local Development Setup

If you prefer to run the application locally, ensure your system supports AVX2 instructions:

### Prerequisites
- Node.js 18+ with AVX2-compatible CPU
- npm or yarn package manager

### Installation

1. **Install Backend Dependencies**
   ```bash
   cd api
   npm install
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd ..
   npm install
   ```

3. **Configure Environment**
   ```bash
   echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
   ```

4. **Run the Application**

   Terminal 1 (Backend):
   ```bash
   cd api
   node server.js
   ```

   Terminal 2 (Frontend):
   ```bash
   npm run dev
   ```

5. **Access the Application**
   - Open http://localhost:3000 in your browser

## Generating a Test Wallet

**Important**: This is a testnet application. Do not use real funds or production keys.

### Option 1: Using Aztec CLI
```bash
aztec-wallet create-account
```

### Option 2: Generate Random Key
Create a random 32-byte hexadecimal string:
- Format: `0x` followed by 64 random hexadecimal characters
- Example: `0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`

You can use online tools or the following Node.js snippet:
```javascript
const crypto = require('crypto');
const secretKey = '0x' + crypto.randomBytes(32).toString('hex');
console.log(secretKey);
```

## Features

### Core Functionality
- **Wallet Connection**: Secure authentication using Aztec secret keys
- **Order Book Display**: Real-time view of encrypted bids and asks
- **Trade Panel**: Interactive interface for placing buy and sell orders
- **Portfolio Management**: Track your holdings and positions
- **Sponsored Transactions**: Gas-free trading via Fee Payment Contracts

### Privacy Features
- Encrypted order amounts and prices
- Private balance tracking
- Confidential trade execution
- Zero-knowledge proof verification

## Tech Stack

### Smart Contracts
- **Language**: Noir
- **Platform**: Aztec Network (Devnet v3.0.0-devnet.5)
- **Features**: Private state, encrypted events, FPC support

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Aztec Integration**: @aztec/aztec.js@3.0.0-devnet.5
- **CORS**: Enabled for cross-origin requests

## Contract Source Code

The Noir smart contracts for this project are available in a separate repository:

https://github.com/rudazy/Aztec-

This repository contains:
- Token contract implementation
- Escrow contract for secure trades
- OrderBook contract with encrypted orders
- Fee Payment Contract for sponsored transactions

## Screenshots

Screenshots of the application interface will be added here to showcase:
- Wallet connection flow
- Order book interface
- Trade execution panel
- Portfolio dashboard

## Development Notes

### API Endpoints

The backend API exposes the following endpoints:

- `POST /api/connect-wallet` - Authenticate with secret key
- `GET /api/orders` - Retrieve current order book
- `POST /api/place-order` - Submit new buy/sell order
- `GET /api/portfolio` - Fetch user portfolio data

### Known Limitations

- Devnet deployment only (not production-ready)
- Requires AVX2 CPU support for proof generation
- Test environment with no real monetary value
- Limited scalability testing

## Security Considerations

This is an experimental application deployed on a test network. Users should be aware:

- Never use production private keys
- All transactions are on a test network
- Smart contracts have not been audited
- Use only for learning and demonstration purposes

## License

MIT License

Copyright (c) 2024 Aztec Dark Market

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
