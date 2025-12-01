import { AztecAddress } from '@aztec/aztec.js';

export const NETWORK_CONFIG = {
  pxeUrl: 'https://devnet.aztec-labs.com/',
  chainId: 'aztec-devnet-v3.0.0-devnet.5',
};

export const CONTRACT_ADDRESSES = {
  token: AztecAddress.fromString('0x2731c1024ce94a508083fe50ae1b22a1274f0f7a4c7157e294899b366ea55816'),
  escrow: AztecAddress.fromString('0x161fcf08c79d512031323bee0f49381ade4799a3b6b7b3470e9c5a43af9eebc2'),
  orderBook: AztecAddress.fromString('0x23d2149ea91babceacc6e98fe5bef2dfd875622516ba182da53cb7f1b466aaac'),
  sponsoredFpc: AztecAddress.fromString('0x280e5686a148059543f4d0968f9a18cd4992520fcd887444b8689bf2726a1f97'),
};

export const TRADING_CONFIG = {
  defaultSlippage: 0.5, // 0.5%
  maxSlippage: 5, // 5%
  minOrderAmount: 0.001,
};
