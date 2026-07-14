'use client';

import { motion, useInView } from 'framer-motion';
import { ArrowRight, Sparkles, Mail, Check, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';

import { api } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function NewsletterSection() {
  const ref = useRef<HTMLSectionElement>(null>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setStatus('loading');
    setMessage('');
    
    try {
      await api.post('/newsletter/subscribe', { email: email.trim() });
      setStatus('success');
      setMessage('Thanks for joining! Check your inbox for a welcome gift. ✦');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-forest-deep"
      aria-label="Newsletter signup"
    >
      {/* Background image */}
      <Image
        src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2000&q=80"
        alt=""
        fill
        className="absolute inset-0 h-full w-full object-cover opacity-20"
        priority
      />
      <div className="absolute inset-0 bg-forest-deep/80" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-clay/20"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + i * 10}%`,
              width: 60 + i * 20,
              height: 60 + i * 20,
            }}
            animate={{
              x: [-30, 30, -30],
              y: [30, -30, 30],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{ duration: 10 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: i }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="container relative z-10 px-4 py-20 sm:py-28"
      >
        <div className="max-w-2xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-sand/10 px-4 py-2 mb-6"
          >
            <Sparkles className="h-4 w-4 text-clay" strokeWidth={1.5} />
            <span className="eyebrow text-sand/80">Join the Detour</span>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-serif text-3xl font-semibold leading-tight tracking-tight text-sand sm:text-4xl lg:text-5xl"
          >
            Stories, early access & a little inspiration.
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-4 max-w-md mx-auto leading-relaxed text-sand/80"
          >
            Sign up for new arrivals, members-only offers, and ₹500 off your first order.
          </motion.p>

          {/* Form or success state */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-8"
          >
            {status === 'success' ? (
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-clay/20 text-clay"
                >
                  <Check className="h-8 w-8" />
                </motion.div>
                <p className="text-sand">{message}</p>
                <Button
                  variant="glass"
                  className="border-sand/30 hover:border-sand/60"
                  onClick={() => setStatus('idle')}
                >
                  <X className="h-4 w-4 mr-2" />
                  Dismiss
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row max-w-md mx-auto">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50" strokeWidth={1.5} />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="pl-12 rounded-sm border border-sand/30 bg-sand/10 px-5 py-3.5 text-sm text-sand placeholder:text-sand/50 outline-none transition-colors focus:border-sand focus:bg-sand/15"
                    disabled={status === 'loading'}
                    aria-label="Email address"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  variant="default"
                  className="whitespace-nowrap px-8 py-3.5 text-[13px]"
                  disabled={status === 'loading'}
                  rightIcon={status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                >
                  {status === 'loading' ? 'Subscribing...' : 'Sign Up'}
                </Button>
                {status === 'error' && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-400 text-center sm:text-left"
                    role="alert"
                  >
                    {message}
                  </motion.p>
                )}
              </form>
            )}
          </motion.div>

          {/* Privacy note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-6 text-xs text-sand/50"
          >
            By subscribing, you agree to our{' '}
            <Link href="/privacy-policy" className="underline hover:text-sand">Privacy Policy</Link>
            . Unsubscribe anytime.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}