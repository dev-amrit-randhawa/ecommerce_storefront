'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TransitionContextValue {
  isTransitioning: boolean;
  startTransition: (pathname: string) => void;
}

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function usePageTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('usePageTransition must be used within a PageTransitionProvider');
  }
  return context;
}

interface PageTransitionProviderProps {
  children: ReactNode;
}

export function PageTransitionProvider({ children }: PageTransitionProviderProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  const startTransition = useCallback((pathname: string) => {
    setIsTransitioning(true);
    setPendingPath(pathname);
  }, []);

  useEffect(() => {
    if (isTransitioning && pendingPath) {
      const timer = setTimeout(() => {
        window.location.href = pendingPath;
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning, pendingPath]);

  return (
    <TransitionContext.Provider value={{ isTransitioning, startTransition }}>
      {children}
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-forest-deep flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.3, ease: [0.61, 1, 0.88, 1] }}
          >
            <div className="flex flex-col items-center gap-4 text-sand">
              <div className="relative w-16 h-16">
                <motion.div
                  className="absolute inset-0 border-2 border-clay/30 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-0 border-2 border-clay rounded-full"
                  style={{ clipPath: 'polygon(50% 0%, 100% 0%, 100% 50%, 50% 50%)' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              </div>
              <p className="text-sm uppercase tracking-[0.2em]">Loading...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}

export const pageTransitionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
};

export const staggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const slideUpVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
};

export const fadeScaleVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
};

export const slideFromRightVariants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
  transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
};

export const slideFromLeftVariants = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
  transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
};

export const revealVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const textRevealVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const lineRevealVariants = {
  hidden: { width: 0 },
  visible: {
    width: '100%',
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const hoverLift = {
  y: -4,
  scale: 1.02,
  transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
};

export const hoverScale = {
  scale: 1.05,
  transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] },
};

export const tapScale = {
  scale: 0.97,
  transition: { duration: 0.1 },
};

export const springConfig = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 25,
};

export const springSoft = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
};

export const springBouncy = {
  type: 'spring' as const,
  stiffness: 500,
  damping: 20,
};