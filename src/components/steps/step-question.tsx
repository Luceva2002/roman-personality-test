'use client';

import * as React from 'react';

import { getOptions, getQuestion } from '../../lib/persona';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

type StepQuestionProps = {
  id: string;
  value?: string;
  onChange: (value: string) => void;
};

export function StepQuestion({ id, value, onChange }: StepQuestionProps) {
  const question = getQuestion(id);
  if (!question) return null;

  if (question.type === 'text') {
    return (
      <div className="flex justify-center">
        <Input
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
          placeholder={question.label}
          className="max-w-md"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 justify-items-center">
      {getOptions(id).map((option) => (
        <Button
          key={option.value}
          variant={value === option.value ? 'default' : 'outline'}
          onClick={() => onChange(option.value)}
          className="w-full"
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
