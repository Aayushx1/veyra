import { useMemo } from 'react';
import { lineDiff } from '../lib/diff';
import type { Problem } from '../problems';

/** How the simple solution turns into the optimized one, line by line. */
export function DiffView({ problem }: { problem: Problem }) {
  const [a, b] = problem.solutions;
  const ops = useMemo(() => lineDiff(a.code, b.code), [a.code, b.code]);
  const removed = ops.filter((o) => o.type === 'del').length;
  const added = ops.filter((o) => o.type === 'add').length;
  return (
    <section aria-label="Diff between solutions" className="diff">
      <p className="muted">
        <b>{a.label}</b> <span className="cx cx-bad">{a.complexity}</span>{' '}
        <span aria-hidden="true">→</span> <b>{b.label}</b>{' '}
        <span className="cx cx-good">{b.complexity}</span>
      </p>
      <p className="muted small">
        {removed} lines removed, {added} lines added. Unchanged lines are dimmed.
      </p>
      <pre className="diffcode" tabIndex={0} aria-label="Unified diff">
        {ops.map((o, i) => (
          <div key={i} className={`dl dl-${o.type}`}>
            <span className="dsign" aria-hidden="true">
              {o.type === 'add' ? '+' : o.type === 'del' ? '-' : ' '}
            </span>
            <span className="sr-only">
              {o.type === 'add' ? 'added: ' : o.type === 'del' ? 'removed: ' : ''}
            </span>
            {o.text || '​'}
          </div>
        ))}
      </pre>
    </section>
  );
}
