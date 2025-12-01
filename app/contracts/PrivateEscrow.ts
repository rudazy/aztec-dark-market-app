// PrivateEscrow Contract Wrapper
// This file provides typed access to the PrivateEscrow contract methods

import { Contract, AztecAddress, Fr, AccountWallet } from '@aztec/aztec.js';
import { CONTRACT_ADDRESSES } from '../config';

// Escrow Contract ABI (placeholder - update with actual ABI when available)
const EscrowABI = {
  name: 'PrivateEscrow',
  functions: [
    {
      name: 'deposit',
      functionType: 'secret',
      isInternal: false,
      parameters: [{ name: 'amount', type: { kind: 'field' } }],
      returnTypes: [],
    },
    {
      name: 'withdraw',
      functionType: 'secret',
      isInternal: false,
      parameters: [{ name: 'amount', type: { kind: 'field' } }],
      returnTypes: [],
    },
    {
      name: 'get_balance',
      functionType: 'unconstrained',
      isInternal: false,
      parameters: [{ name: 'owner', type: { kind: 'field' } }],
      returnTypes: [{ kind: 'field' }],
    },
  ],
  outputs: { structs: {}, globals: {} },
  fileMap: {},
};

export class PrivateEscrowContract {
  private contract: Contract;
  private wallet: AccountWallet;

  private constructor(contract: Contract, wallet: AccountWallet) {
    this.contract = contract;
    this.wallet = wallet;
  }

  static async at(wallet: AccountWallet): Promise<PrivateEscrowContract> {
    // Note: Replace EscrowABI with actual contract artifact when available
    const contract = await Contract.at(CONTRACT_ADDRESSES.escrow, EscrowABI as any, wallet);
    return new PrivateEscrowContract(contract, wallet);
  }

  /**
   * Deposit tokens into escrow
   * @param amount The amount to deposit
   */
  async deposit(amount: bigint) {
    try {
      const tx = await this.contract.methods.deposit(amount).send({
        from: this.wallet.getAddress()
      });

      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Error depositing to escrow:', error);
      throw error;
    }
  }

  /**
   * Withdraw tokens from escrow
   * @param amount The amount to withdraw
   */
  async withdraw(amount: bigint) {
    try {
      const tx = await this.contract.methods.withdraw(amount).send({
        from: this.wallet.getAddress()
      });

      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Error withdrawing from escrow:', error);
      throw error;
    }
  }

  /**
   * Get escrow balance for an owner
   * @param owner The address of the owner
   * @returns The balance as a bigint
   */
  async getBalance(owner: AztecAddress): Promise<bigint> {
    try {
      const result = await this.contract.methods.get_balance(owner).simulate({
        from: this.wallet.getAddress()
      });
      return BigInt(result);
    } catch (error) {
      console.error('Error getting escrow balance:', error);
      throw error;
    }
  }

  getAddress(): AztecAddress {
    return this.contract.address;
  }
}
