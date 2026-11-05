export type TokenType = 'comment' | 'string' | 'number' | 'keyword' | 'call' | 'plain';
export interface Token {
  type: TokenType;
  text: string;
}

const KEYWORDS =
  'function|return|if|else|for|while|do|const|let|var|new|of|in|break|continue|switch|case|default|try|catch|finally|throw|true|false|null|undefined|class|typeof|async|await';

const RE = new RegExp(
  [
    String.raw`(\/\/[^\n]*|\/\*[\s\S]*?\*\/)`,
    String.raw`("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|` + '`(?:\\\\.|[^`\\\\])*`)',
    String.raw`(\b\d+(?:\.\d+)?\b)`,
    String.raw`(\b(?:${KEYWORDS})\b)`,
    String.raw`(\b[A-Za-z_$][\w$]*(?=\())`,
  ].join('|'),
  'g',
);
const TYPES: TokenType[] = ['comment', 'string', 'number', 'keyword', 'call'];

/** Tiny JavaScript tokenizer for display only. Never executes or evals anything. */
export function highlight(source: string): Token[][] {
  const tokens: Token[] = [];
  let last = 0;
  for (const m of source.matchAll(RE)) {
    const at = m.index ?? 0;
    if (at > last) tokens.push({ type: 'plain', text: source.slice(last, at) });
    const group = m.findIndex((g, i) => i > 0 && g !== undefined) - 1;
    tokens.push({ type: TYPES[group], text: m[0] });
    last = at + m[0].length;
  }
  if (last < source.length) tokens.push({ type: 'plain', text: source.slice(last) });

  // Split tokens on newlines so each source line renders independently.
  const lines: Token[][] = [[]];
  for (const t of tokens) {
    t.text.split('\n').forEach((part, i) => {
      if (i > 0) lines.push([]);
      if (part) lines[lines.length - 1].push({ type: t.type, text: part });
    });
  }
  return lines;
}
