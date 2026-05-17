import { env } from '../../../lib/env';

/**
 * Farcaster Mini App manifest.
 *
 * The `accountAssociation` block is the proof binding this domain to a
 * specific Farcaster account — it is intentionally hard-coded because it is
 * generated once on the Farcaster developer portal for the production domain.
 */
export async function GET() {
  const baseUrl = env.appUrl;

  const manifest = {
    accountAssociation: {
      header:
        'eyJmaWQiOjEzNzQ5MjIsInR5cGUiOiJhdXRoIiwia2V5IjoiMHhFNDJkNzUyODI1NjVCYUU3QTdhYkFCOWVBRmNlODU4MDI0RjU1MDljIn0',
      payload: 'eyJkb21haW4iOiJib3JvLWNvYXR0by1wYXJpb2xpbm8udmVyY2VsLmFwcCJ9',
      signature:
        'OmKUUhGPY6TOnJUrcMbcl1NEz8Bb1EetMgUf6fioYEM18c2H0Ps7trJnq+HBd6QhlWfs3EVSWUyOtmNpyeDF+hs=',
    },
    baseBuilder: {
      allowedAddresses: env.miniApp.allowedBaseAddresses,
    },
    miniapp: {
      version: '1',
      name: env.miniApp.name,
      homeUrl: baseUrl,
      iconUrl: `${baseUrl}/metamask.png`,
      splashImageUrl: `${baseUrl}/sfondo.png`,
      splashBackgroundColor: '#000000',
      webhookUrl: env.miniApp.webhookUrl ?? undefined,
      subtitle: 'Scopri che romano sei',
      description:
        'Quiz divertente per scoprire il tuo archetipo romano e mintare il tuo NFT.',
      screenshotUrls: [`${baseUrl}/sfondo.png`],
      primaryCategory: 'social',
      tags: ['nft', 'roma', 'miniapp', 'baseapp'],
      heroImageUrl: `${baseUrl}/sfondo.png`,
      tagline: 'Play instantly',
      ogTitle: env.miniApp.name,
      ogDescription: 'Scopri il tuo archetipo romano e mintalo come NFT',
      ogImageUrl: `${baseUrl}/sfondo.png`,
      noindex: true,
    },
  };

  return Response.json(manifest);
}
