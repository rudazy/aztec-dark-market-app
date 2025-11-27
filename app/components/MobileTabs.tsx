'use client';

interface MobileTabsProps {
  activeTab: 'trade' | 'orders' | 'portfolio';
  onTabChange: (tab: 'trade' | 'orders' | 'portfolio') => void;
}

export default function MobileTabs({ activeTab, onTabChange }: MobileTabsProps) {
  return (
    <div className="lg:hidden sticky top-16 z-40 bg-gray-900/95 backdrop-blur-md border-b border-purple-700/30 mb-4">
      <div className="flex">
        <button
          onClick={() => onTabChange('trade')}
          className={`flex-1 py-3 text-sm font-medium transition-all ${
            activeTab === 'trade'
              ? 'text-purple-300 border-b-2 border-purple-500 bg-purple-900/20'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Trade
        </button>
        <button
          onClick={() => onTabChange('orders')}
          className={`flex-1 py-3 text-sm font-medium transition-all ${
            activeTab === 'orders'
              ? 'text-purple-300 border-b-2 border-purple-500 bg-purple-900/20'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => onTabChange('portfolio')}
          className={`flex-1 py-3 text-sm font-medium transition-all ${
            activeTab === 'portfolio'
              ? 'text-purple-300 border-b-2 border-purple-500 bg-purple-900/20'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Portfolio
        </button>
      </div>
    </div>
  );
}
