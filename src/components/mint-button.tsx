'use client';

import * as React from 'react';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../lib/contract';
import { cn } from '../lib/utils';
import { Button } from './ui/button';

/**
 * Triggers `mint()` on the RomanPersonaNFT contract. The deployed contract
 * cycles through pre-configured personas server-side, so we do not pass any
 * persona-specific arguments here.
 */
export function MintButton() {
  const { isConnected } = useAccount();
  const { writeContract, data: hash, isPending, isError, error, reset } =
    useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const handleMint = React.useCallback(() => {
    if (!isConnected) return;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'mint',
      args: [],
    });
  }, [isConnected, writeContract]);

  if (isSuccess) {
    return (
      <div className="space-y-3 text-center">
        <p className="text-green-400 font-bold text-lg">✅ NFT mintato!</p>
        {hash ? (
          <p className="text-sm text-white/70">
            Transazione: {hash.slice(0, 10)}…{hash.slice(-8)}
          </p>
        ) : null}
        <Button onClick={() => window.location.reload()} variant="outline">
          Minta un altro
        </Button>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-3 text-center">
        <p className="text-red-400 font-bold">❌ Errore durante il mint</p>
        <p className="text-sm text-white/60">{error?.message ?? 'Errore sconosciuto.'}</p>
        <Button onClick={() => { reset(); handleMint(); }}>Riprova</Button>
      </div>
    );
  }

  if (isConfirming) {
    return (
      <Button disabled className="cursor-wait">
        ⏳ Conferma in corso…
      </Button>
    );
  }

  const disabled = !isConnected || isPending;
  const label = !isConnected
    ? 'Connetti il wallet'
    : isPending
      ? '⏳ Firmando…'
      : '🎨 Minta il tuo NFT';

  return (
    <Button
      onClick={handleMint}
      disabled={disabled}
      className={cn(
        'bg-gradient-to-r from-purple-500 to-pink-500',
        'hover:from-purple-600 hover:to-pink-600',
      )}
    >
      {label}
    </Button>
  );
}
