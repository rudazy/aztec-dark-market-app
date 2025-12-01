// Token Contract Wrapper
// This file provides typed access to the Token contract methods

import { Contract, AztecAddress, Fr, AccountWallet } from '@aztec/aztec.js';
import { CONTRACT_ADDRESSES } from '../config';

// Token Contract ABI (placeholder - update with actual ABI when available)
const TokenABI = {
  name: 'Token',
  functions: [
    {
      name: 'balance_of_private',
      functionType: 'secret',
      isInternal: false,
      parameters: [{ name: 'owner', type: { kind: 'field' } }],
      returnTypes: [{ kind: 'field' }],
    },
    {
      name: 'transfer',
      functionType: 'secret',
      isInternal: false,
      parameters: [
        { name: 'to', type: { kind: 'field' } },
        { name: 'amount', type: { kind: 'field' } },
      ],
      returnTypes: [],
    },
  ],
  outputs: { structs: {}, globals: {} },
  fileMap: {},
};

export class TokenContract {
  private contract: Contract;
  private wallet: AccountWallet;

  private constructor(contract: Contract, wallet: AccountWallet) {
    this.contract = contract;
    this.wallet = wallet;
  }

  static async at(wallet: AccountWallet): Promise<TokenContract> {
    // Note: Replace TokenABI with actual contract artifact when available
    const contract = await Contract.at(CONTRACT_ADDRESSES.token, TokenABI as any, wallet);
    return new TokenContract(contract, wallet);
  }

  /**
   * Get the private balance of an account
   * @param owner The address of the account
   * @returns The balance as a bigint
   */
  async balanceOf(owner: AztecAddress): Promise<bigint> {
    try {
      // Call the balance_of_private function
      const result = await this.contract.methods.balance_of_private(owner).simulate({
        from: this.wallet.getAddress()
      });
      return BigInt(result);
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }

  /**
   * Transfer tokens to another account
   * @param to The recipient address
   * @param amount The amount to transfer
   */
  async transfer(to: AztecAddress, amount: bigint) {
    try {
      const tx = await this.contract.methods.transfer(to, amount).send({
        from: this.wallet.getAddress()
      });

      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Error transferring tokens:', error);
      throw error;
    }
  }

  getAddress(): AztecAddress {
    return this.contract.address;
  }
}
