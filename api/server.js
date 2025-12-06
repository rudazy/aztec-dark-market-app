import express from 'express';
import cors from 'cors';
import { createAztecNodeClient } from '@aztec/aztec.js/node';
import { Fr } from '@aztec/foundation/fields';
import { getSchnorrAccountContractAddress } from '@aztec/accounts/schnorr';

const app = express();
app.use(cors());
app.use(express.json());

const PXE_URL = 'https://devnet.aztec-labs.com';

const CONTRACT_ADDRESSES = {
  token: '0x2731c1024ce94a508083fe50ae1b22a1274f0f7a4c7157e294899b366ea55816',
  escrow: '0x161fcf08c79d512031323bee0f49381ade4799a3b6b7b3470e9c5a43af9eebc2',
  orderbook: '0x23d2149ea91babceacc6e98fe5bef2dfd875622516ba182da53cb7f1b466aaac'
};

let nodeClient = null;

async function getNode() {
  if (!nodeClient) {
    nodeClient = createAztecNodeClient(PXE_URL);
  }
  return nodeClient;
}

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const node = await getNode();
    const info = await node.getNodeInfo();
    res.json({ 
      success: true, 
      network: 'devnet',
      nodeVersion: info.nodeVersion,
      contracts: CONTRACT_ADDRESSES
    });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Connect wallet
app.post('/api/wallet/connect', async (req, res) => {
  try {
    const { secretKey } = req.body;
    if (!secretKey) {
      return res.json({ success: false, error: 'Secret key required' });
    }
    
    const secret = Fr.fromHexString(secretKey);
    const salt = Fr.fromHexString('0x1234');
    const address = await getSchnorrAccountContractAddress(secret, salt);
    
    res.json({ 
      success: true, 
      address: address.toString(),
      message: 'Wallet connected'
    });
  } catch (error) {
    console.error('Connect error:', error);
    res.json({ success: false, error: error.message });
  }
});

// Get orders - returns array format
app.get('/api/orders', async (req, res) => {
  try {
    res.json({ 
      success: true, 
      orders: []
    });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Create order
app.post('/api/orders', async (req, res) => {
  try {
    const { side, price, amount, secretKey } = req.body;
    
    if (!secretKey || !side || !price || !amount) {
      return res.json({ success: false, error: 'Missing required fields' });
    }
    
    const orderId = `order_${Date.now()}`;
    
    res.json({ 
      success: true, 
      orderId,
      message: 'Order created'
    });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Get balance
app.get('/api/balance', async (req, res) => {
  try {
    res.json({ 
      success: true, 
      balance: '0',
      tokenAddress: CONTRACT_ADDRESSES.token
    });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Get balance with POST (for wallet-specific balance)
app.post('/api/balance', async (req, res) => {
  try {
    const { secretKey, tokenAddress } = req.body;
    res.json({ 
      success: true, 
      balance: '0',
      tokenAddress: tokenAddress || CONTRACT_ADDRESSES.token
    });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Get block info
app.get('/api/node/block', async (req, res) => {
  try {
    const node = await getNode();
    const tips = await node.getL2Tips();
    res.json({ 
      success: true, 
      tips
    });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Aztec Dark Market API running on port ${PORT}`);
  console.log(`Node URL: ${PXE_URL}`);
  console.log(`Contracts:`, CONTRACT_ADDRESSES);
});
