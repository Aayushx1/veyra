import { IconFirst, IconLast, IconNext, IconPause, IconPlay, IconPrev } from './icons';

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
  const atStart = disabled || index === 0;
  const atEnd = disabled || index >= last;
  const pct = last === 0 ? 0 : (Math.min(index, last) / last) * 100;

  return (
    <div className="stepper" role="group" aria-label="Playback controls">
      <div className="transport">
        <button
          className="icon"
          onClick={() => onIndex(0)}
          disabled={atStart}
          aria-label="First step"
        >
          <IconFirst />
        </button>
        <button
          className="icon"
          onClick={() => onIndex(index - 1)}
          disabled={atStart}
          aria-label="Previous step"
        >
          <IconPrev />
        </button>
        <button
          className="icon play"
          onClick={() => onPlaying(!playing)}
          disabled={atEnd}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <IconPause /> : <IconPlay />}
        </button>
        <button
          className="icon"
          onClick={() => onIndex(index + 1)}
          disabled={atEnd}
          aria-label="Next step"
        >
          <IconNext />
        </button>
        <button
          className="icon"
          onClick={() => onIndex(last)}
          disabled={atEnd}
          aria-label="Last step"
        >
          <IconLast />
        </button>
      </div>
      <input
        type="range"
        className="scrub"
        min={0}
        max={last}
        value={Math.min(index, last)}
        onChange={(e) => onIndex(Number(e.target.value))}
        disabled={disabled}
        aria-label="Scrub through steps"
        style={{ ['--p' as string]: `${pct}%` }}
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
