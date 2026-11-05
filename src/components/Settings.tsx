import { useEffect, useRef, useState } from 'react';
import {
  PROVIDERS,
  aiReady,
  clearAiKey,
  listModels,
  loadAi,
  saveAi,
  type AiConfig,
} from '../lib/ai';

/** Provider, endpoint, model and key. The key lives in sessionStorage unless the user opts in. */
export function SettingsForm({ onSaved }: { onSaved?: (c: AiConfig) => void }) {
  const [cfg, setCfg] = useState(() => loadAi());
  const [models, setModels] = useState<string[]>([]);
  const [msg, setMsg] = useState('');
  const prov = PROVIDERS.find((p) => p.id === cfg.provider) ?? PROVIDERS[0];

  const pick = (id: string) => {
    const p = PROVIDERS.find((x) => x.id === id)!;
    setCfg({ ...cfg, provider: id, base: p.base, model: p.model });
    setModels([]);
    setMsg('');
  };

  const save = () => {
    saveAi(cfg, cfg.remember);
    setMsg(aiReady(cfg) ? 'Saved.' : 'Saved, but a key is still needed for this provider.');
    onSaved?.(cfg);
  };

  const fetchModels = async () => {
    setMsg('Loading models…');
    try {
      const list = await listModels(cfg);
      setModels(list);
      setMsg(`${list.length} models found.`);
    } catch (e) {
      setMsg((e as Error).message);
    }
  };

  return (
    <form
      className="settings"
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      <label>
        Provider
        <select value={cfg.provider} onChange={(e) => pick(e.target.value)}>
          {PROVIDERS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
      <p className="muted small">
        {prov.note}{' '}
        {prov.keyUrl && (
          <a href={prov.keyUrl} target="_blank" rel="noopener noreferrer">
            Get a key ↗
          </a>
        )}
      </p>
      <label>
        Endpoint
        <input
          value={cfg.base}
          onChange={(e) => setCfg({ ...cfg, base: e.target.value })}
          spellCheck={false}
        />
      </label>
      <label>
        Model
        <input
          value={cfg.model}
          onChange={(e) => setCfg({ ...cfg, model: e.target.value })}
          list="veyra-models"
          spellCheck={false}
        />
        <datalist id="veyra-models">
          {models.map((m) => (
            <option key={m} value={m} />
          ))}
        </datalist>
      </label>
      <label>
        API key {prov.keyOptional && <span className="muted">(optional)</span>}
        <input
          type="password"
          value={cfg.key}
          onChange={(e) => setCfg({ ...cfg, key: e.target.value })}
          autoComplete="off"
          spellCheck={false}
          placeholder={prov.keyOptional ? 'not needed for most local servers' : 'paste your key'}
        />
      </label>
      <label className="check">
        <input
          type="checkbox"
          checked={cfg.remember}
          onChange={(e) => setCfg({ ...cfg, remember: e.target.checked })}
        />
        Remember the key on this device (otherwise it is forgotten when you close the tab)
      </label>
      <p className="muted small">
        Your key is sent only to the endpoint above, directly from your browser. Veyra has no server
        and never includes keys in backups or share links.
      </p>
      <div className="row">
        <button type="submit" className="primary">
          Save
        </button>
        <button type="button" onClick={fetchModels}>
          List models
        </button>
        <button
          type="button"
          onClick={() => {
            clearAiKey();
            setCfg({ ...cfg, key: '' });
            setMsg('Key removed from this browser.');
          }}
        >
          Forget key
        </button>
      </div>
      {msg && (
        <p role="status" className="muted small">
          {msg}
        </p>
      )}
    </form>
  );
}

export function SettingsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby="settings-h"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="modal-body">
        <div className="modal-head">
          <h2 id="settings-h">AI settings</h2>
          <button onClick={onClose} aria-label="Close settings">
            ✕
          </button>
        </div>
        <p className="muted small">
          Only used to generate pages for problems outside the library. Everything else works
          offline.
        </p>
        {open && <SettingsForm />}
      </div>
    </dialog>
  );
}
