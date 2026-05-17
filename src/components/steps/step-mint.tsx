'use client';

import * as React from 'react';
import Image from 'next/image';

import { getPersonaImage, type Risposte } from '../../lib/persona';
import { MintButton } from '../mint-button';

type StepMintProps = {
  risposte: Risposte;
  persona: string;
};

export function StepMint({ risposte, persona }: StepMintProps) {
  const imageUrl = React.useMemo(() => getPersonaImage(persona), [persona]);
  const nome = risposte.nome.trim() || 'Anonimo';

  return (
    <div className="space-y-4 text-center">
      <div className="relative mx-auto aspect-square max-w-md w-full overflow-hidden rounded-2xl border border-white/20">
        <Image
          src={imageUrl}
          alt={`Anteprima NFT: ${persona}`}
          fill
          sizes="(max-width: 768px) 100vw, 28rem"
          priority
          className="object-cover"
        />
      </div>
      <p className="text-lg font-semibold capitalize text-white">
        {nome} — {persona}
      </p>
      <MintButton />
    </div>
  );
}
