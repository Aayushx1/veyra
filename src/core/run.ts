import { instrument, InstrumentError } from './instrument';
import { serialize } from './serialize';
import { DEFAULT_MAX_OPS, DEFAULT_MAX_RECORDED, type Step, type TraceRequest, type TraceResult } from './types';

class LimitError extends Error {}

/** Names shadowed inside user code. This is hardening, not a security boundary: the worker is. */
const SHADOWED = ['fetch', 'XMLHttpRequest', 'WebSocket', 'importScripts', 'EventSource', 'indexedDB', 'localStorage'];

/** Parse the JSON args text. Throws a readable error. */
export function parseArgs(text: string): unknown[] {
  let v: unknown;
  try {
    v = JSON.parse(text);
  } catch (e) {
    throw new Error(`Input must be a JSON array of arguments, e.g. [[1,2,3], 4]. (${(e as Error).message})`);
  }
  if (!Array.isArray(v)) throw new Error('Input must be a JSON array of arguments, e.g. [[1,2,3], 4].');
  return v;
}

/**
 * Instrument and execute `req.code`, recording a snapshot before each statement.
 * Synchronous and dependency free, so it runs identically in a Web Worker and in tests.
 */
export function runTrace(req: TraceRequest): TraceResult {
  const started = performance.now();
  const maxRecorded = req.maxRecorded ?? DEFAULT_MAX_RECORDED;
  const maxOps = req.maxOps ?? DEFAULT_MAX_OPS;
  const steps: Step[] = [];
  let ops = 0;
  let lastLine = 0;
  let truncated = false;

  const finish = (extra: Partial<TraceResult>): TraceResult => ({
    steps,
    ops,
    truncated,
    durationMs: performance.now() - started,
    ...extra,
  });

  let inst;
  let args: unknown[];
  try {
    inst = instrument(req.code);
    args = parseArgs(req.args);
  } catch (e) {
    const line = e instanceof InstrumentError ? e.line : undefined;
    return finish({ error: { message: (e as Error).message, line } });
  }
  const entry = req.entry?.trim() || inst.entry;
  if (!entry) return finish({ error: { message: 'No function found. Declare one, e.g. function solve(nums) { … }' } });
  if (!/^[A-Za-z_$][\w$]*$/.test(entry)) return finish({ error: { message: `"${entry}" is not a valid function name.` } });

  const snap = (line: number, read: () => Record<string, unknown>) => {
    lastLine = line;
    ops++;
    if (ops > maxOps) throw new LimitError(`Stopped after ${maxOps.toLocaleString()} statements (possible infinite loop).`);
    if (steps.length >= maxRecorded) {
      truncated = true;
      return;
    }
    const raw = read();
    const vars: Step['vars'] = {};
    for (const k of Object.keys(raw)) vars[k] = serialize(raw[k]);
    steps.push({ line, vars, ops });
  };

  try {
    const factory = new Function('__s', ...SHADOWED, `"use strict";\n${inst.code}\n;return typeof ${entry} === 'function' ? ${entry} : undefined;`);
    const fn = factory(snap, ...SHADOWED.map(() => undefined)) as ((...a: unknown[]) => unknown) | undefined;
    if (!fn) return finish({ error: { message: `Function "${entry}" was not found in your code.` } });
    const result = fn(...args);
    return finish({ result: serialize(result) });
  } catch (e) {
    const err = e as Error;
    return finish({ error: { message: err.message || String(e), line: lastLine || undefined } });
  }
}
