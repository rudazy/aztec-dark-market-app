'use client';

import { useState, useEffect } from 'react';
import { connectWallet as apiConnectWallet, getHealth } from '../lib/api';

interface WalletConnectProps {
  onWalletChange: (address: string | null) => void;
}

export default function WalletConnect({ onWalletChange }: WalletConnectProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [secretKey, setSecretKey] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [apiHealthy, setApiHealthy] = useState(false);

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        setStatus('Connecting to API backend...');
        await getHealth();
        setApiHealthy(true);
        setStatus('API backend connected');
      } catch (err) {
        setError('Failed to connect to API backend: ' + (err as Error).message);
        console.error(err);
      }
    };

    checkApiHealth();
  }, []);

  const handleConnectWallet = async () => {
    if (!apiHealthy) {
      setError('API backend not ready. Please wait...');
      return;
    }

    if (!secretKey) {
      setError('Please enter a secret key');
      return;
    }

    if (secretKey.length < 32) {
      setError('Secret key must be at least 32 characters (hex string)');
      return;
    }

    setIsConnecting(true);
    setError('');
    setStatus('');

    try {
      setStatus('Connecting wallet via API...');
      const response = await apiConnectWallet(secretKey);

      setAddress(response.address);
      onWalletChange(response.address);
      setStatus('Wallet connected successfully!');

      // Save to localStorage for convenience
      if (typeof window !== 'undefined') {
        localStorage.setItem('aztec_secret_key', secretKey);
        localStorage.setItem('aztec_address', response.address);
      }
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError('Failed to connect wallet: ' + errorMessage);
      console.error('Wallet connection error:', err);
      setStatus('');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setSecretKey('');
    setStatus('');
    onWalletChange(null);

    if (typeof window !== 'undefined') {
      localStorage.removeItem('aztec_secret_key');
      localStorage.removeItem('aztec_address');
    }
  };

  // Auto-load from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('aztec_secret_key');
    const savedAddress = localStorage.getItem('aztec_address');
    if (savedKey && savedAddress && apiHealthy && !address) {
      setSecretKey(savedKey);
      setAddress(savedAddress);
      onWalletChange(savedAddress);
      setStatus('Wallet loaded from session');
    }
  }, [apiHealthy, address, onWalletChange]);

  return (
    <div className="bg-gray-900 border border-purple-700/30 rounded-xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-purple-300 mb-6">Wallet</h2>

      {!address ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Secret Key (Hex)
            </label>
            <input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleConnectWallet()}
              placeholder="0x..."
              className="w-full px-3 py-2 bg-gray-800 border border-purple-700/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-mono text-sm"
            />
            <div className="text-xs text-gray-500 mt-1">
              Enter your Aztec account secret key (32+ hex chars)
            </div>
          </div>

          {status && (
            <div className="text-purple-400 text-sm bg-purple-900/20 border border-purple-700/30 rounded-lg p-3">
              {status}
            </div>
          )}

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 border border-red-700/30 rounded-lg p-3">
              {error}
            </div>
          )}

          <button
            onClick={handleConnectWallet}
            disabled={isConnecting || !secretKey || !apiHealthy}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all shadow-lg"
          >
            {isConnecting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="spinner"></div>
                Connecting...
              </span>
            ) : !apiHealthy ? (
              'Connecting to API...'
            ) : (
              'Connect Wallet'
            )}
          </button>

          <div className="text-xs text-gray-600 bg-gray-800/30 rounded-lg p-3">
            <p className="font-semibold mb-1">Don't have an account?</p>
            <p>Generate a secret key using Aztec CLI or create one with crypto.randomBytes(32)</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-400 mb-1">Connected Address:</div>
            <div className="text-xs text-purple-300 font-mono break-all bg-gray-800 p-3 rounded-lg border border-purple-700/30">
              {address}
            </div>
          </div>

          <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Connected to Aztec Devnet</span>
            </div>
          </div>

          {status && (
            <div className="text-xs text-gray-500 bg-gray-800/30 rounded p-2">
              {status}
            </div>
          )}

          <button
            onClick={disconnectWallet}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}

      <div className="mt-4 text-xs text-purple-400 bg-purple-900/20 border border-purple-700/30 rounded-lg p-3">
        🔒 Using Sponsored FPC for gas-free transactions
      </div>
    </div>
  );
}
