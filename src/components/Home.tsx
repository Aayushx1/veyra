import { useState, type FormEvent } from 'react';
import { CATEGORIES, PROBLEMS, byLcSlug } from '../problems';
import { parseProblemSlug } from '../lib/leetcode';
import { href } from '../lib/router';
import { loadSession } from '../lib/store';
import { useApp } from '../state';

const EXAMPLES = ['two-sum', 'valid-parentheses', 'climbing-stairs', 'number-of-islands'];

const STEPS = [
  {
    n: '01',
    t: 'Trace',
    d: 'Run real code and watch variables, pointers and collections change line by line.',
  },
  {
    n: '02',
    t: 'Two variants',
    d: 'A simple solution first, then the optimized one, side by side.',
  },
  {
    n: '03',
    t: 'Diff & race',
    d: 'See exactly what changed between them, then watch the work grow as n does.',
  },
  {
    n: '04',
    t: 'Remember it',
    d: 'A memory hook, a real-world use, and spaced-repetition cards for Anki.',
  },
];

export function Home() {
  const { done, find, mine } = useApp();
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const last = loadSession().last;

  const open = (e: FormEvent) => {
    e.preventDefault();
    const slug = parseProblemSlug(text);
    if (!slug) {
      setError(
        'That does not look like a LeetCode link or problem name. Try leetcode.com/problems/two-sum/',
      );
      return;
    }
    setError('');
    const known = byLcSlug(slug) ?? find(slug);
    location.hash = known ? href.problem(known.id).slice(1) : href.generate(slug).slice(1);
  };

  const doneCount = PROBLEMS.filter((p) => done[p.id]).length;

  return (
    <div className="home">
      <section className="hero" aria-labelledby="hero-h">
        <p className="eyebrow">
          <span className="prompt">~/veyra</span> <span className="blink">▌</span>
        </p>
        <h2 id="hero-h" className="hero-title">
          Paste a problem.
          <br />
          <em>Watch it run.</em>
        </h2>
        <p className="hero-sub">
          {PROBLEMS.length}+ interview problems across {CATEGORIES.length} topics, each with a
          simple and an optimized solution you can trace line by line. Paste any LeetCode link to
          get the same for a problem that is not in the library.
        </p>

        <form className="cmd" onSubmit={open} role="search">
          <label htmlFor="lc-url" className="cmd-prompt">
            $ trace
          </label>
          <input
            id="lc-url"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://leetcode.com/problems/two-sum/"
            spellCheck={false}
            autoComplete="off"
            aria-describedby={error ? 'lc-err' : undefined}
          />
          <button type="submit" className="primary">
            Run
          </button>
        </form>
        {error && (
          <p id="lc-err" role="alert" className="error">
            {error}
          </p>
        )}
        <p className="try">
          try:{' '}
          {EXAMPLES.map((s) => (
            <button
              key={s}
              type="button"
              className="chip"
              onClick={() => {
                setText(s);
                setError('');
              }}
            >
              {s}
            </button>
          ))}
        </p>

        {last && last.hash !== '#/' && last.hash !== '' && (
          <a className="continue" href={last.hash}>
            Continue where you left off: <b>{last.label}</b> →
          </a>
        )}
      </section>

      <section aria-labelledby="topics-h" className="topics">
        <div className="section-head">
          <h2 id="topics-h">
            <span className="slashes">//</span> topics
          </h2>
          <p className="muted mono small">
            {doneCount}/{PROBLEMS.length} done
            {Object.keys(mine).length > 0 && (
              <>
                {' · '}
                <a href={href.mine}>{Object.keys(mine).length} of your own</a>
              </>
            )}
          </p>
        </div>
        <ul className="cards">
          {CATEGORIES.map((c) => {
            const list = PROBLEMS.filter((p) => p.category === c.id);
            const d = list.filter((p) => done[p.id]).length;
            const pct = list.length ? Math.round((d / list.length) * 100) : 0;
            return (
              <li key={c.id}>
                <a className="card-link" href={href.category(c.id)}>
                  <span className="glyph" aria-hidden="true">
                    {c.glyph}
                  </span>
                  <span className="c-title">{c.label}</span>
                  <span className="c-blurb">{c.blurb}</span>
                  <span className="c-foot">
                    <span className="mono">{list.length} problems</span>
                    <span
                      className="meter"
                      role="img"
                      aria-label={`${d} of ${list.length} done`}
                      style={{ ['--pct' as string]: `${pct}%` }}
                    />
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="how-h" className="how">
        <div className="section-head">
          <h2 id="how-h">
            <span className="slashes">//</span> every problem page
          </h2>
        </div>
        <ol className="steps">
          {STEPS.map((s) => (
            <li key={s.n}>
              <span className="step-n mono">{s.n}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
