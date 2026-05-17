import { NextResponse, type NextRequest } from 'next/server';

import { env } from '../../../../lib/env';
import { getPersonaForTokenId } from '../../../../lib/persona';

/** Cache headers used by NFT metadata: long-lived because content is immutable. */
const METADATA_CACHE_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'public, max-age=31536000, immutable',
  'Access-Control-Allow-Origin': '*',
} as const;

function resolveBaseUrl(request: NextRequest): string {
  if (env.appUrl) return env.appUrl;
  const protocol = request.headers.get('x-forwarded-proto') ?? 'https';
  const host = request.headers.get('host') ?? request.nextUrl.host;
  return `${protocol}://${host}`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { tokenId: string } },
) {
  const tokenId = Number.parseInt(params.tokenId, 10);
  if (!Number.isFinite(tokenId) || tokenId < 1) {
    return NextResponse.json({ error: 'Token ID non valido' }, { status: 400 });
  }

  try {
    const persona = getPersonaForTokenId(tokenId);
    const baseUrl = resolveBaseUrl(request);

    const metadata = {
      name: `Roman Persona #${tokenId} - ${persona.name}`,
      description: persona.description,
      image: `${baseUrl}${persona.image}`,
      external_url: baseUrl,
      attributes: [
        { trait_type: 'Persona', value: persona.name },
        { trait_type: 'Type', value: 'Roman Character' },
        { trait_type: 'Token ID', display_type: 'number', value: tokenId },
      ],
    };

    return NextResponse.json(metadata, { headers: METADATA_CACHE_HEADERS });
  } catch (error) {
    console.error('NFT metadata error:', error);
    return NextResponse.json(
      { error: 'Errore nella generazione dei metadati' },
      { status: 500 },
    );
  }
}
