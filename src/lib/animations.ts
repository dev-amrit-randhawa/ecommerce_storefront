export const easings = {
  easeOutExpo: [0.19, 1, 0.22, 1],
  easeInExpo: [0.95, 0.05, 0.795, 0.035],
  easeOutQuart: [0.25, 0.46, 0.45, 0.94],
  easeInOutQuart: [0.77, 0, 0.175, 1],
  easeOutCirc: [0.075, 0.82, 0.165, 1],
  easeInOutCirc: [0.785, 0.135, 0.15, 0.86],
  easeOutBack: [0.175, 0.885, 0.32, 1.275],
  easeInBack: [0.6, -0.28, 0.735, 0.045],
  spring: { type: 'spring', stiffness: 400, damping: 25 },
  springSoft: { type: 'spring', stiffness: 300, damping: 30 },
  springBouncy: { type: 'spring', stiffness: 500, damping: 20 },
} as const;

export const durations = {
  instant: 0,
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 0.7,
  slowest: 1,
} as const;

export const transitions = {
  default: { duration: durations.normal, ease: easings.easeOutQuart },
  fast: { duration: durations.fast, ease: easings.easeOutQuart },
  slow: { duration: durations.slow, ease: easings.easeOutQuart },
  spring: easings.spring,
  springSoft: easings.springSoft,
  springBouncy: easings.springBouncy,
  page: { duration: durations.slow, ease: easings.easeOutExpo },
  modal: { duration: durations.fast, ease: easings.easeOutCirc },
  tooltip: { duration: durations.fast, ease: easings.easeOutBack },
  stagger: (index: number, baseDelay = 0.05) => ({
    delay: index * baseDelay,
    duration: durations.normal,
    ease: easings.easeOutQuart,
  }),
} as const;

export const variants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: transitions.default,
  },
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: transitions.default,
  },
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: transitions.default,
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 10 },
    transition: transitions.default,
  },
  fadeInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
    transition: transitions.default,
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: transitions.spring,
  },
  slideUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: transitions.page,
  },
  slideDown: {
    initial: { opacity: 0, y: -40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: transitions.page,
  },
  slideLeft: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: transitions.page,
  },
  slideRight: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: transitions.page,
  },
  reveal: {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: easings.easeOutExpo },
    },
  },
  textReveal: {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: easings.easeOutExpo },
    },
  },
  lineReveal: {
    hidden: { width: 0 },
    visible: {
      width: '100%',
      transition: { duration: 0.8, ease: easings.easeOutExpo },
    },
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.1 },
    },
  },
  staggerItem: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  },
  hoverLift: {
    y: -8,
    scale: 1.02,
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    transition: transitions.springSoft,
  },
  hoverScale: {
    scale: 1.05,
    transition: transitions.fast,
  },
  tapScale: {
    scale: 0.97,
    transition: { duration: 0.1 },
  },
  focusRing: {
    boxShadow: '0 0 0 3px hsl(var(--ring) / 0.5)',
    transition: transitions.fast,
  },
  shimmer: {
    backgroundPosition: ['-200% 0', '200% 0'],
    transition: { duration: 2, ease: 'linear', repeat: Infinity },
  },
  pulse: {
    opacity: [0.4, 1, 0.4],
    transition: { duration: 2, ease: 'easeInOut', repeat: Infinity },
  },
  float: {
    y: [0, -20, 0],
    transition: { duration: 6, ease: 'easeInOut', repeat: Infinity },
  },
  rotate: {
    rotate: [0, 360],
    transition: { duration: 20, ease: 'linear', repeat: Infinity },
  },
} as const;

export function createStaggerVariants(
  baseVariants: typeof variants.fadeInUp,
  staggerDelay = 0.05
) {
  return {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: 0.1,
        },
      },
    },
    item: baseVariants,
  };
}

export function createScrollVariants(offset = 100) {
  return {
    hidden: { opacity: 0, y: offset },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: easings.easeOutExpo },
    },
  };
}