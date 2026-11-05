import { describe, expect, it } from 'vitest';
import { CATEGORIES, PROBLEMS, byId, byLcSlug } from '../src/problems';

describe('catalog integrity', () => {
  it('has unique ids and unique LeetCode slugs', () => {
    const ids = PROBLEMS.map((p) => p.id);
    expect(ids.filter((x, i) => ids.indexOf(x) !== i)).toEqual([]);
    const slugs = PROBLEMS.map((p) => p.lc).filter(Boolean) as string[];
    expect(slugs.filter((x, i) => slugs.indexOf(x) !== i)).toEqual([]);
  });

  it('only uses known categories and has at least one problem in each', () => {
    const known = new Set(CATEGORIES.map((c) => c.id));
    for (const p of PROBLEMS) expect(known.has(p.category), p.id).toBe(true);
    for (const c of CATEGORIES) {
      expect(
        PROBLEMS.some((p) => p.category === c.id),
        c.id,
      ).toBe(true);
    }
  });

  it('keeps LeetCode numbers unique and lookups consistent', () => {
    const nums = PROBLEMS.map((p) => p.n).filter((n): n is number => typeof n === 'number');
    expect(nums.filter((x, i) => nums.indexOf(x) !== i)).toEqual([]);
    for (const p of PROBLEMS) {
      expect(byId(p.id)).toBe(p);
      if (p.lc) expect(byLcSlug(p.lc)).toBe(p);
    }
  });

  it('is a substantial library', () => {
    expect(PROBLEMS.length).toBeGreaterThanOrEqual(150);
  });
});
