import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { PROBLEMS, byId, type Problem } from './problems';
import { loadDone, loadMine, saveDone, saveMine } from './lib/store';

interface AppState {
  done: Record<string, number>;
  mine: Record<string, Problem>;
  toggleDone: (id: string) => void;
  addMine: (p: Problem) => void;
  removeMine: (id: string) => void;
  /** Re-read storage, e.g. after importing a backup or erasing data. */
  reload: () => void;
  find: (id: string) => Problem | undefined;
  /** Library problems plus the user's generated ones. */
  all: Problem[];
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [done, setDone] = useState(loadDone);
  const [mine, setMine] = useState(loadMine);

  const toggleDone = useCallback((id: string) => {
    setDone((d) => {
      const next = { ...d };
      if (next[id]) delete next[id];
      else next[id] = Date.now();
      saveDone(next);
      return next;
    });
  }, []);

  const addMine = useCallback((p: Problem) => {
    setMine((m) => {
      const next = { ...m, [p.id]: p };
      saveMine(next);
      return next;
    });
  }, []);

  const removeMine = useCallback((id: string) => {
    setMine((m) => {
      const next = { ...m };
      delete next[id];
      saveMine(next);
      return next;
    });
  }, []);

  const reload = useCallback(() => {
    setDone(loadDone());
    setMine(loadMine());
  }, []);

  const value = useMemo<AppState>(
    () => ({
      done,
      mine,
      toggleDone,
      addMine,
      removeMine,
      reload,
      find: (id) => byId(id) ?? mine[id],
      all: [...PROBLEMS, ...Object.values(mine)],
    }),
    [done, mine, toggleDone, addMine, removeMine, reload],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used inside AppProvider');
  return v;
}
