import { runTrace } from './run';
import type { TraceRequest } from './types';

self.onmessage = (e: MessageEvent<TraceRequest>) => {
  self.postMessage(runTrace(e.data));
};
