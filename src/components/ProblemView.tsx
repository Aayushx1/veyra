import { useCallback, useEffect, useRef, useState } from 'react';
import type { Step, TraceResult, V } from '../core/types';
import { show } from '../core/serialize';
import { CATEGORIES, PROBLEMS, type Problem } from '../problems';
import { traceInWorker } from '../lib/client';
import { encodeShare } from '../lib/share';
import { changedVars } from '../lib/view';
import { leetcodeUrl } from '../lib/leetcode';
import { href } from '../lib/router';
import { useApp } from '../state';
import { CodeEditor } from './CodeEditor';
import { Stepper } from './Stepper';
import { Value } from './Value';
import { Compare } from './Compare';
import { DiffView } from './DiffView';
import { Complexity, Difficulty } from './Badges';
import { IconCheck, IconShare } from './icons';

type Pane = 'trace' | 'compare' | 'diff';

const isFn = (v: V) =>
  typeof v === 'object' && v !== null && v.t === 'special' && v.s.startsWith('ƒ');
const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + '…' : s);
const sourceLine = (code: string, line?: number) =>
  line ? (code.split('\n')[line - 1] ?? '').trim() : '';

interface Props {
  /** A library or generated problem. Omit for free-form code opened from a share link. */
  problem?: Problem;
  initial?: { code: string; input: string };
}

export function ProblemView({ problem, initial }: Props) {
  const { done, toggleDone } = useApp();
  const first = problem?.solutions[0];
  const [sol, setSol] = useState(0);
  const [code, setCode] = useState(initial?.code ?? first?.code ?? '');
  const [input, setInput] = useState(initial?.input ?? problem?.input ?? '[]');
  const [pane, setPane] = useState<Pane>('trace');
  const [traced, setTraced] = useState<{ code: string; input: string; result: TraceResult } | null>(
    null,
  );
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [notice, setNotice] = useState('');
  const runId = useRef(0);

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
      if (pane !== 'trace' || ['TEXTAREA', 'INPUT', 'SELECT', 'BUTTON', 'A'].includes(tag)) return;
      if (e.key === 'ArrowRight') go(index + 1);
      else if (e.key === 'ArrowLeft') go(index - 1);
      else if (e.key === ' ') {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, index, pane]);

  const pickSolution = (i: number) => {
    if (!problem) return;
    setSol(i);
    setCode(problem.solutions[i].code);
    setInput(problem.input);
  };

  const share = async () => {
    const url = `${location.origin}${location.pathname}#/s=${encodeShare({ code, input })}`;
    try {
      await navigator.clipboard.writeText(url);
      setNotice('Link copied to clipboard.');
    } catch {
      location.hash = `/s=${encodeShare({ code, input })}`;
      setNotice('Link placed in the address bar.');
    }
  };

  const step: Step | undefined = result?.steps[index];
  const prev: Step | undefined = index > 0 ? result?.steps[index - 1] : undefined;
  const changed = step ? changedVars(prev, step) : new Set<string>();
  const visibleKeys = step ? Object.keys(step.vars).filter((k) => !isFn(step.vars[k])) : [];
  const changes = step && prev ? [...changed].filter((k) => !isFn(step.vars[k])) : [];
  const hintText = changes
    .slice(0, 3)
    .map((k) => `${k} = ${clip(show(step!.vars[k]), 22)}`)
    .join('   ');

  const cat = problem ? CATEGORIES.find((c) => c.id === problem.category) : undefined;
  const siblings = problem ? PROBLEMS.filter((p) => p.category === problem.category) : [];
  const at = problem ? siblings.findIndex((p) => p.id === problem.id) : -1;
  const prevP = at > 0 ? siblings[at - 1] : undefined;
  const nextP = at >= 0 && at < siblings.length - 1 ? siblings[at + 1] : undefined;
  const isDone = !!(problem && done[problem.id]);
  const edited = !!problem && code !== problem.solutions[sol].code;

  return (
    <article className="problem">
      <div className="crumbs">
        <a href={href.home}>topics</a>
        <span aria-hidden="true">/</span>
        {cat ? <a href={href.category(cat.id)}>{cat.label}</a> : <span>custom</span>}
      </div>

      <div className="titlebar">
        <div>
          <h2>{problem ? problem.title : 'Custom code'}</h2>
          <p className="lede">
            {problem ? problem.summary : 'Write a function, set a JSON input, and step through it.'}
          </p>
          {problem && (
            <p className="meta">
              <Difficulty d={problem.difficulty} />
              {problem.n && <span className="mono muted">#{problem.n}</span>}
              {problem.generated && <span className="tag">AI generated · verified by running</span>}
              {problem.tags?.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </p>
          )}
        </div>
        <div className="actions">
          {problem && (
            <button
              aria-pressed={isDone}
              className={isDone ? 'on' : ''}
              onClick={() => toggleDone(problem.id)}
            >
              <IconCheck />
              {isDone ? 'Done' : 'Mark done'}
            </button>
          )}
          {problem?.lc && (
            <a
              className="btnlink"
              href={leetcodeUrl(problem.lc)}
              target="_blank"
              rel="noopener noreferrer"
            >
              LeetCode ↗
            </a>
          )}
          <button onClick={share}>
            <IconShare />
            Share link
          </button>
        </div>
      </div>
      {notice && (
        <p className="notice" role="status">
          <IconCheck /> {notice}
        </p>
      )}

      <div className="tabs" role="tablist" aria-label="View">
        {(['trace', 'compare', 'diff'] as Pane[]).map((p) => (
          <button
            key={p}
            role="tab"
            aria-selected={pane === p}
            disabled={p !== 'trace' && !problem}
            onClick={() => setPane(p)}
          >
            {p === 'trace' ? 'Trace' : p === 'compare' ? 'Compare' : 'Diff'}
          </button>
        ))}
      </div>

      {pane === 'compare' && problem && <Compare problem={problem} />}
      {pane === 'diff' && problem && <DiffView problem={problem} />}

      {pane === 'trace' && (
        <>
          {problem && (
            <div className="seg" role="group" aria-label="Solution">
              {problem.solutions.map((s, i) => (
                <button
                  key={s.label}
                  aria-pressed={sol === i && !edited}
                  onClick={() => pickSolution(i)}
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
                onChange={setCode}
                activeLine={step?.line}
                errorLine={result?.error?.line}
                hint={prev && hintText ? { line: prev.line, text: hintText } : undefined}
                filename={problem ? `${problem.id}.js` : 'scratch.js'}
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
                    Showing the first {total.toLocaleString()} of {result.ops.toLocaleString()}{' '}
                    steps.
                  </p>
                )}
              </div>

              {step && (
                <div className="narrate">
                  <p className="n-head">
                    Step {index + 1} · line {step.line}
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
                          <Value v={step.vars[k]} prev={prev?.vars[k]} vars={step.vars} name={k} />
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

      {problem && (
        <section className="remember" aria-label="Remember it">
          <h3>Remember it</h3>
          <p>
            <b>{problem.pattern}.</b> {problem.hook}
          </p>
          {problem.real && (
            <p className="muted">
              <b>In the wild:</b> {problem.real}
            </p>
          )}
        </section>
      )}

      {problem && (prevP || nextP) && (
        <nav className="pager" aria-label="Neighbouring problems">
          {prevP ? <a href={href.problem(prevP.id)}>← {prevP.title}</a> : <span />}
          {nextP ? <a href={href.problem(nextP.id)}>{nextP.title} →</a> : <span />}
        </nav>
      )}
    </article>
  );
}
