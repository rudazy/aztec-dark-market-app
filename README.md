# Aztec Dark Market

A privacy-preserving trading platform built on Aztec Network. Execute trades with encrypted orders using zero-knowledge proofs.

## Deployed Contracts (Devnet v3.0.0-devnet.5)

| Contract | Address |
|----------|---------|
| Token | 0x2731c1024ce94a508083fe50ae1b22a1274f0f7a4c7157e294899b366ea55816 |
| Escrow | 0x161fcf08c79d512031323bee0f49381ade4799a3b6b7b3470e9c5a43af9eebc2 |
| OrderBook | 0x23d2149ea91babceacc6e98fe5bef2dfd875622516ba182da53cb7f1b466aaac |

## Architecture

The application uses a split architecture due to Aztec.js requiring Node.js Buffer APIs unavailable in browsers:

- Frontend: Next.js React application (browser-safe)
- Backend: Express.js API with @aztec/aztec.js@3.0.0-devnet.5
- Proving: Handled server-side where AVX2 instructions are available

## Quick Start (GitHub Codespaces)

Codespaces provides the AVX2 CPU support required for proof generation.

1. Open this repository in GitHub Codespaces
2. Start the API server:
   ```bash
   cd api && npm install && node server.js
   ```
3. In a new terminal, configure and start the frontend:
   ```bash
   echo "NEXT_PUBLIC_API_URL=<your-3001-port-url>" > .env.local
   npm install && npm run dev
   ```
4. In the Ports tab, set port 3001 visibility to Public
5. Access the application through the port 3000 URL

## Generating a Test Wallet

Generate a 32-byte hex secret key for testing:
- Using Aztec CLI: `aztec-wallet create-account`
- Manual: 0x followed by 64 random hexadecimal characters

## Contract Source

Noir contract implementations: https://github.com/rudazy/Aztec-

## Technical Stack

- Noir smart contracts on Aztec Network
- Next.js 14 with TypeScript
- Express.js API server
- Tailwind CSS

## License

MIT
