export interface MockWallet {
  address: string;
  secretKey: string;
}

export class WalletUtils {
  private static WALLET_STORAGE_KEY = 'aztec_dark_market_wallet';

  static async deriveAddress(secretKey: string): Promise<string> {
    // Use Web Crypto API to derive address from secret key
    const encoder = new TextEncoder();
    const data = encoder.encode(secretKey);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Format as Aztec address (0x + 64 hex chars)
    return '0x' + hashHex;
  }

  static saveWallet(wallet: MockWallet): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.WALLET_STORAGE_KEY, JSON.stringify(wallet));
    }
  }

  static loadWallet(): MockWallet | null {
    if (typeof window !== 'undefined') {
      const walletData = localStorage.getItem(this.WALLET_STORAGE_KEY);
      if (walletData) {
        try {
          return JSON.parse(walletData);
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  static clearWallet(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.WALLET_STORAGE_KEY);
    }
  }

  static isValidSecretKey(secretKey: string): boolean {
    // Basic validation: non-empty and at least 8 characters
    return secretKey.length >= 8;
  }
}
