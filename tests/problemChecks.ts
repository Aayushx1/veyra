import { describe, expect, it } from 'vitest';
import { runTrace } from '../src/core/run';
import { show } from '../src/core/serialize';
import type { Problem } from '../src/problems/types';
import { SCALES } from '../src/problems/scale';

const DIFFS = ['Easy', 'Medium', 'Hard'];

/** Shared quality gate for a category's problems. Every problem must pass all of these. */
export function checkProblems(name: string, list: Problem[], category: string) {
  describe(`problems: ${name}`, () => {
    if (list.length === 0) it.skip('no problems yet', () => {});
    for (const p of list) {
      describe(p.id, () => {
        it('has valid metadata', () => {
          expect(p.category).toBe(category);
          expect(p.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
          expect(DIFFS).toContain(p.difficulty);
          expect(p.title.length).toBeGreaterThan(2);
          expect(p.summary.length).toBeGreaterThan(15);
          expect(p.hook.length).toBeGreaterThan(10);
          expect(p.pattern.length).toBeGreaterThan(2);
          if (p.lc) expect(p.lc).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
          expect(p.cases.length).toBeGreaterThanOrEqual(2);
          expect(() => JSON.parse(p.input)).not.toThrow();
          for (const s of p.solutions) {
            expect(s.code.length).toBeGreaterThan(20);
            expect(s.complexity).toMatch(/^O\(.+\)$/);
          }
        });

        p.solutions.forEach((s, idx) => {
          it(`solution ${idx} (${s.label}) matches every expected output`, () => {
            for (const c of [{ input: p.input, expected: p.expected }, ...p.cases]) {
              const r = runTrace({ code: s.code, args: c.input });
              expect(r.error, `${c.input} -> ${r.error?.message}`).toBeUndefined();
              expect(show(r.result!), c.input).toBe(c.expected);
              expect(r.truncated || r.ops < 200_000, 'demo input should be small').toBe(true);
            }
          });
        });

        const sc = p.scale ?? SCALES[p.id];
        if (sc) {
          it('optimized solution does less work than the simple one at scale', () => {
            const n = sc.sizes[sc.sizes.length - 1];
            const [slow, fast] = p.solutions.map((s) =>
              runTrace({ code: s.code, args: sc.make(n), maxRecorded: 1 }),
            );
            expect(slow.error?.message).toBeUndefined();
            expect(fast.error?.message).toBeUndefined();
            expect(fast.ops).toBeLessThan(slow.ops);
          });
        }
      });
    }
  });
}
