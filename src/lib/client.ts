import type { TraceRequest, TraceResult } from '../core/types';

const TIMEOUT_MS = 4000;

/**
 * Run a trace in a fresh Web Worker. The worker is terminated on timeout, which is the only
 * reliable way to stop code such as `while(true){}` that never reaches an instrumented statement.
 */
export function traceInWorker(req: TraceRequest, timeoutMs = TIMEOUT_MS): Promise<TraceResult> {
  return new Promise((resolve) => {
    const started = performance.now();
    const worker = new Worker(new URL('../core/worker.ts', import.meta.url), { type: 'module' });
    const fail = (message: string): TraceResult => ({
      steps: [],
      ops: 0,
      truncated: false,
      durationMs: performance.now() - started,
      error: { message },
    });
    const done = (r: TraceResult) => {
      clearTimeout(timer);
      worker.terminate();
      resolve(r);
    };
    const timer = setTimeout(
      () => done(fail(`Timed out after ${timeoutMs / 1000}s. Is there an infinite loop?`)),
      timeoutMs,
    );
    worker.onmessage = (e: MessageEvent<TraceResult>) => done(e.data);
    worker.onerror = (e) => done(fail(e.message || 'The tracer crashed.'));
    worker.postMessage(req);
  });
}
