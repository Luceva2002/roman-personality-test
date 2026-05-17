/**
 * Centralized environment configuration.
 *
 * All public env vars used by the app are read here so the rest of the codebase
 * has a single source of truth and we can swap defaults in one place.
 */

const DEFAULT_APP_URL = 'https://boro-coatto-pariolino.vercel.app';

export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? DEFAULT_APP_URL,
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  miniApp: {
    name: process.env.MINIAPP_NAME ?? 'Boro, Coatto o Pariolino?',
    webhookUrl: process.env.MINIAPP_WEBHOOK_URL,
    allowedBaseAddresses: (process.env.BASE_ALLOWED_ADDRESSES ?? '')
      .split(',')
      .map((address) => address.trim())
      .filter(Boolean),
  },
} as const;

export function isWalletConnectConfigured(
  projectId: string | undefined = env.walletConnectProjectId,
): projectId is string {
  return (
    typeof projectId === 'string' &&
    projectId.length > 20 &&
    projectId !== 'YOUR_PROJECT_ID_HERE'
  );
}
