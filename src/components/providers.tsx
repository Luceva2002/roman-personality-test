'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http, type CreateConnectorFn } from 'wagmi';
import { arbitrumSepolia } from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

import { env, isWalletConnectConfigured } from '../lib/env';

const APP_NAME = 'Boro, Coatto o Pariolino?';
const APP_DESCRIPTION = 'Scopri il tuo archetipo romano e mintalo come NFT.';
const APP_ICON = `${env.appUrl}/metamask.png`;

function buildConnectors(): CreateConnectorFn[] {
  const connectors: CreateConnectorFn[] = [
    injected({ shimDisconnect: true }),
    coinbaseWallet({ appName: APP_NAME, appLogoUrl: APP_ICON }),
  ];

  if (isWalletConnectConfigured()) {
    connectors.push(
      walletConnect({
        projectId: env.walletConnectProjectId!,
        metadata: {
          name: APP_NAME,
          description: APP_DESCRIPTION,
          url: env.appUrl,
          icons: [APP_ICON],
        },
        showQrModal: true,
      }),
    );
  }

  return connectors;
}

const wagmiConfig = createConfig({
  chains: [arbitrumSepolia],
  transports: {
    [arbitrumSepolia.id]: http('https://sepolia-rollup.arbitrum.io/rpc'),
  },
  connectors: buildConnectors(),
  ssr: true,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
