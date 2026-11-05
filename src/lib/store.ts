import type { Problem } from '../problems/types';
import type { Deck } from './srs';

/** Everything Veyra persists lives under these keys, in this browser only. */
export const KEYS = {
  done: 'veyra:done',
  mine: 'veyra:mine',
  srs: 'veyra:srs',
  session: 'veyra:session',
  ai: 'veyra:ai',
} as const;

type Store = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
const ls = (): Store => localStorage;

export function readJSON<T>(key: string, fallback: T, store: Store = ls()): T {
  try {
    const raw = store.getItem(key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown, store: Store = ls()): boolean {
  try {
    store.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false; // storage full or blocked: progress just will not persist
  }
}

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/** Problems marked done: id -> completion timestamp. */
export const loadDone = (s?: Store): Record<string, number> => {
  const v = readJSON<unknown>(KEYS.done, {}, s);
  return isRecord(v)
    ? (Object.fromEntries(Object.entries(v).filter(([, t]) => typeof t === 'number')) as Record<
        string,
        number
      >)
    : {};
};
export const saveDone = (d: Record<string, number>, s?: Store) => writeJSON(KEYS.done, d, s);

export const loadMine = (s?: Store): Record<string, Problem> => {
  const v = readJSON<unknown>(KEYS.mine, {}, s);
  return isRecord(v) ? (v as Record<string, Problem>) : {};
};
export const saveMine = (m: Record<string, Problem>, s?: Store) => writeJSON(KEYS.mine, m, s);

export interface Session {
  visits: number;
  last?: { hash: string; label: string; at: number };
}
export const loadSession = (s?: Store): Session => {
  const v = readJSON<unknown>(KEYS.session, null, s);
  return isRecord(v) && typeof v.visits === 'number' ? (v as unknown as Session) : { visits: 0 };
};
export const saveSession = (x: Session, s?: Store) => writeJSON(KEYS.session, x, s);

/* ---------- backup ---------- */

export interface Backup {
  app: 'veyra';
  version: 1;
  exportedAt: string;
  done: Record<string, number>;
  srs: Deck;
  mine: Record<string, Problem>;
}

/** API keys are deliberately never part of a backup. */
export function exportBackup(s?: Store, now = new Date()): Backup {
  return {
    app: 'veyra',
    version: 1,
    exportedAt: now.toISOString(),
    done: loadDone(s),
    srs: readJSON<Deck>(KEYS.srs, {}, s),
    mine: loadMine(s),
  };
}

/** Validate and apply a backup. Throws a readable Error on anything unexpected. */
export function importBackup(
  text: string,
  s?: Store,
): { done: number; cards: number; mine: number } {
  let v: unknown;
  try {
    v = JSON.parse(text);
  } catch {
    throw new Error('That file is not valid JSON.');
  }
  if (!isRecord(v) || v.app !== 'veyra' || v.version !== 1) {
    throw new Error('That does not look like a Veyra backup.');
  }
  const done = isRecord(v.done) ? v.done : {};
  const srs = isRecord(v.srs) ? v.srs : {};
  const mine = isRecord(v.mine) ? v.mine : {};
  const cleanDone = Object.fromEntries(
    Object.entries(done).filter(([, t]) => typeof t === 'number'),
  );
  const cleanSrs = Object.fromEntries(
    Object.entries(srs).filter(
      ([, c]) =>
        isRecord(c) && ['ease', 'interval', 'reps', 'due'].every((k) => typeof c[k] === 'number'),
    ),
  );
  const cleanMine = Object.fromEntries(
    Object.entries(mine).filter(
      ([id, p]) =>
        isRecord(p) && p.id === id && Array.isArray(p.solutions) && p.solutions.length === 2,
    ),
  );
  saveDone({ ...loadDone(s), ...(cleanDone as Record<string, number>) }, s);
  writeJSON(KEYS.srs, { ...readJSON<Deck>(KEYS.srs, {}, s), ...cleanSrs }, s);
  saveMine({ ...loadMine(s), ...(cleanMine as unknown as Record<string, Problem>) }, s);
  return {
    done: Object.keys(cleanDone).length,
    cards: Object.keys(cleanSrs).length,
    mine: Object.keys(cleanMine).length,
  };
}

export function eraseAll(s: Store = ls()): void {
  for (const k of Object.values(KEYS)) s.removeItem(k);
}
