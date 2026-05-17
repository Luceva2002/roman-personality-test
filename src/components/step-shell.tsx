'use client';

import * as React from 'react';

import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { WalletButton } from './wallet-button';

type StepShellProps = {
  title: string;
  description?: string;
  step: number;
  total: number;
  onBack?: () => void;
  onNext?: () => void;
  showWallet?: boolean;
  children: React.ReactNode;
};

export function StepShell({
  title,
  description,
  step,
  total,
  onBack,
  onNext,
  showWallet,
  children,
}: StepShellProps) {
  const percent = Math.round(((step + 1) / total) * 100);
  const hasFooter = Boolean(onBack || onNext || showWallet);

  return (
    <div className="relative mx-auto max-w-2xl px-4 sm:px-6 pb-32">
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        {title ? (
          <h2 className="text-2xl font-semibold mb-6 text-center">{title}</h2>
        ) : null}
        {description ? (
          <p className="text-white/80 mb-6 text-center">{description}</p>
        ) : null}
        <div className="w-full max-w-xl">{children}</div>
      </div>

      {hasFooter && (
        <div className="fixed left-0 right-0 bottom-16 z-20 flex justify-center items-center gap-4 px-4">
          <div className="flex gap-4 items-center">
            {onBack && (
              <Button variant="outline" onClick={onBack} className="min-w-[120px]">
                Indietro
              </Button>
            )}
            {onNext && (
              <Button onClick={onNext} className="min-w-[120px]">
                Avanti
              </Button>
            )}
            {showWallet && (
              <div className="ml-2">
                <WalletButton />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="fixed left-0 right-0 bottom-0 z-10 p-3">
        <Progress value={percent} />
      </div>
    </div>
  );
}
