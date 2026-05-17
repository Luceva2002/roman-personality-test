'use client';

import { useEffect, useState } from 'react';

import { isWalletConnectConfigured } from '../lib/env';

/** Console messages that are noisy but unrelated to our code. */
const IGNORED_CONSOLE_PATTERNS = [
  'cca-lite.coinbase.com',
  'Analytics SDK',
  'ERR_BLOCKED_BY_CLIENT',
  'castbuddy',
];

function suppressNoisyConsoleErrors(): () => void {
  const original = console.error;
  console.error = (...args: unknown[]) => {
    const message = args.join(' ');
    if (IGNORED_CONSOLE_PATTERNS.some((pattern) => message.includes(pattern))) {
      return;
    }
    original.apply(console, args as Parameters<typeof console.error>);
  };
  return () => {
    console.error = original;
  };
}

/**
 * Dev-only banner shown when WalletConnect is not configured.
 * Also silences a small allowlist of third-party console errors that are
 * blocked by ad-blockers and unrelated to our app.
 */
export function DevWarnings() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    if (!isWalletConnectConfigured()) {
      setShowWarning(true);
    }

    return suppressNoisyConsoleErrors();
  }, []);

  if (!showWarning) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-yellow-500/90 text-black p-4 rounded-xl shadow-lg z-50">
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden>
          ⚠️
        </span>
        <div className="flex-1">
          <h3 className="font-bold mb-1">WalletConnect non configurato</h3>
          <p className="text-sm">
            Per i wallet mobili, ottieni un Project ID gratuito su{' '}
            <a
              href="https://cloud.walletconnect.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold hover:text-black/80"
            >
              cloud.walletconnect.com
            </a>
            .
          </p>
          <button
            type="button"
            onClick={() => setShowWarning(false)}
            className="mt-2 text-xs underline hover:no-underline"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}
