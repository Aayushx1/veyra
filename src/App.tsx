import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Step, TraceResult, V } from './core/types';
import { show } from './core/serialize';
import { PROBLEMS, byId, type Problem } from './problems';
import { traceInWorker } from './lib/client';
import { decodeShare, encodeShare } from './lib/share';
import { changedVars } from './lib/view';
import { CodeEditor } from './components/CodeEditor';
import { Stepper } from './components/Stepper';
import { Value } from './components/Value';
import { Compare } from './components/Compare';
import { Review } from './components/Review';
import {
  IconCards,
  IconChart,
  IconCheck,
  IconMoon,
  IconShare,
  IconSun,
  IconTrace,
  Logo,
} from './components/icons';

type Tab = 'trace' | 'compare' | 'review';

const TABS: { id: Tab; label: string; icon: ReactNode }[] = [
  { id: 'trace', label: 'Trace', icon: <IconTrace /> },
  { id: 'compare', label: 'Compare', icon: <IconChart /> },
  { id: 'review', label: 'Review', icon: <IconCards /> },
];

const initial = () => {
  const m = /^#s=(.+)$/.exec(location.hash);
  const shared = m ? decodeShare(m[1]) : null;
  if (shared) return { pid: null as string | null, sol: 0, ...shared };
  const p = PROBLEMS[0];
  return { pid: p.id as string | null, sol: 0, code: p.solutions[0].code, input: p.input };
};

/** Colour a complexity class: green is scalable, amber is middling, red grows fast. */
function tone(c: string): 'good' | 'mid' | 'bad' {
  if (/^O\((1|log n|n)\)$/.test(c)) return 'good';
  if (/n log n/.test(c)) return 'mid';
  return 'bad';
}

const isFn = (v: V) =>
  typeof v === 'object' && v !== null && v.t === 'special' && v.s.startsWith('ƒ');
const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

function Complexity({ c }: { c: string }) {
  return <span className={`cx cx-${tone(c)}`}>{c}</span>;
}

function sourceLine(code: string, line?: number) {
  return line ? (code.split('\n')[line - 1] ?? '').trim() : '';
}

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
  const problem: Problem | undefined = pid ? byId(pid) : undefined;

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

  const step: Step | undefined = result?.steps[index];
  const prev: Step | undefined = index > 0 ? result?.steps[index - 1] : undefined;
  const changed = step ? changedVars(prev, step) : new Set<string>();
  const visibleKeys = step ? Object.keys(step.vars).filter((k) => !isFn(step.vars[k])) : [];

  // What the previously executed line did: old -> new for each variable that changed.
  const changes = step && prev ? [...changed].filter((k) => !isFn(step.vars[k])) : [];
  const hintText = changes
    .slice(0, 3)
    .map((k) => `${k} = ${clip(show(step!.vars[k]), 22)}`)
    .join('   ');

  const groups: ['Easy' | 'Medium' | 'Hard', Problem[]][] = (['Easy', 'Medium', 'Hard'] as const)
    .map((d) => [d, PROBLEMS.filter((p) => p.difficulty === d)] as [typeof d, Problem[]])
    .filter(([, list]) => list.length > 0);

  return (
    <div className="app">
      <header className="topbar">
        <h1 className="brand">
          <Logo />
          Veyra
        </h1>
        <nav aria-label="Sections">
          {TABS.map((t) => (
            <button
              key={t.id}
              aria-current={tab === t.id ? 'page' : undefined}
              onClick={() => setTab(t.id)}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
        <button
          className="icon theme"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? <IconSun /> : <IconMoon />}
        </button>
      </header>

      <main>
        <aside aria-label="Problems">
          <h2>Problems</h2>
          {groups.map(([d, list]) => (
            <div key={d} className="group">
              <p className="group-label">{d}</p>
              <ul>
                {list.map((p) => (
                  <li key={p.id}>
                    <button
                      aria-current={pid === p.id ? 'true' : undefined}
                      onClick={() => choose(p.id)}
                    >
                      <span className="p-title">{p.title}</span>
                      <span className="p-meta">
                        <span className="pattern">{p.pattern}</span>
                        <Complexity c={p.solutions[1].complexity} />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        {tab === 'review' ? (
          <Review />
        ) : (
          <section className="work" aria-label={tab === 'trace' ? 'Trace' : 'Compare'}>
            {tab === 'trace' && (
              <div className="hero">
                <p className="hero-title">
                  See your code <em>think</em>.
                </p>
                <p className="hero-sub">
                  Step through real JavaScript and watch every variable, pointer and collection
                  change. Edit the code or the input and it re-traces instantly.
                </p>
              </div>
            )}

            <div className="titlebar">
              <div>
                <h2>{problem ? problem.title : 'Custom code'}</h2>
                <p className="muted">
                  {problem
                    ? problem.summary
                    : 'Write a function, set a JSON input, and step through it.'}
                </p>
              </div>
              <button className="ghostbtn" onClick={share}>
                <IconShare />
                Share link
              </button>
            </div>
            {notice && (
              <p className="notice" role="status">
                <IconCheck /> {notice}
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
                        {s.label} <Complexity c={s.complexity} />
                      </button>
                    ))}
                  </div>
                )}
                <div className="grid">
                  <div className="left">
                    <CodeEditor
                      value={code}
                      onChange={(v) => {
                        setCode(v);
                        if (problem && v !== problem.solutions[sol].code) setPid(null);
                      }}
                      activeLine={step?.line}
                      errorLine={result?.error?.line}
                      hint={prev && hintText ? { line: prev.line, text: hintText } : undefined}
                    />
                    <label className="field">
                      Input · JSON array of arguments
                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        spellCheck={false}
                      />
                    </label>
                  </div>

                  <div className="right">
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
                      <p className="keys" aria-hidden="true">
                        <kbd>←</kbd> <kbd>→</kbd> step · <kbd>Space</kbd> play
                      </p>
                    </div>

                    <div className="status" aria-live="polite">
                      {busy && (
                        <p className="muted loading" role="status">
                          <span className="spinner" /> Tracing…
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

                    {step && (
                      <div className="narrate">
                        <p className="n-head">
                          <span>
                            Step {index + 1} · line {step.line}
                          </span>
                        </p>
                        <code className="n-line">{sourceLine(code, step.line)}</code>
                        {changes.length > 0 && (
                          <ul className="n-changes" aria-label="Changes since the previous step">
                            {changes.slice(0, 4).map((k) => (
                              <li key={k}>
                                <b>{k}</b>
                                {prev && k in prev.vars && (
                                  <>
                                    <s>{clip(show(prev.vars[k]), 18)}</s>
                                    <span aria-hidden="true">→</span>
                                  </>
                                )}
                                <strong>{clip(show(step.vars[k]), 24)}</strong>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}

                    <div className="panel">
                      <h3>Variables</h3>
                      {step ? (
                        <dl className="vars">
                          {visibleKeys.map((k) => (
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
                          {visibleKeys.length === 0 && (
                            <p className="muted">No variables in scope yet.</p>
                          )}
                        </dl>
                      ) : (
                        !busy && <p className="muted">Nothing to show.</p>
                      )}
                    </div>

                    {result && !result.error && result.result !== undefined && (
                      <div className="panel result">
                        <h3>Returned</h3>
                        <Value v={result.result} />
                        <p className="muted small">
                          {result.ops.toLocaleString()} statements ·{' '}
                          {Math.max(1, Math.round(result.durationMs))} ms
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
