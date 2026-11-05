import { describe, expect, it } from 'vitest';
import { leetcodeUrl, parseProblemSlug, titleFromSlug } from '../src/lib/leetcode';
import { lineDiff } from '../src/lib/diff';
import { parseRoute } from '../src/lib/router';
import {
  KEYS,
  eraseAll,
  exportBackup,
  importBackup,
  loadDone,
  saveDone,
  saveMine,
} from '../src/lib/store';
import {
  buildPrompt,
  extractJson,
  generateProblem,
  verifyGenerated,
  type AiConfig,
} from '../src/lib/ai';
import { pushToAnki, toAnkiNotes } from '../src/lib/ankiConnect';
import { core } from '../src/problems/data/core';

class MemStore {
  m = new Map<string, string>();
  getItem(k: string) {
    return this.m.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    this.m.set(k, v);
  }
  removeItem(k: string) {
    this.m.delete(k);
  }
}

describe('leetcode links', () => {
  it('extracts slugs from urls and bare slugs', () => {
    expect(parseProblemSlug('https://leetcode.com/problems/two-sum/')).toBe('two-sum');
    expect(parseProblemSlug('leetcode.com/problems/two-sum/description/?envType=x#a')).toBe(
      'two-sum',
    );
    expect(parseProblemSlug('https://leetcode.com/problems/Two-Sum')).toBe('two-sum');
    expect(parseProblemSlug('https://leetcode.cn/problems/3sum/')).toBe('3sum');
    expect(parseProblemSlug('  climbing-stairs ')).toBe('climbing-stairs');
    expect(parseProblemSlug('problems/climbing-stairs')).toBe('climbing-stairs');
  });
  it('rejects junk', () => {
    expect(parseProblemSlug('')).toBeNull();
    expect(parseProblemSlug('hello world')).toBeNull();
    expect(parseProblemSlug('https://example.com/x')).toBeNull();
    expect(parseProblemSlug('<script>alert(1)</script>')).toBeNull();
  });
  it('formats titles and urls', () => {
    expect(titleFromSlug('two-sum')).toBe('Two Sum');
    expect(leetcodeUrl('two-sum')).toBe('https://leetcode.com/problems/two-sum/');
  });
});

describe('lineDiff', () => {
  it('marks added, removed and unchanged lines', () => {
    const d = lineDiff('a\nb\nc', 'a\nx\nc\nd');
    expect(d.map((o) => o.type + ':' + o.text)).toEqual([
      'same:a',
      'del:b',
      'add:x',
      'same:c',
      'add:d',
    ]);
  });
  it('handles identical input', () => {
    expect(lineDiff('a', 'a')).toEqual([{ type: 'same', text: 'a' }]);
  });
});

describe('router', () => {
  it('parses routes and falls back to home', () => {
    expect(parseRoute('')).toEqual({ name: 'home' });
    expect(parseRoute('#/c/arrays')).toEqual({ name: 'category', id: 'arrays' });
    expect(parseRoute('#/p/two-sum')).toEqual({ name: 'problem', id: 'two-sum' });
    expect(parseRoute('#/gen/abc')).toEqual({ name: 'generate', slug: 'abc' });
    expect(parseRoute('#/s=TOKEN')).toEqual({ name: 'shared', token: 'TOKEN' });
    expect(parseRoute('#/data')).toEqual({ name: 'data' });
    expect(parseRoute('#/nope')).toEqual({ name: 'home' });
    expect(parseRoute('#/c/')).toEqual({ name: 'home' });
  });
});

describe('backup', () => {
  it('round-trips progress and never includes ai keys', () => {
    const a = new MemStore();
    saveDone({ 'two-sum': 123 }, a);
    a.setItem(KEYS.ai, JSON.stringify({ provider: 'groq' }));
    a.setItem('veyra:ai-key', 'sk-secret');
    const text = JSON.stringify(exportBackup(a));
    expect(text).not.toContain('sk-secret');
    expect(text).not.toContain('groq');
    const b = new MemStore();
    expect(importBackup(text, b)).toEqual({ done: 1, cards: 0, mine: 0 });
    expect(loadDone(b)).toEqual({ 'two-sum': 123 });
  });
  it('rejects bad files and filters bad entries', () => {
    const s = new MemStore();
    expect(() => importBackup('nope', s)).toThrow(/valid JSON/);
    expect(() => importBackup('{"app":"other"}', s)).toThrow(/Veyra backup/);
    const r = importBackup(
      JSON.stringify({
        app: 'veyra',
        version: 1,
        done: { a: 1, b: 'x' },
        srs: { c: { ease: 2 } },
        mine: { z: { id: 'q' } },
      }),
      s,
    );
    expect(r).toEqual({ done: 1, cards: 0, mine: 0 });
  });
  it('erases everything', () => {
    const s = new MemStore();
    saveDone({ x: 1 }, s);
    saveMine({}, s);
    eraseAll(s);
    expect(s.m.size).toBe(0);
  });
});

