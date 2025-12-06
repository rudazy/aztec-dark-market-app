'use client';

import { useState } from 'react';
import { CONTRACT_ADDRESSES, NETWORK_CONFIG } from '../config';

export default function Footer() {
  const [isExpanded, setIsExpanded] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  return (
    <footer className="border-t border-purple-700/30 bg-gray-900/95 backdrop-blur-md mt-12">
      <div className="container mx-auto px-4 lg:px-6 py-6">
        {/* Contract Addresses Collapsible Section */}
        <div className="mb-6">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800/70 rounded-lg border border-purple-700/30 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="text-left">
                <h3 className="font-semibold text-purple-300">Contract Addresses</h3>
                <p className="text-xs text-gray-500">View deployed contracts on Devnet</p>
              </div>
            </div>
            <svg
              className={`w-5 h-5 text-purple-400 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isExpanded && (
            <div className="mt-3 p-4 bg-gray-800/30 rounded-lg border border-purple-700/20 space-y-3">
              {/* Token */}
              <div className="group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-purple-400">Token Contract</span>
                  <button
                    onClick={() => copyToClipboard(CONTRACT_ADDRESSES.token.toString(), 'Token')}
                    className="text-xs text-gray-500 hover:text-purple-400 transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <div className="font-mono text-xs text-gray-400 bg-gray-900/50 p-2 rounded border border-gray-700/50 break-all">
                  {CONTRACT_ADDRESSES.token.toString()}
                </div>
              </div>

              {/* Escrow */}
              <div className="group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-purple-400">Escrow Contract</span>
                  <button
                    onClick={() => copyToClipboard(CONTRACT_ADDRESSES.escrow.toString(), 'Escrow')}
                    className="text-xs text-gray-500 hover:text-purple-400 transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <div className="font-mono text-xs text-gray-400 bg-gray-900/50 p-2 rounded border border-gray-700/50 break-all">
                  {CONTRACT_ADDRESSES.escrow.toString()}
                </div>
              </div>

              {/* OrderBook */}
              <div className="group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-purple-400">OrderBook Contract</span>
                  <button
                    onClick={() => copyToClipboard(CONTRACT_ADDRESSES.orderBook.toString(), 'OrderBook')}
                    className="text-xs text-gray-500 hover:text-purple-400 transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <div className="font-mono text-xs text-gray-400 bg-gray-900/50 p-2 rounded border border-gray-700/50 break-all">
                  {CONTRACT_ADDRESSES.orderBook.toString()}
                </div>
              </div>

              {/* Sponsored FPC */}
              <div className="group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-purple-400">Sponsored FPC</span>
                  <button
                    onClick={() => copyToClipboard(CONTRACT_ADDRESSES.sponsoredFpc.toString(), 'FPC')}
                    className="text-xs text-gray-500 hover:text-purple-400 transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <div className="font-mono text-xs text-gray-400 bg-gray-900/50 p-2 rounded border border-gray-700/50 break-all">
                  {CONTRACT_ADDRESSES.sponsoredFpc.toString()}
                </div>
              </div>

              {/* PXE URL */}
              <div className="group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-purple-400">PXE URL</span>
                  <button
                    onClick={() => copyToClipboard(NETWORK_CONFIG.pxeUrl, 'PXE URL')}
                    className="text-xs text-gray-500 hover:text-purple-400 transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <div className="font-mono text-xs text-gray-400 bg-gray-900/50 p-2 rounded border border-gray-700/50 break-all">
                  {NETWORK_CONFIG.pxeUrl}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <a
              href="https://aztec.network"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition-colors"
            >
              Aztec Network
            </a>
            <span>•</span>
            <a
              href="https://docs.aztec.network"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition-colors"
            >
              Documentation
            </a>
            <span>•</span>
            <span className="text-gray-600">{NETWORK_CONFIG.chainId}</span>
          </div>

          <p className="text-sm text-gray-600">
            Aztec Dark Market - Privacy-First Decentralized Trading
          </p>

          <div className="text-xs text-purple-400 bg-purple-900/20 border border-purple-700/30 rounded-lg px-4 py-2 inline-block">
            All transactions are private and encrypted on Aztec Network
          </div>
        </div>
      </div>
    </footer>
  );
}
