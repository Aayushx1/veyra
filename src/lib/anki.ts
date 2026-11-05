import type { Problem } from '../problems';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const cell = (s: string) => s.replace(/\t/g, ' ').replace(/\r?\n/g, '<br>');

/** Anki "Import file" format: tab separated, HTML enabled, tags in column 3. */
export function toAnkiTsv(problems: Problem[]): string {
  const rows = problems.flatMap((p) => {
    const tag =
      'veyra ' +
      p.pattern
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_|_$/g, '');
    const best = p.solutions[1];
    return [
      [
        `<b>${esc(p.title)}</b><br>${esc(p.summary)}<br><br>Which pattern fits, and why?`,
        `<b>${esc(p.pattern)}</b><br>${esc(p.hook)}`,
        tag,
      ],
      [
        `Write the <b>${esc(best.label)}</b> solution for <b>${esc(p.title)}</b> (${esc(best.complexity)}).`,
        `<pre style="text-align:left">${esc(best.code)}</pre>`,
        tag,
      ],
    ].map((r) => r.map(cell).join('\t'));
  });
  return `#separator:tab\n#html:true\n#tags column:3\n${rows.join('\n')}\n`;
}
