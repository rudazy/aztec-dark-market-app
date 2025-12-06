'use client';

interface HeaderProps {
  address: string | null;
  onConnectClick: () => void;
}

export default function Header({ address, onConnectClick }: HeaderProps) {
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-purple-700/30 bg-gray-900/95 backdrop-blur-md shadow-lg">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-300 to-purple-500 bg-clip-text text-transparent">
                Aztec Dark Market
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">Private Trading Platform</p>
            </div>
          </div>

          {/* Right Side - Network Status + Wallet */}
          <div className="flex items-center gap-3">
            {/* Network Status Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-purple-900/30 border border-purple-700/30 rounded-lg">
              <div className="relative">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              </div>
              <span className="text-sm text-gray-300">Devnet v3.0.0</span>
            </div>

            {/* Wallet Button */}
            {address ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 border border-purple-500/50 rounded-lg">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-sm font-mono text-purple-300 hidden sm:inline">
                  {formatAddress(address)}
                </span>
                <span className="text-sm font-mono text-purple-300 sm:hidden">
                  Connected
                </span>
              </div>
            ) : (
              <button
                onClick={onConnectClick}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-lg transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
