import { useState } from 'react';

interface Point {
  n: number;
  a: number;
  b: number;
}

/** Drag the slider to grow the input and watch the two bars pull apart. */
export function Race({ points, labels }: { points: Point[]; labels: [string, string] }) {
  const [i, setI] = useState(0);
  const p = points[Math.min(i, points.length - 1)];
  const max = Math.max(p.a, p.b, 1);
  const ratio = p.b > 0 ? p.a / p.b : 1;
  return (
    <div className="race">
      <label className="race-slider">
        <span>
          Input size <b>n = {p.n}</b>
        </span>
        <input
          type="range"
          min={0}
          max={points.length - 1}
          value={i}
          onChange={(e) => setI(Number(e.target.value))}
          aria-label="Input size"
        />
      </label>
      <div className="lane">
        <span className="lane-label">{labels[0]}</span>
        <div className="bar-track">
          <div className="bar bar-a" style={{ width: `${(p.a / max) * 100}%` }} />
        </div>
        <span className="lane-num">{p.a.toLocaleString()}</span>
      </div>
      <div className="lane">
        <span className="lane-label">{labels[1]}</span>
        <div className="bar-track">
          <div className="bar bar-b" style={{ width: `${(p.b / max) * 100}%` }} />
        </div>
        <span className="lane-num">{p.b.toLocaleString()}</span>
      </div>
      <p className="muted small" role="status">
        {ratio >= 1.5
          ? `${labels[1]} does about ${ratio.toFixed(1)}× less work at this size.`
          : 'At this size the two are close. Drag right to see them diverge.'}
      </p>
    </div>
  );
}
