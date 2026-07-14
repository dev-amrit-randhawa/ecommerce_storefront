'use client';

import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, Sparkles, Leaf, Zap } from 'lucide-react';
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
    desktop: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=2000&q=80', 
    mobile: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80' 
  },
  link: '/search?sort=newest',
  position: 'hero',
  priority: 0,
  ctaText: 'Shop New Arrivals',
  secondaryCtaText: 'Our Story',
  secondaryCtaLink: '/brands',
};

const trustBadges = [
  { icon: Leaf, label: 'Sustainable Materials', description: 'Organic, recycled, responsible' },
  { icon: Zap, label: 'Carbon Neutral', description: 'Offsetting every shipment' },
  { icon: Sparkles, label: 'Lifetime Repair', description: 'We fix what we make' },
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
      {/* Background Layer */}
      <div className="absolute inset-0" aria-hidden="true">
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
              {/* Parallax floating elements */}
              <motion.div
                className="absolute top-1/4 left-1/4 w-72 h-72 bg-clay/10 rounded-full blur-[120px]"
                animate={{ 
                  x: [0, 30, -20, 0], 
                  y: [0, -20, 30, 0],
                  scale: [1, 1.1, 0.9, 1]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-forest/10 rounded-full blur-[150px]"
                animate={{ 
                  x: [0, -25, 15, 0], 
                  y: [0, 25, -15, 0],
                  scale: [1, 1.05, 0.95, 1]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
              />
            </motion.div>
          </AnimatePresence>
        )}

        {/* Gradient overlay for text legibility */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-forest-deep/95 via-forest-deep/40 to-forest-deep/20"
          style={{ opacity: overlay }}
        />
      </div>

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <motion.div
          className="absolute top-20 left-10 w-2 h-2 bg-clay/30 rounded-full"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
            x: [0, 10, 0],
            y: [0, -10, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-40 right-20 w-1.5 h-1.5 bg-sand/40 rounded-full"
          animate={{ 
            scale: [1, 2, 1],
            opacity: [0.2, 0.6, 0.2],
            x: [0, -15, 0],
            y: [0, 15, 0]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-1 h-1 bg-clay/40 rounded-full"
          animate={{ 
            scale: [1, 1.8, 1],
            opacity: [0.2, 0.7, 0.2],
            x: [0, 5, 0],
            y: [0, -5, 0]
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-2.5 h-2.5 bg-forest/30 rounded-full"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.9, 0.3],
            x: [0, -8, 0],
            y: [0, 8, 0]
          }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex h-full items-center">
        <div className="container px-4">
          <div className="max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={banner._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ y: contentY, opacity: contentOpacity }}
              >
                {/* Eyebrow */}
                <motion.span
                  className="eyebrow inline-block text-sand/80"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  <Sparkles className="inline h-3.5 w-3.5 mr-1.5" />
                  New Collection
                </motion.span>

                {/* Title */}
                <motion.h1
                  className="mt-4 font-serif text-5xl font-semibold leading-[0.95] tracking-tight text-sand sm:text-6xl lg:text-7xl xl:text-8xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.7 }}
                >
                  <GradientText variant="full">{title}</GradientText>
                </motion.h1>

                {/* Subtitle */}
                {subtitle && (
                  <motion.p
                    className="mt-6 max-w-xl text-base leading-relaxed text-sand/85 sm:text-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    {subtitle}
                  </motion.p>
                )}

                {/* Description */}
                {description && (
                  <motion.p
                    className="mt-4 max-w-md text-sm leading-relaxed text-sand/70"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    {description}
                  </motion.p>
                )}

                {/* CTAs */}
                <motion.div
                  className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <Button
                    asChild
                    size="xl"
                    variant="gradient"
                    className="group w-full sm:w-auto px-10 py-4.5 text-base"
                  >
                    <Link href={ctaHref} className="flex items-center gap-3">
                      {ctaText}
                      <motion.span
                        layoutId="arrow"
                        className="flex h-5 w-5"
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        whileHover={{ x: 4 }}
                      >
                        <ArrowRight className="h-5 w-5" />
                      </motion.span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="xl"
                    variant="glass"
                    className="w-full sm:w-auto px-10 py-4.5 text-base border-sand/30 hover:border-sand/60"
                  >
                    <Link href={secondaryCtaLink} className="flex items-center gap-2">
                      {secondaryCtaText}
                    </Link>
                  </Button>
                </motion.div>

                {/* Trust badges */}
                <motion.div
                  className="mt-12 flex flex-wrap gap-4 sm:gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  {trustBadges.map((badge, i) => (
                    <motion.div
                      key={badge.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + i * 0.1, duration: 0.4 }}
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sand/10 text-clay">
                        <badge.icon className="h-5 w-5" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-sand">{badge.label}</p>
                        <p className="text-[11px] text-sand/60">{badge.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <motion.div
          className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={cn(
                'relative h-1.5 rounded-full transition-all duration-500 ease-out',
                i === activeIndex
                  ? 'w-10 bg-sand'
                  : 'w-3 bg-sand/40 hover:bg-sand/60'
              )}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === activeIndex ? 'true' : 'false'}
            >
              {i === activeIndex && (
                <motion.span
                  className="absolute left-0 top-0 h-full bg-clay"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: HERO_INTERVAL / 1000, ease: 'linear' }}
                />
              )}
            </button>
          ))}
        </motion.div>
      )}

      {/* Scroll indicator */}
      {slides.length <= 1 && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-sand/70">Scroll to explore</span>
          <motion.div
            className="h-8 w-px bg-gradient-to-b from-sand/60 to-transparent"
            animate={{ scaleY: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </section>
  );
}