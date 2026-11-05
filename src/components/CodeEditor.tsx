import { useRef, useState } from 'react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  /** 1-based line currently executing in the trace. */
  activeLine?: number;
  errorLine?: number;
}

const LINE_PX = 22;

/** A plain textarea with a line gutter and an execution-line highlight; no editor dependency. */
export function CodeEditor({ value, onChange, activeLine, errorLine }: Props) {
  const [scroll, setScroll] = useState(0);
  const ref = useRef<HTMLTextAreaElement>(null);
  const lines = value.split('\n').length;

  return (
    <div className="editor">
      <div className="gutter" aria-hidden="true">
        <div style={{ transform: `translateY(${-scroll}px)` }}>
          {Array.from({ length: lines }, (_, i) => (
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
            style={{ top: (activeLine - 1) * LINE_PX + 8 - scroll }}
          />
        ) : null}
        {errorLine ? (
          <div
            className="hl err"
            aria-hidden="true"
            style={{ top: (errorLine - 1) * LINE_PX + 8 - scroll }}
          />
        ) : null}
        <textarea
          ref={ref}
          aria-label="Code editor"
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={(e) => setScroll(e.currentTarget.scrollTop)}
          onKeyDown={(e) => {
            if (e.key === 'Tab' && !e.shiftKey) {
              // Keep Tab useful for indenting; Escape then Tab leaves the editor.
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
  );
}
