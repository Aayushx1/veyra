import { runTrace } from '../core/run';
import { show } from '../core/serialize';
import { CATEGORIES, type CategoryId, type Problem } from '../problems/types';
import { titleFromSlug } from './leetcode';
import { KEYS, readJSON, writeJSON } from './store';

/* ---------- provider settings ---------- */

export interface Provider {
  id: string;
  name: string;
  base: string;
  model: string;
  keyUrl?: string;
  note: string;
  anthropic?: boolean;
  keyOptional?: boolean;
}

export const PROVIDERS: Provider[] = [
  {
    id: 'groq',
    name: 'Groq',
    base: 'https://api.groq.com/openai/v1',
    model: 'llama-3.3-70b-versatile',
    keyUrl: 'https://console.groq.com/keys',
    note: 'Fast, has a free tier.',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    base: 'https://generativelanguage.googleapis.com/v1beta/openai',
    model: 'gemini-2.5-flash',
    keyUrl: 'https://aistudio.google.com/apikey',
    note: 'Free tier, large context.',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    base: 'https://openrouter.ai/api/v1',
    model: 'meta-llama/llama-3.3-70b-instruct:free',
    keyUrl: 'https://openrouter.ai/keys',
    note: 'One key, many models, some free.',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    base: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
    keyUrl: 'https://platform.openai.com/api-keys',
    note: 'Paid.',
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    base: 'https://api.anthropic.com/v1',
    model: 'claude-haiku-5-5',
    keyUrl: 'https://console.anthropic.com/settings/keys',
    note: 'Paid. Calls go straight from your browser.',
    anthropic: true,
  },
  {
    id: 'custom',
    name: 'Custom / local',
    base: 'http://localhost:11434/v1',
    model: 'llama3.1',
    note: 'Ollama, LM Studio or any OpenAI-compatible endpoint. Needs CORS enabled.',
    keyOptional: true,
  },
];

export interface AiConfig {
  provider: string;
  base: string;
  model: string;
  key: string;
}

interface SavedAi {
  provider: string;
  base: string;
  model: string;
  remember: boolean;
}

const SESSION_KEY = 'veyra:ai-key';

/** Settings persist in localStorage; the key stays in sessionStorage unless the user opts in. */
export function loadAi(): AiConfig & { remember: boolean } {
  const saved = readJSON<Partial<SavedAi>>(KEYS.ai, {});
  const prov = PROVIDERS.find((p) => p.id === saved.provider) ?? PROVIDERS[0];
  let key = '';
  try {
    key =
      sessionStorage.getItem(SESSION_KEY) ??
      (saved.remember ? (localStorage.getItem(SESSION_KEY) ?? '') : '');
  } catch {
    /* storage unavailable */
  }
  return {
    provider: prov.id,
    base: typeof saved.base === 'string' && saved.base ? saved.base : prov.base,
    model: typeof saved.model === 'string' && saved.model ? saved.model : prov.model,
    key,
    remember: !!saved.remember,
  };
}

