'use client';

import * as React from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

import { StepShell } from '../components/step-shell';
import { StepHero } from '../components/steps/step-hero';
import { StepMint } from '../components/steps/step-mint';
import { StepQuestion } from '../components/steps/step-question';
import { calcolaPunteggio, questions, type Risposte } from '../lib/persona';

const HERO_STEPS = 1;
const MINT_STEPS = 1;
const TOTAL_STEPS = HERO_STEPS + questions.length + MINT_STEPS;
const MINT_STEP_INDEX = HERO_STEPS + questions.length;

export default function Page() {
  const [step, setStep] = React.useState(0);
  const [risposte, setRisposte] = React.useState<Risposte>({ nome: '' });

  const { persona } = React.useMemo(() => calcolaPunteggio(risposte), [risposte]);

  React.useEffect(() => {
    // Tell the Mini App container the UI is ready (no-op outside Farcaster).
    sdk.actions.ready().catch(() => undefined);
  }, []);

  const next = React.useCallback(
    () => setStep((current) => Math.min(TOTAL_STEPS - 1, current + 1)),
    [],
  );
  const back = React.useCallback(
    () => setStep((current) => Math.max(0, current - 1)),
    [],
  );

  const updateAnswer = React.useCallback(
    (id: keyof Risposte) => (value: string) =>
      setRisposte((prev) => ({ ...prev, [id]: value })),
    [],
  );

  return (
    <main className="mx-auto max-w-5xl py-10">
      {step === 0 && (
        <StepShell title="" step={0} total={TOTAL_STEPS}>
          <StepHero onStart={next} />
        </StepShell>
      )}

      {step >= HERO_STEPS && step <= questions.length && (() => {
        const question = questions[step - HERO_STEPS];
        return (
          <StepShell
            title={question.label}
            step={step}
            total={TOTAL_STEPS}
            onBack={back}
            onNext={next}
          >
            <StepQuestion
              id={question.id}
              value={risposte[question.id as keyof Risposte]}
              onChange={updateAnswer(question.id as keyof Risposte)}
            />
          </StepShell>
        );
      })()}

      {step === MINT_STEP_INDEX && (
        <StepShell
          title="Immagine & Mint"
          step={step}
          total={TOTAL_STEPS}
          onBack={back}
          showWallet
        >
          <StepMint risposte={risposte} persona={persona} />
        </StepShell>
      )}
    </main>
  );
}
