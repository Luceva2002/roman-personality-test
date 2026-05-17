import type { Abi } from 'viem';

import abi from '../../contracts/RomanPersonaNFT.abi.json';

/**
 * Address of the deployed RomanPersonaNFT contract on Arbitrum Sepolia.
 *
 * Override at build time with `NEXT_PUBLIC_CONTRACT_ADDRESS` to point the app
 * at a different deployment without changing source code.
 */
export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ??
  '0xfd40710B7D9ef3351Ea3891aA1Aa22BAEF9072B3') as `0x${string}`;

export const CONTRACT_ABI = abi as unknown as Abi;
