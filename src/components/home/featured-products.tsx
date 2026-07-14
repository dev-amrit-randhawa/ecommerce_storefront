'use client';

import { motion, useInView } from 'framer-motion';
import { ArrowRight, Star, Heart, Zap, Leaf, Tag, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';

import { ProductCard, type CardProduct } from '@/components/product/product-card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Product extends CardProduct {
  tags?: string[];
  isNew?: boolean;
  sustainability?: string[];
}

export function FeaturedProducts({ products, loading }: { products: Product[]; loading: boolean }) {
  const ref = useRef<HTMLSectionElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const displayProducts = products.length > 0 ? products : Array.from({ length: 8 }, (_, i) => ({
    _id: `placeholder-${i}`,
    name: '',
    slug: '',
    basePrice: 0,
    images: [],
    tags: [],
    isNew: false,
  } as Product));

  return (
    <section
      ref={ref}
      className="border-t border-border bg-muted/30"
      aria-label="Featured products"
    >
      <div className="container px-4 py-16 sm:py-24">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <span className="eyebrow text-clay">Bestsellers</span>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Loved by Wanderers
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              Our most cherished pieces — chosen by those who roam
            </p>
          </div>
          <Link
            href="/search?featured=true"
            className="link-underline hidden items-center gap-1.5 text-sm font-semibold uppercase tracking-[0.1em] text-foreground/70 transition-colors hover:text-foreground sm:flex"
          >
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>

        {/* Product grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.1, staggerChildren: 0.05 }}
          className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4"
        >
          {displayProducts.map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <ProductCard
                product={product as CardProduct}
                index={i}
                animate={!loading}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* View all on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center sm:hidden"
        >
          <Link
            href="/search?featured=true"
            className="link-underline inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-[0.1em] text-foreground/70 transition-colors hover:text-foreground"
          >
            View All Bestsellers <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}