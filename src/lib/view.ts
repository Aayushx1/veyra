import type { Step, V } from '../core/types';
import { show } from '../core/serialize';

export type ArrV = Extract<V, { t: 'arr' }>;
export const isArr = (v: V | undefined): v is ArrV =>
  typeof v === 'object' && v !== null && v.t === 'arr';

/** Names whose value changed between two steps (or are new). */
export function changedVars(prev: Step | undefined, cur: Step): Set<string> {
  const out = new Set<string>();
  for (const k of Object.keys(cur.vars)) {
    if (!prev || !(k in prev.vars) || show(prev.vars[k]) !== show(cur.vars[k])) out.add(k);
  }
  return out;
}

/** Indices of an array that changed since the previous step. */
export function changedCells(prev: V | undefined, cur: ArrV): Set<number> {
  const out = new Set<number>();
  const before = isArr(prev) ? prev.items : undefined;
  cur.items.forEach((x, i) => {
    if (!before || i >= before.length || show(before[i]) !== show(x)) out.add(i);
  });
  return out;
}

const POINTER_NAME =
  /^(i|j|k|l|r|lo|hi|mid|left|right|start|end|slow|fast|idx|index|p|q|head|tail|ptr|pos|cur)\d*$/i;

/**
 * Guess which scalar variables are pointers into an array: conventionally named integers that
 * are valid indices. Returns index -> variable names, drawn above the cells.
 */
export function pointersFor(
  arr: ArrV,
  vars: Record<string, V>,
  self: string,
): Record<number, string[]> {
  const out: Record<number, string[]> = {};
  const len = arr.items.length + arr.more;
  for (const [name, v] of Object.entries(vars)) {
    if (name === self || typeof v !== 'number' || !Number.isInteger(v)) continue;
    if (v < 0 || v >= len || !POINTER_NAME.test(name)) continue;
    (out[v] ??= []).push(name);
  }
  return out;
}

const PRESET_TONE: Record<string, number> = {
  i: 0,
  lo: 0,
  left: 0,
  l: 0,
  start: 0,
  slow: 0,
  p: 0,
  j: 1,
  hi: 1,
  right: 1,
  r: 1,
  end: 1,
  fast: 1,
  q: 1,
  k: 2,
  mid: 2,
};

/** Stable colour slot (0-5) for a variable name. Conventional pairs get clearly different hues. */
export function toneOf(name: string): number {
  const preset = PRESET_TONE[name.toLowerCase()];
  if (preset !== undefined) return preset;
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return 3 + (h % 3);
}

const PAIRS: [string, string][] = [
  ['lo', 'hi'],
  ['left', 'right'],
  ['l', 'r'],
  ['start', 'end'],
];

/** If a conventional low/high pointer pair is present, the inclusive index range between them. */
export function windowFor(pointers: Record<number, string[]>): [number, number] | null {
  const where = new Map<string, number>();
  for (const [idx, names] of Object.entries(pointers)) {
    for (const n of names) where.set(n.toLowerCase(), Number(idx));
  }
  for (const [a, b] of PAIRS) {
    const x = where.get(a);
    const y = where.get(b);
    if (x !== undefined && y !== undefined && x <= y) return [x, y];
  }
  return null;
}
