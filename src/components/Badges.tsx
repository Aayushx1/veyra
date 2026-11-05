/**
 * Green scales well, amber is middling, red grows fast. Products of unrelated sizes (n·m) are
 * amber; a grid's R·C is linear in its cell count, so it is green.
 */
export function complexityTone(c: string): 'good' | 'mid' | 'bad' {
  const body = c.replace(/^O\(|\)$/g, '');
  if (/[²³ⁿ]|\^/.test(body)) return 'bad';
  if (/^log/i.test(body) || /α/.test(body)) return 'good';
  if (/log/i.test(body)) return 'mid';
  if (/^[RC]\s*[·*]\s*[RC]$/i.test(body)) return 'good';
  if (/[·*]/.test(body)) return 'mid';
  return 'good';
}

export function Complexity({ c }: { c: string }) {
  return <span className={`cx cx-${complexityTone(c)}`}>{c}</span>;
}

export function Difficulty({ d }: { d: 'Easy' | 'Medium' | 'Hard' }) {
  return <span className={`diffbadge d-${d.toLowerCase()}`}>{d}</span>;
}
