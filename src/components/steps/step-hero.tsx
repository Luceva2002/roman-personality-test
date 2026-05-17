'use client';

import * as React from 'react';

import { Button } from '../ui/button';

type StepHeroProps = {
  onStart: () => void;
};

export function StepHero({ onStart }: StepHeroProps) {
  return (
    <div className="text-center space-y-8 py-8">
      <h1 className="text-4xl font-semibold leading-tight">
        Vedemo se sei boro,
        <br />
        coatto o pariolino
      </h1>
      <Button onClick={onStart} size="lg">
        Inizia
      </Button>
    </div>
  );
}
