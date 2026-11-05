import { useState } from 'react';
import { aiReady, generateProblem, loadAi } from '../lib/ai';
import { leetcodeUrl, titleFromSlug } from '../lib/leetcode';
import { href } from '../lib/router';
import { useApp } from '../state';
import { SettingsForm } from './Settings';

/** Build a verified practice page for a LeetCode problem that is not in the library. */
export function Generate({ slug }: { slug: string }) {
  const { addMine, find } = useApp();
  const [ready, setReady] = useState(() => aiReady(loadAi()));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const existing = find(slug);

  const run = async () => {
    setBusy(true);
    setError('');
    try {
      const p = await generateProblem(loadAi(), slug);
      addMine(p);
      location.hash = href.problem(p.id).slice(1);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="generate">
      <div className="crumbs">
        <a href={href.home}>topics</a>
        <span aria-hidden="true">/</span>
        <span>new problem</span>
      </div>
      <h2>{titleFromSlug(slug)}</h2>
      <p className="lede">
        This problem is not in the built-in library yet.{' '}
        <a href={leetcodeUrl(slug)} target="_blank" rel="noopener noreferrer">
          Open it on LeetCode ↗
        </a>
      </p>

      {existing ? (
        <p className="card">
          You already have a page for this. <a href={href.problem(existing.id)}>Open it →</a>
        </p>
      ) : (
        <>
          <div className="card">
            <h3>Generate a page with your own AI key</h3>
            <p>
              Veyra asks a model for a simple and an optimized solution, then <b>runs both</b> on
              several inputs. The page is only kept if they run without errors and agree on every
              input, so what you see has been checked. It is still worth reading the code before
              trusting it. Only the problem name is sent to the provider.
            </p>
            <div className="row">
              <button className="primary" onClick={run} disabled={busy || !ready}>
                {busy ? 'Generating and verifying…' : 'Generate page'}
              </button>
              {!ready && <span className="muted small">Add a provider and key below first.</span>}
            </div>
            {busy && (
              <p className="muted loading" role="status">
                <span className="spinner" /> This can take up to a minute.
              </p>
            )}
            {error && (
              <p role="alert" className="error">
                {error}
              </p>
            )}
          </div>
          <div className="card">
            <h3>Provider</h3>
            <SettingsForm onSaved={(c) => setReady(aiReady(c))} />
          </div>
        </>
      )}
    </div>
  );
}
