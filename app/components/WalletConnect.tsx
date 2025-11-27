'use client';

import { useState, useEffect } from 'react';
import { MockWallet, WalletUtils } from '../lib/mockWallet';

interface WalletConnectProps {
  onWalletChange: (wallet: MockWallet | null) => void;
}

export default function WalletConnect({ onWalletChange }: WalletConnectProps) {
  const [wallet, setWallet] = useState<MockWallet | null>(null);
  const [secretKey, setSecretKey] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Try to load wallet from localStorage on mount
    const savedWallet = WalletUtils.loadWallet();
    if (savedWallet) {
      setWallet(savedWallet);
      onWalletChange(savedWallet);
    }
  }, [onWalletChange]);

  const connectWallet = async () => {
    if (!secretKey) {
      setError('Please enter a secret key');
      return;
    }

    if (!WalletUtils.isValidSecretKey(secretKey)) {
      setError('Secret key must be at least 8 characters');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Derive address from secret key
      const address = await WalletUtils.deriveAddress(secretKey);

      const newWallet: MockWallet = {
        address,
        secretKey,
      };

      // Save to localStorage
      WalletUtils.saveWallet(newWallet);

      setWallet(newWallet);
      onWalletChange(newWallet);
    } catch (err) {
      setError('Failed to connect wallet: ' + (err as Error).message);
      console.error(err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    WalletUtils.clearWallet();
    setWallet(null);
    setSecretKey('');
    onWalletChange(null);
  };

  return (
    <div className="bg-gray-900 border border-purple-700/30 rounded-xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-purple-300 mb-6">Wallet</h2>

      {!wallet ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Secret Key
            </label>
            <input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && connectWallet()}
              placeholder="Enter your secret key (min 8 chars)"
              className="w-full px-3 py-2 bg-gray-800 border border-purple-700/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
            <div className="text-xs text-gray-500 mt-1">
              Demo mode: Any secret key will work (min 8 characters)
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}

          <button
            onClick={connectWallet}
            disabled={isConnecting || !secretKey}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-400 mb-1">Connected Address:</div>
            <div className="text-xs text-purple-300 font-mono break-all bg-gray-800 p-2 rounded">
              {wallet.address}
            </div>
          </div>

          <button
            onClick={disconnectWallet}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
