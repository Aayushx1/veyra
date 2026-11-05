import type { Problem } from '../problems/types';
import { toAnkiTsv } from './anki';

/* AnkiConnect (desktop Anki add-on 2055492159) listens on localhost. */
const ANKI_URL = 'http://127.0.0.1:8765';

interface Note {
  deckName: string;
  modelName: string;
  fields: { Front: string; Back: string };
  tags: string[];
  options: { allowDuplicate: boolean };
}

async function invoke<T>(action: string, params: unknown, f: typeof fetch): Promise<T> {
  const res = await f(ANKI_URL, {
    method: 'POST',
    body: JSON.stringify({ action, version: 6, params }),
  });
  const j = (await res.json()) as { result: T; error: string | null };
  if (j.error) throw new Error(j.error);
  return j.result;
}

/** Same cards as the TSV export, shaped for AnkiConnect. */
export function toAnkiNotes(problems: Problem[], deck: string): Note[] {
  return toAnkiTsv(problems)
    .trim()
    .split('\n')
    .slice(3)
    .map((row) => {
      const [front, back, tags] = row.split('\t');
      return {
        deckName: deck,
        modelName: 'Basic',
        fields: { Front: front, Back: back },
        tags: tags.split(' ').filter(Boolean),
        options: { allowDuplicate: false },
      };
    });
}

/** Push cards to a running desktop Anki. Throws a readable error if it is unreachable. */
export async function pushToAnki(
  problems: Problem[],
  deck = 'Veyra',
  f: typeof fetch = fetch,
): Promise<{ added: number; skipped: number }> {
  try {
    await invoke('createDeck', { deck }, f);
  } catch (e) {
    throw new Error(
      'Could not reach Anki. Keep desktop Anki open with the AnkiConnect add-on, and allow this site in its webCorsOriginList.',
      { cause: e },
    );
  }
  const notes = toAnkiNotes(problems, deck);
  const ids = await invoke<(number | null)[]>('addNotes', { notes }, f);
  const added = ids.filter((x) => x != null).length;
  return { added, skipped: notes.length - added };
}
