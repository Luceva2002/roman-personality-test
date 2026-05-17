import type { Metadata } from 'next';
import Link from 'next/link';

import { env } from '../../lib/env';

const baseUrl = env.appUrl;

export const metadata: Metadata = {
  title: 'Boro, Coatto o Pariolino? — Farcaster Frame',
  description: 'Scopri che romano sei direttamente da Farcaster.',
  openGraph: {
    title: 'Boro, Coatto o Pariolino?',
    description: 'Scopri che romano sei e minta il tuo NFT.',
    images: [`${baseUrl}/sfondo.png`],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${baseUrl}/api/frame/image?step=hero`,
    'fc:frame:button:1': '🚀 Inizia il quiz',
    'fc:frame:post_url': `${baseUrl}/api/frame`,
  },
};

export default function FramePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl mx-auto text-center space-y-6 bg-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/20">
        <h1 className="text-4xl font-bold text-white">🏛️ Boro, Coatto o Pariolino?</h1>
        <p className="text-xl text-white/90">
          Questa pagina è ottimizzata come Frame Farcaster: condividila per
          giocare al quiz dal feed.
        </p>
        <div className="space-y-4 text-white/80 text-left">
          <h2 className="text-2xl font-semibold text-white">Come funziona</h2>
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>Condividi questo link su Farcaster.</li>
            <li>Il Frame interattivo appare nel feed.</li>
            <li>Gli utenti scoprono il loro archetipo romano.</li>
            <li>Possono mintare il loro NFT in un click.</li>
          </ol>
        </div>
        <div className="pt-6 border-t border-white/20">
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-white font-semibold transition-all"
          >
            🎨 Vai all&apos;app completa
          </Link>
        </div>
      </div>
    </main>
  );
}