export function saveAi(cfg: AiConfig, remember: boolean): void {
  writeJSON(KEYS.ai, {
    provider: cfg.provider,
    base: cfg.base,
    model: cfg.model,
    remember,
  } satisfies SavedAi);
  try {
    sessionStorage.setItem(SESSION_KEY, cfg.key);
    if (remember) localStorage.setItem(SESSION_KEY, cfg.key);
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

export function clearAiKey(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

export const aiReady = (c: AiConfig) =>
  !!c.base && !!c.model && (!!c.key || !!PROVIDERS.find((p) => p.id === c.provider)?.keyOptional);

/* ---------- prompt, parsing and verification ---------- */

const SYSTEM = `You write interview-practice material as strict JSON. Reply with ONE JSON object and nothing else.`;

export function buildPrompt(slug: string, feedback?: string[]): string {
  const cats = CATEGORIES.map((c) => c.id).join(', ');
  return `Write a practice page for the LeetCode problem with slug "${slug}" (${titleFromSlug(slug)}).
Use your own words; do not quote the problem statement.

Return JSON with exactly these fields:
{
  "title": string,
  "difficulty": "Easy" | "Medium" | "Hard",
  "category": one of: ${cats},
  "pattern": short pattern name,
  "summary": one or two sentences describing the task,
  "hook": one-line memory trick,
  "real": one sentence on where this idea appears in real systems,
  "input": a JSON array of arguments (as a string) for a SMALL demo, e.g. "[[2,7,11,15], 9]",
  "cases": array of 3 more input strings in the same format, including an edge case,
  "solutions": [
    { "label": "Brute force", "complexity": "O(n^2)", "code": "..." },
    { "label": "Optimized",   "complexity": "O(n)",   "code": "..." }
  ]
}

Code rules (they are executed and checked):
- Plain JavaScript, function declarations, helpers declared BEFORE the main function; the LAST top-level function is called with the parsed input arguments and must RETURN the answer.
- Both solutions must return identical results for the demo input and every case. Returned values must be numbers, booleans, strings, null, or arrays/objects of those (no floats if avoidable). If several answers are valid, return a canonical (sorted) one.
- No imports, no console output, no randomness, no time. Keep the demo input tiny.
- The first solution is the simple/brute-force approach, the second is the optimized one.${
    feedback?.length
      ? `\n\nYour previous attempt failed these checks, fix them:\n- ${feedback.join('\n- ')}`
      : ''
  }`;
}

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/** Extract the JSON object from a model reply, tolerating code fences and chatter. */
export function extractJson(text: string): unknown {
  const fenced = /```(?:json)?\s*([\s\S]*?)```/.exec(text);
  const body = fenced ? fenced[1] : text;
  const start = body.indexOf('{');
  const end = body.lastIndexOf('}');
  if (start < 0 || end <= start) throw new Error('The model did not return a JSON object.');
  try {
    return JSON.parse(body.slice(start, end + 1));
  } catch {
    throw new Error('The model returned malformed JSON.');
  }
}

export interface Verified {
  problem?: Problem;
  issues: string[];
}

/** Turn a model reply into a Problem, but only if both solutions run and agree on every input. */
export function verifyGenerated(raw: unknown, slug: string): Verified {
  const issues: string[] = [];
  if (typeof raw !== 'object' || raw === null) return { issues: ['Reply was not an object.'] };
  const r = raw as Record<string, unknown>;
  const sols = Array.isArray(r.solutions) ? r.solutions : [];
  if (sols.length < 2) return { issues: ['Need two solutions.'] };

  const solutions = sols.slice(0, 2).map((s) => {
    const o = (s ?? {}) as Record<string, unknown>;
    return {
      label: str(o.label, 40) || 'Solution',
      complexity: /^O\(.+\)$/.test(str(o.complexity, 30)) ? str(o.complexity, 30) : 'O(?)',
      code: str(o.code, 8000),
    };
  }) as Problem['solutions'];
  if (solutions.some((s) => s.code.length < 20)) return { issues: ['A solution had no code.'] };

  const inputs = [r.input, ...(Array.isArray(r.cases) ? r.cases.slice(0, 5) : [])].filter(
    (x): x is string => typeof x === 'string',
  );
  if (inputs.length < 2) return { issues: ['Need a demo input and at least one extra case.'] };

  const outputs: string[] = [];
  for (const input of inputs) {
    const results = solutions.map((s) => runTrace({ code: s.code, args: input, maxRecorded: 1 }));
    const bad = results.findIndex((x) => x.error);
    if (bad >= 0) {
      issues.push(`Solution ${bad + 1} failed on ${input}: ${results[bad].error!.message}`);
      continue;
    }
    if (results.some((x) => x.ops > 200_000)) {
      issues.push(`Input ${input} is too large to trace; use a smaller one.`);
      continue;
    }
    const [a, b] = results.map((x) => show(x.result!));
    if (a !== b) issues.push(`The solutions disagree on ${input}: ${a} vs ${b}`);
    else outputs.push(a);
  }
  if (issues.length) return { issues };

  const catId = CATEGORIES.some((c) => c.id === r.category) ? (r.category as CategoryId) : 'arrays';
  const diff = ['Easy', 'Medium', 'Hard'].includes(r.difficulty as string)
    ? (r.difficulty as Problem['difficulty'])
    : 'Medium';
  const problem: Problem = {
    id: slug,
    lc: slug,
    category: catId,
    title: str(r.title, 80) || titleFromSlug(slug),
    difficulty: diff,
    pattern: str(r.pattern, 60) || 'Unclassified',
    summary: str(r.summary, 400) || 'Generated practice page.',
    hook: str(r.hook, 200) || 'Trace it to see the pattern.',
    real: str(r.real, 300) || undefined,
    input: inputs[0],
    expected: outputs[0],
    cases: inputs.slice(1).map((input, i) => ({ input, expected: outputs[i + 1] })),
    solutions,
    generated: true,
  };
  return { problem, issues: [] };
}

/* ---------- network ---------- */

type Fetcher = typeof fetch;

async function timed(f: Fetcher, url: string, init: RequestInit, ms: number): Promise<Response> {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), ms);
  try {
    return await f(url, { ...init, signal: ac.signal });
  } finally {
    clearTimeout(t);
  }
}

export async function chat(cfg: AiConfig, user: string, f: Fetcher = fetch): Promise<string> {
  const prov = PROVIDERS.find((p) => p.id === cfg.provider);
  const base = cfg.base.replace(/\/$/, '');
  let res: Response;
  try {
    res = prov?.anthropic
      ? await timed(
          f,
          `${base}/messages`,
          {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              'x-api-key': cfg.key,
              'anthropic-version': '2023-06-01',
              'anthropic-dangerous-direct-browser-access': 'true',
            },
            body: JSON.stringify({
              model: cfg.model,
              max_tokens: 4000,
              system: SYSTEM,
              messages: [{ role: 'user', content: user }],
            }),
          },
          120_000,
        )
      : await timed(
          f,
          `${base}/chat/completions`,
          {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              ...(cfg.key ? { authorization: `Bearer ${cfg.key}` } : {}),
            },
            body: JSON.stringify({
              model: cfg.model,
              temperature: 0.2,
              messages: [
                { role: 'system', content: SYSTEM },
                { role: 'user', content: user },
              ],
            }),
          },
          120_000,
        );
  } catch (e) {
    throw new Error(
      (e as Error).name === 'AbortError'
        ? 'The provider took longer than 2 minutes.'
        : `Could not reach ${base}. You may be offline, the URL may be wrong, or the provider may block calls from browsers (CORS).`,
      { cause: e },
    );
  }
  const body = await res.text();
  if (!res.ok) {
    const hint =
      res.status === 401 || res.status === 403
        ? 'The key was rejected. '
        : res.status === 429
          ? 'Rate limit reached; wait a minute or switch provider. '
          : '';
    throw new Error(`${res.status}: ${hint}${body.slice(0, 200)}`);
  }
  let j: {
    content?: { text?: string }[];
    choices?: { message?: { content?: string } }[];
  };
  try {
    j = JSON.parse(body);
  } catch {
    throw new Error('The provider returned something that is not JSON.');
  }
  return prov?.anthropic
    ? (j.content ?? []).map((c) => c.text ?? '').join('')
    : (j.choices?.[0]?.message?.content ?? '');
}

