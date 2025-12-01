// API Client for Backend Communication
// This module provides functions to interact with the Node.js backend API

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Type definitions for API responses
export interface WalletConnectResponse {
  address: string;
  message: string;
}

export interface HealthResponse {
  status: string;
  timestamp: number;
}

export interface BlockInfoResponse {
  blockNumber: number;
  timestamp: number;
  transactionCount: number;
}

export interface CreateOrderResponse {
  orderId: string;
  message: string;
}

export interface Balance {
  balance: string;
  decimals: number;
}

export interface Order {
  id: string;
  owner: string;
  isBuy: boolean;
  amount: string;
  price: string;
  filled: string;
  status: number;
}

export interface OrdersResponse {
  orders: Order[];
}

// Error handling helper
class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

// Generic fetch wrapper with error handling
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new APIError(response.status, errorText || response.statusText);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new Error(`Network error: ${(error as Error).message}`);
  }
}

// ============================================================================
// Wallet API
// ============================================================================

/**
 * Connect wallet using a secret key
 * @param secretKey The user's secret key (hex string)
 * @returns Wallet connection response with address
 */
export async function connectWallet(secretKey: string): Promise<WalletConnectResponse> {
  return apiFetch<WalletConnectResponse>('/api/wallet/connect', {
    method: 'POST',
    body: JSON.stringify({ secretKey }),
  });
}

/**
 * Disconnect the current wallet session
 */
export async function disconnectWallet(): Promise<void> {
  await apiFetch('/api/wallet/disconnect', {
    method: 'POST',
  });
}

// ============================================================================
// Health & Node Info API
// ============================================================================

/**
 * Check API health status
 * @returns Health status response
 */
export async function getHealth(): Promise<HealthResponse> {
  return apiFetch<HealthResponse>('/api/health');
}

/**
 * Get current block information from the Aztec node
 * @returns Block information
 */
export async function getBlockInfo(): Promise<BlockInfoResponse> {
  return apiFetch<BlockInfoResponse>('/api/node/block');
}

// ============================================================================
// Trading API
// ============================================================================

/**
 * Create a new order in the order book
 * @param isBuy True for buy order, false for sell order
 * @param amount Amount of tokens
 * @param price Price per token
 * @returns Order creation response
 */
export async function createOrder(
  isBuy: boolean,
  amount: string,
  price: string
): Promise<CreateOrderResponse> {
  return apiFetch<CreateOrderResponse>('/api/orders/create', {
    method: 'POST',
    body: JSON.stringify({ isBuy, amount, price }),
  });
}

/**
 * Cancel an existing order
 * @param orderId The ID of the order to cancel
 */
export async function cancelOrder(orderId: string): Promise<void> {
  return apiFetch(`/api/orders/cancel/${orderId}`, {
    method: 'DELETE',
  });
}

/**
 * Get orders for the connected wallet
 * @returns List of orders
 */
export async function getOrders(): Promise<OrdersResponse> {
  return apiFetch<OrdersResponse>('/api/orders');
}

// ============================================================================
// Token/Balance API
// ============================================================================

/**
 * Get token balance for the connected wallet
 * @returns Balance information
 */
export async function getBalance(): Promise<Balance> {
  return apiFetch<Balance>('/api/balance');
}

/**
 * Transfer tokens to another address
 * @param to Recipient address
 * @param amount Amount to transfer
 */
export async function transferTokens(to: string, amount: string): Promise<void> {
  return apiFetch('/api/transfer', {
    method: 'POST',
    body: JSON.stringify({ to, amount }),
  });
}

// ============================================================================
// Export API_URL for components that need it
// ============================================================================
export { API_URL };
