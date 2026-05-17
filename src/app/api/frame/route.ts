import { NextResponse, type NextRequest } from 'next/server';

import { env } from '../../../lib/env';

const FRAME_HEADERS = { 'Content-Type': 'text/html' } as const;

type FrameMeta = {
  image: string;
  buttons: Array<{ label: string; action?: 'link'; target?: string }>;
  postUrl: string;
};

function renderFrame({ image, buttons, postUrl }: FrameMeta): string {
  const buttonTags = buttons
    .flatMap((button, index) => {
      const i = index + 1;
      const tags = [`<meta property="fc:frame:button:${i}" content="${button.label}" />`];
      if (button.action) {
        tags.push(`<meta property="fc:frame:button:${i}:action" content="${button.action}" />`);
      }
      if (button.target) {
        tags.push(`<meta property="fc:frame:button:${i}:target" content="${button.target}" />`);
      }
      return tags;
    })
    .join('\n    ');

  return `<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${image}" />
    ${buttonTags}
    <meta property="fc:frame:post_url" content="${postUrl}" />
  </head>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { untrustedData?: { buttonIndex?: number } };
    const buttonIndex = body.untrustedData?.buttonIndex ?? 1;
    const baseUrl = env.appUrl;

    if (buttonIndex === 1) {
      return new NextResponse(
        renderFrame({
          image: `${baseUrl}/api/frame/image?step=nome`,
          buttons: [{ label: 'Inizia il quiz' }],
          postUrl: `${baseUrl}/api/frame`,
        }),
        { headers: FRAME_HEADERS },
      );
    }

    if (buttonIndex === 2) {
      return new NextResponse(
        renderFrame({
          image: `${baseUrl}/api/frame/image?step=result`,
          buttons: [
            { label: '🎨 Mint NFT', action: 'link', target: baseUrl },
            { label: '🔄 Ricomincia' },
          ],
          postUrl: `${baseUrl}/api/frame`,
        }),
        { headers: FRAME_HEADERS },
      );
    }

    return new NextResponse(
      renderFrame({
        image: `${baseUrl}/api/frame/image?step=hero`,
        buttons: [{ label: '🚀 Inizia' }],
        postUrl: `${baseUrl}/api/frame`,
      }),
      { headers: FRAME_HEADERS },
    );
  } catch (error) {
    console.error('Frame POST error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function GET() {
  const baseUrl = env.appUrl;

  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${baseUrl}/api/frame/image?step=hero" />
    <meta property="fc:frame:button:1" content="🚀 Scopri il tuo archetipo romano" />
    <meta property="fc:frame:post_url" content="${baseUrl}/api/frame" />
    <meta property="og:title" content="Boro, Coatto o Pariolino?" />
    <meta property="og:description" content="Scopri che romano sei e minta il tuo NFT." />
    <meta property="og:image" content="${baseUrl}/sfondo.png" />
  </head>
  <body>
    <h1>Boro, Coatto o Pariolino?</h1>
    <p>Frame Farcaster: condividi questa pagina per giocare direttamente dal feed.</p>
  </body>
</html>`;

  return new NextResponse(html, { headers: FRAME_HEADERS });
}
