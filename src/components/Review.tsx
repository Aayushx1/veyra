import { useMemo, useState } from 'react';
import { isDue, loadDeck, newCard, review, saveDeck, type Deck, type Grade } from '../lib/srs';
import { toAnkiTsv } from '../lib/anki';
import { href } from '../lib/router';
import { useApp } from '../state';
import { download } from './DataView';

const NEW_PER_SESSION = 10;

const GRADES: { g: Grade; label: string; hint: string }[] = [
  { g: 0, label: 'Again', hint: 'tomorrow' },
  { g: 3, label: 'Hard', hint: 'soon' },
  { g: 4, label: 'Good', hint: 'normal' },
  { g: 5, label: 'Easy', hint: 'later' },
];

/** Spaced-repetition review of the pattern and memory hook for each problem. */
export function Review() {
  const { all } = useApp();
  const [deck, setDeck] = useState<Deck>(() => loadDeck());
  const [shown, setShown] = useState(false);
  const [now] = useState(() => Date.now());

  // Cards you have seen and that are due come first, then a few new ones per session.
  const queue = useMemo(() => {
    const seen = all.filter((p) => deck[p.id] && isDue(deck[p.id], now));
    const fresh = all.filter((p) => !deck[p.id]).slice(0, NEW_PER_SESSION);
    return [...seen, ...fresh];
  }, [all, deck, now]);
  const current = queue[0];
  const learned = Object.keys(deck).length;

  const grade = (g: Grade, at: number) => {
    if (!current) return;
    const next = { ...deck, [current.id]: review(deck[current.id] ?? newCard(now), g, at) };
    setDeck(next);
    saveDeck(next);
    setShown(false);
  };

  return (
    <section aria-labelledby="review-h" className="review">
      <div className="crumbs">
        <a href={href.home}>topics</a>
        <span aria-hidden="true">/</span>
        <span>review</span>
      </div>
      <h2 id="review-h">Review</h2>
      <p className="muted" role="status">
        {queue.length} to review now · {learned} of {all.length} learned. Progress is stored only in
        this browser.
      </p>
      {current ? (
        <div className="card flash">
          <p className="eyebrow">
            {current.title} <span className="mono muted">· {current.difficulty}</span>
          </p>
          <p>{current.summary}</p>
          <p>
            <strong>Which pattern fits, and why?</strong>
          </p>
          {shown ? (
            <>
              <p className="answer">
                <strong>{current.pattern}.</strong> {current.hook}
              </p>
              <div className="grades" role="group" aria-label="How well did you remember?">
                {GRADES.map(({ g, label, hint }) => (
                  <button key={g} onClick={() => grade(g, Date.now())}>
                    {label} <span className="muted small">{hint}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <button className="primary" onClick={() => setShown(true)}>
              Show answer
            </button>
          )}
        </div>
      ) : (
        <p className="card">All caught up. Come back when cards are due.</p>
      )}
      <div className="row">
        <button
          onClick={() => download('veyra-anki.txt', toAnkiTsv(all), 'text/tab-separated-values')}
        >
          Export Anki cards
        </button>
        <button
          onClick={() => {
            if (confirm('Erase all review progress in this browser?')) {
              setDeck({});
              saveDeck({});
            }
          }}
        >
          Reset progress
        </button>
      </div>
    </section>
  );
}
