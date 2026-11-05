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
