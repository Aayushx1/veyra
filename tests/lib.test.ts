import { describe, expect, it } from 'vitest';
import { PROBLEMS } from '../src/problems';
import { SCALES } from '../src/problems/scale';
import { runTrace } from '../src/core/run';
import { show } from '../src/core/serialize';
import { decodeShare, encodeShare } from '../src/lib/share';
import { DAY, isDue, newCard, review } from '../src/lib/srs';
import { toAnkiTsv } from '../src/lib/anki';
import { changedCells, changedVars, isArr, pointersFor } from '../src/lib/view';

describe('problem library', () => {
  it('has unique ids', () => {
    expect(new Set(PROBLEMS.map((p) => p.id)).size).toBe(PROBLEMS.length);
  });
  for (const p of PROBLEMS) {
    p.solutions.forEach((s) => {
      it(`${p.id} / ${s.label} produces expected results`, () => {
        for (const c of [{ input: p.input, expected: p.expected }, ...p.cases]) {
          const r = runTrace({ code: s.code, args: c.input });
          expect(r.error, c.input).toBeUndefined();
          expect(show(r.result!), c.input).toBe(c.expected);
        }
      });
    });
    it(`${p.id}: optimized solution does fewer statements than brute force at scale`, () => {
      const sc = SCALES[p.id];
      expect(sc, 'missing scale generator').toBeDefined();
      const n = sc.sizes[sc.sizes.length - 1];
      const [slow, fast] = p.solutions.map((s) => runTrace({ code: s.code, args: sc.make(n) }));
      expect(slow.error).toBeUndefined();
      expect(fast.error).toBeUndefined();
      expect(fast.ops).toBeLessThan(slow.ops);
    });
  }
});

describe('share links', () => {
  it('round-trips unicode and rejects garbage', () => {
    const s = { code: 'function f(){ return "héllo ✓"; }', input: '[1]' };
    expect(decodeShare(encodeShare(s))).toEqual(s);
    expect(decodeShare('%%%')).toBeNull();
    expect(decodeShare(encodeShare({ code: 'x'.repeat(30000), input: '[]' }))).toBeNull();
  });
});

describe('spaced repetition (SM-2)', () => {
  const t0 = 1_000_000;
  it('grows intervals on success and resets on failure', () => {
    let c = newCard(t0);
    expect(isDue(c, t0)).toBe(true);
    c = review(c, 4, t0);
    expect(c.interval).toBe(1);
    c = review(c, 4, t0);
    expect(c.interval).toBe(6);
    c = review(c, 5, t0);
    expect(c.interval).toBeGreaterThan(6);
    expect(c.due).toBe(t0 + c.interval * DAY);
    c = review(c, 0, t0);
    expect(c).toMatchObject({ reps: 0, interval: 1 });
  });
  it('never lets ease drop below 1.3', () => {
    let c = newCard(0);
    for (let i = 0; i < 30; i++) c = review(c, 3, 0);
    expect(c.ease).toBeGreaterThanOrEqual(1.3);
  });
});

describe('anki export', () => {
  it('emits two three-column cards per problem and escapes html', () => {
    const tsv = toAnkiTsv(PROBLEMS.slice(0, 2));
    const rows = tsv.trim().split('\n').slice(3);
    expect(rows).toHaveLength(4);
    rows.forEach((r) => expect(r.split('\t')).toHaveLength(3));
    expect(tsv).toContain('&lt;');
  });
});

describe('view helpers', () => {
  it('diffs variables and cells, and infers pointers', () => {
    const r = runTrace({
      code: 'function f(a){ let lo = 0; let hi = a.length - 1; a[0] = 9; return lo + hi; }',
      args: '[[1,2,3]]',
    });
    const last = r.steps[r.steps.length - 1];
    const prev = r.steps[r.steps.length - 2];
    expect([...changedVars(prev, last)]).toContain('a');
    const a = last.vars.a;
    expect(isArr(a)).toBe(true);
    if (isArr(a)) {
      expect([...changedCells(prev.vars.a, a)]).toEqual([0]);
      expect(pointersFor(a, last.vars, 'a')).toEqual({ 0: ['lo'], 2: ['hi'] });
    }
  });
});
