import { useMemo, useRef, useState } from 'react';
import { highlight } from '../lib/highlight';

interface Props {
  value: string;
  onChange: (v: string) => void;
  /** 1-based line currently executing in the trace. */
  activeLine?: number;
  errorLine?: number;
  /** Ghost annotation shown after a line, e.g. "sum = 12". */
  hint?: { line: number; text: string };
  filename?: string;
}

const LINE_PX = 22;
const PAD_Y = 10;
const PAD_X = 14;

/**
 * Syntax-highlighted editor without an editor dependency: a transparent textarea sits over a
 * highlighted, non-interactive rendering of the same text. Both use identical font metrics.
 */
export function CodeEditor({ value, onChange, activeLine, errorLine, hint, filename }: Props) {
  const [scroll, setScroll] = useState({ top: 0, left: 0 });
  const lines = useMemo(() => highlight(value), [value]);
  const src = value.split('\n');
  const escaped = useRef(false);

  return (
    <div className="editor-wrap">
      <div className="chrome" aria-hidden="true">
        <span className="dots">
          <i />
          <i />
          <i />
        </span>
        <span className="fname">{filename ?? 'scratch.js'}</span>
      </div>
      <div className="editor">
        <div className="gutter" aria-hidden="true">
          <div style={{ transform: `translateY(${-scroll.top}px)`, paddingTop: PAD_Y }}>
            {lines.map((_, i) => (
              <div key={i} className={i + 1 === activeLine ? 'gl active' : 'gl'}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>
        <div className="surface">
          {activeLine ? (
            <div
              className="hl"
              aria-hidden="true"
              style={{ top: (activeLine - 1) * LINE_PX + PAD_Y - scroll.top }}
            />
          ) : null}
          {errorLine ? (
            <div
              className="hl err"
              aria-hidden="true"
              style={{ top: (errorLine - 1) * LINE_PX + PAD_Y - scroll.top }}
            />
          ) : null}
          <pre
            className="code"
            aria-hidden="true"
            style={{ transform: `translate(${-scroll.left}px, ${-scroll.top}px)` }}
          >
            {lines.map((toks, i) => (
              <div key={i} className="cl">
                {toks.map((t, j) => (
                  <span key={j} className={`tk-${t.type}`}>
                    {t.text}
                  </span>
                ))}
                {'​'}
              </div>
            ))}
          </pre>
          {hint && hint.line <= src.length ? (
            <span
              className="ghost"
              aria-hidden="true"
              style={{
                top: (hint.line - 1) * LINE_PX + PAD_Y - scroll.top,
                left: `calc(${PAD_X}px + ${src[hint.line - 1].length + 3}ch - ${scroll.left}px)`,
              }}
            >
              <span>{hint.text}</span>
            </span>
          ) : null}
          <textarea
            aria-label="Code editor"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onScroll={(e) =>
              setScroll({ top: e.currentTarget.scrollTop, left: e.currentTarget.scrollLeft })
            }
            onKeyDown={(e) => {
              if (e.key === 'Escape') escaped.current = true;
              else if (e.key !== 'Tab') escaped.current = false;
              if (e.key === 'Tab' && !e.shiftKey && !escaped.current) {
                // Tab indents; press Escape first to move focus onward with the keyboard.
                e.preventDefault();
                const t = e.currentTarget;
                const { selectionStart: s, selectionEnd: en } = t;
                onChange(value.slice(0, s) + '  ' + value.slice(en));
                requestAnimationFrame(() => t.setSelectionRange(s + 2, s + 2));
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
