import { useMemo, useState } from 'react';
import { PROBLEMS } from '../problems';
import { isDue, loadDeck, newCard, review, saveDeck, type Deck, type Grade } from '../lib/srs';
import { toAnkiTsv } from '../lib/anki';

function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/tab-separated-values' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

const GRADES: { g: Grade; label: string }[] = [
  { g: 0, label: 'Again' },
  { g: 3, label: 'Hard' },
  { g: 4, label: 'Good' },
  { g: 5, label: 'Easy' },
];

/** Spaced-repetition review of the pattern and memory hook for each problem. */
export function Review() {
  const [deck, setDeck] = useState<Deck>(() => loadDeck());
  const [shown, setShown] = useState(false);
  const [now] = useState(() => Date.now());
  const due = useMemo(() => PROBLEMS.filter((p) => isDue(deck[p.id], now)), [deck, now]);
  const current = due[0];

  const grade = (g: Grade, at: number) => {
    if (!current) return;
    const next = { ...deck, [current.id]: review(deck[current.id] ?? newCard(now), g, at) };
    setDeck(next);
    saveDeck(next);
    setShown(false);
  };

  return (
    <section aria-labelledby="review-h" className="review">
      <h2 id="review-h">Review</h2>
      <p className="muted" role="status">
        {due.length} of {PROBLEMS.length} due. Progress is stored only in this browser.
      </p>
      {current ? (
        <div className="card">
          <h3>{current.title}</h3>
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
                {GRADES.map(({ g, label }) => (
                  <button key={g} onClick={() => grade(g, Date.now())}>
                    {label}
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
        <button onClick={() => download('veyra-anki.txt', toAnkiTsv(PROBLEMS))}>
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
