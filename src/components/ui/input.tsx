'use client';

import * as React from 'react';

import { cn } from '../../lib/utils';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, ...rest }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          'h-11 w-full rounded-xl bg-white/10 border border-white/20 px-3',
          'text-[var(--fg)] placeholder-white/60 outline-none',
          'focus:ring-2 focus:ring-white/30',
          className,
        )}
        {...rest}
      />
    );
  },
);
