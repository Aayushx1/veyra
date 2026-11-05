export type CategoryId =
  | 'arrays'
  | 'strings'
  | 'two-pointers'
  | 'sliding-window'
  | 'stack-queue'
  | 'binary-search'
  | 'linked-list'
  | 'trees'
  | 'graphs'
  | 'dp'
  | 'heap-greedy'
  | 'backtracking'
  | 'math-bits';

export interface Category {
  id: CategoryId;
  label: string;
  blurb: string;
  /** Short mono glyph shown on category cards. */
  glyph: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'arrays',
    label: 'Arrays & Hashing',
    blurb: 'Counting, lookups, prefix sums, in-place tricks.',
    glyph: '[ ]',
  },
  {
    id: 'strings',
    label: 'Strings',
    blurb: 'Parsing, matching, frequency and palindromes.',
    glyph: '" "',
  },
  {
    id: 'two-pointers',
    label: 'Two Pointers',
    blurb: 'Converging and fast/slow pointer patterns.',
    glyph: '<->',
  },
  {
    id: 'sliding-window',
    label: 'Sliding Window',
    blurb: 'Fixed and variable windows over sequences.',
    glyph: '[=>',
  },
  {
    id: 'stack-queue',
    label: 'Stack & Queue',
    blurb: 'LIFO/FIFO, monotonic stacks, parsing.',
    glyph: '|_|',
  },
  {
    id: 'binary-search',
    label: 'Binary Search',
    blurb: 'Halving on sorted data and on answers.',
    glyph: '/2',
  },
  {
    id: 'linked-list',
    label: 'Linked Lists',
    blurb: 'Pointer rewiring, cycles, merging.',
    glyph: 'o->o',
  },
  { id: 'trees', label: 'Trees', blurb: 'Traversals, recursion, BSTs.', glyph: '/ \\' },
  {
    id: 'graphs',
    label: 'Graphs',
    blurb: 'BFS, DFS, grids, topological order, union-find.',
    glyph: 'o-o',
  },
  {
    id: 'dp',
    label: 'Dynamic Programming',
    blurb: 'Overlapping subproblems and tabulation.',
    glyph: 'dp',
  },
  {
    id: 'heap-greedy',
    label: 'Heap, Greedy & Intervals',
    blurb: 'Priority queues, local choices, merging ranges.',
    glyph: 'top',
  },
  {
    id: 'backtracking',
    label: 'Backtracking',
    blurb: 'Search with choose, explore, undo.',
    glyph: '{}',
  },
  {
    id: 'math-bits',
    label: 'Math & Bits',
    blurb: 'Number theory, simulation, bit manipulation.',
    glyph: '0x',
  },
];

export interface Solution {
  label: string;
  /** Time complexity, plain text such as "O(n log n)". */
  complexity: string;
  code: string;
}

export interface Scale {
  sizes: number[];
  make: (n: number) => string;
}

export interface Problem {
  id: string;
  category: CategoryId;
  /** LeetCode slug (for the outbound link and for matching pasted URLs). */
  lc?: string;
  /** LeetCode problem number. */
  n?: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags?: string[];
  pattern: string;
  summary: string;
  /** One-line memory hook shown in review. */
  hook: string;
  /** Where this idea shows up in real systems (one sentence). */
  real?: string;
  /** JSON array of arguments for the default demo input. */
  input: string;
  /** Expected `show()` text of the result for the default input. */
  expected: string;
  /** Extra inputs with expected output, used by tests. */
  cases: { input: string; expected: string }[];
  /** [simple/brute-force, optimized]. */
  solutions: [Solution, Solution];
  /** Optional input generator for the compare chart. */
  scale?: Scale;
}
