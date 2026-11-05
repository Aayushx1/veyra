/** JSON-safe snapshot of a runtime value. */
export type V =
  | number
  | string
  | boolean
  | null
  | { t: 'undef' }
  | { t: 'special'; s: string } // NaN, Infinity, bigint, symbol, function
  | { t: 'arr'; items: V[]; more: number }
  | { t: 'set'; items: V[]; more: number }
  | { t: 'map'; entries: [V, V][]; more: number }
  | { t: 'obj'; entries: [string, V][]; more: number }
  | { t: 'ref' }
  | { t: 'deep' };

export interface Step {
  /** 1-based source line about to execute. */
  line: number;
  /** Variables visible at that line. */
  vars: Record<string, V>;
  /** Number of statements executed so far (including this one). */
  ops: number;
}

export interface TraceError {
  message: string;
  line?: number;
}

export interface TraceResult {
  steps: Step[];
  /** Total statements executed (may exceed steps.length when recording was capped). */
  ops: number;
  result?: V;
  error?: TraceError;
  /** True if recording stopped early because of a limit. */
  truncated: boolean;
  durationMs: number;
}

export interface TraceRequest {
  code: string;
  /** JSON array of arguments, e.g. `[[1,2,3], 4]`. */
  args: string;
  /** Function to call. Defaults to the last top-level function declaration. */
  entry?: string;
  maxRecorded?: number;
  maxOps?: number;
}

export const DEFAULT_MAX_RECORDED = 2000;
export const DEFAULT_MAX_OPS = 2_000_000;
