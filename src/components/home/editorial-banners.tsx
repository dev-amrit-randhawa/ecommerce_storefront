'use client';

import { motion, useInView } from 'framer-motion';
import { ArrowRight, Sparkles, Leaf, Zap, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

const editorialTiles = [
  {
    eyebrow: 'The Edit',
    title: 'The Summer Edit',
    description: 'Lightweight layers for long days and warm nights',
    cta: 'Shop the Edit',
    href: '/categories/summer',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80',
    color: 'from-clay/20 via-clay/10 to-transparent',
    icon: Sparkles,
  },
  {
    eyebrow: "Women's Bottoms",
    title: 'Work-to-Weekend Wide Legs',
    description: 'Versatile trousers that transition effortlessly',
    cta: "Shop Women's Pants",
    href: '/categories/womens-bottoms',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    color: 'from-forest/20 via-forest/10 to-transparent',
    icon: Leaf,
  },
  {
    eyebrow: 'Outerwear',
    title: 'Jackets for Every Journey',
    description: 'Technical fabrics meet timeless design',
    cta: 'Explore Outerwear',
    href: '/categories/outerwear',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
    color: 'from-sky/20 via-sky/10 to-transparent',
    icon: Zap,
  },
  {
    eyebrow: 'Sustainability',
    title: 'Made to Last, Designed to Return',
    description: 'Our circular design philosophy in action',
    cta: 'Learn More',
    href: '/sustainability',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=80',
    color: 'from-emerald/20 via-emerald/10 to-transparent',
    icon: Heart,
  },
];

export function EditorialBanners() {
  const ref = useRef<HTMLSectionElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="py-12 sm:py-16"
      aria-label="Editorial highlights"
    >
      <div className="container px-4">
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {editorialTiles.map((tile, i) => (
            <motion.div
              key={tile.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
            >
              <Link
                href={tile.href}
                className="group relative block aspect-[4/5] overflow-hidden rounded-xl bg-forest-deep sm:aspect-[16/10] lg:aspect-[4/5]"
              >
                <Image
                  src={tile.image}
                  alt={tile.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
                  priority={i < 2}
                />
                <div className={cn(
                  'absolute inset-0 bg-gradient-to-t',
                  tile.color,
                  'group-hover:from-forest-deep/90 group-hover:via-forest-deep/40 transition-all duration-500'
                )} />
                
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <tile.icon className="h-4 w-4 text-sand/80" strokeWidth={1.5} />
                    <span className="eyebrow text-sand/80">{tile.eyebrow}</span>
                  </div>
                  <h3 className="font-serif text-2xl font-semibold leading-tight text-sand sm:text-3xl lg:text-2xl max-w-xs">
                    {tile.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm text-sand/70 hidden sm:block">
                    {tile.description}
                  </p>
                  <div className="mt-5">
                    <span className="inline-flex items-center gap-1.5 rounded-sm border border-sand/50 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-sand transition-all duration-300 group-hover:bg-sand group-hover:text-forest-deep group-hover:border-sand">
                      {tile.cta}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}