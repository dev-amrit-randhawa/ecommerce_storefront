'use client';

import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { Menu, Search, ShoppingBag, Heart, User, X, ChevronDown, ArrowRight, Sparkles, Truck, RotateCcw, ShieldCheck, Leaf } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';

import { SearchOverlay } from '@/components/search/search-overlay';
import { selectCartCount, useCartStore } from '@/lib/stores/cart-store';
import { useWishlistStore } from '@/lib/stores/wishlist-store';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn, GradientText, Glass } from '@/lib/utils';

const navigation = [
  {
    name: 'New In',
    href: '/search?sort=newest',
    megaMenu: {
      columns: [
        { title: 'New Arrivals', items: [{ name: 'Just Landed', href: '/search?sort=newest' }, { name: 'This Week', href: '/search?sort=newest&week=1' }, { name: 'Coming Soon', href: '/search?coming-soon=true' }] },
        { title: 'Categories', items: [{ name: 'Tops & Tees', href: '/categories/tops' }, { name: 'Bottoms', href: '/categories/bottoms' }, { name: 'Dresses', href: '/categories/dresses' }, { name: 'Outerwear', href: '/categories/outerwear' }] },
        { title: 'Features', items: [{ name: 'Sustainable', href: '/search?sustainable=true' }, { name: 'Limited Edition', href: '/search?limited=true' }] },
      ],
      featured: { title: 'Summer Collection', description: 'Lightweight fabrics for warm days', href: '/categories/summer', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80' },
    },
  },
  {
    name: 'Shop',
    href: '/categories',
    megaMenu: {
      columns: [
        { title: 'Women', items: [{ name: 'All Women\'s', href: '/categories/womens' }, { name: 'Tops', href: '/categories/womens-tops' }, { name: 'Bottoms', href: '/categories/womens-bottoms' }, { name: 'Dresses', href: '/categories/womens-dresses' }, { name: 'Outerwear', href: '/categories/womens-outerwear' }] },
        { title: 'Men', items: [{ name: 'All Men\'s', href: '/categories/mens' }, { name: 'T-Shirts', href: '/categories/mens-tees' }, { name: 'Shirts', href: '/categories/mens-shirts' }, { name: 'Pants', href: '/categories/mens-pants' }, { name: 'Jackets', href: '/categories/mens-jackets' }] },
        { title: 'Accessories', items: [{ name: 'Bags', href: '/categories/bags' }, { name: 'Hats', href: '/categories/hats' }, { name: 'Scarves', href: '/categories/scarves' }, { name: 'Jewelry', href: '/categories/jewelry' }] },
        { title: 'Footwear', items: [{ name: 'Sneakers', href: '/categories/sneakers' }, { name: 'Boots', href: '/categories/boots' }, { name: 'Sandals', href: '/categories/sandals' }] },
      ],
      featured: { title: 'Best Sellers', description: 'Our most loved pieces', href: '/search?featured=true', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=600&q=80' },
    },
  },
  {
    name: 'Brands',
    href: '/brands',
    megaMenu: {
      columns: [
        { title: 'Featured Brands', items: [{ name: 'Patagonia', href: '/brands/patagonia' }, { name: 'Veja', href: '/brands/veja' }, { name: 'Everlane', href: '/brands/everlane' }, { name: 'Allbirds', href: '/brands/allbirds' }] },
        { title: 'By Category', items: [{ name: 'Sustainable', href: '/brands?sustainable=true' }, { name: 'Local', href: '/brands?local=true' }, { name: 'Artisan', href: '/brands?artisan=true' }] },
        { title: 'All Brands', items: [{ name: 'A-Z Directory', href: '/brands' }] },
      ],
      featured: { title: 'Brand Spotlight', description: 'Discover the story behind Patagonia', href: '/brands/patagonia', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80' },
    },
  },
  {
    name: 'Sale',
    href: '/search?sale=true',
    megaMenu: {
      columns: [
        { title: 'Shop Sale', items: [{ name: 'Up to 50% Off', href: '/search?sale=true&discount=50' }, { name: 'Final Sale', href: '/search?final-sale=true' }, { name: 'Last Chance', href: '/search?last-chance=true' }] },
        { title: 'Categories', items: [{ name: 'Women\'s Sale', href: '/search?sale=true&category=womens' }, { name: 'Men\'s Sale', href: '/search?sale=true&category=mens' }, { name: 'Accessories Sale', href: '/search?sale=true&category=accessories' }] },
      ],
      featured: { title: 'End of Season', description: 'Up to 60% off select styles', href: '/search?sale=true', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80' },
    },
  },
];

const announcements = [
  'Complimentary shipping on orders over ₹1,000',
  'Designed for Detours — built to last, made to wander',
  '7-day easy returns on every order',
];

const trustBadges = [
  { icon: Truck, label: 'Free Shipping', description: 'On orders over ₹1,000' },
  { icon: RotateCcw, label: 'Easy Returns', description: '7-day no-fuss exchanges' },
  { icon: ShieldCheck, label: 'Secure Checkout', description: 'Razorpay protected' },
  { icon: Leaf, label: 'Sustainable', description: 'Eco-friendly materials' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cartCount = useCartStore(selectCartCount);
  const wishlistCount = useWishlistStore((s) => s.ids.length);
  const headerRef = useRef<HTMLHeaderElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll({ target: headerRef, layoutEffect: true });
  const opacity = useTransform(scrollY, [0, 50], [1, 0.95]);
  const blur = useTransform(scrollY, [0, 50], [0, 20]);
  const translateY = useTransform(scrollY, [0, 100], [0, -10]);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        setMegaMenuOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMegaMenuEnter = (key: string) => setMegaMenuOpen(key);
  const handleMegaMenuLeave = () => setMegaMenuOpen(null);

  return (
    <>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50"
        style={{ opacity, backdropFilter: `blur(${blur}px)`, transform: `translateY(${translateY}px)` }}
      >
        {/* Announcement Marquee */}
        <motion.div
          className="bg-forest-deep text-sand overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="container px-4 py-2">
            <div className="flex items-center justify-center gap-16 overflow-hidden whitespace-nowrap">
              <motion.div
                className="flex shrink-0 items-center gap-16 animate-marquee"
                style={{ animationDuration: '30s' }}
              >
                {[...announcements, ...announcements].map((line, i) => (
                  <span key={i} className="text-[11px] uppercase tracking-[0.22em] text-sand/90">
                    {line}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main Header Bar */}
        <motion.div
          className={cn(
            'border-b transition-all duration-300',
            scrolled
              ? 'border-border bg-background/90 backdrop-blur-md shadow-[0_1px_20px_rgba(0,0,0,0.04)]'
              : 'border-transparent bg-transparent'
          )}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="container px-4">
            <div className="grid h-16 lg:h-18 grid-cols-[1fr_auto_1fr] items-center gap-4">
              {/* Left: Menu + Navigation */}
              <div className="flex items-center gap-4">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <button
                      className="lg:hidden cursor-pointer -ml-1 p-1.5 text-foreground/70 transition-colors hover:text-foreground"
                      aria-label="Toggle menu"
                    >
                      {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] max-w-[90vw] p-6">
                    <nav className="flex flex-col gap-1">
                      {navigation.map((item, i) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <Link
                            href={item.href}
                            className="cursor-pointer flex items-center justify-between px-3 py-3 text-lg font-medium text-foreground transition-colors hover:text-clay"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.name}
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          </Link>
                        </motion.div>
                      ))}
                    </nav>
                    <div className="mt-6 border-t border-border pt-6 flex flex-col gap-3">
                      <Link href="/account" className="cursor-pointer px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                        My Account
                      </Link>
                      <Link href="/account/wishlist" className="cursor-pointer flex items-center justify-between px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                        Wishlist
                        {wishlistCount > 0 && (
                          <span className="px-2 py-0.5 text-[10px] font-semibold bg-clay text-sand rounded-full">
                            {wishlistCount}
                          </span>
                        )}
                      </Link>
                      <Link href="/cart" className="cursor-pointer flex items-center justify-between px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                        Cart
                        {cartCount > 0 && (
                          <span className="px-2 py-0.5 text-[10px] font-semibold bg-clay text-sand rounded-full">
                            {cartCount}
                          </span>
                        )}
                      </Link>
                    </div>
                  </SheetContent>
                </Sheet>

                <nav className="hidden lg:flex lg:items-center lg:gap-1" ref={megaMenuRef} onMouseEnter={() => setMegaMenuOpen(null)} onMouseLeave={handleMegaMenuLeave}>
                  {navigation.map((item) => (
                    <DropdownMenu key={item.name}>
                      <DropdownMenuTrigger asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            'cursor-pointer flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-medium uppercase tracking-[0.12em] text-foreground/75 transition-colors hover:text-foreground',
                            megaMenuOpen === item.name && 'text-clay'
                          )}
                          onMouseEnter={() => handleMegaMenuEnter(item.name)}
                        >
                          {item.name}
                          <ChevronDown className={cn('h-3.5 w-3.5 text-muted-foreground transition-transform', megaMenuOpen === item.name && 'rotate-180')} />
                        </Link>
                      </DropdownMenuTrigger>
                      {item.megaMenu && (
                        <DropdownMenuContent
                          align="start"
                          sideOffset={8}
                          className="w-[680px] max-w-[90vw] p-0 overflow-hidden"
                          onMouseEnter={() => handleMegaMenuEnter(item.name)}
                          onMouseLeave={handleMegaMenuLeave}
                        >
                          <div className="grid grid-cols-4 gap-0">
                            {item.megaMenu.columns.map((col, colIndex) => (
                              <motion.div
                                key={col.title}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: colIndex * 0.05 }}
                                className={cn('p-6 border-r border-border/50', colIndex === item.megaMenu.columns.length - 1 && 'border-r-0')}
                              >
                                <h4 className="eyebrow mb-3 text-clay">{col.title}</h4>
                                <ul className="space-y-2">
                                  {col.items.map((link) => (
                                    <li key={link.name}>
                                      <Link
                                        href={link.href}
                                        className="cursor-pointer text-sm text-foreground/70 transition-colors hover:text-clay"
                                      >
                                        {link.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </motion.div>
                            ))}
                          </div>
                          {item.megaMenu.featured && (
                            <div className="relative col-span-4 p-6 bg-secondary/50 border-t border-border/50">
                              <div className="grid grid-cols-2 gap-6 items-center">
                                <div>
                                  <span className="eyebrow text-clay">{item.megaMenu.featured.title}</span>
                                  <h4 className="mt-2 font-serif text-xl font-semibold text-foreground">{item.megaMenu.featured.description}</h4>
                                  <Link
                                    href={item.megaMenu.featured.href}
                                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.1em] text-forest hover:text-clay"
                                  >
                                    Explore <ArrowRight className="h-4 w-4" />
                                  </Link>
                                </div>
                                <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                                  <Image
                                    src={item.megaMenu.featured.image}
                                    alt={item.megaMenu.featured.title}
                                    fill
                                    className="object-cover transition-transform duration-700 hover:scale-105"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </DropdownMenuContent>
                      )}
                    </DropdownMenu>
                  ))}
                </nav>
              </div>

              {/* Center: Logo */}
              <Link href="/" className="cursor-pointer select-none text-center flex items-center justify-center" aria-label="Speffo home">
                <Image
                  src="/logo.png"
                  alt="Speffo"
                  width={100}
                  height={36}
                  className="h-8 w-auto object-contain"
                  priority
                />
              </Link>

              {/* Right: Actions */}
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search"
                  className="lg:hidden"
                >
                  <Search className="h-5 w-5" strokeWidth={1.6} />
                </Button>
                <Link
                  href="/account/wishlist"
                  className="hidden lg:flex h-10 w-10 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-black/[0.04] hover:text-foreground"
                  aria-label="Wishlist"
                >
                  <Heart className="h-5 w-5" strokeWidth={1.6} />
                  {wishlistCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-clay px-1 text-[10px] font-semibold text-sand">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/account"
                  className="hidden lg:flex h-10 w-10 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-black/[0.04] hover:text-foreground"
                  aria-label="Account"
                >
                  <User className="h-5 w-5" strokeWidth={1.6} />
                </Link>
                <Link
                  href="/cart"
                  className="relative flex h-10 w-10 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-black/[0.04] hover:text-foreground"
                  aria-label="Cart"
                >
                  <ShoppingBag className="h-5 w-5" strokeWidth={1.6} />
                  {mounted && cartCount > 0 && (
                    <motion.span
                      className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-clay px-1 text-[10px] font-semibold text-sand"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-7 bg-background/97 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navigation.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  href={item.href}
                  className="cursor-pointer font-serif text-3xl font-medium text-foreground transition-colors hover:text-clay"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 flex items-center gap-6 text-sm text-muted-foreground"
            >
              <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="cursor-pointer hover:text-foreground">
                Account
              </Link>
              <Link href="/account/wishlist" onClick={() => setMobileMenuOpen(false)} className="cursor-pointer hover:text-foreground">
                Wishlist
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-[97px] lg:h-[105px]" />
    </>
  );
}