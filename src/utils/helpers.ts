/**
 * Check if code is running in a browser environment.
 * Helpful for safe Server-Side Rendering (Next.js, Remix, etc.)
 */
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
};

/**
 * Helper to wrap class names.
 */
export const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Helper to defer resolution.
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
