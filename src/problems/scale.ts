/** Worst-case-ish input generators, used by compare mode to chart statement counts vs size. */
import type { Scale } from './types';

const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);
const DEFAULT_SIZES = [4, 8, 16, 32, 64];

export const SCALES: Record<string, Scale> = {
  'pair-sum': { sizes: DEFAULT_SIZES, make: (n) => JSON.stringify([range(n), 4 * n]) },
  'sorted-pair': { sizes: DEFAULT_SIZES, make: (n) => JSON.stringify([range(n), 4 * n]) },
  'max-window': {
    sizes: DEFAULT_SIZES,
    make: (n) => JSON.stringify([range(n), Math.max(1, Math.floor(n / 2))]),
  },
  'has-duplicate': { sizes: DEFAULT_SIZES, make: (n) => JSON.stringify([range(n)]) },
  'valid-brackets': {
    sizes: [2, 4, 8, 16, 32],
    make: (n) => JSON.stringify(['('.repeat(n) + ')'.repeat(n)]),
  },
  'search-sorted': {
    sizes: [4, 16, 64, 256, 1024],
    make: (n) => JSON.stringify([range(n), n + 1]),
  },
  'max-subarray': {
    sizes: DEFAULT_SIZES,
    make: (n) => JSON.stringify([range(n).map((x) => (x % 2 ? -1 : 2))]),
  },
  'fib-memo': { sizes: [4, 8, 12, 16, 20], make: (n) => JSON.stringify([n]) },
};
