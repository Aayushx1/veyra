interface Props {
  index: number;
  total: number;
  playing: boolean;
  speed: number;
  onIndex: (i: number) => void;
  onPlaying: (p: boolean) => void;
  onSpeed: (s: number) => void;
}

export function Stepper({ index, total, playing, speed, onIndex, onPlaying, onSpeed }: Props) {
  const last = Math.max(0, total - 1);
  const disabled = total === 0;
  return (
    <div className="stepper" role="group" aria-label="Playback controls">
      <button onClick={() => onIndex(0)} disabled={disabled || index === 0} aria-label="First step">
        ⏮
      </button>
      <button
        onClick={() => onIndex(index - 1)}
        disabled={disabled || index === 0}
        aria-label="Previous step"
      >
        ◀
      </button>
      <button
        className="primary"
        onClick={() => onPlaying(!playing)}
        disabled={disabled || index >= last}
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {playing ? '⏸' : '▶'}
      </button>
      <button
        onClick={() => onIndex(index + 1)}
        disabled={disabled || index >= last}
        aria-label="Next step"
      >
        ▶|
      </button>
      <button
        onClick={() => onIndex(last)}
        disabled={disabled || index >= last}
        aria-label="Last step"
      >
        ⏭
      </button>
      <input
        type="range"
        min={0}
        max={last}
        value={Math.min(index, last)}
        onChange={(e) => onIndex(Number(e.target.value))}
        disabled={disabled}
        aria-label="Scrub through steps"
      />
      <span className="count" aria-live="polite">
        {disabled ? '0 / 0' : `${index + 1} / ${total}`}
      </span>
      <label className="speed">
        Speed
        <select value={speed} onChange={(e) => onSpeed(Number(e.target.value))}>
          <option value={1200}>0.5×</option>
          <option value={600}>1×</option>
          <option value={250}>2×</option>
          <option value={100}>5×</option>
        </select>
      </label>
    </div>
  );
}
