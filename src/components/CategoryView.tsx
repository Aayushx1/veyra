import { useMemo, useState } from 'react';
import type { Problem } from '../problems';
import { href } from '../lib/router';
import { useApp } from '../state';
import { Complexity, Difficulty } from './Badges';

interface Props {
  title: string;
  blurb: string;
  problems: Problem[];
  /** Show a delete button per row (for the user's own generated problems). */
  deletable?: boolean;
  empty?: string;
}

const LEVELS = ['All', 'Easy', 'Medium', 'Hard'] as const;

export function CategoryView({ title, blurb, problems, deletable, empty }: Props) {
  const { done, toggleDone, removeMine } = useApp();
  const [level, setLevel] = useState<(typeof LEVELS)[number]>('All');
  const [q, setQ] = useState('');

  const shown = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return problems.filter((p) => {
      if (level !== 'All' && p.difficulty !== level) return false;
      if (words.length === 0) return true;
      // Match title, pattern, tags, the LeetCode slug (so "valid anagram" finds it) and number.
      const hay = [p.title, p.pattern, p.lc?.replace(/-/g, ' '), p.n, ...(p.tags ?? [])]
        .join(' ')
        .toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }, [problems, level, q]);

  const doneCount = problems.filter((p) => done[p.id]).length;
  const pct = problems.length ? Math.round((doneCount / problems.length) * 100) : 0;

  return (
    <div className="category">
      <div className="crumbs">
        <a href={href.home}>topics</a>
        <span aria-hidden="true">/</span>
        <span>{title}</span>
      </div>
      <div className="titlebar">
        <div>
          <h2>{title}</h2>
          <p className="lede">{blurb}</p>
        </div>
        <div className="progress-box">
          <span className="mono small">
            {doneCount}/{problems.length} done
          </span>
          <span
            className="meter wide"
            role="img"
            aria-label={`${pct}% complete`}
            style={{ ['--pct' as string]: `${pct}%` }}
          />
        </div>
      </div>

      <div className="filters">
        <div className="seg" role="group" aria-label="Difficulty">
          {LEVELS.map((l) => (
            <button key={l} aria-pressed={level === l} onClick={() => setLevel(l)}>
              {l}
            </button>
          ))}
        </div>
        <label className="search">
          <span className="sr-only">Search problems</span>
          <input
            type="search"
            placeholder="search…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
      </div>

      {problems.length === 0 ? (
        <p className="card">{empty ?? 'Nothing here yet.'}</p>
      ) : shown.length === 0 ? (
        <p className="muted">No problems match those filters.</p>
      ) : (
        <div className="tablewrap">
          <table className="ptable">
            <caption className="sr-only">{title} problems</caption>
            <thead>
              <tr>
                <th scope="col">Done</th>
                <th scope="col">#</th>
                <th scope="col">Problem</th>
                <th scope="col">Level</th>
                <th scope="col">Pattern</th>
                <th scope="col">Best</th>
                {deletable && <th scope="col">Remove</th>}
              </tr>
            </thead>
            <tbody>
              {shown.map((p) => (
                <tr key={p.id} className={done[p.id] ? 'is-done' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={!!done[p.id]}
                      onChange={() => toggleDone(p.id)}
                      aria-label={`Mark ${p.title} as done`}
                    />
                  </td>
                  <td className="mono muted">{p.n ?? '·'}</td>
                  <td>
                    <a href={href.problem(p.id)}>{p.title}</a>
                  </td>
                  <td>
                    <Difficulty d={p.difficulty} />
                  </td>
                  <td className="muted">{p.pattern}</td>
                  <td>
                    <Complexity c={p.solutions[1].complexity} />
                  </td>
                  {deletable && (
                    <td>
                      <button
                        className="linklike"
                        onClick={() => {
                          if (confirm(`Remove "${p.title}" from this browser?`)) removeMine(p.id);
                        }}
                        aria-label={`Remove ${p.title}`}
                      >
                        remove
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
