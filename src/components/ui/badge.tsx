'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.1em] transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-forest text-sand hover:bg-forest-deep',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border-border text-foreground hover:bg-secondary',
        clay: 'border-transparent bg-clay text-sand hover:bg-clay/90',
        glass: 'border-border/50 bg-background/60 backdrop-blur-md text-foreground',
        success: 'border-transparent bg-green-600 text-white hover:bg-green-700',
        warning: 'border-transparent bg-amber-500 text-white hover:bg-amber-600',
      },
      size: {
        default: 'h-5 px-2.5',
        sm: 'h-4 px-2 text-[10px]',
        lg: 'h-6 px-3 text-sm',
      },
      dot: {
        true: 'relative pl-6 before:content-[""] before:absolute before:left-2 before:top-1/2 before:-translate-y-1/2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-current',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, dot, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size, dot, className }))} {...props} />;
}

export { Badge, badgeVariants };