import type { Problem } from '../types';

const arr = (n: number, f: (i: number) => number | string) =>
  Array.from({ length: n }, (_, i) => f(i));
const grid = (r: number, c: number, f: (i: number, j: number) => number | string) =>
  Array.from({ length: r }, (_, i) => Array.from({ length: c }, (_, j) => f(i, j)));
const SMALL = [4, 8, 12, 16, 20];

export const dp: Problem[] = [
  {
    id: 'climbing-stairs',
    category: 'dp',
    lc: 'climbing-stairs',
    n: 70,
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    tags: ['fibonacci', 'recursion'],
    pattern: 'Fibonacci-style recurrence',
    summary: 'Count the distinct ways to climb n steps when each move is either one or two steps.',
    hook: 'ways(n) = ways(n-1) + ways(n-2): the last move was a 1-step or a 2-step.',
    real: 'Counting paths through staged pipelines or retry ladders uses the same additive recurrence.',
    input: '[5]',
    expected: '8',
    cases: [
      { input: '[1]', expected: '1' },
      { input: '[3]', expected: '3' },
      { input: '[10]', expected: '89' },
    ],
    solutions: [
      {
        label: 'Plain recursion',
        complexity: 'O(2ⁿ)',
        code: `function climbStairs(n) {
  if (n <= 2) return n;
  return climbStairs(n - 1) + climbStairs(n - 2);
}`,
      },
      {
        label: 'Two rolling variables',
        complexity: 'O(n)',
        code: `function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1;
  let b = 2;
  for (let i = 3; i <= n; i++) {
    const next = a + b;
    a = b;
    b = next;
  }
  return b;
}`,
      },
    ],
    scale: { sizes: SMALL, make: (n) => JSON.stringify([n]) },
  },
  {
    id: 'house-robber',
    category: 'dp',
    lc: 'house-robber',
    n: 198,
    title: 'House Robber',
    difficulty: 'Medium',
    tags: ['linear dp'],
    pattern: 'Take or skip, no neighbors',
    summary:
      'Pick values from a row so that no two picked values sit next to each other, maximizing the total.',
    hook: 'best(i) = max(skip i, take i + best(i+2)).',
    real: 'Scheduling non-overlapping jobs with conflicts between adjacent slots follows this take-or-skip shape.',
    input: '[[2, 7, 9, 3, 1]]',
    expected: '12',
    cases: [
      { input: '[[]]', expected: '0' },
      { input: '[[5]]', expected: '5' },
      { input: '[[1, 2, 3, 1]]', expected: '4' },
    ],
    solutions: [
      {
        label: 'Plain recursion',
        complexity: 'O(2ⁿ)',
        code: `function pick(nums, i) {
  if (i >= nums.length) return 0;
  return Math.max(pick(nums, i + 1), nums[i] + pick(nums, i + 2));
}
function rob(nums) {
  return pick(nums, 0);
}`,
      },
      {
        label: 'Rolling pair',
        complexity: 'O(n)',
        code: `function rob(nums) {
  let skip = 0;
  let take = 0;
  for (const x of nums) {
    const next = Math.max(take, skip + x);
    skip = take;
    take = next;
  }
  return take;
}`,
      },
    ],
    scale: { sizes: SMALL, make: (n) => JSON.stringify([arr(n, (i) => (i % 7) + 1)]) },
  },
  {
    id: 'house-robber-ii',
    category: 'dp',
    lc: 'house-robber-ii',
    n: 213,
    title: 'House Robber II',
    difficulty: 'Medium',
    tags: ['linear dp', 'circular'],
    pattern: 'Break the circle into two lines',
    summary:
      'Same no-neighbors picking, but the row is a ring so the first and last entries are also neighbors.',
    hook: 'A ring is two lines: drop the first element, or drop the last.',
    real: 'Round-robin resources arranged in a loop are handled by cutting the loop once and solving the line.',
    input: '[[2, 3, 2]]',
    expected: '3',
    cases: [
      { input: '[[1, 2, 3, 1]]', expected: '4' },
      { input: '[[5]]', expected: '5' },
      { input: '[[]]', expected: '0' },
      { input: '[[1, 2, 1, 1]]', expected: '3' },
    ],
    solutions: [
      {
        label: 'Recursion on both lines',
        complexity: 'O(2ⁿ)',
        code: `function pick(nums, i, hi) {
  if (i > hi) return 0;
  return Math.max(pick(nums, i + 1, hi), nums[i] + pick(nums, i + 2, hi));
}
function robRing(nums) {
  const n = nums.length;
  if (n === 0) return 0;
  if (n === 1) return nums[0];
  return Math.max(pick(nums, 0, n - 2), pick(nums, 1, n - 1));
}`,
      },
      {
        label: 'Rolling pair on both lines',
        complexity: 'O(n)',
        code: `function line(nums, lo, hi) {
  let skip = 0;
  let take = 0;
  for (let i = lo; i <= hi; i++) {
    const next = Math.max(take, skip + nums[i]);
    skip = take;
    take = next;
  }
  return take;
}
function robRing(nums) {
  const n = nums.length;
  if (n === 0) return 0;
  if (n === 1) return nums[0];
  return Math.max(line(nums, 0, n - 2), line(nums, 1, n - 1));
}`,
      },
    ],
    scale: { sizes: SMALL, make: (n) => JSON.stringify([arr(n, (i) => (i % 7) + 1)]) },
  },
  {
    id: 'coin-change',
    category: 'dp',
    lc: 'coin-change',
    n: 322,
    title: 'Coin Change',
    difficulty: 'Medium',
    tags: ['unbounded', 'min'],
    pattern: 'Unbounded knapsack, minimize count',
    summary:
      'Find the fewest coins that sum exactly to an amount, or report -1 if it cannot be done.',
    hook: 'fewest(a) = 1 + min over coins of fewest(a - coin).',
    real: 'Making change, packing fixed-size blocks, and bandwidth allocation all reduce to this.',
    input: '[[1, 2, 5], 7]',
    expected: '2',
    cases: [
      { input: '[[2], 3]', expected: '-1' },
      { input: '[[1], 0]', expected: '0' },
      { input: '[[3, 7], 10]', expected: '2' },
    ],
    solutions: [
      {
        label: 'Plain recursion',
        complexity: 'O(kⁿ)',
        code: `function fewest(coins, rem) {
  if (rem === 0) return 0;
  let best = -1;
  for (const c of coins) {
    if (c <= rem) {
      const sub = fewest(coins, rem - c);
      if (sub >= 0 && (best < 0 || sub + 1 < best)) best = sub + 1;
    }
  }
  return best;
}
function coinChange(coins, amount) {
  return fewest(coins, amount);
}`,
      },
      {
        label: 'Bottom-up table',
        complexity: 'O(n·k)',
        code: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(-1);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (c <= a && dp[a - c] >= 0) {
        if (dp[a] < 0 || dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;
      }
    }
  }
  return dp[amount];
}`,
      },
    ],
    scale: { sizes: [5, 10, 15, 20], make: (n) => JSON.stringify([[1, 2, 5], n]) },
  },
  {
    id: 'longest-increasing-subsequence',
    category: 'dp',
    lc: 'longest-increasing-subsequence',
    n: 300,
    title: 'Longest Increasing Subsequence',
    difficulty: 'Medium',
    tags: ['binary search', 'subsequence'],
    pattern: 'Patience tails array',
    summary:
      'Find the length of the longest strictly increasing subsequence (not necessarily contiguous).',
    hook: 'Keep the smallest possible tail for each length, and binary search where a new value lands.',
    real: 'Diff tools and version-history comparison use subsequence ideas; patience sorting is the fast variant.',
    input: '[[10, 9, 2, 5, 3, 7, 101, 18]]',
    expected: '4',
    cases: [
      { input: '[[]]', expected: '0' },
      { input: '[[7]]', expected: '1' },
      { input: '[[0, 1, 0, 3, 2, 3]]', expected: '4' },
      { input: '[[7, 7, 7]]', expected: '1' },
    ],
    solutions: [
      {
        label: 'Pairwise table',
        complexity: 'O(n²)',
        code: `function lengthOfLIS(nums) {
  const n = nums.length;
  if (n === 0) return 0;
  const dp = new Array(n).fill(1);
  let best = 1;
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) dp[i] = dp[j] + 1;
    }
    if (dp[i] > best) best = dp[i];
  }
  return best;
}`,
      },
      {
        label: 'Patience tails + binary search',
        complexity: 'O(n log n)',
        code: `function lengthOfLIS(nums) {
  const tails = [];
  for (const x of nums) {
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = x;
  }
  return tails.length;
}`,
      },
    ],
    scale: {
      sizes: [10, 20, 40, 80, 160],
      make: (n) => JSON.stringify([arr(n, (i) => (i * 37 + 11) % 101)]),
    },
  },
  {
    id: 'longest-common-subsequence',
    category: 'dp',
    lc: 'longest-common-subsequence',
    n: 1143,
    title: 'Longest Common Subsequence',
    difficulty: 'Medium',
    tags: ['2D dp', 'strings'],
    pattern: '2-D table over two prefixes',
    summary:
      'Return the length of the longest sequence of characters appearing in both strings in the same order.',
    hook: 'Chars match: 1 + diagonal. Otherwise take the better of dropping a char from either string.',
    real: 'File diffing and DNA sequence alignment are built on this table.',
    input: '["abcde", "ace"]',
    expected: '3',
    cases: [
      { input: '["abc", "abc"]', expected: '3' },
      { input: '["abc", "def"]', expected: '0' },
      { input: '["", "a"]', expected: '0' },
    ],
    solutions: [
      {
        label: 'Plain recursion',
        complexity: 'O(2^(n+m))',
        code: `function walk(a, b, i, j) {
  if (i === a.length || j === b.length) return 0;
  if (a[i] === b[j]) return 1 + walk(a, b, i + 1, j + 1);
  return Math.max(walk(a, b, i + 1, j), walk(a, b, i, j + 1));
}
function longestCommonSubsequence(a, b) {
  return walk(a, b, 0, 0);
}`,
      },
      {
        label: '2-D table',
        complexity: 'O(n·m)',
        code: `function longestCommonSubsequence(a, b) {
  const dp = [];
  for (let i = 0; i <= a.length; i++) dp.push(new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}`,
      },
    ],
    scale: {
      sizes: [2, 4, 6, 8, 10],
      make: (n) => JSON.stringify(['abcdefghijkl'.slice(0, n), 'zyxwvutsrqpo'.slice(0, n)]),
    },
  },
  {
    id: 'edit-distance',
    category: 'dp',
    lc: 'edit-distance',
    n: 72,
    title: 'Edit Distance',
    difficulty: 'Hard',
    tags: ['2D dp', 'strings'],
    pattern: '2-D table: insert, delete, replace',
    summary:
      'Find the minimum number of single-character insertions, deletions or replacements to turn one word into another.',
    hook: 'Equal chars cost nothing; otherwise 1 + min(insert, delete, replace).',
    real: 'Spell checkers and fuzzy search rank suggestions by this distance.',
    input: '["sun", "sat"]',
    expected: '2',
    cases: [
      { input: '["", "abc"]', expected: '3' },
      { input: '["abc", ""]', expected: '3' },
      { input: '["horse", "ros"]', expected: '3' },
    ],
    solutions: [
      {
        label: 'Plain recursion',
        complexity: 'O(3^(n+m))',
        code: `function edit(a, b, i, j) {
  if (i === a.length) return b.length - j;
  if (j === b.length) return a.length - i;
  if (a[i] === b[j]) return edit(a, b, i + 1, j + 1);
  return 1 + Math.min(edit(a, b, i + 1, j), edit(a, b, i, j + 1), edit(a, b, i + 1, j + 1));
}
function minDistance(a, b) {
  return edit(a, b, 0, 0);
}`,
      },
      {
        label: '2-D table',
        complexity: 'O(n·m)',
        code: `function minDistance(a, b) {
  const dp = [];
  for (let i = 0; i <= a.length; i++) dp.push(new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}`,
      },
    ],
    scale: {
      sizes: [2, 3, 4, 5, 6, 7],
      make: (n) => JSON.stringify(['abcdefgh'.slice(0, n), 'zyxwvuts'.slice(0, n)]),
    },
  },
  {
    id: 'unique-paths',
    category: 'dp',
    lc: 'unique-paths',
    n: 62,
    title: 'Unique Paths',
    difficulty: 'Medium',
    tags: ['grid'],
    pattern: 'Grid path counting',
    summary:
      'Count the routes from the top-left to the bottom-right of a grid when you may only move right or down.',
    hook: 'paths(cell) = paths(from above) + paths(from left).',
    real: 'Counting routes through a layered network or lattice uses the same sum over predecessors.',
    input: '[3, 3]',
    expected: '6',
    cases: [
      { input: '[1, 1]', expected: '1' },
      { input: '[3, 2]', expected: '3' },
      { input: '[3, 7]', expected: '28' },
    ],
    solutions: [
      {
        label: 'Plain recursion',
        complexity: 'O(2^(m+n))',
        code: `function paths(r, c) {
  if (r === 1 || c === 1) return 1;
  return paths(r - 1, c) + paths(r, c - 1);
}
function uniquePaths(m, n) {
  return paths(m, n);
}`,
      },
      {
        label: 'Single rolling row',
        complexity: 'O(m·n)',
        code: `function uniquePaths(m, n) {
  const row = new Array(n).fill(1);
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      row[c] += row[c - 1];
    }
  }
  return row[n - 1];
}`,
      },
    ],
    scale: { sizes: [2, 4, 6, 8, 10], make: (n) => JSON.stringify([n, n]) },
  },
  {
    id: 'unique-paths-ii',
    category: 'dp',
    lc: 'unique-paths-ii',
    n: 63,
    title: 'Unique Paths II',
    difficulty: 'Medium',
    tags: ['grid'],
    pattern: 'Grid path counting with blocked cells',
    summary: 'Count right/down routes across a grid in which some cells are walls (marked 1).',
    hook: 'Same sum as before, but a wall cell contributes zero paths.',
    real: 'Routing around failed nodes or blocked regions counts only the surviving paths.',
    input: '[[[0, 0, 0], [0, 1, 0], [0, 0, 0]]]',
    expected: '2',
    cases: [
      { input: '[[[1]]]', expected: '0' },
      { input: '[[[0]]]', expected: '1' },
      { input: '[[[0, 1], [0, 0]]]', expected: '1' },
      { input: '[[[0, 0], [0, 1]]]', expected: '0' },
    ],
    solutions: [
      {
        label: 'Plain recursion',
        complexity: 'O(2^(m+n))',
        code: `function walk(g, r, c) {
  if (r >= g.length || c >= g[0].length || g[r][c] === 1) return 0;
  if (r === g.length - 1 && c === g[0].length - 1) return 1;
  return walk(g, r + 1, c) + walk(g, r, c + 1);
}
function uniquePathsWithObstacles(g) {
  return walk(g, 0, 0);
}`,
      },
      {
        label: 'Single rolling row',
        complexity: 'O(m·n)',
        code: `function uniquePathsWithObstacles(g) {
  const cols = g[0].length;
  const row = new Array(cols).fill(0);
  row[0] = g[0][0] === 1 ? 0 : 1;
  for (let r = 0; r < g.length; r++) {
    for (let c = 0; c < cols; c++) {
      if (g[r][c] === 1) row[c] = 0;
      else if (c > 0) row[c] += row[c - 1];
    }
  }
  return row[cols - 1];
}`,
      },
    ],
    scale: {
      sizes: [2, 4, 6, 8, 10],
      make: (n) => JSON.stringify([grid(n, n, (i, j) => (n > 2 && i === 1 && j === 1 ? 1 : 0))]),
    },
  },
  {
    id: 'minimum-path-sum',
    category: 'dp',
    lc: 'minimum-path-sum',
    n: 64,
    title: 'Minimum Path Sum',
    difficulty: 'Medium',
    tags: ['grid'],
    pattern: 'Grid DP, cheapest route',
    summary:
      'Find the cheapest right/down route from the top-left to the bottom-right, summing the cell costs.',
    hook: 'cost(cell) = value + min(cost from above, cost from left).',
    real: 'Shortest-path routing on a layered cost lattice, like seam carving in image resizing.',
    input: '[[[1, 3, 1], [1, 5, 1], [4, 2, 1]]]',
    expected: '7',
    cases: [
      { input: '[[[5]]]', expected: '5' },
      { input: '[[[1, 2], [1, 1]]]', expected: '3' },
      { input: '[[[1, 2, 3]]]', expected: '6' },
    ],
    solutions: [
      {
        label: 'Plain recursion',
        complexity: 'O(2^(m+n))',
        code: `function cost(g, r, c) {
  const here = g[r][c];
  const lastRow = r === g.length - 1;
  const lastCol = c === g[0].length - 1;
  if (lastRow && lastCol) return here;
  if (lastRow) return here + cost(g, r, c + 1);
  if (lastCol) return here + cost(g, r + 1, c);
  return here + Math.min(cost(g, r + 1, c), cost(g, r, c + 1));
}
function minPathSum(g) {
  return cost(g, 0, 0);
}`,
      },
      {
        label: 'Single rolling row',
        complexity: 'O(m·n)',
        code: `function minPathSum(g) {
  const cols = g[0].length;
  const row = new Array(cols).fill(0);
  for (let r = 0; r < g.length; r++) {
    for (let c = 0; c < cols; c++) {
      if (r === 0 && c === 0) row[c] = g[0][0];
      else if (r === 0) row[c] = row[c - 1] + g[r][c];
      else if (c === 0) row[c] = row[c] + g[r][c];
      else row[c] = Math.min(row[c], row[c - 1]) + g[r][c];
    }
  }
  return row[cols - 1];
}`,
      },
    ],
    scale: {
      sizes: [2, 4, 6, 8, 10],
      make: (n) => JSON.stringify([grid(n, n, (i, j) => ((i + j) % 5) + 1)]),
    },
  },
  {
    id: 'word-break',
    category: 'dp',
    lc: 'word-break',
    n: 139,
    title: 'Word Break',
    difficulty: 'Medium',
    tags: ['strings', 'dictionary'],
    pattern: 'Prefix reachability table',
    summary: 'Decide whether a string can be cut into pieces that all appear in a given word list.',
    hook: 'ok[i] is true if some word ends at i and ok[start of that word] is true.',
    real: 'Tokenizers and search-query segmenters split text using a vocabulary this way.',
    input: '["leetcode", ["leet", "code"]]',
    expected: 'true',
    cases: [
      { input: '["applepenapple", ["apple", "pen"]]', expected: 'true' },
      { input: '["catsandog", ["cats", "dog", "sand", "and", "cat"]]', expected: 'false' },
      { input: '["", ["a"]]', expected: 'true' },
      { input: '["a", []]', expected: 'false' },
    ],
    solutions: [
      {
        label: 'Plain recursion',
        complexity: 'O(2ⁿ)',
        code: `function canSplit(s, words, start) {
  if (start === s.length) return true;
  for (const w of words) {
    if (s.slice(start, start + w.length) === w) {
      if (canSplit(s, words, start + w.length)) return true;
    }
  }
  return false;
}
function wordBreak(s, words) {
  return canSplit(s, words, 0);
}`,
      },
      {
        label: 'Reachability table',
        complexity: 'O(n²·k)',
        code: `function wordBreak(s, words) {
  const ok = new Array(s.length + 1).fill(false);
  ok[0] = true;
  for (let i = 1; i <= s.length; i++) {
    for (const w of words) {
      const start = i - w.length;
      if (start >= 0 && ok[start] && s.slice(start, i) === w) {
        ok[i] = true;
        break;
      }
    }
  }
  return ok[s.length];
}`,
      },
    ],
    scale: {
      sizes: SMALL,
      make: (n) => JSON.stringify(['a'.repeat(n) + 'b', ['a', 'aa']]),
    },
  },
  {
    id: 'partition-equal-subset-sum',
    category: 'dp',
    lc: 'partition-equal-subset-sum',
    n: 416,
    title: 'Partition Equal Subset Sum',
    difficulty: 'Medium',
    tags: ['subset sum', 'knapsack'],
    pattern: '0/1 subset-sum reachability',
    summary:
      'Decide whether a list of positive numbers can be split into two groups with equal totals.',
    hook: 'Half the total is the target: can some subset hit exactly that sum?',
    real: 'Balancing work across two machines is a partition problem.',
    input: '[[1, 5, 11, 5]]',
    expected: 'true',
    cases: [
      { input: '[[1, 2, 3, 5]]', expected: 'false' },
      { input: '[[2]]', expected: 'false' },
      { input: '[[1, 1]]', expected: 'true' },
    ],
    solutions: [
      {
        label: 'Include/exclude recursion',
        complexity: 'O(2ⁿ)',
        code: `function pick(nums, i, rem) {
  if (rem === 0) return true;
  if (i === nums.length || rem < 0) return false;
  return pick(nums, i + 1, rem - nums[i]) || pick(nums, i + 1, rem);
}
function canPartition(nums) {
  let sum = 0;
  for (const x of nums) sum += x;
  if (sum % 2 === 1) return false;
  return pick(nums, 0, sum / 2);
}`,
      },
      {
        label: 'Reachable-sums table',
        complexity: 'O(n·sum)',
        code: `function canPartition(nums) {
  let sum = 0;
  for (const x of nums) sum += x;
  if (sum % 2 === 1) return false;
  const half = sum / 2;
  const dp = new Array(half + 1).fill(false);
  dp[0] = true;
  for (const x of nums) {
    for (let s = half; s >= x; s--) {
      if (dp[s - x]) dp[s] = true;
    }
  }
  return dp[half];
}`,
      },
    ],
    scale: {
      sizes: [4, 8, 12, 14, 16],
      make: (n) => JSON.stringify([[...arr(n - 1, () => 4), 2]]),
    },
  },
  {
    id: 'decode-ways',
    category: 'dp',
    lc: 'decode-ways',
    n: 91,
    title: 'Decode Ways',
    difficulty: 'Medium',
    tags: ['strings'],
    pattern: 'Linear dp with one- and two-digit tokens',
    summary:
      'Count how many ways a digit string can be read as letters, where 1 to 26 map to A to Z.',
    hook: 'ways(i) = ways(i+1) if one digit is valid, plus ways(i+2) if two digits are valid.',
    real: 'Parsing ambiguous encodings, such as variable-length codes, counts the valid readings this way.',
    input: '["226"]',
    expected: '3',
    cases: [
      { input: '["12"]', expected: '2' },
      { input: '["06"]', expected: '0' },
      { input: '["10"]', expected: '1' },
      { input: '["11106"]', expected: '2' },
    ],
    solutions: [
      {
        label: 'Plain recursion',
        complexity: 'O(2ⁿ)',
        code: `function ways(s, i) {
  if (i === s.length) return 1;
  if (s[i] === '0') return 0;
  let total = ways(s, i + 1);
  if (i + 1 < s.length && (s[i] === '1' || (s[i] === '2' && s[i + 1] <= '6'))) {
    total += ways(s, i + 2);
  }
  return total;
}
function numDecodings(s) {
  return ways(s, 0);
}`,
      },
      {
        label: 'Rolling pair from the end',
        complexity: 'O(n)',
        code: `function numDecodings(s) {
  let next1 = 1;
  let next2 = 0;
  for (let i = s.length - 1; i >= 0; i--) {
    let cur = 0;
    if (s[i] !== '0') {
      cur = next1;
      if (i + 1 < s.length && (s[i] === '1' || (s[i] === '2' && s[i + 1] <= '6'))) {
        cur += next2;
      }
    }
    next2 = next1;
    next1 = cur;
  }
  return next1;
}`,
      },
    ],
    scale: { sizes: SMALL, make: (n) => JSON.stringify(['1'.repeat(n)]) },
  },
  {
    id: 'maximum-product-subarray',
    category: 'dp',
    lc: 'maximum-product-subarray',
    n: 152,
    title: 'Maximum Product Subarray',
    difficulty: 'Medium',
    tags: ['subarray', 'min/max tracking'],
    pattern: 'Track both max and min ending here',
    summary:
      'Find the largest product of any contiguous run of numbers, which may include negatives and zeros.',
    hook: 'A negative flips things, so keep the smallest product too: it may become the biggest.',
    real: 'Compounding growth or loss factors over a window behaves this way when some factors invert the sign.',
    input: '[[2, 3, -2, 4]]',
    expected: '6',
    cases: [
      { input: '[[-2, 0, -1]]', expected: '0' },
      { input: '[[-2]]', expected: '-2' },
      { input: '[[-2, 3, -4]]', expected: '24' },
      { input: '[[0, 2]]', expected: '2' },
    ],
    solutions: [
      {
        label: 'Every subarray',
        complexity: 'O(n²)',
        code: `function maxProduct(nums) {
  let best = nums[0];
  for (let i = 0; i < nums.length; i++) {
    let prod = 1;
    for (let j = i; j < nums.length; j++) {
      prod *= nums[j];
      if (prod > best) best = prod;
    }
  }
  return best;
}`,
      },
      {
        label: 'Running max and min',
        complexity: 'O(n)',
        code: `function maxProduct(nums) {
  let hi = nums[0];
  let lo = nums[0];
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    const x = nums[i];
    const a = hi * x;
    const b = lo * x;
    hi = Math.max(x, a, b);
    lo = Math.min(x, a, b);
    if (hi > best) best = hi;
  }
  return best;
}`,
      },
    ],
    scale: {
      sizes: [10, 20, 40, 80],
      make: (n) => JSON.stringify([arr(n, (i) => (i % 3) - 1)]),
    },
  },
  {
    id: 'min-cost-climbing-stairs',
    category: 'dp',
    lc: 'min-cost-climbing-stairs',
    n: 746,
    title: 'Min Cost Climbing Stairs',
    difficulty: 'Easy',
    tags: ['linear dp'],
    pattern: 'Linear dp, two predecessors',
    summary:
      'Each step has a fee to leave it; starting on step 0 or 1 and moving by 1 or 2, find the cheapest way past the last step.',
    hook: 'cost(i) = fee[i] + min(cost(i+1), cost(i+2)).',
    real: 'Picking the cheapest chain of stops where each stop has a fixed toll.',
    input: '[[10, 15, 20]]',
    expected: '15',
    cases: [
      { input: '[[1, 100, 1, 1, 1, 100, 1, 1, 100, 1]]', expected: '6' },
      { input: '[[5, 5]]', expected: '5' },
      { input: '[[0, 0]]', expected: '0' },
    ],
    solutions: [
      {
        label: 'Plain recursion',
        complexity: 'O(2ⁿ)',
        code: `function best(cost, i) {
  if (i >= cost.length) return 0;
  return cost[i] + Math.min(best(cost, i + 1), best(cost, i + 2));
}
function minCostClimbingStairs(cost) {
  return Math.min(best(cost, 0), best(cost, 1));
}`,
      },
      {
        label: 'Rolling pair from the top',
        complexity: 'O(n)',
        code: `function minCostClimbingStairs(cost) {
  let a = 0;
  let b = 0;
  for (let i = cost.length - 1; i >= 0; i--) {
    const cur = cost[i] + Math.min(a, b);
    a = b;
    b = cur;
  }
  return Math.min(a, b);
}`,
      },
    ],
    scale: { sizes: SMALL, make: (n) => JSON.stringify([arr(n, (i) => ((i * 3) % 7) + 1)]) },
  },
  {
    id: 'coin-change-ii',
    category: 'dp',
    lc: 'coin-change-ii',
    n: 518,
    title: 'Coin Change II',
    difficulty: 'Medium',
    tags: ['unbounded', 'counting'],
    pattern: 'Unbounded knapsack, count combinations',
    summary:
      'Count the distinct combinations of coins that add up to an amount, where order does not matter.',
    hook: 'Loop coins on the outside so each combination is counted once, not once per ordering.',
    real: 'Counting distinct ways to compose a budget from fixed denominations, such as quota or license bundles.',
    input: '[5, [1, 2, 5]]',
    expected: '4',
    cases: [
      { input: '[3, [2]]', expected: '0' },
      { input: '[10, [10]]', expected: '1' },
      { input: '[0, [7]]', expected: '1' },
    ],
    solutions: [
      {
        label: 'Take or move on recursion',
        complexity: 'O(2^(n+k))',
        code: `function ways(coins, i, rem) {
  if (rem === 0) return 1;
  if (rem < 0 || i === coins.length) return 0;
  return ways(coins, i, rem - coins[i]) + ways(coins, i + 1, rem);
}
function change(amount, coins) {
  return ways(coins, 0, amount);
}`,
      },
      {
        label: 'Rolling 1-D table',
        complexity: 'O(n·k)',
        code: `function change(amount, coins) {
  const dp = new Array(amount + 1).fill(0);
  dp[0] = 1;
  for (const c of coins) {
    for (let a = c; a <= amount; a++) {
      dp[a] += dp[a - c];
    }
  }
  return dp[amount];
}`,
      },
    ],
    scale: { sizes: [10, 20, 30, 40, 50], make: (n) => JSON.stringify([n, [1, 2, 5]]) },
  },
  {
    id: 'target-sum',
    category: 'dp',
    lc: 'target-sum',
    n: 494,
    title: 'Target Sum',
    difficulty: 'Medium',
    tags: ['subset sum', 'counting'],
    pattern: 'Reduce signs to a subset-sum count',
    summary:
      'Put a plus or minus before every number and count the sign assignments whose total equals the target.',
    hook: 'Plus-group P and minus-group M: P = (total + target) / 2, so count subsets that sum to P.',
    real: 'Counting configurations that net out to a required balance, like ledger reconciliation.',
    input: '[[1, 1, 1, 1, 1], 3]',
    expected: '5',
    cases: [
      { input: '[[1], 1]', expected: '1' },
      { input: '[[1], 2]', expected: '0' },
      { input: '[[0, 0, 0], 0]', expected: '8' },
      { input: '[[1, 0], 1]', expected: '2' },
    ],
    solutions: [
      {
        label: 'Try both signs',
        complexity: 'O(2ⁿ)',
        code: `function count(nums, i, sum, target) {
  if (i === nums.length) return sum === target ? 1 : 0;
  return count(nums, i + 1, sum + nums[i], target) + count(nums, i + 1, sum - nums[i], target);
}
function findTargetSumWays(nums, target) {
  return count(nums, 0, 0, target);
}`,
      },
      {
        label: 'Subset-count table',
        complexity: 'O(n·sum)',
        code: `function findTargetSumWays(nums, target) {
  let total = 0;
  for (const x of nums) total += x;
  if (Math.abs(target) > total || (total + target) % 2 !== 0) return 0;
  const need = (total + target) / 2;
  const dp = new Array(need + 1).fill(0);
  dp[0] = 1;
  for (const x of nums) {
    for (let s = need; s >= x; s--) {
      dp[s] += dp[s - x];
    }
  }
  return dp[need];
}`,
      },
    ],
    scale: {
      sizes: [4, 8, 12, 14, 16],
      make: (n) => JSON.stringify([arr(n, () => 1), n % 2]),
    },
  },
  {
    id: 'jump-game',
    category: 'dp',
    lc: 'jump-game',
    n: 55,
    title: 'Jump Game',
    difficulty: 'Medium',
    tags: ['greedy', 'reachability'],
    pattern: 'Furthest reach greedy',
    summary:
      'Each entry is the maximum jump length from that index; decide whether the last index can be reached from the first.',
    hook: 'Track the furthest index reachable so far; if you stand beyond it, you are stuck.',
    real: 'Checking whether a chain of hops with limited range can span a distance, like multi-hop radio links.',
    input: '[[2, 3, 1, 1, 4]]',
    expected: 'true',
    cases: [
      { input: '[[3, 2, 1, 0, 4]]', expected: 'false' },
      { input: '[[0]]', expected: 'true' },
      { input: '[[2, 0, 0]]', expected: 'true' },
      { input: '[[1, 0, 1]]', expected: 'false' },
    ],
    solutions: [
      {
        label: 'Try every jump (recursion)',
        complexity: 'O(2ⁿ)',
        code: `function reach(nums, i) {
  if (i >= nums.length - 1) return true;
  for (let step = 1; step <= nums[i]; step++) {
    if (reach(nums, i + step)) return true;
  }
  return false;
}
function canJump(nums) {
  return reach(nums, 0);
}`,
      },
      {
        label: 'Furthest reach',
        complexity: 'O(n)',
        code: `function canJump(nums) {
  let far = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > far) return false;
    far = Math.max(far, i + nums[i]);
  }
  return true;
}`,
      },
    ],
    scale: {
      sizes: [6, 10, 14, 18, 22],
      make: (n) => JSON.stringify([arr(n, (i) => (i === n - 3 || i === n - 2 ? 0 : 2))]),
    },
  },
  {
    id: 'jump-game-ii',
    category: 'dp',
    lc: 'jump-game-ii',
    n: 45,
    title: 'Jump Game II',
    difficulty: 'Medium',
    tags: ['greedy', 'bfs'],
    pattern: 'Greedy jump windows (implicit BFS)',
    summary:
      'Given a row of maximum jump lengths where the end is always reachable, find the fewest jumps to get there.',
    hook: 'Each jump covers a window; when you reach the window edge, take one more jump to the furthest point seen.',
    real: 'Minimum hop counts in range-limited networks resemble layered breadth-first search.',
    input: '[[2, 3, 1, 1, 4]]',
    expected: '2',
    cases: [
      { input: '[[2, 3, 0, 1, 4]]', expected: '2' },
      { input: '[[0]]', expected: '0' },
      { input: '[[1, 1, 1, 1]]', expected: '3' },
    ],
    solutions: [
      {
        label: 'Try every jump (recursion)',
        complexity: 'O(2ⁿ)',
        code: `function fewest(nums, i) {
  if (i >= nums.length - 1) return 0;
  let best = 1000000;
  for (let step = 1; step <= nums[i]; step++) {
    const c = 1 + fewest(nums, i + step);
    if (c < best) best = c;
  }
  return best;
}
function jump(nums) {
  return fewest(nums, 0);
}`,
      },
      {
        label: 'Greedy windows',
        complexity: 'O(n)',
        code: `function jump(nums) {
  let jumps = 0;
  let end = 0;
  let far = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    far = Math.max(far, i + nums[i]);
    if (i === end) {
      jumps++;
      end = far;
    }
  }
  return jumps;
}`,
      },
    ],
    scale: { sizes: [6, 10, 14, 18, 22], make: (n) => JSON.stringify([arr(n, () => 2)]) },
  },
  {
    id: 'triangle',
    category: 'dp',
    lc: 'triangle',
    n: 120,
    title: 'Triangle',
    difficulty: 'Medium',
    tags: ['2D dp'],
    pattern: 'Bottom-up fold of a triangle',
    summary:
      'Walk from the top of a number triangle to the bottom, moving to an adjacent entry below each time, with the smallest total.',
    hook: 'Start from the bottom row and fold upward: each cell adds the smaller of its two children.',
    real: 'Layered decision graphs, like pricing or trellis decoding, are collapsed from the last layer backward.',
    input: '[[[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]]]',
    expected: '11',
    cases: [
      { input: '[[[-10]]]', expected: '-10' },
      { input: '[[[1], [2, 3]]]', expected: '3' },
      { input: '[[[1], [5, 2], [3, 9, 1]]]', expected: '4' },
    ],
    solutions: [
      {
        label: 'Plain recursion',
        complexity: 'O(2ⁿ)',
        code: `function down(t, r, c) {
  if (r === t.length) return 0;
  return t[r][c] + Math.min(down(t, r + 1, c), down(t, r + 1, c + 1));
}
function minimumTotal(t) {
  return down(t, 0, 0);
}`,
      },
      {
        label: 'Fold bottom-up in one row',
        complexity: 'O(n²)',
        code: `function minimumTotal(t) {
  const dp = t[t.length - 1].slice();
  for (let r = t.length - 2; r >= 0; r--) {
    for (let c = 0; c <= r; c++) {
      dp[c] = t[r][c] + Math.min(dp[c], dp[c + 1]);
    }
  }
  return dp[0];
}`,
      },
    ],
    scale: {
      sizes: [4, 6, 8, 10, 12, 14],
      make: (n) =>
        JSON.stringify([
          Array.from({ length: n }, (_, r) => arr(r + 1, (c) => ((r * c + r) % 9) + 1)),
        ]),
    },
  },
  {
    id: 'longest-palindromic-subsequence',
    category: 'dp',
    lc: 'longest-palindromic-subsequence',
    n: 516,
    title: 'Longest Palindromic Subsequence',
    difficulty: 'Medium',
    tags: ['interval dp', 'strings'],
    pattern: 'Interval dp on (left, right)',
    summary:
      'Find the length of the longest subsequence of a string that reads the same forwards and backwards.',
    hook: 'Ends match: 2 + inside. Otherwise drop either end and keep the better.',
    real: 'Symmetry detection in sequences, such as palindromic regions in DNA.',
    input: '["bbbab"]',
    expected: '4',
    cases: [
      { input: '["cbbd"]', expected: '2' },
      { input: '["a"]', expected: '1' },
      { input: '["abc"]', expected: '1' },
    ],
    solutions: [
      {
        label: 'Plain recursion',
        complexity: 'O(2ⁿ)',
        code: `function lps(s, i, j) {
  if (i > j) return 0;
  if (i === j) return 1;
  if (s[i] === s[j]) return 2 + lps(s, i + 1, j - 1);
  return Math.max(lps(s, i + 1, j), lps(s, i, j - 1));
}
function longestPalindromeSubseq(s) {
  return lps(s, 0, s.length - 1);
}`,
      },
      {
        label: 'Interval table',
        complexity: 'O(n²)',
        code: `function longestPalindromeSubseq(s) {
  const n = s.length;
  const dp = [];
  for (let i = 0; i < n; i++) dp.push(new Array(n).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    dp[i][i] = 1;
    for (let j = i + 1; j < n; j++) {
      if (s[i] === s[j]) dp[i][j] = 2 + (i + 1 <= j - 1 ? dp[i + 1][j - 1] : 0);
      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
    }
  }
  return dp[0][n - 1];
}`,
      },
    ],
    scale: {
      sizes: [4, 6, 8, 10, 12, 14],
      make: (n) => JSON.stringify(['abcdefghijklmnop'.slice(0, n)]),
    },
  },
  {
    id: 'perfect-squares',
    category: 'dp',
    lc: 'perfect-squares',
    n: 279,
    title: 'Perfect Squares',
    difficulty: 'Medium',
    tags: ['unbounded', 'min'],
    pattern: 'Coin change with square coins',
    summary: 'Find the fewest perfect squares (1, 4, 9, ...) that add up to n.',
    hook: 'It is coin change where the coins are the squares up to n.',
    real: 'Decomposing a quantity into the fewest allowed block sizes, as in memory or tile allocation.',
    input: '[12]',
    expected: '3',
    cases: [
      { input: '[1]', expected: '1' },
      { input: '[13]', expected: '2' },
      { input: '[4]', expected: '1' },
    ],
    solutions: [
      {
        label: 'Plain recursion',
        complexity: 'O(nⁿ)',
        code: `function fewest(n) {
  if (n === 0) return 0;
  let best = n;
  for (let k = 1; k * k <= n; k++) {
    const c = 1 + fewest(n - k * k);
    if (c < best) best = c;
  }
  return best;
}
function numSquares(n) {
  return fewest(n);
}`,
      },
      {
        label: 'Bottom-up table',
        complexity: 'O(n√n)',
        code: `function numSquares(n) {
  const dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    dp[i] = i;
    for (let k = 1; k * k <= i; k++) {
      if (dp[i - k * k] + 1 < dp[i]) dp[i] = dp[i - k * k] + 1;
    }
  }
  return dp[n];
}`,
      },
    ],
    scale: { sizes: [4, 8, 12, 16, 20], make: (n) => JSON.stringify([n]) },
  },
  {
    id: 'best-time-to-buy-and-sell-stock-with-cooldown',
    category: 'dp',
    lc: 'best-time-to-buy-and-sell-stock-with-cooldown',
    n: 309,
    title: 'Stock Trading With Cooldown',
    difficulty: 'Medium',
    tags: ['state machine'],
    pattern: 'State machine dp',
    summary:
      'Trade a stock as often as you like, holding at most one share, but you must skip a day after each sale; maximize profit.',
    hook: 'Three states per day: holding, just sold, resting. Each day moves between them.',
    real: 'Systems with a mandatory cooldown after an action, such as rate-limited trading or retries, are modeled as state machines.',
    input: '[[1, 2, 3, 0, 2]]',
    expected: '3',
    cases: [
      { input: '[[1]]', expected: '0' },
      { input: '[[2, 1]]', expected: '0' },
      { input: '[[1, 2, 4]]', expected: '3' },
      { input: '[[]]', expected: '0' },
    ],
    solutions: [
      {
        label: 'Plain recursion',
        complexity: 'O(2ⁿ)',
        code: `function best(prices, i, holding) {
  if (i >= prices.length) return 0;
  const wait = best(prices, i + 1, holding);
  if (holding) return Math.max(wait, prices[i] + best(prices, i + 2, false));
  return Math.max(wait, best(prices, i + 1, true) - prices[i]);
}
function maxProfit(prices) {
  return best(prices, 0, false);
}`,
      },
      {
        label: 'Three-state machine',
        complexity: 'O(n)',
        code: `function maxProfit(prices) {
  if (prices.length === 0) return 0;
  let hold = -prices[0];
  let sold = 0;
  let rest = 0;
  for (let i = 1; i < prices.length; i++) {
    const prevSold = sold;
    sold = hold + prices[i];
    hold = Math.max(hold, rest - prices[i]);
    rest = Math.max(rest, prevSold);
  }
  return Math.max(sold, rest);
}`,
      },
    ],
    scale: { sizes: SMALL, make: (n) => JSON.stringify([arr(n, (i) => ((i * 5) % 7) + 1)]) },
  },
  {
    id: 'maximal-square',
    category: 'dp',
    lc: 'maximal-square',
    n: 221,
    title: 'Maximal Square',
    difficulty: 'Medium',
    tags: ['grid', '2D dp'],
    pattern: 'Largest square ending at each cell',
    summary:
      'In a grid of "0" and "1" characters, find the area of the biggest square made only of "1" cells.',
    hook: 'side(cell) = 1 + min(up, left, up-left) when the cell is a 1.',
    real: 'Finding the largest free block in an occupancy map, like picking a clear region on a bitmap or disk.',
    input:
      '[[["1", "0", "1", "0", "0"], ["1", "0", "1", "1", "1"], ["1", "1", "1", "1", "1"], ["1", "0", "0", "1", "0"]]]',
    expected: '4',
    cases: [
      { input: '[[["0", "1"], ["1", "0"]]]', expected: '1' },
      { input: '[[["0"]]]', expected: '0' },
      { input: '[[["1", "1"], ["1", "1"]]]', expected: '4' },
    ],
    solutions: [
      {
        label: 'Grow from every cell',
        complexity: 'O(m·n·min(m,n)²)',
        code: `function ringOk(g, r, c, s) {
  for (let k = 0; k <= s; k++) {
    if (g[r + s][c + k] !== '1') return false;
    if (g[r + k][c + s] !== '1') return false;
  }
  return true;
}
function maximalSquare(g) {
  let best = 0;
  for (let r = 0; r < g.length; r++) {
    for (let c = 0; c < g[0].length; c++) {
      if (g[r][c] === '1') {
        let side = 1;
        while (r + side < g.length && c + side < g[0].length && ringOk(g, r, c, side)) side++;
        if (side > best) best = side;
      }
    }
  }
  return best * best;
}`,
      },
      {
        label: 'Rolling row of side lengths',
        complexity: 'O(m·n)',
        code: `function maximalSquare(g) {
  const cols = g[0].length;
  const dp = new Array(cols + 1).fill(0);
  let best = 0;
  for (let r = 0; r < g.length; r++) {
    let diag = 0;
    for (let c = 0; c < cols; c++) {
      const up = dp[c + 1];
      if (g[r][c] === '1') {
        dp[c + 1] = 1 + Math.min(dp[c], up, diag);
        if (dp[c + 1] > best) best = dp[c + 1];
      } else {
        dp[c + 1] = 0;
      }
      diag = up;
    }
  }
  return best * best;
}`,
      },
    ],
    scale: {
      sizes: [4, 6, 8, 10, 12],
      make: (n) => JSON.stringify([grid(n, n, () => '1')]),
    },
  },
  {
    id: 'interleaving-string',
    category: 'dp',
    lc: 'interleaving-string',
    n: 97,
    title: 'Interleaving String',
    difficulty: 'Medium',
    tags: ['2D dp', 'strings'],
    pattern: '2-D reachability over two prefixes',
    summary:
      'Decide whether a third string can be formed by weaving two strings together while keeping each one in order.',
    hook: 'dp[i][j]: can the first i chars of A and j chars of B weave into the first i+j chars of C?',
    real: 'Verifying that a merged log or event stream is a valid interleaving of two ordered sources.',
    input: '["aab", "axy", "aaxaby"]',
    expected: 'true',
    cases: [
      { input: '["aabcc", "dbbca", "aadbbcbcac"]', expected: 'true' },
      { input: '["aabcc", "dbbca", "aadbbbaccc"]', expected: 'false' },
      { input: '["", "", ""]', expected: 'true' },
      { input: '["a", "", "c"]', expected: 'false' },
    ],
    solutions: [
      {
        label: 'Plain recursion',
        complexity: 'O(2^(n+m))',
        code: `function mix(a, b, c, i, j) {
  if (i + j === c.length) return true;
  if (i < a.length && a[i] === c[i + j] && mix(a, b, c, i + 1, j)) return true;
  if (j < b.length && b[j] === c[i + j] && mix(a, b, c, i, j + 1)) return true;
  return false;
}
function isInterleave(a, b, c) {
  if (a.length + b.length !== c.length) return false;
  return mix(a, b, c, 0, 0);
}`,
      },
      {
        label: 'Rolling 1-D table',
        complexity: 'O(n·m)',
        code: `function isInterleave(a, b, c) {
  const n = a.length;
  const m = b.length;
  if (n + m !== c.length) return false;
  const dp = new Array(m + 1).fill(false);
  dp[0] = true;
  for (let j = 1; j <= m; j++) dp[j] = dp[j - 1] && b[j - 1] === c[j - 1];
  for (let i = 1; i <= n; i++) {
    dp[0] = dp[0] && a[i - 1] === c[i - 1];
    for (let j = 1; j <= m; j++) {
      dp[j] = (dp[j] && a[i - 1] === c[i + j - 1]) || (dp[j - 1] && b[j - 1] === c[i + j - 1]);
    }
  }
  return dp[m];
}`,
      },
    ],
    scale: {
      sizes: [2, 4, 6, 8],
      make: (n) => JSON.stringify(['a'.repeat(n), 'a'.repeat(n), 'a'.repeat(2 * n - 1) + 'b']),
    },
  },
  {
    id: 'n-th-tribonacci-number',
    category: 'dp',
    lc: 'n-th-tribonacci-number',
    n: 1137,
    title: 'N-th Tribonacci Number',
    difficulty: 'Easy',
    tags: ['recurrence'],
    pattern: 'Fibonacci with three terms',
    summary:
      'Compute the n-th term of a sequence that starts 0, 1, 1 and where each later term is the sum of the previous three.',
    hook: 'Keep a window of the last three values and slide it forward.',
    real: 'Any fixed-order linear recurrence, such as a filter over the last k samples, rolls a small window.',
    input: '[4]',
    expected: '4',
    cases: [
      { input: '[0]', expected: '0' },
      { input: '[2]', expected: '1' },
      { input: '[10]', expected: '149' },
    ],
    solutions: [
      {
        label: 'Plain recursion',
        complexity: 'O(3ⁿ)',
        code: `function tribonacci(n) {
  if (n === 0) return 0;
  if (n <= 2) return 1;
  return tribonacci(n - 1) + tribonacci(n - 2) + tribonacci(n - 3);
}`,
      },
      {
        label: 'Rolling window of three',
        complexity: 'O(n)',
        code: `function tribonacci(n) {
  if (n === 0) return 0;
  if (n <= 2) return 1;
  let a = 0;
  let b = 1;
  let c = 1;
  for (let i = 3; i <= n; i++) {
    const d = a + b + c;
    a = b;
    b = c;
    c = d;
  }
  return c;
}`,
      },
    ],
    scale: { sizes: SMALL, make: (n) => JSON.stringify([n]) },
  },
  {
    id: 'delete-and-earn',
    category: 'dp',
    lc: 'delete-and-earn',
    n: 740,
    title: 'Delete and Earn',
    difficulty: 'Medium',
    tags: ['house robber', 'counting'],
    pattern: 'Bucket by value, then House Robber',
    summary:
      'Taking a number earns its value and removes every copy of the numbers one above and one below it; maximize the points.',
    hook: 'Bucket points by value; taking value v forbids v-1 and v+1, which is exactly House Robber.',
    real: 'Reducing a problem with neighbor conflicts to a known linear form is a common modeling step.',
    input: '[[3, 4, 2]]',
    expected: '6',
    cases: [
      { input: '[[2, 2, 3, 3, 3, 4]]', expected: '9' },
      { input: '[[1]]', expected: '1' },
      { input: '[[]]', expected: '0' },
    ],
    solutions: [
      {
        label: 'Buckets + plain recursion',
        complexity: 'O(2^max)',
        code: `function pick(points, i) {
  if (i >= points.length) return 0;
  return Math.max(pick(points, i + 1), points[i] + pick(points, i + 2));
}
function deleteAndEarn(nums) {
  if (nums.length === 0) return 0;
  let top = 0;
  for (const x of nums) if (x > top) top = x;
  const points = new Array(top + 1).fill(0);
  for (const x of nums) points[x] += x;
  return pick(points, 0);
}`,
      },
      {
        label: 'Buckets + rolling pair',
        complexity: 'O(n + max)',
        code: `function deleteAndEarn(nums) {
  if (nums.length === 0) return 0;
  let top = 0;
  for (const x of nums) if (x > top) top = x;
  const points = new Array(top + 1).fill(0);
  for (const x of nums) points[x] += x;
  let skip = 0;
  let take = 0;
  for (const p of points) {
    const next = Math.max(take, skip + p);
    skip = take;
    take = next;
  }
  return take;
}`,
      },
    ],
    scale: { sizes: SMALL, make: (n) => JSON.stringify([arr(n, (i) => i + 1)]) },
  },
  {
    id: 'zero-one-knapsack',
    category: 'dp',
    title: '0/1 Knapsack',
    difficulty: 'Medium',
    tags: ['knapsack'],
    pattern: '0/1 knapsack, capacity table',
    summary:
      'Given item weights, item values and a capacity, choose each item at most once to maximize total value without exceeding the capacity.',
    hook: 'Iterate capacity downward so each item is used only once.',
    real: 'Selecting which jobs, ads or cache entries to keep under a fixed budget is a knapsack.',
    input: '[[1, 3, 4, 5], [1, 4, 5, 7], 7]',
    expected: '9',
    cases: [
      { input: '[[], [], 5]', expected: '0' },
      { input: '[[5], [10], 4]', expected: '0' },
      { input: '[[2], [3], 2]', expected: '3' },
    ],
    solutions: [
      {
        label: 'Take or skip recursion',
        complexity: 'O(2ⁿ)',
        code: `function best(weights, values, i, cap) {
  if (i === weights.length) return 0;
  let result = best(weights, values, i + 1, cap);
  if (weights[i] <= cap) {
    const taken = values[i] + best(weights, values, i + 1, cap - weights[i]);
    if (taken > result) result = taken;
  }
  return result;
}
function knapsack(weights, values, cap) {
  return best(weights, values, 0, cap);
}`,
      },
      {
        label: 'Rolling capacity table',
        complexity: 'O(n·W)',
        code: `function knapsack(weights, values, cap) {
  const dp = new Array(cap + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    for (let w = cap; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    }
  }
  return dp[cap];
}`,
      },
    ],
    scale: {
      sizes: [4, 8, 12, 14, 16],
      make: (n) =>
        JSON.stringify([arr(n, (i) => (i % 5) + 1), arr(n, (i) => ((i * 3) % 7) + 1), 2 * n]),
    },
  },
];
