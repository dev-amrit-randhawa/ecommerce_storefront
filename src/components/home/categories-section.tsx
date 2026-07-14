'use client';

import { motion, useInView } from 'framer-motion';
import { ArrowRight, Grid3X3 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  productCount: number;
  description?: string;
}

const fallbackImages = [
  'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80',
];

export function CategoriesSection({ categories, loading }: { categories: Category[]; loading: boolean }) {
  const ref = useRef<HTMLSectionElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const displayCategories = categories.length > 0 ? categories : [
    { _id: '1', name: 'Women', slug: 'womens', productCount: 120, image: fallbackImages[0] },
    { _id: '2', name: 'Men', slug: 'mens', productCount: 95, image: fallbackImages[1] },
    { _id: '3', name: 'Accessories', slug: 'accessories', productCount: 60, image: fallbackImages[2] },
    { _id: '4', name: 'Footwear', slug: 'footwear', productCount: 45, image: fallbackImages[3] },
  ];

  return (
    <section
      ref={ref}
      className="py-16 sm:py-24"
      aria-label="Shop by category"
    >
      <div className="container px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <span className="eyebrow text-clay">Collections</span>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Shop by Category
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              Discover curated collections for every journey
            </p>
          </div>
          <Link
            href="/categories"
            className="link-underline hidden items-center gap-1.5 text-sm font-semibold uppercase tracking-[0.1em] text-foreground/70 transition-colors hover:text-foreground sm:flex"
          >
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>

        {/* Category grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="aspect-[3/4] animate-pulse rounded-xl bg-secondary"
                />
              ))
            : displayCategories.map((cat, i) => (
                <motion.div
                  key={cat._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.07 }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="group relative block aspect-[3/4] overflow-hidden rounded-xl bg-forest-deep"
                  >
                    {cat.image ? (
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="h-full w-full object-cover opacity-90 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
                        priority={i < 4}
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-forest to-forest-deep" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/85 via-forest-deep/30 to-transparent group-hover:from-forest-deep/95 group-hover:via-forest-deep/40 transition-all duration-500" />
                    <div className="absolute inset-0 flex flex-col items-end justify-between p-4 sm:p-6">
                      {/* Product count badge */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="self-start"
                      >
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-sand/10 backdrop-blur-sm text-[11px] font-semibold uppercase tracking-[0.1em] text-sand">
                          <Grid3X3 className="h-3 w-3" strokeWidth={1.5} />
                          {cat.productCount.toLocaleString()} items
                        </span>
                      </motion.div>

                      {/* Content */}
                      <div className="w-full text-right">
                        <h3 className="font-serif text-xl font-semibold text-sand sm:text-2xl">
                          {cat.name}
                        </h3>
                        {cat.description && (
                          <p className="mt-1 text-sm text-sand/70 line-clamp-1">{cat.description}</p>
                        )}
                        <p className="mt-2 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-sand/80 group-hover:text-sand transition-colors">
                          Explore <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center sm:hidden"
        >
          <Link
            href="/categories"
            className="link-underline inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-[0.1em] text-foreground/70 transition-colors hover:text-foreground"
          >
            View All Categories <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}