const good = {
  title: 'Sum Two',
  difficulty: 'Easy',
  category: 'arrays',
  pattern: 'Hash map',
  summary: 'Find two numbers that add to a target.',
  hook: 'Remember what you have seen.',
  real: 'Join keys.',
  input: '[[2,7,11,15], 9]',
  cases: ['[[3,2,4], 6]', '[[1], 5]'],
  solutions: [
    {
      label: 'Brute force',
      complexity: 'O(n^2)',
      code: 'function f(a, t) { for (let i = 0; i < a.length; i++) { for (let j = i + 1; j < a.length; j++) { if (a[i] + a[j] === t) return [i, j]; } } return []; }',
    },
    {
      label: 'Hash map',
      complexity: 'O(n)',
      code: 'function f(a, t) { const m = new Map(); for (let i = 0; i < a.length; i++) { if (m.has(t - a[i])) return [m.get(t - a[i]), i]; m.set(a[i], i); } return []; }',
    },
  ],
};

const cfg: AiConfig = { provider: 'groq', base: 'https://x/v1', model: 'm', key: 'k' };

describe('ai generation', () => {
  it('extracts json from fenced and chatty replies', () => {
    expect(extractJson('Sure!\n```json\n{"a":1}\n```')).toEqual({ a: 1 });
    expect(extractJson('here {"a":2} done')).toEqual({ a: 2 });
    expect(() => extractJson('no json')).toThrow(/JSON/);
    expect(() => extractJson('{bad')).toThrow();
  });
  it('accepts a page whose solutions agree and computes expected outputs by running them', () => {
    const v = verifyGenerated(good, 'sum-two');
    expect(v.issues).toEqual([]);
    expect(v.problem?.expected).toBe('[0, 1]');
    expect(v.problem?.cases.map((c) => c.expected)).toEqual(['[1, 2]', '[]']);
    expect(v.problem?.generated).toBe(true);
  });
  it('rejects pages where the solutions disagree or crash', () => {
    const bad = structuredClone(good);
    bad.solutions[1].code = 'function f(a, t) { return [9, 9]; }';
    expect(verifyGenerated(bad, 'x').issues[0]).toMatch(/disagree/);
    const crash = structuredClone(good);
    crash.solutions[0].code = 'function f(a, t) { return a.nope.x; }';
    expect(verifyGenerated(crash, 'x').issues[0]).toMatch(/failed/);
    expect(verifyGenerated({}, 'x').issues.length).toBeGreaterThan(0);
  });
  it('retries once with feedback, then succeeds', async () => {
    const bad = structuredClone(good);
    bad.solutions[1].code = 'function f(a, t) { return [9, 9]; }';
    const replies = [JSON.stringify(bad), '```json\n' + JSON.stringify(good) + '\n```'];
    const prompts: string[] = [];
    const f = (async (_u: string, init: RequestInit) => {
      prompts.push(JSON.parse(init.body as string).messages[1].content);
      return new Response(JSON.stringify({ choices: [{ message: { content: replies.shift() } }] }));
    }) as unknown as typeof fetch;
    const p = await generateProblem(cfg, 'sum-two', f);
    expect(p.id).toBe('sum-two');
    expect(prompts[1]).toMatch(/previous attempt failed/);
    expect(buildPrompt('a-b')).toContain('"a-b"');
  });
  it('surfaces provider errors readably and gives up after two bad replies', async () => {
    const denied = (async () => new Response('nope', { status: 401 })) as unknown as typeof fetch;
    await expect(generateProblem(cfg, 'a', denied)).rejects.toThrow(/key was rejected/);
    const junk = (async () =>
      new Response(
        JSON.stringify({ choices: [{ message: { content: 'blah' } }] }),
      )) as unknown as typeof fetch;
    await expect(generateProblem(cfg, 'a', junk)).rejects.toThrow(/verified page/);
  });
});

describe('anki push', () => {
  it('builds notes and reports added vs skipped', async () => {
    expect(toAnkiNotes(core.slice(0, 2), 'D')).toHaveLength(4);
    const calls: string[] = [];
    const f = (async (_u: string, init: RequestInit) => {
      const b = JSON.parse(init.body as string);
      calls.push(b.action);
      return new Response(
        JSON.stringify({ result: b.action === 'addNotes' ? [1, null, 3, 4] : null, error: null }),
      );
    }) as unknown as typeof fetch;
    expect(await pushToAnki(core.slice(0, 2), 'D', f)).toEqual({ added: 3, skipped: 1 });
    expect(calls).toEqual(['createDeck', 'addNotes']);
    const down = (async () => {
      throw new TypeError('fail');
    }) as unknown as typeof fetch;
    await expect(pushToAnki(core, 'D', down)).rejects.toThrow(/Could not reach Anki/);
  });
});
