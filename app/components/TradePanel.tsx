'use client';

import { useState } from 'react';
import { createOrder } from '../lib/api';
import { TRADING_CONFIG } from '../config';

interface TradePanelProps {
  address: string | null;
}

type OrderType = 'buy' | 'sell';

export default function TradePanel({ address }: TradePanelProps) {
  const [orderType, setOrderType] = useState<OrderType>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      setError('Please connect your wallet first');
      return;
    }

    if (!amount || !price) {
      setError('Please enter both amount and price');
      return;
    }

    const amountNum = parseFloat(amount);
    const priceNum = parseFloat(price);

    if (amountNum < TRADING_CONFIG.minOrderAmount) {
      setError(`Minimum order amount is ${TRADING_CONFIG.minOrderAmount}`);
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      console.log('Creating order:', {
        type: orderType,
        amount: amount,
        price: price,
      });

      // Call API to create order
      const response = await createOrder(orderType === 'buy', amount, price);

      setSuccess(`${orderType.toUpperCase()} order created successfully! Order ID: ${response.orderId}`);
      setAmount('');
      setPrice('');
    } catch (err) {
      setError('Failed to create order: ' + (err as Error).message);
      console.error('Order creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = amount && price ? (parseFloat(amount) * parseFloat(price)).toFixed(4) : '0.0000';

  return (
    <div className="bg-gray-900 border border-purple-700/30 rounded-xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-purple-300 mb-6">Trade Panel</h2>

      {/* Order Type Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setOrderType('buy')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            orderType === 'buy'
              ? 'bg-green-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          BUY
        </button>
        <button
          onClick={() => setOrderType('sell')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            orderType === 'sell'
              ? 'bg-red-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          SELL
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Amount
          </label>
          <input
            type="number"
            step="0.000001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 bg-gray-800 border border-purple-700/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
          <div className="text-xs text-gray-500 mt-1">
            Min: {TRADING_CONFIG.minOrderAmount}
          </div>
        </div>

        {/* Price Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Price
          </label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 bg-gray-800 border border-purple-700/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Total */}
        <div className="bg-gray-800 border border-purple-700/30 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Total:</span>
            <span className="text-white font-mono text-lg">{total}</span>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="text-red-400 text-sm bg-red-900/20 border border-red-700/30 rounded-lg p-3">
            {error}
          </div>
        )}

        {success && (
          <div className="text-green-400 text-sm bg-green-900/20 border border-green-700/30 rounded-lg p-3">
            {success}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!address || isSubmitting}
          className={`w-full font-medium py-3 px-4 rounded-lg transition-colors ${
            orderType === 'buy'
              ? 'bg-green-600 hover:bg-green-700 disabled:bg-gray-700'
              : 'bg-red-600 hover:bg-red-700 disabled:bg-gray-700'
          } text-white disabled:cursor-not-allowed`}
        >
          {isSubmitting
            ? 'Processing...'
            : !address
            ? 'Connect Wallet First'
            : `${orderType.toUpperCase()}`}
        </button>
      </form>

      {/* Privacy Notice */}
      <div className="mt-4 text-xs text-purple-400 bg-purple-900/20 border border-purple-700/30 rounded-lg p-3">
        🔒 Your trades are private and encrypted on Aztec Network
      </div>
    </div>
  );
}
