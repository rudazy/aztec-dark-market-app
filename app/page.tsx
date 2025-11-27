'use client';

import { useState, useRef } from 'react';
import { MockWallet } from './lib/mockWallet';
import Header from './components/Header';
import WalletConnect from './components/WalletConnect';
import TradePanel from './components/TradePanel';
import OrderBook from './components/OrderBook';
import Portfolio from './components/Portfolio';
import MobileTabs from './components/MobileTabs';
import Footer from './components/Footer';

export default function Home() {
  const [wallet, setWallet] = useState<MockWallet | null>(null);
  const [mobileTab, setMobileTab] = useState<'trade' | 'orders' | 'portfolio'>('orders');
  const walletSectionRef = useRef<HTMLDivElement>(null);

  const handleConnectClick = () => {
    if (walletSectionRef.current) {
      walletSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950">
      {/* Header */}
      <Header wallet={wallet} onConnectClick={handleConnectClick} />

      {/* Mobile Tabs */}
      <MobileTabs activeTab={mobileTab} onTabChange={setMobileTab} />

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {/* Desktop: 3-Column Grid */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6">
          {/* Left Column - Trade Panel (Wallet + Buy/Sell Form) */}
          <div className="lg:col-span-3 space-y-6">
            <div ref={walletSectionRef}>
              <WalletConnect onWalletChange={setWallet} />
            </div>
            <TradePanel wallet={wallet} />
          </div>

          {/* Center Column - Order Book (Larger, Main Focus) */}
          <div className="lg:col-span-6">
            <OrderBook wallet={wallet} />
          </div>

          {/* Right Column - Portfolio */}
          <div className="lg:col-span-3">
            <Portfolio wallet={wallet} />
          </div>
        </div>

        {/* Mobile: Tab-Based View */}
        <div className="lg:hidden">
          {mobileTab === 'trade' && (
            <div className="space-y-6">
              <div ref={walletSectionRef}>
                <WalletConnect onWalletChange={setWallet} />
              </div>
              <TradePanel wallet={wallet} />
            </div>
          )}

          {mobileTab === 'orders' && (
            <div>
              <OrderBook wallet={wallet} />
            </div>
          )}

          {mobileTab === 'portfolio' && (
            <div>
              <Portfolio wallet={wallet} />
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900/50 border border-purple-700/30 rounded-xl p-6 hover:border-purple-600/50 transition-all card-hover">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="text-lg font-semibold text-purple-300 mb-2">Private Trading</h3>
            <p className="text-sm text-gray-400">
              All trades are encrypted and private on Aztec Network. Your trading activity remains confidential.
            </p>
          </div>

          <div className="bg-gray-900/50 border border-purple-700/30 rounded-xl p-6 hover:border-purple-600/50 transition-all card-hover">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold text-purple-300 mb-2">Fast Settlement</h3>
            <p className="text-sm text-gray-400">
              Instant order matching with secure escrow ensures fast and reliable trade execution.
            </p>
          </div>

          <div className="bg-gray-900/50 border border-purple-700/30 rounded-xl p-6 hover:border-purple-600/50 transition-all card-hover">
            <div className="text-4xl mb-3">🛡️</div>
            <h3 className="text-lg font-semibold text-purple-300 mb-2">Sponsored Fees</h3>
            <p className="text-sm text-gray-400">
              Gas fees covered by fee payment contract, making trading more accessible.
            </p>
          </div>
        </div>

        {/* Network Info Banner */}
        <div className="mt-8">
          <div className="bg-purple-900/20 border border-purple-700/30 rounded-xl px-6 py-4 text-center">
            <p className="text-sm text-gray-400">
              Connected to{' '}
              <span className="text-purple-300 font-mono">
                devnet.aztec-labs.com
              </span>
              {' '}•{' '}
              <span className="text-gray-500">
                Devnet v3.0.0-devnet.5
              </span>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
