import type { Metadata } from 'next';
import * as React from 'react';

import { DevWarnings } from '../components/dev-warnings';
import { Providers } from '../components/providers';
import { env } from '../lib/env';
import '../styles/globals.css';

const baseUrl = env.appUrl;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'Boro, Coatto o Pariolino?',
  description:
    'Scopri che tipo di romano sei e minta il tuo NFT personalizzato. Boro, Pariolino o Coatto?',
  openGraph: {
    title: 'Boro, Coatto o Pariolino?',
    description: 'Scopri che tipo di romano sei e minta il tuo NFT personalizzato.',
    images: [`${baseUrl}/sfondo.png`],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${baseUrl}/api/frame/image?step=hero`,
    'fc:frame:button:1': '🚀 Scopri il tuo archetipo',
    'fc:frame:post_url': `${baseUrl}/api/frame`,
  },
  manifest: `${baseUrl}/.well-known/farcaster.json`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <div className="app-background" aria-hidden />
        <div className="vignette" aria-hidden />
        <Providers>{children}</Providers>
        <DevWarnings />
      </body>
    </html>
  );
}