/** Ask the model, verify by running the code, and retry once with the failures as feedback. */
export async function generateProblem(
  cfg: AiConfig,
  slug: string,
  f: Fetcher = fetch,
): Promise<Problem> {
  let feedback: string[] | undefined;
  let last: string[] = [];
  for (let attempt = 0; attempt < 2; attempt++) {
    const reply = await chat(cfg, buildPrompt(slug, feedback), f);
    let verdict: Verified;
    try {
      verdict = verifyGenerated(extractJson(reply), slug);
    } catch (e) {
      verdict = { issues: [(e as Error).message] };
    }
    if (verdict.problem) return verdict.problem;
    last = feedback = verdict.issues;
  }
  throw new Error(`Could not produce a verified page. ${last.slice(0, 3).join(' ')}`);
}

/** Models listed by an OpenAI-compatible endpoint (best effort). */
export async function listModels(cfg: AiConfig, f: Fetcher = fetch): Promise<string[]> {
  const prov = PROVIDERS.find((p) => p.id === cfg.provider);
  if (prov?.anthropic) return ['claude-haiku-5-5', 'claude-sonnet-5-5', 'claude-opus-5-5'];
  const res = await timed(
    f,
    `${cfg.base.replace(/\/$/, '')}/models`,
    { headers: cfg.key ? { authorization: `Bearer ${cfg.key}` } : {} },
    15_000,
  );
  if (!res.ok) throw new Error(`${res.status}: could not list models.`);
  const j = (await res.json()) as { data?: { id?: string }[] };
  return (j.data ?? []).map((m) => m.id ?? '').filter(Boolean);
}
