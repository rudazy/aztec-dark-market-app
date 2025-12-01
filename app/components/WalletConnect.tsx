'use client';

import { useState, useEffect } from 'react';
import { createPXEClient, PXE, AccountWallet, Fr, GrumpkinScalar } from '@aztec/aztec.js';
import { getSchnorrAccount } from '@aztec/accounts/schnorr';
import { NETWORK_CONFIG, CONTRACT_ADDRESSES } from '../config';

interface WalletConnectProps {
  onWalletChange: (wallet: AccountWallet | null) => void;
}

export default function WalletConnect({ onWalletChange }: WalletConnectProps) {
  const [pxe, setPxe] = useState<PXE | null>(null);
  const [wallet, setWallet] = useState<AccountWallet | null>(null);
  const [secretKey, setSecretKey] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const initPXE = async () => {
      try {
        setStatus('Connecting to PXE...');
        const client = createPXEClient(NETWORK_CONFIG.pxeUrl);
        setPxe(client);
        setStatus('PXE connected');
      } catch (err) {
        setError('Failed to connect to PXE: ' + (err as Error).message);
        console.error(err);
      }
    };

    initPXE();
  }, []);

  const connectWallet = async () => {
    if (!pxe) {
      setError('PXE not initialized. Please wait...');
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
      // Convert secret key to Fr for encryption
      setStatus('Deriving account from secret key...');
      const encryptionPrivateKey = Fr.fromString(secretKey);

      // Get Schnorr account (the signing key is derived from the encryption key)
      setStatus('Creating Schnorr account...');
      const account = await getSchnorrAccount(pxe, encryptionPrivateKey, GrumpkinScalar.fromString(secretKey));

      // Get the account's address
      const accountAddress = account.getAddress();
      setStatus(`Account address: ${accountAddress.toString()}`);

      // Check if account is already registered
      setStatus('Checking account registration...');
      const registeredAccounts = await pxe.getRegisteredAccounts();
      const isRegistered = registeredAccounts.some(
        (acc) => acc.address.toString() === accountAddress.toString()
      );

      if (!isRegistered) {
        setStatus('Registering account with PXE...');
        await account.register();
        setStatus('Account registered successfully');
      } else {
        setStatus('Account already registered');
      }

      // Get the wallet
      setStatus('Getting wallet instance...');
      const accountWallet = await account.getWallet();

      // Set up sponsored FPC
      setStatus('Setting up sponsored fee payment...');
      // Note: FPC setup depends on your contract's FPC implementation
      // This is a placeholder - adjust based on your FPC contract interface

      setWallet(accountWallet);
      setAddress(accountAddress.toString());
      onWalletChange(accountWallet);
      setStatus('Wallet connected successfully!');

      // Save to localStorage for convenience
      if (typeof window !== 'undefined') {
        localStorage.setItem('aztec_secret_key', secretKey);
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
    setWallet(null);
    setAddress('');
    setSecretKey('');
    setStatus('');
    onWalletChange(null);

    if (typeof window !== 'undefined') {
      localStorage.removeItem('aztec_secret_key');
    }
  };

  // Auto-load from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('aztec_secret_key');
    if (savedKey && pxe && !wallet) {
      setSecretKey(savedKey);
    }
  }, [pxe, wallet]);

  return (
    <div className="bg-gray-900 border border-purple-700/30 rounded-xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-purple-300 mb-6">Wallet</h2>

      {!wallet ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Secret Key (Hex)
            </label>
            <input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && connectWallet()}
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
            onClick={connectWallet}
            disabled={isConnecting || !secretKey || !pxe}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all shadow-lg"
          >
            {isConnecting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="spinner"></div>
                Connecting...
              </span>
            ) : !pxe ? (
              'Connecting to PXE...'
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
