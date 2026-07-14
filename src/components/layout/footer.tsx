'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { ArrowRight, Mail, ChevronRight, Sparkles, Leaf, Zap, Heart, Award } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api/client';
import { cn } from '@/lib/utils';

const footerLinks = {
  Shop: [
    { name: 'New Arrivals', href: '/search?sort=newest' },
    { name: 'All Collections', href: '/categories' },
    { name: 'Bestsellers', href: '/search?featured=true' },
    { name: 'Sale', href: '/search?sale=true' },
    { name: 'Brands', href: '/brands' },
    { name: 'Gift Cards', href: '/gift-cards' },
  ],
  Account: [
    { name: 'My Account', href: '/account' },
    { name: 'Orders', href: '/account/orders' },
    { name: 'Wishlist', href: '/account/wishlist' },
    { name: 'Addresses', href: '/account/addresses' },
    { name: 'Returns', href: '/account/returns' },
    { name: 'Settings', href: '/account/settings' },
  ],
  Help: [
    { name: 'FAQ', href: '/faq' },
    { name: 'Shipping', href: '/shipping-policy' },
    { name: 'Returns & Exchanges', href: '/return-policy' },
    { name: 'Track Order', href: '/track-order' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Size Guide', href: '/size-guide' },
  ],
  Company: [
    { name: 'Our Story', href: '/about' },
    { name: 'Sustainability', href: '/sustainability' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Wholesale', href: '/wholesale' },
    { name: 'Affiliates', href: '/affiliates' },
  ],
};

const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/wespeffo', path: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z' },
  { label: 'Twitter', href: 'https://twitter.com/wespeffo', path: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z' },
  { label: 'Facebook', href: 'https://www.facebook.com/wespeffo', path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
  { label: 'Pinterest', href: 'https://www.pinterest.com/wespeffo', path: 'M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z' },
  { label: 'YouTube', href: 'https://www.youtube.com/@wespeffo', path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 7.685 0 12 0 12s0 4.315.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 16.315 24 12 24 12s0-4.315-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
];

const trustBadges = [
  { icon: Leaf, label: 'Sustainable Materials', description: 'Organic, recycled, responsible' },
  { icon: Zap, label: 'Carbon Neutral', description: 'Offsetting every shipment' },
  { icon: Heart, label: 'Lifetime Repair', description: 'We fix what we make' },
  { icon: Award, label: 'Fair Trade', description: 'Ethical partnerships worldwide' },
];

const paymentMethods = [
  { name: 'Visa', icon: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/in.svg' },
  { name: 'Mastercard', icon: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/in.svg' },
  { name: 'Razorpay', icon: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/in.svg' },
  { name: 'UPI', icon: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/in.svg' },
  { name: 'Net Banking', icon: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/in.svg' },
];

export function Footer() {
  const ref = useRef<HTMLFooterElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await api.post('/newsletter/subscribe', { email: email.trim() });
      setSubscribed(true);
      setEmail('');
    } catch {
      // Silently handle error
    }
  };

  return (
    <footer
      ref={ref}
      className="relative bg-forest-deep text-sand"
      aria-label="Footer"
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-clay/50 to-transparent" />

      {/* Noise overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      <div className="container relative z-10 px-4 py-16 sm:py-24">
        {/* Main grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 gap-10 sm:gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.5fr]"
        >
          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-xs lg:pr-8"
          >
            <Link href="/" className="cursor-pointer inline-block mb-6">
              <Image
                src="/logo.png"
                alt="Speffo"
                width={120}
                height={44}
                className="h-10 w-auto object-contain brightness-0 invert"
                priority
              />
            </Link>
            <p className="text-sm leading-relaxed text-sand/70 mb-6">
              Considered, durable goods designed for detours. Made responsibly, built to be lived in — since &rsquo;96.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {trustBadges.map((badge) => (
                <div key={badge.label} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sand/5 border border-sand/10">
                  <badge.icon className="h-4 w-4 text-clay" strokeWidth={1.5} />
                  <span className="text-[11px] font-medium text-sand">{badge.label}</span>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + socials.indexOf(social) * 0.05 }}
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-sand/20 bg-sand/5 text-sand/80 transition-all duration-300 hover:border-sand/40 hover:bg-sand/10 hover:text-sand"
                  aria-label={social.label}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={social.path} />
                  </svg>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + categoryIndex * 0.05 }}
            >
              <h3 className="eyebrow mb-4 text-sand/60">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="link-underline cursor-pointer text-sm text-sand/80 transition-colors hover:text-sand group"
                    >
                      {link.name}
                      <ChevronRight className="inline-block h-3.5 w-3.5 transform transition-transform group-hover:translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Newsletter column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="lg:pl-8 border-l border-sand/10 pl-8"
          >
            <h3 className="eyebrow mb-3 text-sand/60">Newsletter</h3>
            <p className="text-sm text-sand/70 mb-5">
              Join 50,000+ wanderers for stories, early access, and ₹500 off your first order.
            </p>

            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-sand/5 border border-sand/10"
              >
                <Sparkles className="h-5 w-5 text-clay flex-shrink-0" strokeWidth={1.5} />
                <p className="text-sm text-sand">Thanks for subscribing! Check your inbox. ✦</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-sand/40" strokeWidth={1.5} />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="pl-12 rounded-lg border border-sand/20 bg-sand/5 px-4 py-3 text-sm text-sand placeholder:text-sand/40 focus:border-sand/50 focus:bg-sand/10"
                    aria-label="Email address"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  variant="default"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Subscribe
                </Button>
                <p className="text-[10px] text-sand/50 text-center">
                  By subscribing, you agree to our{' '}
                  <Link href="/privacy-policy" className="underline hover:text-sand">Privacy Policy</Link>
                </p>
              </form>
            )}

            {/* Payment methods */}
            <div className="mt-8 pt-8 border-t border-sand/10">
              <p className="text-[11px] uppercase tracking-[0.1em] text-sand/50 mb-3">Secure payments with</p>
              <div className="flex flex-wrap gap-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className="flex h-6 min-w-[50px] items-center justify-center rounded bg-sand/5 text-[10px] font-semibold uppercase tracking-[0.1em] text-sand/60 px-2"
                  >
                    {method.name}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-sand/10 pt-8 sm:flex-row"
        >
          <p className="text-xs text-sand/60">
            &copy; {new Date().getFullYear()} Speffo. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-xs text-sand/50">
            <Link href="/privacy-policy" className="hover:text-sand transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-sand transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-sand transition-colors">Cookies</Link>
            <Link href="/accessibility" className="hover:text-sand transition-colors">Accessibility</Link>
          </div>

          <p className="text-xs uppercase tracking-[0.18em] text-sand/50 font-medium">
            Designed for Detours
          </p>
        </motion.div>
      </div>
    </footer>
  );
}