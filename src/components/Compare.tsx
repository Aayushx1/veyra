import { useEffect, useState } from 'react';
import { Race } from './Race';
import { scaleOf, type Problem } from '../problems';
import { traceInWorker } from '../lib/client';

interface Point {
  n: number;
  a: number;
  b: number;
}

const W = 520;
const H = 240;
const PAD = { l: 52, r: 16, t: 14, b: 32 };

/** Runs both solutions across growing input sizes and charts statements executed. */
export function Compare({ problem }: { problem: Problem }) {
  const scale = scaleOf(problem);
  const [state, setState] = useState<{ id: string; points?: Point[]; err?: string } | null>(null);

  useEffect(() => {
    if (!scale) return;
    let cancelled = false;
    (async () => {
      const out: Point[] = [];
      for (const n of scale.sizes) {
        const input = scale.make(n);
        const [a, b] = await Promise.all(
          problem.solutions.map((s) =>
            traceInWorker({ code: s.code, args: input, maxRecorded: 1 }),
          ),
        );
        const bad = a.error ?? b.error;
        if (bad) {
          if (!cancelled) setState({ id: problem.id, err: `n=${n}: ${bad.message}` });
          return;
        }
        out.push({ n, a: a.ops, b: b.ops });
      }
      if (!cancelled) setState({ id: problem.id, points: out });
    })();
    return () => {
      cancelled = true;
    };
  }, [problem, scale]);

  const err = state?.id === problem.id ? state.err : undefined;
  const points = state?.id === problem.id ? state.points : undefined;

  if (!scale) return <p className="muted">No scaling data for this problem.</p>;
  if (err)
    return (
      <p role="alert" className="error">
        {err}
      </p>
    );
  if (!points)
    return (
      <p className="muted" role="status">
        Measuring both solutions…
      </p>
    );

  const maxY = Math.max(...points.flatMap((p) => [p.a, p.b]));
  const maxX = points[points.length - 1].n;
  const x = (n: number) => PAD.l + (n / maxX) * (W - PAD.l - PAD.r);
  const y = (v: number) => H - PAD.b - (v / maxY) * (H - PAD.t - PAD.b);
  const line = (k: 'a' | 'b') => points.map((p) => `${x(p.n)},${y(p[k])}`).join(' ');
  const [sa, sb] = problem.solutions;

  return (
    <div className="compare">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Statements executed versus input size for ${sa.label} and ${sb.label}`}
      >
        <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} className="axis" />
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} className="axis" />
        <text x={PAD.l - 6} y={PAD.t + 4} textAnchor="end" className="tick">
          {maxY.toLocaleString()}
        </text>
        <text x={PAD.l - 6} y={H - PAD.b} textAnchor="end" className="tick">
          0
        </text>
        <text x={x(maxX)} y={H - 10} textAnchor="end" className="tick">
          n = {maxX}
        </text>
        <polyline points={line('a')} className="series s-a" fill="none" />
        <polyline points={line('b')} className="series s-b" fill="none" />
        {points.map((p) => (
          <g key={p.n}>
            <circle cx={x(p.n)} cy={y(p.a)} r="3.5" className="dot s-a" />
            <circle cx={x(p.n)} cy={y(p.b)} r="3.5" className="dot s-b" />
          </g>
        ))}
      </svg>
      <ul className="legend">
        <li>
          <span className="sw s-a" /> {sa.label} <em>{sa.complexity}</em>
        </li>
        <li>
          <span className="sw s-b" /> {sb.label} <em>{sb.complexity}</em>
        </li>
      </ul>
      <Race points={points} labels={[sa.label, sb.label]} />
      <table className="data">
        <caption>Statements executed (worst-case style input)</caption>
        <thead>
          <tr>
            <th>n</th>
            <th>{sa.label}</th>
            <th>{sb.label}</th>
          </tr>
        </thead>
        <tbody>
          {points.map((p) => (
            <tr key={p.n}>
              <td>{p.n}</td>
              <td>{p.a.toLocaleString()}</td>
              <td>{p.b.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="muted small">
        Counts executed statements, so work hidden inside native calls (sort, replace, splice) is
        undercounted. Use it to compare growth, not as a benchmark.
      </p>
    </div>
  );
}
