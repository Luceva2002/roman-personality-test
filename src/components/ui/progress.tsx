import * as React from 'react';

type ProgressProps = {
  value: number;
  max?: number;
};

export function Progress({ value, max = 100 }: ProgressProps) {
  const percent = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className="h-2 w-full rounded-full bg-white/10 overflow-hidden"
    >
      <div
        className="h-full bg-[var(--accent)] transition-all"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
