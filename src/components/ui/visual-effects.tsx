import { cn } from '@/lib/utils';

export interface GlassProps {
  variant?: 'default' | 'strong' | 'subtle' | 'card';
  className?: string;
  children: React.ReactNode;
}

export function Glass({ variant = 'default', className, children }: GlassProps) {
  const variants = {
    default: 'bg-background/60 backdrop-blur-md border border-border/50 shadow-glass',
    strong: 'bg-background/80 backdrop-blur-lg border border-border/30 shadow-glass-lg',
    subtle: 'bg-background/40 backdrop-blur-sm border border-border/70 shadow-sm',
    card: 'bg-card/80 backdrop-blur-md border border-border/50 shadow-elevation-2',
  };

  return (
    <div className={cn(variants[variant], 'rounded-xl', className)}>
      {children}
    </div>
  );
}

export interface GradientTextProps {
  variant?: 'primary' | 'accent' | 'forest-clay' | 'full' | 'subtle';
  className?: string;
  children: React.ReactNode;
}

export function GradientText({ variant = 'primary', className, children }: GradientTextProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-forest via-forest-deep to-clay bg-clip-text text-transparent',
    accent: 'bg-gradient-to-r from-clay via-clay/80 to-forest bg-clip-text text-transparent',
    'forest-clay': 'bg-gradient-to-r from-forest to-clay bg-clip-text text-transparent',
    full: 'bg-gradient-to-r from-forest-deep via-forest via-clay to-sand bg-clip-text text-transparent',
    subtle: 'bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent',
  };

  return (
    <span className={cn(variants[variant], className)}>{children}</span>
  );
}

export interface ShimmerProps {
  className?: string;
  children?: React.ReactNode;
}

export function Shimmer({ className, children }: ShimmerProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-shimmer',
        className
      )}
    >
      {children}
    </div>
  );
}

export interface NoiseOverlayProps {
  opacity?: number;
  className?: string;
}

export function NoiseOverlay({ opacity = 0.03, className }: NoiseOverlayProps) {
  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-0 z-[9999]',
        className
      )}
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

export interface SpotlightProps {
  className?: string;
  children: React.ReactNode;
}

export function Spotlight({ className, children }: SpotlightProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div
        className="absolute inset-0 bg-gradient-to-r from-forest/10 via-transparent to-clay/10 opacity-50 animate-pulse-glow"
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export interface AnimatedBorderProps {
  className?: string;
  children: React.ReactNode;
  color?: 'forest' | 'clay' | 'primary' | 'accent';
  speed?: number;
}

export function AnimatedBorder({ className, children, color = 'forest', speed = 3000 }: AnimatedBorderProps) {
  const colors = {
    forest: 'from-forest via-forest-deep to-clay',
    clay: 'from-clay via-clay/80 to-forest',
    primary: 'from-primary via-primary/80 to-accent',
    accent: 'from-accent via-accent/80 to-primary',
  };

  return (
    <div
      className={cn(
        'relative rounded-xl overflow-hidden',
        className
      )}
      style={{
        '--border-speed': `${speed}ms`,
      } as React.CSSProperties}
    >
      <div
        className="absolute inset-0 bg-gradient-to-r animate-marquee"
        style={{
          background: `linear-gradient(90deg, hsl(var(--${color})), hsl(var(--${color})/0.5), hsl(var(--${color})))`,
          backgroundSize: '200% 100%',
          animationDuration: `${speed}ms`,
        } as React.CSSProperties}
        aria-hidden="true"
      >
        <div className="absolute inset-[1px] bg-background rounded-[inherit]">
          {children}
        </div>
      </div>
    </div>
  );
}

export interface FloatingElementProps {
  className?: string;
  children: React.ReactNode;
  amplitude?: number;
  duration?: number;
}

export function FloatingElement({ className, children, amplitude = 20, duration = 6000 }: FloatingElementProps) {
  return (
    <motion.div
      className={cn('inline-block', className)}
      animate={{ y: [-amplitude, amplitude, -amplitude] }}
      transition={{ duration: duration / 1000, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}