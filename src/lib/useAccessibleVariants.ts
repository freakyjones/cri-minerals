import { useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';

/**
 * Returns animation variants that respect the user's prefers-reduced-motion
 * system preference (Rule 4.4). When reduced motion is preferred, all
 * animations collapse to simple opacity fades.
 */
export function useAccessibleVariants(fullVariants: Variants, reducedVariants?: Variants): Variants {
  const shouldReduceMotion = useReducedMotion();

  if (!shouldReduceMotion) return fullVariants;

  // If explicit reduced variants are provided, use them.
  if (reducedVariants) return reducedVariants;

  // Default: collapse all transitions to simple opacity fades.
  const reduced: Variants = {};
  for (const key of Object.keys(fullVariants)) {
    const variant = fullVariants[key];
    if (typeof variant === 'object' && variant !== null && !Array.isArray(variant)) {
      const v = variant as Record<string, unknown>;
      reduced[key] = { opacity: v.opacity !== undefined ? v.opacity : 1 } as Variants[string];
    } else {
      reduced[key] = variant;
    }
  }
  return reduced;
}
