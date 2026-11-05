import type { Problem } from './types';
import { SCALES } from './scale';
import { core } from './data/core';
import { arrays } from './data/arrays';
import { strings } from './data/strings';
import { twoPointers } from './data/two-pointers';
import { slidingWindow } from './data/sliding-window';
import { stackQueue } from './data/stack-queue';
import { binarySearch } from './data/binary-search';
import { linkedList } from './data/linked-list';
import { trees } from './data/trees';
import { graphs } from './data/graphs';
import { dp } from './data/dp';
import { heapGreedy } from './data/heap-greedy';
import { backtracking } from './data/backtracking';
import { mathBits } from './data/math-bits';

export * from './types';

export const PROBLEMS: Problem[] = [
  ...core,
  ...arrays,
  ...strings,
  ...twoPointers,
  ...slidingWindow,
  ...stackQueue,
  ...binarySearch,
  ...linkedList,
  ...trees,
  ...graphs,
  ...dp,
  ...heapGreedy,
  ...backtracking,
  ...mathBits,
];

export const byId = (id: string) => PROBLEMS.find((p) => p.id === id);
export const byLcSlug = (slug: string) => PROBLEMS.find((p) => p.lc === slug);
export const scaleOf = (p: Problem) => p.scale ?? SCALES[p.id];
