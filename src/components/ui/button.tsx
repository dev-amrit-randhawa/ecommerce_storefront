'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-semibold uppercase tracking-[0.14em] transition-all duration-300 ease-out-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-forest text-sand hover:bg-forest-deep hover:shadow-lg hover:shadow-forest/30',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-lg hover:shadow-destructive/30',
        outline:
          'border border-border bg-background hover:bg-secondary hover:text-secondary-foreground hover:border-border/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-sm',
        ghost:
          'hover:bg-secondary hover:text-secondary-foreground',
        link: 'text-foreground underline-offset-4 hover:underline',
        clay: 'bg-clay text-sand hover:bg-clay/90 hover:shadow-lg hover:shadow-clay/30',
        glass: 'bg-background/60 backdrop-blur-md border border-border/50 hover:bg-background/80 hover:border-border',
        gradient: 'bg-gradient-to-r from-forest via-forest-deep to-clay text-sand hover:from-forest-deep hover:via-clay hover:to-forest hover:shadow-lg hover:shadow-forest/30',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 px-4 py-1.5 text-xs',
        lg: 'h-12 px-8 py-2.5 text-base',
        xl: 'h-14 px-10 py-3 text-lg',
        icon: 'h-11 w-11',
        'icon-sm': 'h-9 w-9',
        'icon-lg': 'h-12 w-12',
      },
      fullWidth: {
        true: 'w-full',
      },
      loading: {
        true: 'relative overflow-hidden pr-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, loading, asChild = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className, fullWidth, loading }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <svg
            className="absolute right-4 h-4 w-4 animate-spin text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };