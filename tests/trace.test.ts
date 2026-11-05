import { describe, expect, it } from 'vitest';
import { runTrace } from '../src/core/run';
import { instrument } from '../src/core/instrument';
import { serialize, show } from '../src/core/serialize';

const twoSum = `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`;

describe('runTrace', () => {
  it('returns the correct result and records steps', () => {
    const r = runTrace({ code: twoSum, args: '[[2,7,11,15], 9]' });
    expect(r.error).toBeUndefined();
    expect(show(r.result!)).toBe('[0, 1]');
    expect(r.steps.length).toBeGreaterThan(3);
    expect(r.steps[0].line).toBe(2);
  });

  it('captures variables before each statement', () => {
    const r = runTrace({ code: twoSum, args: '[[2,7,11,15], 9]' });
    const last = r.steps[r.steps.length - 1];
    expect(last.line).toBe(5);
    expect(last.vars.i).toBe(1);
    expect(show(last.vars.seen)).toBe('Map{2 → 0}');
  });

  it('instruments unbraced if/for/while bodies without changing behaviour', () => {
    const code = `function f(n) {
  let s = 0;
  for (let i = 0; i < n; i++) if (i % 2) s += i; else s -= 1;
  let k = 0;
  while (k < 3) k++;
  return s + k;
}`;
    const r = runTrace({ code, args: '[5]' });
    expect(r.error).toBeUndefined();
    expect(r.result).toBe(4 - 3 + 3); // i=1,3 add 4; i=0,2,4 subtract 3; k=3
    expect(r.steps.length).toBeGreaterThan(8);
  });

  it('supports closures, destructuring, switch and try/catch', () => {
    const code = `function f(arr) {
  const [a, ...rest] = arr;
  const add = (x) => { const y = x + a; return y; };
  let out = 0;
  switch (rest.length) { case 2: out = add(1); break; default: out = -1; }
  try { null.x; } catch (e) { out += 10; }
  return out;
}`;
    const r = runTrace({ code, args: '[[5,6,7]]' });
    expect(r.error).toBeUndefined();
    expect(r.result).toBe(16);
  });

  it('reports syntax errors with a line', () => {
    const r = runTrace({ code: 'function f( {', args: '[]' });
    expect(r.error?.line).toBe(1);
    expect(r.steps).toHaveLength(0);
  });

  it('reports runtime errors with the line reached', () => {
    const r = runTrace({ code: 'function f(a) {\n  const x = a.b.c;\n  return x;\n}', args: '[{}]' });
    expect(r.error?.line).toBe(2);
    expect(r.error?.message).toMatch(/undefined|Cannot read/);
  });

  it('stops runaway loops at the op limit', () => {
    const r = runTrace({ code: 'function f() { let i = 0; while (true) { i++; } }', args: '[]', maxOps: 500 });
    expect(r.error?.message).toMatch(/infinite loop/);
  });

  it('caps recorded steps but keeps counting ops', () => {
    const r = runTrace({
      code: 'function f(n) { let s = 0; for (let i = 0; i < n; i++) { s += i; } return s; }',
      args: '[1000]',
      maxRecorded: 50,
    });
    expect(r.truncated).toBe(true);
    expect(r.steps).toHaveLength(50);
    expect(r.ops).toBeGreaterThan(1000);
    expect(r.result).toBe(499500);
  });

  it('rejects invalid input and missing functions', () => {
    expect(runTrace({ code: twoSum, args: '{oops' }).error?.message).toMatch(/JSON array/);
    expect(runTrace({ code: twoSum, args: '5' }).error?.message).toMatch(/JSON array/);
    expect(runTrace({ code: 'const a = 1;', args: '[]' }).error?.message).toMatch(/No function/);
    expect(runTrace({ code: twoSum, args: '[]', entry: 'nope' }).error?.message).toMatch(/not found/);
    expect(runTrace({ code: twoSum, args: '[]', entry: 'a;b' }).error?.message).toMatch(/not a valid/);
  });

  it('does not expose network globals to user code', () => {
    const r = runTrace({ code: 'function f() { return typeof fetch; }', args: '[]' });
    expect(r.result).toBe('undefined');
  });
});

describe('instrument', () => {
  it('detects the last top-level function as entry', () => {
    expect(instrument('function a(){}\nfunction b(){}').entry).toBe('b');
    expect(instrument('const x = 1;').entry).toBeUndefined();
  });
});

describe('serialize', () => {
  it('handles cycles, depth, big collections and special numbers', () => {
    const a: Record<string, unknown> = { n: 1 };
    a.self = a;
    expect(show(serialize(a))).toBe('{n: 1, self: ↻}');
    expect(show(serialize(NaN))).toBe('NaN');
    const big = serialize(Array.from({ length: 100 }, (_, i) => i));
    expect(big).toMatchObject({ t: 'arr', more: 36 });
    expect(show(serialize(new Set([1, 2])))).toBe('Set{1, 2}');
    expect(show(serialize(undefined))).toBe('undefined');
  });
});
