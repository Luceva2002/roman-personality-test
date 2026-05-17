import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

type FrameStep = 'hero' | 'nome' | 'result';

const STEP_CONTENT: Record<FrameStep, { title: string; subtitle: string }> = {
  hero: {
    title: '🏛️ Boro, Coatto o Pariolino?',
    subtitle: 'Scopri che romano sei e minta il tuo NFT personale',
  },
  nome: {
    title: '📝 Come te chiami?',
    subtitle: 'Completa il quiz sul sito per scoprire il tuo archetipo',
  },
  result: {
    title: '🎨 Il tuo NFT è pronto!',
    subtitle: 'Clicca "Mint NFT" per completare la creazione',
  },
};

function parseStep(value: string | null): FrameStep {
  if (value === 'nome' || value === 'result') return value;
  return 'hero';
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const step = parseStep(searchParams.get('step'));
  const { title, subtitle } = STEP_CONTENT[step];

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '30px',
              textShadow: '0 4px 8px rgba(0,0,0,0.5)',
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: '36px',
              color: 'rgba(255,255,255,0.9)',
              maxWidth: '900px',
              lineHeight: 1.4,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            {subtitle}
          </p>
          {step === 'hero' && (
            <div
              style={{
                display: 'flex',
                marginTop: '40px',
                fontSize: '48px',
                gap: '30px',
              }}
            >
              🏛️ 🍝 ⚡
            </div>
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
