'use client';

import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Heart, ShoppingBag, Eye, ArrowRight, Tag, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { colorHex, colorNeedsBorder } from '@/lib/colors';
import { useWishlistStore } from '@/lib/stores/wishlist-store';
import { useCartStore } from '@/lib/stores/cart-store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, GradientText } from '@/lib/utils';

export interface CardProduct {
  _id: string;
  name: string;
  slug: string;
  basePrice: number;
  salePrice?: number;
  images: { url: string; alt?: string; isDefault?: boolean }[];
  ratings?: { average: number; count: number };
  brandId?: { name: string; slug: string };
  colors?: string[];
  tags?: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  sustainability?: string[];
}

interface ProductCardProps {
  product: CardProduct;
  index?: number;
  animate?: boolean;
  variant?: 'default' | 'compact' | 'featured';
}

export function ProductCard({ product, index = 0, animate = true, variant = 'default' }: ProductCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const wishlistIds = useWishlistStore((s) => s.ids);
  const addToCart = useCartStore((s) => s.addItem);
  const wished = wishlistIds.includes(product._id);

  const onSale = product.salePrice != null && product.salePrice < product.basePrice;
  const displayPrice = onSale ? product.salePrice! : product.basePrice;
  const discountPercent = onSale ? Math.round(((product.basePrice - displayPrice) / product.basePrice) * 100) : 0;

  const primary = product.images[0]?.url;
  const secondary = product.images[1]?.url;
  const colors = product.colors ?? [];
  const shownColors = colors.slice(0, 4);
  const extraColors = colors.length - shownColors.length;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const firstVariant = product.images[0];
    addToCart(
      {
        productId: product._id,
        slug: product.slug,
        name: product.name,
        variantId: product._id,
        sku: product._id,
        variantLabel: 'Default',
        price: displayPrice,
        image: primary,
        maxStock: 99,
      },
      1
    );
    toast.success(`Added ${product.name} to cart`);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product._id);
    toast.success(wished ? 'Removed from wishlist' : 'Saved to wishlist');
  };

  if (variant === 'compact') {
    return (
      <motion.div
        ref={ref}
        initial={animate ? { opacity: 0, y: 20 } : false}
        animate={animate && isInView ? { opacity: 1, y: 0 } : animate ? {} : { opacity: 1 }}
        transition={{ duration: 0.4, delay: (index % 4) * 0.05 }}
        className="group relative"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Link href={`/products/${product.slug}`} className="block group">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-secondary">
            {primary && (
              <Image
                src={primary}
                alt={product.images[0]?.alt || product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={cn(
                  'object-cover transition-all duration-700 ease-out',
                  hover && secondary ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
                )}
                onLoad={() => setImageLoaded(true)}
              />
            )}
            {secondary && (
              <Image
                src={secondary}
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={cn(
                  'object-cover transition-all duration-700 ease-out',
                  hover ? 'opacity-100 scale-105' : 'opacity-0 scale-95'
                )}
              />
            )}
            {!imageLoaded && primary && (
              <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-forest border-t-transparent" />
              </div>
            )}

            {onSale && (
              <Badge variant="clay" className="absolute left-3 top-3">
                -{discountPercent}%
              </Badge>
            )}

            {product.isNew && (
              <Badge variant="forest" className="absolute right-3 top-3">
                New
              </Badge>
            )}

            {product.tags?.includes('limited') && (
              <Badge variant="accent" className="absolute right-3 top-3">
                Limited
              </Badge>
            )}

            {/* Quick actions on hover */}
            <AnimatePresence>
              {hover && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-end p-3"
                >
                  <div className="w-full flex gap-2">
                    <Button
                      size="sm"
                      variant="glass"
                      className="flex-1"
                      onClick={handleQuickView}
                      rightIcon={<Eye className="h-3.5 w-3.5" />}
                    >
                      Quick View
                    </Button>
                    <Button
                      size="sm"
                      variant="glass"
                      className="flex-1"
                      onClick={handleAddToCart}
                      rightIcon={<ShoppingBag className="h-3.5 w-3.5" />}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Link>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-pressed={wished}
          className={cn(
            'absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/85 backdrop-blur-sm text-foreground/70 transition-all duration-200',
            wished ? 'text-clay fill-clay' : 'hover:text-clay hover:fill-clay hover:bg-clay/10',
            'group-hover:opacity-100 group-hover:visible opacity-0 invisible'
          )}
        >
          <Heart className={cn('h-4.5 w-4.5 stroke-1.5', wished && 'fill-current')} />
        </button>

        {/* Product info */}
        <div className="mt-3.5 space-y-2">
          {/* Color swatches */}
          {shownColors.length > 0 && (
            <div className="flex items-center gap-1.5">
              {shownColors.map((c) => (
                <span
                  key={c}
                  title={c}
                  className={cn(
                    'h-3 w-3 rounded-full transition-transform hover:scale-125',
                    colorNeedsBorder(c) ? 'ring-1 ring-black/10' : ''
                  )}
                  style={{ backgroundColor: colorHex(c) }}
                />
              ))}
              {extraColors > 0 && (
                <span className="text-[10px] text-muted-foreground font-medium">+{extraColors}</span>
              )}
            </div>
          )}

          <Link href={`/products/${product.slug}`} className="block">
            {product.brandId && (
              <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                {product.brandId.name}
              </p>
            )}
            <motion.h3
              initial={false}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-medium leading-snug text-foreground group-hover:text-clay transition-colors line-clamp-2"
            >
              {product.name}
            </motion.h3>

            {/* Rating */}
            {product.ratings && product.ratings.count > 0 && (
              <div className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span className="text-sm font-medium text-foreground">{product.ratings.average.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">({product.ratings.count})</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <span className="font-serif text-base font-semibold text-foreground">
                ₹{displayPrice.toLocaleString('en-IN')}
              </span>
              {onSale && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{product.basePrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </Link>

          {/* Sustainability tags */}
          {product.sustainability && product.sustainability.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {product.sustainability.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px] px-2 py-0.5">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // Featured variant - larger, more prominent
  if (variant === 'featured') {
    return (
      <motion.article
        ref={ref}
        initial={animate ? { opacity: 0, y: 30 } : false}
        animate={animate && isInView ? { opacity: 1, y: 0 } : animate ? {} : { opacity: 1 }}
        transition={{ duration: 0.6, delay: (index % 4) * 0.08 }}
        className="group relative"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Link href={`/products/${product.slug}`} className="block group">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-secondary">
            {primary && (
              <Image
                src={primary}
                alt={product.images[0]?.alt || product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={cn(
                  'object-cover transition-all duration-1000 ease-out',
                  hover ? 'scale-105' : 'scale-100'
                )}
                onLoad={() => setImageLoaded(true)}
                priority={index < 2}
              />
            )}
            {!imageLoaded && primary && (
              <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-forest border-t-transparent" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {onSale && (
                <Badge variant="clay" className="px-3 py-1.5 text-xs">
                  -{discountPercent}% Off
                </Badge>
              )}
              {product.isNew && (
                <Badge variant="forest" className="px-3 py-1.5 text-xs">
                  New Arrival
                </Badge>
              )}
              {product.tags?.includes('limited') && (
                <Badge variant="accent" className="px-3 py-1.5 text-xs">
                  Limited Edition
                </Badge>
              )}
            </div>

            {/* Sustainability badges */}
            {product.sustainability && product.sustainability.length > 0 && (
              <div className="absolute right-4 top-4 flex flex-col gap-1.5">
                {product.sustainability.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="glass" className="text-[10px] px-2.5 py-1">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
              aria-pressed={wished}
              className={cn(
                'absolute right-4 bottom-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/85 backdrop-blur-sm text-foreground/70 transition-all duration-200',
                wished ? 'text-clay fill-clay scale-100' : 'hover:text-clay hover:fill-clay hover:bg-clay/10 scale-100',
                'group-hover:opacity-100 group-hover:visible opacity-0 invisible scale-95'
              )}
            >
              <Heart className={cn('h-5 w-5 stroke-1.5', wished && 'fill-current')} />
            </button>

            {/* Hover overlay with quick actions */}
            <AnimatePresence>
              {hover && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-t from-forest-deep/80 via-forest-deep/20 to-transparent flex items-end p-4"
                >
                  <div className="w-full flex gap-3">
                    <Button
                      size="md"
                      variant="default"
                      className="flex-1"
                      onClick={handleQuickView}
                      rightIcon={<Eye className="h-4 w-4" />}
                    >
                      Quick View
                    </Button>
                    <Button
                      size="md"
                      variant="secondary"
                      className="flex-1"
                      onClick={handleAddToCart}
                      rightIcon={<ShoppingBag className="h-4 w-4" />}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Link>

        {/* Product info */}
        <div className="mt-4 space-y-2.5">
          <Link href={`/products/${product.slug}`} className="block">
            {product.brandId && (
              <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                {product.brandId.name}
              </p>
            )}
            <h3 className="font-serif text-lg font-semibold leading-snug text-foreground group-hover:text-clay transition-colors line-clamp-1">
              {product.name}
            </h3>

            {/* Rating */}
            {product.ratings && product.ratings.count > 0 && (
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                <span className="text-sm font-medium text-foreground">{product.ratings.average.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({product.ratings.count})</span>
              </div>
            )}

            <div className="flex items-baseline gap-2 pt-1">
              <span className="font-serif text-lg font-semibold text-foreground">
                ₹{displayPrice.toLocaleString('en-IN')}
              </span>
              {onSale && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{product.basePrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </Link>

          {/* Color swatches */}
          {shownColors.length > 0 && (
            <div className="flex items-center gap-2 pt-1">
              {shownColors.map((c) => (
                <span
                  key={c}
                  title={c}
                  className={cn(
                    'h-4 w-4 rounded-full transition-all hover:scale-125 cursor-pointer',
                    colorNeedsBorder(c) ? 'ring-1 ring-black/10' : ''
                  )}
                  style={{ backgroundColor: colorHex(c) }}
                />
              ))}
              {extraColors > 0 && (
                <span className="text-[11px] text-muted-foreground font-medium">+{extraColors}</span>
              )}
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {product.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px] px-2 py-0.5">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </motion.article>
    );
  }

  // Default variant
  return (
    <motion.article
      ref={ref}
      initial={animate ? { opacity: 0, y: 24 } : false}
      animate={animate && isInView ? { opacity: 1, y: 0 } : animate ? {} : { opacity: 1 }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.05 }}
      className="group relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      whileTap={{ scale: 0.98 }}
    >
      <Link href={`/products/${product.slug}`} className="block group">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-secondary">
          {primary && (
            <Image
              src={primary}
              alt={product.images[0]?.alt || product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={cn(
                'object-cover transition-all duration-700 ease-out',
                hover && secondary ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
              )}
              onLoad={() => setImageLoaded(true)}
            />
          )}
          {secondary && (
            <Image
              src={secondary}
              alt=""
              aria-hidden="true"
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={cn(
                'object-cover transition-all duration-700 ease-out',
                hover ? 'opacity-100 scale-105' : 'opacity-0 scale-95'
              )}
            />
          )}
          {!imageLoaded && primary && (
            <div className="absolute inset-0 flex items-center justify-center bg-secondary">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-forest border-t-transparent" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {onSale && (
              <Badge variant="clay" className="px-2.5 py-1 text-[10px]">
                -{discountPercent}%
              </Badge>
            )}
            {product.isNew && (
              <Badge variant="forest" className="px-2.5 py-1 text-[10px]">
                New
              </Badge>
            )}
            {product.tags?.includes('limited') && (
              <Badge variant="accent" className="px-2.5 py-1 text-[10px]">
                Limited
              </Badge>
            )}
            {product.tags?.includes('bestseller') && (
              <Badge variant="gradient" className="px-2.5 py-1 text-[10px]">
                Bestseller
              </Badge>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
            aria-pressed={wished}
            className={cn(
              'absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/85 backdrop-blur-sm text-foreground/70 transition-all duration-200',
              wished ? 'text-clay fill-clay' : 'hover:text-clay hover:fill-clay hover:bg-clay/10',
              'group-hover:opacity-100 group-hover:visible opacity-0 invisible'
            )}
          >
            <Heart className={cn('h-4.5 w-4.5 stroke-1.5', wished && 'fill-current')} />
          </button>

          {/* Hover overlay */}
          <AnimatePresence>
            {hover && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute inset-0 bg-gradient-to-t from-forest-deep/70 via-forest-deep/20 to-transparent flex items-end p-3"
              >
                <div className="w-full flex gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    className="flex-1"
                    onClick={handleQuickView}
                    rightIcon={<Eye className="h-3.5 w-3.5" />}
                  >
                    Quick View
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex-1"
                    onClick={handleAddToCart}
                    rightIcon={<ShoppingBag className="h-3.5 w-3.5" />}
                  >
                    Add to Cart
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Link>

        {/* Product info */}
        <div className="mt-3.5 space-y-2">
          {/* Color swatches */}
          {shownColors.length > 0 && (
            <div className="flex items-center gap-1.5">
              {shownColors.map((c) => (
                <span
                  key={c}
                  title={c}
                  className={cn(
                    'h-3.5 w-3.5 rounded-full transition-all hover:scale-125 cursor-pointer',
                    colorNeedsBorder(c) ? 'ring-1 ring-black/10' : ''
                  )}
                  style={{ backgroundColor: colorHex(c) }}
                />
              ))}
              {extraColors > 0 && (
                <span className="text-[11px] text-muted-foreground font-medium">+{extraColors}</span>
              )}
            </div>
          )}

          <Link href={`/products/${product.slug}`} className="block">
            {product.brandId && (
              <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                {product.brandId.name}
              </p>
            )}
            <h3 className="text-sm font-medium leading-snug text-foreground transition-colors group-hover:text-clay line-clamp-2">
              {product.name}
            </h3>

            {/* Rating */}
            {product.ratings && product.ratings.count > 0 && (
              <div className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span className="text-sm font-medium text-foreground">{product.ratings.average.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">({product.ratings.count})</span>
              </div>
            )}

            <div className="flex items-baseline gap-2 pt-0.5">
              <span className="font-serif text-base font-semibold text-foreground">
                ₹{displayPrice.toLocaleString('en-IN')}
              </span>
              {onSale && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{product.basePrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </Link>

          {/* Sustainability */}
          {product.sustainability && product.sustainability.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {product.sustainability.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px] px-2 py-0.5">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </motion.article>
    );
}