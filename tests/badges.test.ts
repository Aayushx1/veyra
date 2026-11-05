import { describe, expect, it } from 'vitest';
import { complexityTone } from '../src/components/Badges';

describe('complexityTone', () => {
  it('colours growth classes sensibly', () => {
    for (const c of ['O(1)', 'O(n)', 'O(log n)', 'O(V + E)', 'O(R·C)', 'O(E · α(V))', 'O(m + n)']) {
      expect(complexityTone(c), c).toBe('good');
    }
    for (const c of ['O(n log n)', 'O(E log V)', 'O(n·m)', 'O(n·k)']) {
      expect(complexityTone(c), c).toBe('mid');
    }
    for (const c of ['O(n²)', 'O(2ⁿ)', 'O(n^2)', 'O(n³)']) {
      expect(complexityTone(c), c).toBe('bad');
    }
  });
});
