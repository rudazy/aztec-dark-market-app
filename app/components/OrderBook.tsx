'use client';

import { useState, useEffect } from 'react';
import { MockWallet } from '../lib/mockWallet';

interface Order {
  id: string;
  type: 'buy' | 'sell';
  price: number;
  amount: number;
  total: number;
  timestamp: number;
}

interface OrderBookProps {
  wallet: MockWallet | null;
}

export default function OrderBook({ wallet }: OrderBookProps) {
  const [buyOrders, setBuyOrders] = useState<Order[]>([]);
  const [sellOrders, setSellOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (wallet) {
      loadOrders();
      const interval = setInterval(loadOrders, 10000);
      return () => clearInterval(interval);
    }
  }, [wallet]);

  const loadOrders = async () => {
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock buy orders (sorted by price descending)
      const mockBuyOrders: Order[] = [
        { id: '1', type: 'buy', price: 100.5, amount: 2.5, total: 251.25, timestamp: Date.now() - 10000 },
        { id: '2', type: 'buy', price: 100.0, amount: 1.8, total: 180.0, timestamp: Date.now() - 20000 },
        { id: '3', type: 'buy', price: 99.5, amount: 3.2, total: 318.4, timestamp: Date.now() - 30000 },
        { id: '4', type: 'buy', price: 99.0, amount: 1.5, total: 148.5, timestamp: Date.now() - 40000 },
        { id: '5', type: 'buy', price: 98.5, amount: 2.0, total: 197.0, timestamp: Date.now() - 50000 },
        { id: '6', type: 'buy', price: 98.0, amount: 1.3, total: 127.4, timestamp: Date.now() - 60000 },
        { id: '7', type: 'buy', price: 97.5, amount: 2.8, total: 273.0, timestamp: Date.now() - 70000 },
      ];

      // Mock sell orders (sorted by price ascending)
      const mockSellOrders: Order[] = [
        { id: '8', type: 'sell', price: 101.0, amount: 1.2, total: 121.2, timestamp: Date.now() - 15000 },
        { id: '9', type: 'sell', price: 101.5, amount: 2.0, total: 203.0, timestamp: Date.now() - 25000 },
        { id: '10', type: 'sell', price: 102.0, amount: 1.7, total: 173.4, timestamp: Date.now() - 35000 },
        { id: '11', type: 'sell', price: 102.5, amount: 3.0, total: 307.5, timestamp: Date.now() - 45000 },
        { id: '12', type: 'sell', price: 103.0, amount: 1.1, total: 113.3, timestamp: Date.now() - 55000 },
        { id: '13', type: 'sell', price: 103.5, amount: 2.4, total: 248.4, timestamp: Date.now() - 65000 },
        { id: '14', type: 'sell', price: 104.0, amount: 1.9, total: 197.6, timestamp: Date.now() - 75000 },
      ];

      setBuyOrders(mockBuyOrders);
      setSellOrders(mockSellOrders);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const spread = buyOrders.length > 0 && sellOrders.length > 0
    ? (sellOrders[0].price - buyOrders[0].price).toFixed(2)
    : '—';

  const spreadPercent = buyOrders.length > 0 && sellOrders.length > 0
    ? (((sellOrders[0].price - buyOrders[0].price) / buyOrders[0].price) * 100).toFixed(2)
    : '—';

  return (
    <div className="bg-gray-900 border border-purple-700/30 rounded-xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-300">Order Book</h2>
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-purple-400">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span>Updating...</span>
          </div>
        )}
      </div>

      {!wallet ? (
        <div className="text-center text-gray-500 py-12 bg-gray-800/30 rounded-lg border border-gray-700/50">
          <div className="text-4xl mb-3">🔒</div>
          <p className="text-lg mb-2">Connect Your Wallet</p>
          <p className="text-sm text-gray-600">View live order book and start trading</p>
        </div>
      ) : (
        <div>
          {/* Desktop: Side by Side Layout */}
          <div className="hidden md:grid md:grid-cols-2 gap-6">
            {/* Buy Orders (Bids) */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wide">
                  Buy Orders (Bids)
                </h3>
              </div>
              <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-green-700/20">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs text-gray-500 bg-gray-900/50">
                      <th className="px-3 py-2 text-left">Price</th>
                      <th className="px-3 py-2 text-left">Amount</th>
                      <th className="px-3 py-2 text-left">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buyOrders.map((order, idx) => (
                      <tr
                        key={order.id}
                        className="hover:bg-green-900/10 transition-colors border-t border-gray-800/50"
                        style={{ opacity: 1 - (idx * 0.1) }}
                      >
                        <td className="px-3 py-2 font-mono text-green-400 font-medium">
                          ${order.price.toFixed(2)}
                        </td>
                        <td className="px-3 py-2 font-mono text-gray-300 text-sm">
                          {order.amount.toFixed(4)}
                        </td>
                        <td className="px-3 py-2 font-mono text-gray-400 text-sm">
                          ${order.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sell Orders (Asks) */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wide">
                  Sell Orders (Asks)
                </h3>
              </div>
              <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-red-700/20">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs text-gray-500 bg-gray-900/50">
                      <th className="px-3 py-2 text-left">Price</th>
                      <th className="px-3 py-2 text-left">Amount</th>
                      <th className="px-3 py-2 text-left">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellOrders.map((order, idx) => (
                      <tr
                        key={order.id}
                        className="hover:bg-red-900/10 transition-colors border-t border-gray-800/50"
                        style={{ opacity: 1 - (idx * 0.1) }}
                      >
                        <td className="px-3 py-2 font-mono text-red-400 font-medium">
                          ${order.price.toFixed(2)}
                        </td>
                        <td className="px-3 py-2 font-mono text-gray-300 text-sm">
                          {order.amount.toFixed(4)}
                        </td>
                        <td className="px-3 py-2 font-mono text-gray-400 text-sm">
                          ${order.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Mobile: Stacked Layout */}
          <div className="md:hidden space-y-4">
            {/* Sell Orders */}
            <div>
              <div className="text-sm font-semibold text-red-400 mb-2">SELL ORDERS</div>
              <div className="bg-gray-800/50 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs text-gray-500">
                      <th className="px-2 py-2 text-left">Price</th>
                      <th className="px-2 py-2 text-left">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellOrders.slice(0, 5).map(order => (
                      <tr key={order.id} className="border-t border-gray-800">
                        <td className="px-2 py-2 font-mono text-red-400 text-sm">
                          ${order.price.toFixed(2)}
                        </td>
                        <td className="px-2 py-2 font-mono text-gray-300 text-sm">
                          {order.amount.toFixed(4)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Buy Orders */}
            <div>
              <div className="text-sm font-semibold text-green-400 mb-2">BUY ORDERS</div>
              <div className="bg-gray-800/50 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs text-gray-500">
                      <th className="px-2 py-2 text-left">Price</th>
                      <th className="px-2 py-2 text-left">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buyOrders.slice(0, 5).map(order => (
                      <tr key={order.id} className="border-t border-gray-800">
                        <td className="px-2 py-2 font-mono text-green-400 text-sm">
                          ${order.price.toFixed(2)}
                        </td>
                        <td className="px-2 py-2 font-mono text-gray-300 text-sm">
                          {order.amount.toFixed(4)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Spread Info */}
          <div className="mt-6 bg-purple-900/20 border border-purple-700/30 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Spread</div>
                <div className="text-lg font-mono text-purple-300">${spread}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Spread %</div>
                <div className="text-lg font-mono text-purple-300">{spreadPercent}%</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
