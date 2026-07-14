'use client';

import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, Sparkles, Leaf, Zap, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { api } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Glass } from '@/components/ui/visual-effects';
import { GradientText } from '@/components/ui/visual-effects';
import { cn } from '@/lib/utils';

interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: { desktop: string; mobile: string };
  link?: string;
  position: string;
  priority: number;
  ctaText?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

const HERO_INTERVAL = 7000;

const fallback: Banner = {
  _id: 'default',
  title: 'Designed for Detours',
  subtitle: 'Considered, durable goods for every kind of trip',
  description: 'From the weekend watering hole to exploring a new city — we make gear that goes the distance.',
  image: { 
    desktop: 'https://images.unsplash.com/photo-1444441984904996-e0b6ba687e04?auto=format&fit=crop&w=2000&q=80', 
    mobile: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80' 
  },
  link: '/search?sort=newest',
  position: 'hero',
  priority: 0,
  ctaText: 'Shop New Arrivals',
  secondaryCtaText: 'Our Story',
  secondaryCtaLink: '/brands',
};

const floatingElements = [
  { x: '10%', y: '20%', delay: 0, size: 80 },
  { x: '85%', y: '15%', delay: 1, size: 120 },
  { x: '15%', y: '75%', delay: 2, size: 60 },
  { x: '80%', y: '80%', delay: 3, size: 100 },
  { x: '50%', y: '5%', delay: 0.5, size: 40 },
  { x: '5%', y: '50%', delay: 1.5, size: 50 },
];

export function HeroSection({ banners, loading }: { banners: Banner[]; loading: boolean }) {
  const ref = useRef<HTMLSectionElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const overlay = useTransform(scrollYProgress, [0, 1], [0.35, 0.65]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [1, 0.8, 0]);

  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const slides = banners.length > 0 ? banners : [fallback];

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, HERO_INTERVAL);
  }, [slides.length]);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);

  const goTo = (idx: number) => {
    setActiveIndex(idx);
    startTimer();
  };

  const banner = slides[activeIndex];
  const title = banner.title;
  const subtitle = banner.subtitle ?? '';
  const description = banner.description ?? '';
  const heroImage = banner.image?.desktop ?? fallback.image.desktop;
  const ctaHref = banner.link ?? '/search?sort=newest';
  const ctaText = banner.ctaText ?? 'Shop Now';
  const secondaryCtaText = banner.secondaryCtaText ?? 'Explore Collections';
  const secondaryCtaLink = banner.secondaryCtaLink ?? '/categories';

  return (
    <section
      ref={ref}
      className="relative h-[90vh] min-h-[600px] max-h-[900px] overflow-hidden bg-forest-deep"
      aria-label="Hero banner"
    >
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {floatingElements.map((el, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-clay/5 blur-[100px]"
            style={{ left: el.x, top: el.y, width: el.size, height: el.size }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: el.delay, duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div
              animate={{
                x: [-20, 20, -20],
                y: [20, -20, 20],
                rotate: [0, 5, 0],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        ))}
      </div>

      {/* Background images with crossfade */}
      {!loading && (
        <AnimatePresence mode="sync">
          <motion.div
            key={banner._id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ y }}
          >
            <img
              src={heroImage}
              alt={title}
              className="h-[120%] w-full object-cover"
              loading="eager"
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/30 to-forest-deep/40" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-forest-deep/20 via-transparent to-clay/10"
              style={{ opacity: overlay }}
            />
          </motion.div>
        </AnimatePresence>
      )}

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex h-full items-end pb-16 sm:items-center sm:pb-0">
        <div className="container px-4">
          <div className="max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={banner._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ y: contentY, opacity: contentOpacity }}
              >
                {/* Eyebrow badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275] }}
                >
                  <Badge variant="glass" className="text-sand/90 border-sand/30 px-4 py-2 gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-clay" />
                    <span className="text-[11px] uppercase tracking-[0.2em]">New Collection</span>
                  </Badge>
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="mt-6 font-serif text-5xl font-semibold leading-[0.98] tracking-tight text-sand sm:text-6xl lg:text-7xl xl:text-8xl"
                >
                  <GradientText variant="full">{title}</GradientText>
                </motion.h1>

                {/* Subtitle */}
                {subtitle && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="mt-6 max-w-xl text-base leading-relaxed text-sand/85 sm:text-lg"
                  >
                    {subtitle}
                  </motion.p>
                )}

                {/* Description */}
                {description && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="mt-4 max-w-lg text-sm leading-relaxed text-sand/70"
                  >
                    {description}
                  </motion.p>
                )}

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
                >
                  <Link href={ctaHref}>
                    <Button
                      size="lg"
                      variant="gradient"
                      className="group w-full sm:w-auto px-10 py-4 text-[13px]"
                      rightIcon={<ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                    >
                      {ctaText}
                    </Button>
                  </Link>
                  <Link href={secondaryCtaLink}>
                    <Button
                      size="lg"
                      variant="glass"
                      className="w-full sm:w-auto px-10 py-4 text-[13px] border-sand/30 hover:border-sand/60 hover:bg-sand/10"
                      rightIcon={<ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                    >
                      {secondaryCtaText}
                    </Button>
                  </Link>
                </motion.div>

                {/* Trust indicators */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="mt-12 flex flex-wrap items-center gap-6 text-sm text-sand/60"
                >
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-clay" strokeWidth={1.5} />
                    <span>Sustainable</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-clay" strokeWidth={1.5} />
                    <span>Carbon Neutral</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-clay" strokeWidth={1.5} />
                    <span>Lifetime Repair</span>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      {slides.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2"
        >
          {slides.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => goTo(i)}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 + i * 0.05, type: 'spring', stiffness: 400, damping: 25 }}
              className={cn(
                'h-1.5 rounded-full transition-all duration-500 ease-out',
                i === activeIndex ? 'w-8 bg-sand' : 'w-3 bg-sand/40 hover:bg-sand/60'
              )}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === activeIndex ? 'true' : 'false'}
            />
          ))}
        </motion.div>
      )}

      {/* Scroll indicator */}
      {slides.length <= 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 sm:flex"
        >
          <motion.div
            className="flex flex-col items-center gap-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-sand/70">Scroll</span>
            <div className="h-8 w-px bg-gradient-to-b from-sand/60 to-transparent" />
          </motion.div>
        </motion.div>
      )}

      {/* Keyboard navigation */}
      <div
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') goTo((activeIndex - 1 + slides.length) % slides.length);
          if (e.key === 'ArrowRight') goTo((activeIndex + 1) % slides.length);
        }}
        tabIndex={0}
        className="sr-only"
        aria-label="Use arrow keys to navigate slides"
      />
    </section>
  );
}