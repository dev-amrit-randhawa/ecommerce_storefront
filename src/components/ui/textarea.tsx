'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  hint?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, hint, id, ...props }, ref) => {
    const textareaId = id || React.useId();
    const errorId = `${textareaId}-error`;
    const hintId = `${textareaId}-hint`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-2 block text-sm font-medium uppercase tracking-[0.1em] text-foreground"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            'flex min-h-[80px] w-full rounded-sm border border-border bg-background px-4 py-3 text-sm transition-all duration-200',
            'placeholder:text-muted-foreground/60',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted',
            'aria-invalid:border-destructive aria-invalid:focus:ring-destructive',
            error && 'border-destructive focus:ring-destructive',
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="mt-1.5 text-sm text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };