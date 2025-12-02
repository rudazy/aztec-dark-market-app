import { Buffer } from 'buffer';

// Polyfill Buffer globally
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
  (globalThis as any).Buffer = Buffer;
}

export {};
