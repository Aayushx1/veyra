export interface Shared {
  code: string;
  input: string;
}

const MAX_CODE = 20_000;
const MAX_INPUT = 5_000;

const toB64 = (s: string) => {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const fromB64 = (s: string) => {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
};

export const encodeShare = (s: Shared): string => toB64(JSON.stringify(s));

/** Returns null for anything malformed or oversized; never throws. */
export function decodeShare(token: string): Shared | null {
  try {
    const v = JSON.parse(fromB64(token)) as Partial<Shared> | null;
    if (v && typeof v.code === 'string' && typeof v.input === 'string') {
      if (v.code.length > MAX_CODE || v.input.length > MAX_INPUT) return null;
      return { code: v.code, input: v.input };
    }
  } catch {
    /* malformed token */
  }
  return null;
}
