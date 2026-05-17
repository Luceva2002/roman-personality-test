'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useSwitchChain,
  type Connector,
} from 'wagmi';
import { arbitrumSepolia } from 'wagmi/chains';

import { cn, shortAddress } from '../lib/utils';

const TARGET_CHAIN = arbitrumSepolia;

const CONNECTOR_LABELS: Record<string, string> = {
  metaMask: 'MetaMask',
  injected: 'Browser wallet',
  coinbaseWallet: 'Coinbase Wallet',
  walletConnect: 'WalletConnect',
};

function labelFor(connector: Connector): string {
  return CONNECTOR_LABELS[connector.id] ?? connector.name;
}

export function WalletButton() {
  const { isConnected, address } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [showModal, setShowModal] = React.useState(false);

  // Keep the wallet on the chain the dApp targets.
  React.useEffect(() => {
    if (isConnected && chainId !== TARGET_CHAIN.id) {
      switchChain({ chainId: TARGET_CHAIN.id });
    }
  }, [isConnected, chainId, switchChain]);

  if (isConnected) {
    return (
      <button
        type="button"
        onClick={() => disconnect()}
        className="h-10 px-3 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 inline-flex items-center gap-2"
      >
        <Image src="/metamask.png" alt="" width={20} height={20} />
        <span className="text-sm">{shortAddress(address)}</span>
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="h-10 px-3 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 inline-flex items-center gap-2"
      >
        <Image src="/metamask.png" alt="" width={20} height={20} />
        <span className="text-sm">{isPending ? 'Connessione…' : 'Connetti Wallet'}</span>
      </button>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowModal(false)}
        >
          <div
            className={cn(
              'bg-white/10 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full',
              'border border-white/20',
            )}
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4 text-white">Connetti Wallet</h3>
            <div className="space-y-2">
              {connectors.map((connector) => (
                <button
                  type="button"
                  key={connector.uid}
                  onClick={() => {
                    connect({ connector, chainId: TARGET_CHAIN.id });
                    setShowModal(false);
                  }}
                  disabled={isPending}
                  className={cn(
                    'w-full h-12 px-4 rounded-xl border border-white/20',
                    'bg-white/5 hover:bg-white/10 inline-flex items-center gap-3',
                    'text-white transition-colors disabled:opacity-60',
                  )}
                >
                  {labelFor(connector)}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="mt-4 w-full h-10 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-sm"
            >
              Annulla
            </button>
          </div>
        </div>
      )}
    </>
  );
}
