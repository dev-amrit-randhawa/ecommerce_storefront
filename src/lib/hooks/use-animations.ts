'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, {
      threshold: 0.1,
      rootMargin: '-50px',
      ...options,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return [ref, isInView] as const;
}

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollTop / docHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}

export function useParallax(speed = 0.5) {
  const ref = useRef<HTMLElement>(null);
  const [transform, setTransform] = useState('translateY(0)');

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      if (rect.bottom >= 0 && rect.top <= viewportHeight) {
        const scrolled = (viewportHeight - rect.top) * speed;
        setTransform(`translateY(${scrolled}px)`);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return [ref, transform] as const;
}

export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return position;
}

export function useReducedMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reduceMotion;
}

export function useStaggeredAnimation(itemCount: number, baseDelay = 0.05) {
  const delays = Array.from({ length: itemCount }, (_, i) => i * baseDelay);
  return delays;
}

export function useSpringConfig(stiffness = 400, damping = 25) {
  return { type: 'spring' as const, stiffness, damping };
}

export function useHover() {
  const [isHovering, setIsHovering] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleEnter = () => setIsHovering(true);
    const handleLeave = () => setIsHovering(false);

    element.addEventListener('mouseenter', handleEnter);
    element.addEventListener('mouseleave', handleLeave);
    return () => {
      element.removeEventListener('mouseenter', handleEnter);
      element.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return [ref, isHovering] as const;
}

export function useTap() {
  const [isPressed, setIsPressed] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleDown = () => setIsPressed(true);
    const handleUp = () => setIsPressed(false);

    element.addEventListener('mousedown', handleDown);
    element.addEventListener('mouseup', handleUp);
    element.addEventListener('mouseleave', handleUp);
    element.addEventListener('touchstart', handleDown);
    element.addEventListener('touchend', handleUp);
    return () => {
      element.removeEventListener('mousedown', handleDown);
      element.removeEventListener('mouseup', handleUp);
      element.removeEventListener('mouseleave', handleUp);
      element.removeEventListener('touchstart', handleDown);
      element.removeEventListener('touchend', handleUp);
    };
  }, []);

  return [ref, isPressed] as const;
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, [query, matches]);

  return matches;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}

export function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function useEventCallback<Args extends unknown[], Return>(
  callback: (...args: Args) => Return
) {
  const ref = useRef(callback);
  ref.current = callback;

  return useCallback((...args: Args) => ref.current(...args), []);
}

export function useAnimationFrame() {
  const [time, setTime] = useState(0);
  const requestRef = useRef<number>();

  useEffect(() => {
    const animate = (timestamp: number) => {
      setTime(timestamp);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return time;
}