'use client';

import { motion, useInView } from 'framer-motion';
import { ArrowRight, Leaf, Truck, RotateCcw, ShieldCheck, Sparkles, Zap, Heart, Award } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

const storyStats = [
  { value: '200+', label: 'Artisan Partners', icon: Heart },
  { value: '50K+', label: 'Happy Wanderers', icon: Sparkles },
  { value: '15', label: 'Countries Sourced', icon: Award },
  { value: '100%', label: 'Carbon Neutral', icon: Zap },
];

const values = [
  { icon: Leaf, title: 'Responsible Materials', description: 'Organic cotton, recycled fibers, and innovative eco-fabrics' },
  { icon: Truck, title: 'Carbon-Neutral Shipping', description: 'Every delivery offset through verified climate projects' },
  { icon: RotateCcw, title: 'Circular Design', description: 'Repair, resell, recycle — extending product lifecycles' },
  { icon: ShieldCheck, title: 'Fair Partnerships', description: 'Living wages and safe conditions for every maker' },
];

export function StorySection() {
  const ref = useRef<HTMLSectionElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="py-16 sm:py-24 bg-background"
      aria-label="Our story"
    >
      <div className="container px-4">
        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16 grid grid-cols-2 gap-8 sm:grid-cols-4"
        >
          {storyStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-forest/10 text-forest mb-3">
                <stat.icon className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <div className="font-serif text-3xl font-semibold text-foreground sm:text-4xl">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main story content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
        >
          {/* Image side */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary">
            <Image
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1400&q=80"
              alt="Considered design, built to last"
              fill
              className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-forest-deep/20 via-transparent to-clay/10" />
            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-6 left-6 bg-sand/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-xl"
            >
              <p className="font-serif text-lg font-semibold text-forest-deep">Since 1996</p>
              <p className="text-sm text-muted-foreground">Designed for Detours</p>
            </motion.div>
          </div>

          {/* Content side */}
          <div>
            <span className="eyebrow text-clay">Our Promise</span>
            <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
              A brand with stories to tell, built for the long way round.
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">
              Every piece is designed to be lived in — versatile, durable, and made
              with materials that tread lightly. We believe good things should last,
              and the best journeys rarely follow a straight line.
            </p>

            {/* Values grid */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6">
              {values.map((value, i) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                  className="flex gap-3 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-forest/10 text-forest">
                    <value.icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{value.title}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link
              href="/brands"
              className="link-underline mt-10 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-forest"
            >
              Explore our brands
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}