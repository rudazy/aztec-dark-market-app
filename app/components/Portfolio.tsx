'use client';

import { useState, useEffect } from 'react';
import { MockWallet } from '../lib/mockWallet';

interface Asset {
  symbol: string;
  balance: number;
  value: number;
}

interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  total: number;
  timestamp: number;
  status: 'completed' | 'pending' | 'failed';
}

interface PortfolioProps {
  wallet: MockWallet | null;
}

export default function Portfolio({ wallet }: PortfolioProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'assets' | 'history'>('assets');

  useEffect(() => {
    if (wallet) {
      loadPortfolio();
      const interval = setInterval(loadPortfolio, 15000); // Refresh every 15 seconds
      return () => clearInterval(interval);
    }
  }, [wallet]);

  const loadPortfolio = async () => {
    setIsLoading(true);

    try {
      // TODO: Fetch actual balances from Token contract
      // TODO: Fetch transaction history from OrderBook contract

      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock assets data
      const mockAssets: Asset[] = [
        { symbol: 'ETH', balance: 5.2341, value: 10500.23 },
        { symbol: 'USDC', balance: 12500.50, value: 12500.50 },
        { symbol: 'TOKEN', balance: 1000.0, value: 5000.0 },
      ];

      // Mock transaction history
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          type: 'buy',
          amount: 10.5,
          price: 100.0,
          total: 1050.0,
          timestamp: Date.now() - 3600000,
          status: 'completed',
        },
        {
          id: '2',
          type: 'sell',
          amount: 5.2,
          price: 102.5,
          total: 533.0,
          timestamp: Date.now() - 7200000,
          status: 'completed',
        },
        {
          id: '3',
          type: 'buy',
          amount: 15.0,
          price: 99.5,
          total: 1492.5,
          timestamp: Date.now() - 10800000,
          status: 'completed',
        },
        {
          id: '4',
          type: 'buy',
          amount: 8.0,
          price: 101.0,
          total: 808.0,
          timestamp: Date.now() - 14400000,
          status: 'pending',
        },
        {
          id: '5',
          type: 'sell',
          amount: 3.5,
          price: 100.0,
          total: 350.0,
          timestamp: Date.now() - 18000000,
          status: 'failed',
        },
      ];

      setAssets(mockAssets);
      setTransactions(mockTransactions);
    } catch (err) {
      console.error('Failed to load portfolio:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="bg-gray-900 border border-purple-700/30 rounded-xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-300">Portfolio</h2>
        {isLoading && (
          <div className="text-sm text-gray-500">Loading...</div>
        )}
      </div>

      {!wallet ? (
        <div className="text-center text-gray-500 py-8">
          Connect your wallet to view your portfolio
        </div>
      ) : (
        <div>
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-800">
            <button
              onClick={() => setActiveTab('assets')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'assets'
                  ? 'text-purple-300 border-b-2 border-purple-500'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Assets
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'history'
                  ? 'text-purple-300 border-b-2 border-purple-500'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              History
            </button>
          </div>

          {/* Assets Tab */}
          {activeTab === 'assets' && (
            <div className="space-y-4">
              {/* Total Value */}
              <div className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Total Portfolio Value</div>
                <div className="text-2xl font-bold text-purple-300 font-mono">
                  ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              {/* Assets List */}
              <div className="space-y-2">
                {assets.map((asset) => (
                  <div
                    key={asset.symbol}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-purple-700/50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-white">{asset.symbol}</div>
                        <div className="text-sm text-gray-400 font-mono">
                          {asset.balance.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-purple-300 font-mono">
                          ${asset.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-2">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-purple-700/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            tx.type === 'buy'
                              ? 'bg-green-900/30 text-green-400'
                              : 'bg-red-900/30 text-red-400'
                          }`}
                        >
                          {tx.type.toUpperCase()}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            tx.status === 'completed'
                              ? 'bg-blue-900/30 text-blue-400'
                              : tx.status === 'pending'
                              ? 'bg-yellow-900/30 text-yellow-400'
                              : 'bg-red-900/30 text-red-400'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(tx.timestamp)}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <div className="text-gray-500 text-xs">Amount</div>
                        <div className="text-white font-mono">{tx.amount}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs">Price</div>
                        <div className="text-white font-mono">${tx.price}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs">Total</div>
                        <div className="text-purple-300 font-mono">${tx.total}</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-600 py-8">
                  No transaction history
                </div>
              )}
            </div>
          )}

          {/* Privacy Notice */}
          <div className="mt-6 text-xs text-purple-400 bg-purple-900/20 border border-purple-700/30 rounded-lg p-3">
            🔒 All balances and transactions are private on Aztec Network
          </div>
        </div>
      )}
    </div>
  );
}
