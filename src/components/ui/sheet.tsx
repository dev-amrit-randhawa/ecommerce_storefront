'use client';

import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>
>(({ className, children, side = 'right', ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(
        'fixed z-50 flex flex-col gap-4 bg-background p-6 shadow-xl transition-all duration-300 ease-out-expo',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:duration-300 data-[state=open]:duration-500',
        side === 'right' &&
          'right-0 top-0 h-full w-[420px] max-w-[90vw] data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
        side === 'left' &&
          'left-0 top-0 h-full w-[420px] max-w-[90vw] data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
        side === 'bottom' &&
          'left-0 bottom-0 w-full max-h-[80vh] data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        side === 'top' &&
          'left-0 top-0 w-full max-h-[80vh] data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between border-b border-border pb-4">
        <SheetPrimitive.Title className="font-serif text-xl font-semibold tracking-tight">
          {props.children?.props?.children || ''}
        </SheetPrimitive.Title>
        <SheetClose className="cursor-pointer rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary" />
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2', className)} {...props} />
);
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex items-center justify-end gap-2 border-t border-border pt-4', className)}
    {...props}
  />
);
SheetFooter.displayName = 'SheetFooter';

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, children, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn('font-serif text-lg font-semibold tracking-tight', className)}
    {...props}
  >
    {children}
  </SheetPrimitive.Title>
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};