import type { V } from './types';

const MAX_DEPTH = 4;
const MAX_ITEMS = 64;
const MAX_STR = 200;

/** Convert any runtime value into a bounded, cycle-safe, JSON-friendly snapshot. */
export function serialize(v: unknown, depth = 0, path: object[] = []): V {
  switch (typeof v) {
    case 'number':
      return Number.isFinite(v) ? v : { t: 'special', s: String(v) };
    case 'string':
      return v.length > MAX_STR ? v.slice(0, MAX_STR) + '…' : v;
    case 'boolean':
      return v;
    case 'undefined':
      return { t: 'undef' };
    case 'bigint':
      return { t: 'special', s: `${v}n` };
    case 'symbol':
      return { t: 'special', s: String(v) };
    case 'function':
      return { t: 'special', s: `ƒ ${v.name || 'anonymous'}` };
  }
  if (v === null) return null;
  const o = v as object;
  if (path.includes(o)) return { t: 'ref' };
  if (depth >= MAX_DEPTH) return { t: 'deep' };
  const next = [...path, o];
  const sub = (x: unknown) => serialize(x, depth + 1, next);

  if (Array.isArray(o)) {
    return { t: 'arr', items: o.slice(0, MAX_ITEMS).map(sub), more: Math.max(0, o.length - MAX_ITEMS) };
  }
  if (o instanceof Set) {
    const all = [...o];
    return { t: 'set', items: all.slice(0, MAX_ITEMS).map(sub), more: Math.max(0, all.length - MAX_ITEMS) };
  }
  if (o instanceof Map) {
    const all = [...o.entries()];
    return {
      t: 'map',
      entries: all.slice(0, MAX_ITEMS).map(([k, val]) => [sub(k), sub(val)] as [V, V]),
      more: Math.max(0, all.length - MAX_ITEMS),
    };
  }
  const keys = Object.keys(o);
  return {
    t: 'obj',
    entries: keys.slice(0, MAX_ITEMS).map((k) => [k, sub((o as Record<string, unknown>)[k])] as [string, V]),
    more: Math.max(0, keys.length - MAX_ITEMS),
  };
}

/** Compact text form of a snapshot. Also usable as a cheap structural equality key. */
export function show(v: V): string {
  if (v === null) return 'null';
  if (typeof v !== 'object') return typeof v === 'string' ? JSON.stringify(v) : String(v);
  const more = (n: number) => (n ? `, …+${n}` : '');
  switch (v.t) {
    case 'undef':
      return 'undefined';
    case 'special':
      return v.s;
    case 'ref':
      return '↻';
    case 'deep':
      return '…';
    case 'arr':
      return `[${v.items.map(show).join(', ')}${more(v.more)}]`;
    case 'set':
      return `Set{${v.items.map(show).join(', ')}${more(v.more)}}`;
    case 'map':
      return `Map{${v.entries.map(([k, x]) => `${show(k)} → ${show(x)}`).join(', ')}${more(v.more)}}`;
    case 'obj':
      return `{${v.entries.map(([k, x]) => `${k}: ${show(x)}`).join(', ')}${more(v.more)}}`;
  }
}
