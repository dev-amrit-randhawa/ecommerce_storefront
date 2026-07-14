'use client';

import { motion } from 'framer-motion';
import { Truck, RotateCcw, ShieldCheck, Leaf, Sparkles, Zap, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Truck,
    label: 'Free Shipping',
    description: 'On orders over ₹1,000',
    color: 'text-forest',
    bgColor: 'bg-forest/10',
  },
  {
    icon: RotateCcw,
    label: 'Easy Returns',
    description: '7-day no-fuss exchanges',
    color: 'text-clay',
    bgColor: 'bg-clay/10',
  },
  {
    icon: ShieldCheck,
    label: 'Secure Checkout',
    description: 'Razorpay protected payments',
    color: 'text-forest-deep',
    bgColor: 'bg-forest-deep/10',
  },
  {
    icon: Leaf,
    label: 'Sustainable',
    description: 'Eco-friendly materials',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-100',
  },
  {
    icon: Sparkles,
    label: 'Lifetime Repair',
    description: 'We fix what we make',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
  },
  {
    icon: Zap,
    label: 'Carbon Neutral',
    description: 'Offsetting every shipment',
    color: 'text-sky-700',
    bgColor: 'bg-sky-100',
  },
];

export function ValueStrip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className="border-y border-border/50 bg-background/50 backdrop-blur-sm"
    >
      <div className="container px-4 py-4 sm:py-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="flex items-center gap-3 p-3 sm:p-4"
            >
              <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', feature.bgColor, feature.color)}>
                <feature.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{feature.label}</p>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}