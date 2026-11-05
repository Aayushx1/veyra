import { useCallback, useEffect, useRef, useState } from 'react';
import type { TraceResult } from './core/types';
import { PROBLEMS, byId } from './problems';
import { traceInWorker } from './lib/client';
import { decodeShare, encodeShare } from './lib/share';
import { changedVars } from './lib/view';
import { CodeEditor } from './components/CodeEditor';
import { Stepper } from './components/Stepper';
import { Value } from './components/Value';
import { Compare } from './components/Compare';
import { Review } from './components/Review';

type Tab = 'trace' | 'compare' | 'review';

const initial = () => {
  const m = /^#s=(.+)$/.exec(location.hash);
  const shared = m ? decodeShare(m[1]) : null;
  if (shared) return { pid: null as string | null, sol: 0, ...shared };
  const p = PROBLEMS[0];
  return { pid: p.id as string | null, sol: 0, code: p.solutions[0].code, input: p.input };
};

export function App() {
  const [start] = useState(initial);
  const [pid, setPid] = useState(start.pid);
  const [sol, setSol] = useState(start.sol);
  const [code, setCode] = useState(start.code);
  const [input, setInput] = useState(start.input);
  const [tab, setTab] = useState<Tab>('trace');
  const [traced, setTraced] = useState<{ code: string; input: string; result: TraceResult } | null>(
    null,
  );
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [notice, setNotice] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>(
    () =>
      (localStorage.getItem('veyra:theme') as 'dark' | 'light' | null) ??
      (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'),
  );
  const runId = useRef(0);
  const problem = pid ? byId(pid) : undefined;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('veyra:theme', theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  // Re-trace shortly after the user stops typing.
  useEffect(() => {
    const id = ++runId.current;
    const t = setTimeout(async () => {
      const r = await traceInWorker({ code, args: input });
      if (id !== runId.current) return;
      setTraced({ code, input, result: r });
      setIndex(0);
      setPlaying(false);
    }, 300);
    return () => clearTimeout(t);
  }, [code, input]);

  const result = traced?.result ?? null;
  const busy = !traced || traced.code !== code || traced.input !== input;
  const total = result?.steps.length ?? 0;

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setIndex((i) => {
        if (i + 1 >= total) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, speed);
    return () => clearInterval(t);
  }, [playing, speed, total]);

  const go = useCallback(
    (i: number) => setIndex(Math.max(0, Math.min(i, Math.max(0, total - 1)))),
    [total],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tab !== 'trace' || ['TEXTAREA', 'INPUT', 'SELECT', 'BUTTON'].includes(tag)) return;
      if (e.key === 'ArrowRight') go(index + 1);
      else if (e.key === 'ArrowLeft') go(index - 1);
      else if (e.key === ' ') {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, index, tab]);

  const choose = (id: string, s = 0) => {
    const p = byId(id)!;
    setPid(id);
    setSol(s);
    setCode(p.solutions[s].code);
    setInput(p.input);
    history.replaceState(null, '', location.pathname);
  };

  const share = async () => {
    const url = `${location.origin}${location.pathname}#s=${encodeShare({ code, input })}`;
    try {
      await navigator.clipboard.writeText(url);
      setNotice('Link copied to clipboard.');
    } catch {
      history.replaceState(null, '', url);
      setNotice('Link placed in the address bar.');
    }
  };

  const step = result?.steps[index];
  const prev = index > 0 ? result?.steps[index - 1] : undefined;
  const changed = step ? changedVars(prev, step) : new Set<string>();
  const stepKeys = step
    ? Object.keys(step.vars).filter((k) => {
        const v = step.vars[k];
        return !(typeof v === 'object' && v !== null && v.t === 'special' && v.s.startsWith('ƒ'));
      })
    : [];

  return (
    <div className="app">
      <header>
        <h1>
          <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">
            <path
              d="M7 9l9 15 9-15"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Veyra
        </h1>
        <nav aria-label="Sections">
          {(['trace', 'compare', 'review'] as Tab[]).map((t) => (
            <button key={t} aria-current={tab === t ? 'page' : undefined} onClick={() => setTab(t)}>
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </nav>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </header>

      <main>
        <aside aria-label="Problems">
          <h2>Problems</h2>
          <ul>
            {PROBLEMS.map((p) => (
              <li key={p.id}>
                <button
                  aria-current={pid === p.id ? 'true' : undefined}
                  onClick={() => choose(p.id)}
                >
                  <span>{p.title}</span>
                  <small>{p.pattern}</small>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {tab === 'review' ? (
          <Review />
        ) : (
          <section className="work" aria-label={tab === 'trace' ? 'Trace' : 'Compare'}>
            <div className="titlebar">
              <div>
                <h2>{problem ? problem.title : 'Custom code'}</h2>
                <p className="muted">
                  {problem
                    ? problem.summary
                    : 'Write a function, set a JSON input, and step through it.'}
                </p>
              </div>
              <button onClick={share}>Share link</button>
            </div>
            {notice && (
              <p className="muted small" role="status">
                {notice}
              </p>
            )}

            {tab === 'compare' ? (
              problem ? (
                <Compare problem={problem} />
              ) : (
                <p className="muted">Compare mode uses library problems. Pick one on the left.</p>
              )
            ) : (
              <>
                {problem && (
                  <div className="seg" role="group" aria-label="Solution">
                    {problem.solutions.map((s, i) => (
                      <button
                        key={s.label}
                        aria-pressed={sol === i && code === s.code}
                        onClick={() => choose(problem.id, i)}
                      >
                        {s.label} <em>{s.complexity}</em>
                      </button>
                    ))}
                  </div>
                )}
                <div className="grid">
                  <div>
                    <CodeEditor
                      value={code}
                      onChange={(v) => {
                        setCode(v);
                        if (problem && v !== problem.solutions[sol].code) setPid(null);
                      }}
                      activeLine={step?.line}
                      errorLine={result?.error?.line}
                    />
                    <label className="field">
                      Input (JSON array of arguments)
                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        spellCheck={false}
                      />
                    </label>
                  </div>
                  <div className="panel">
                    <Stepper
                      index={index}
                      total={total}
                      playing={playing}
                      speed={speed}
                      onIndex={go}
                      onPlaying={setPlaying}
                      onSpeed={setSpeed}
                    />
                    <div aria-live="polite" className="status">
                      {busy && (
                        <p className="muted" role="status">
                          Tracing…
                        </p>
                      )}
                      {!busy && result?.error && (
                        <p role="alert" className="error">
                          {result.error.line ? `Line ${result.error.line}: ` : ''}
                          {result.error.message}
                        </p>
                      )}
                      {!busy && result && !result.error && result.truncated && (
                        <p className="muted small">
                          Showing the first {total.toLocaleString()} of{' '}
                          {result.ops.toLocaleString()} steps.
                        </p>
                      )}
                    </div>
                    <h3>Variables{step ? ` · line ${step.line}` : ''}</h3>
                    {step ? (
                      <dl className="vars">
                        {stepKeys.map((k) => (
                          <div key={k} className={changed.has(k) ? 'var changed' : 'var'}>
                            <dt>{k}</dt>
                            <dd>
                              <Value
                                v={step.vars[k]}
                                prev={prev?.vars[k]}
                                vars={step.vars}
                                name={k}
                              />
                            </dd>
                          </div>
                        ))}
                        {stepKeys.length === 0 && (
                          <p className="muted">No variables in scope yet.</p>
                        )}
                      </dl>
                    ) : (
                      !busy && <p className="muted">Nothing to show.</p>
                    )}
                    {result && !result.error && result.result !== undefined && (
                      <div className="result">
                        <h3>Returned</h3>
                        <Value v={result.result} />
                        <p className="muted small">
                          {result.ops.toLocaleString()} statements, {Math.round(result.durationMs)}{' '}
                          ms
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </section>
        )}
      </main>
      <footer>Veyra runs your code locally in a Web Worker. Nothing is uploaded.</footer>
    </div>
  );
}
