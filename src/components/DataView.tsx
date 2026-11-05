import { useRef, useState } from 'react';
import { CATEGORIES, PROBLEMS } from '../problems';
import { toAnkiTsv } from '../lib/anki';
import { pushToAnki } from '../lib/ankiConnect';
import { clearAiKey } from '../lib/ai';
import { KEYS, eraseAll, exportBackup, importBackup } from '../lib/store';
import { href } from '../lib/router';
import { useApp } from '../state';
import { IconDownload } from './icons';

export function download(name: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

function storageBytes(): number {
  let n = 0;
  try {
    for (const k of Object.values(KEYS)) n += (localStorage.getItem(k) ?? '').length;
  } catch {
    /* unavailable */
  }
  return n;
}

export function DataView() {
  const { done, mine, all, reload } = useApp();
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [deck, setDeck] = useState('Veyra');
  const [busy, setBusy] = useState(false);
  const file = useRef<HTMLInputElement>(null);

  const say = (m: string, e = '') => {
    setMsg(m);
    setErr(e);
  };

  const onImport = async (f: File | undefined) => {
    if (!f) return;
    try {
      if (f.size > 5_000_000) throw new Error('That file is too large to be a Veyra backup.');
      const r = importBackup(await f.text());
      reload();
      say(
        `Imported ${r.done} done marks, ${r.cards} review cards and ${r.mine} generated problems.`,
      );
    } catch (e) {
      say('', (e as Error).message);
    } finally {
      if (file.current) file.current.value = '';
    }
  };

  const push = async () => {
    setBusy(true);
    say('');
    try {
      const r = await pushToAnki(all, deck.trim() || 'Veyra');
      say(`${r.added} new cards added to "${deck}" (${r.skipped} duplicates skipped).`);
    } catch (e) {
      say('', (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const kb = (storageBytes() / 1024).toFixed(1);

  return (
    <div className="data-page">
      <div className="crumbs">
        <a href={href.home}>topics</a>
        <span aria-hidden="true">/</span>
        <span>your data</span>
      </div>
      <h2>Your data</h2>
      <p className="lede">
        Everything lives in this browser. Nothing is uploaded, and there is no account.
      </p>

      <section className="card" aria-labelledby="prog-h">
        <h3 id="prog-h">Progress</h3>
        <ul className="bars">
          {CATEGORIES.map((c) => {
            const list = PROBLEMS.filter((p) => p.category === c.id);
            const d = list.filter((p) => done[p.id]).length;
            const pct = list.length ? Math.round((d / list.length) * 100) : 0;
            return (
              <li key={c.id}>
                <a href={href.category(c.id)}>{c.label}</a>
                <span
                  className="meter wide"
                  role="img"
                  aria-label={`${d} of ${list.length} done`}
                  style={{ ['--pct' as string]: `${pct}%` }}
                />
                <span className="mono small">
                  {d}/{list.length}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="muted small">
          {Object.keys(done).length} done · {Object.keys(mine).length} generated · {kb} KB stored
        </p>
      </section>

      <section className="card" aria-labelledby="bk-h">
        <h3 id="bk-h">Backup</h3>
        <p className="muted">
          One JSON file with your done marks, review schedule and generated problems. API keys are
          never included.
        </p>
        <div className="row">
          <button
            onClick={() =>
              download(
                `veyra-backup-${new Date().toISOString().slice(0, 10)}.json`,
                JSON.stringify(exportBackup(), null, 2),
                'application/json',
              )
            }
          >
            <IconDownload /> Export backup
          </button>
          <button onClick={() => file.current?.click()}>Import backup…</button>
          <input
            ref={file}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => onImport(e.target.files?.[0])}
            aria-label="Backup file"
          />
        </div>
      </section>

      <section className="card" aria-labelledby="anki-h">
        <h3 id="anki-h">Anki</h3>
        <p className="muted">
          Two cards per problem: recall the pattern, and write the optimized solution.{' '}
          <a href={href.anki}>Setup guide</a>
        </p>
        <div className="row">
          <button
            onClick={() => download('veyra-anki.txt', toAnkiTsv(all), 'text/tab-separated-values')}
          >
            <IconDownload /> Download all cards (.txt)
          </button>
        </div>
        <div className="row">
          <label className="inline">
            Deck
            <input value={deck} onChange={(e) => setDeck(e.target.value)} />
          </label>
          <button onClick={push} disabled={busy}>
            {busy ? 'Sending…' : 'Send to Anki'}
          </button>
        </div>
      </section>

      <section className="card danger" aria-labelledby="er-h">
        <h3 id="er-h">Erase</h3>
        <div className="row">
          <button
            onClick={() => {
              if (confirm('Erase ALL Veyra data in this browser? This cannot be undone.')) {
                eraseAll();
                clearAiKey();
                reload();
                say('Everything was erased.');
              }
            }}
          >
            Erase everything
          </button>
        </div>
      </section>

      <div aria-live="polite">
        {msg && <p className="notice">{msg}</p>}
        {err && (
          <p role="alert" className="error">
            {err}
          </p>
        )}
      </div>
    </div>
  );
}
