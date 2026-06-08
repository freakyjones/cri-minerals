import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768; // md breakpoint in Tailwind

export function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches;
    }
    return false;
  });

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    
    // Update state on change
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    // Modern browsers use addEventListener
    if (mql.addEventListener) {
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    } 
    // Fallback for older Safari
    else if (mql.addListener) {
      mql.addListener(onChange);
      return () => mql.removeListener(onChange);
    }
  }, [breakpoint]);

  return isMobile;
}
