import type { Problem } from '../types';

export const backtracking: Problem[] = [
  {
    id: 'subsets',
    category: 'backtracking',
    lc: 'subsets',
    n: 78,
    title: 'All Subsets',
    difficulty: 'Medium',
    tags: ['recursion', 'bitmask'],
    pattern: 'Choose / explore / undo',
    summary:
      'Given distinct numbers, list every possible subset (including the empty one), sorted so the output order is predictable.',
    hook: 'Every element is in or out: 2ⁿ leaves, one decision per level.',
    real: 'Feature-flag matrix testing and config sweeps enumerate every on/off combination the same way.',
    input: '[[1, 2, 3]]',
    expected: '[[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]',
    cases: [
      { input: '[[0]]', expected: '[[], [0]]' },
      { input: '[[]]', expected: '[[]]' },
      { input: '[[1, 2]]', expected: '[[], [1], [1, 2], [2]]' },
    ],
    solutions: [
      {
        label: 'Backtracking',
        complexity: 'O(n·2ⁿ)',
        code: `function cmp(a, b) {
  for (let i = 0; i < a.length && i < b.length; i++) {
    if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  }
  return a.length - b.length;
}

function dfs(nums, start, path, out) {
  out.push(path.slice());
  for (let i = start; i < nums.length; i++) {
    path.push(nums[i]);
    dfs(nums, i + 1, path, out);
    path.pop();
  }
}

function subsets(nums) {
  const out = [];
  dfs(nums, 0, [], out);
  return out.sort(cmp);
}`,
      },
      {
        label: 'Bitmask counting',
        complexity: 'O(n·2ⁿ)',
        code: `function cmp(a, b) {
  for (let i = 0; i < a.length && i < b.length; i++) {
    if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  }
  return a.length - b.length;
}

function subsets(nums) {
  const n = nums.length;
  const out = [];
  for (let mask = 0; mask < (1 << n); mask++) {
    const cur = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) cur.push(nums[i]);
    }
    out.push(cur);
  }
  return out.sort(cmp);
}`,
      },
    ],
  },
  {
    id: 'subsets-ii',
    category: 'backtracking',
    lc: 'subsets-ii',
    n: 90,
    title: 'Subsets With Duplicates',
    difficulty: 'Medium',
    tags: ['recursion', 'duplicates'],
    pattern: 'Sort + skip equal siblings',
    summary: 'The numbers may repeat. List every distinct subset exactly once, in sorted order.',
    hook: 'Sort first; at one level never pick the same value twice as a branch.',
    real: 'Deduplicating multiset combinations, like distinct ingredient bundles from a cart with repeated items.',
    input: '[[1, 2, 2]]',
    expected: '[[], [1], [1, 2], [1, 2, 2], [2], [2, 2]]',
    cases: [
      { input: '[[0]]', expected: '[[], [0]]' },
      { input: '[[2, 2]]', expected: '[[], [2], [2, 2]]' },
      { input: '[[2, 1, 2]]', expected: '[[], [1], [1, 2], [1, 2, 2], [2], [2, 2]]' },
    ],
    solutions: [
      {
        label: 'Enumerate all, dedupe with a set',
        complexity: 'O(n·2ⁿ)',
        code: `function cmp(a, b) {
  for (let i = 0; i < a.length && i < b.length; i++) {
    if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  }
  return a.length - b.length;
}

function numCmp(x, y) {
  return x - y;
}

function subsetsWithDup(nums) {
  const a = nums.slice().sort(numCmp);
  const seen = new Set();
  const out = [];
  for (let mask = 0; mask < (1 << a.length); mask++) {
    const cur = [];
    for (let i = 0; i < a.length; i++) {
      if (mask & (1 << i)) cur.push(a[i]);
    }
    const key = cur.join(',');
    if (!seen.has(key)) {
      seen.add(key);
      out.push(cur);
    }
  }
  return out.sort(cmp);
}`,
      },
      {
        label: 'Sorted backtracking, skip repeats',
        complexity: 'O(n·2ⁿ)',
        code: `function cmp(a, b) {
  for (let i = 0; i < a.length && i < b.length; i++) {
    if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  }
  return a.length - b.length;
}

function numCmp(x, y) {
  return x - y;
}

function dfs(a, start, path, out) {
  out.push(path.slice());
  for (let i = start; i < a.length; i++) {
    if (i > start && a[i] === a[i - 1]) continue;
    path.push(a[i]);
    dfs(a, i + 1, path, out);
    path.pop();
  }
}

function subsetsWithDup(nums) {
  const a = nums.slice().sort(numCmp);
  const out = [];
  dfs(a, 0, [], out);
  return out.sort(cmp);
}`,
      },
    ],
  },
  {
    id: 'permutations',
    category: 'backtracking',
    lc: 'permutations',
    n: 46,
    title: 'All Permutations',
    difficulty: 'Medium',
    tags: ['recursion', 'swap'],
    pattern: 'Choose / explore / undo',
    summary:
      'List every ordering of a set of distinct numbers, in sorted order of the resulting lists.',
    hook: 'Fix a position, try each unused value there, recurse, then put it back.',
    real: 'Brute-force route ordering for a handful of delivery stops, or generating test orderings for race conditions.',
    input: '[[1, 2, 3]]',
    expected: '[[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]',
    cases: [
      { input: '[[7]]', expected: '[[7]]' },
      { input: '[[0, 1]]', expected: '[[0, 1], [1, 0]]' },
    ],
    solutions: [
      {
        label: 'Used-flags backtracking',
        complexity: 'O(n·n!)',
        code: `function cmp(a, b) {
  for (let i = 0; i < a.length && i < b.length; i++) {
    if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  }
  return a.length - b.length;
}

function dfs(nums, path, used, out) {
  if (path.length === nums.length) {
    out.push(path.slice());
    return;
  }
  for (let i = 0; i < nums.length; i++) {
    if (used[i]) continue;
    used[i] = true;
    path.push(nums[i]);
    dfs(nums, path, used, out);
    path.pop();
    used[i] = false;
  }
}

function permute(nums) {
  const out = [];
  dfs(nums, [], new Array(nums.length).fill(false), out);
  return out.sort(cmp);
}`,
      },
      {
        label: 'In-place swapping',
        complexity: 'O(n·n!)',
        code: `function cmp(a, b) {
  for (let i = 0; i < a.length && i < b.length; i++) {
    if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  }
  return a.length - b.length;
}

function dfs(a, k, out) {
  if (k === a.length) {
    out.push(a.slice());
    return;
  }
  for (let i = k; i < a.length; i++) {
    const t = a[k];
    a[k] = a[i];
    a[i] = t;
    dfs(a, k + 1, out);
    const u = a[k];
    a[k] = a[i];
    a[i] = u;
  }
}

function permute(nums) {
  const a = nums.slice();
  const out = [];
  dfs(a, 0, out);
  return out.sort(cmp);
}`,
      },
    ],
  },
  {
    id: 'permutations-ii',
    category: 'backtracking',
    lc: 'permutations-ii',
    n: 47,
    title: 'Permutations With Duplicates',
    difficulty: 'Medium',
    tags: ['recursion', 'duplicates'],
    pattern: 'Sort + skip equal siblings',
    summary: 'The numbers may repeat. List every distinct ordering exactly once, in sorted order.',
    hook: 'Sorted input: an equal twin may only be used after its left twin is used.',
    real: 'Generating distinct anagram-style variants, such as the unique shuffles of a repeated-symbol test pattern.',
    input: '[[1, 1, 2]]',
    expected: '[[1, 1, 2], [1, 2, 1], [2, 1, 1]]',
    cases: [
      { input: '[[2, 2]]', expected: '[[2, 2]]' },
      { input: '[[1, 2, 2]]', expected: '[[1, 2, 2], [2, 1, 2], [2, 2, 1]]' },
      { input: '[[5]]', expected: '[[5]]' },
    ],
    solutions: [
      {
        label: 'Generate all, dedupe with a set',
        complexity: 'O(n·n!)',
        code: `function cmp(a, b) {
  for (let i = 0; i < a.length && i < b.length; i++) {
    if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  }
  return a.length - b.length;
}

function dfs(nums, path, used, out) {
  if (path.length === nums.length) {
    out.push(path.slice());
    return;
  }
  for (let i = 0; i < nums.length; i++) {
    if (used[i]) continue;
    used[i] = true;
    path.push(nums[i]);
    dfs(nums, path, used, out);
    path.pop();
    used[i] = false;
  }
}

function permuteUnique(nums) {
  const all = [];
  dfs(nums, [], new Array(nums.length).fill(false), all);
  const seen = new Set();
  const out = [];
  for (let i = 0; i < all.length; i++) {
    const key = all[i].join(',');
    if (!seen.has(key)) {
      seen.add(key);
      out.push(all[i]);
    }
  }
  return out.sort(cmp);
}`,
      },
      {
        label: 'Sorted backtracking, skip repeats',
        complexity: 'O(n·n!)',
        code: `function cmp(a, b) {
  for (let i = 0; i < a.length && i < b.length; i++) {
    if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  }
  return a.length - b.length;
}

function numCmp(x, y) {
  return x - y;
}

function dfs(a, path, used, out) {
  if (path.length === a.length) {
    out.push(path.slice());
    return;
  }
  for (let i = 0; i < a.length; i++) {
    if (used[i]) continue;
    if (i > 0 && a[i] === a[i - 1] && !used[i - 1]) continue;
    used[i] = true;
    path.push(a[i]);
    dfs(a, path, used, out);
    path.pop();
    used[i] = false;
  }
}

function permuteUnique(nums) {
  const a = nums.slice().sort(numCmp);
  const out = [];
  dfs(a, [], new Array(a.length).fill(false), out);
  return out.sort(cmp);
}`,
      },
    ],
  },
  {
    id: 'combinations',
    category: 'backtracking',
    lc: 'combinations',
    n: 77,
    title: 'Choose K From N',
    difficulty: 'Medium',
    tags: ['recursion', 'pruning'],
    pattern: 'Backtracking with pruning',
    summary:
      'Return every group of k numbers picked from 1..n, ignoring order inside a group, sorted.',
    hook: 'Move forward only, and stop early when too few numbers remain to fill the group.',
    real: 'Picking k-sized teams or k-field composite indexes from a pool of candidates.',
    input: '[4, 2]',
    expected: '[[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]]',
    cases: [
      { input: '[1, 1]', expected: '[[1]]' },
      { input: '[3, 3]', expected: '[[1, 2, 3]]' },
      { input: '[3, 0]', expected: '[[]]' },
    ],
    solutions: [
      {
        label: 'Scan all subsets, keep size k',
        complexity: 'O(n·2ⁿ)',
        code: `function cmp(a, b) {
  for (let i = 0; i < a.length && i < b.length; i++) {
    if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  }
  return a.length - b.length;
}

function combine(n, k) {
  const out = [];
  for (let mask = 0; mask < (1 << n); mask++) {
    const cur = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) cur.push(i + 1);
    }
    if (cur.length === k) out.push(cur);
  }
  return out.sort(cmp);
}`,
      },
      {
        label: 'Backtracking with pruning',
        complexity: 'O(k·C(n,k))',
        code: `function cmp(a, b) {
  for (let i = 0; i < a.length && i < b.length; i++) {
    if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  }
  return a.length - b.length;
}

function dfs(n, k, start, path, out) {
  if (path.length === k) {
    out.push(path.slice());
    return;
  }
  const last = n - (k - path.length) + 1;
  for (let i = start; i <= last; i++) {
    path.push(i);
    dfs(n, k, i + 1, path, out);
    path.pop();
  }
}

function combine(n, k) {
  const out = [];
  dfs(n, k, 1, [], out);
  return out.sort(cmp);
}`,
      },
    ],
    scale: {
      sizes: [6, 8, 10, 12, 13],
      make: (n) => JSON.stringify([n, 2]),
    },
  },
  {
    id: 'combination-sum',
    category: 'backtracking',
    lc: 'combination-sum',
    n: 39,
    title: 'Combination Sum',
    difficulty: 'Medium',
    tags: ['recursion', 'pruning'],
    pattern: 'Backtracking with sorted break',
    summary:
      'Find every multiset of the given distinct numbers that adds up to the target. Each number can be reused as often as you like.',
    hook: 'Sort candidates; once one overshoots, every later one does too, so break.',
    real: 'Making change or filling a shipping container with unlimited stock of a few item sizes.',
    input: '[[2, 3, 6, 7], 7]',
    expected: '[[2, 2, 3], [7]]',
    cases: [
      { input: '[[2, 3, 5], 8]', expected: '[[2, 2, 2, 2], [2, 3, 3], [3, 5]]' },
      { input: '[[2], 1]', expected: '[]' },
      { input: '[[1], 2]', expected: '[[1, 1]]' },
    ],
    solutions: [
      {
        label: 'Try every candidate, reject overshoot after',
        complexity: 'O(n^(t/m))',
        code: `function cmp(a, b) {
  for (let i = 0; i < a.length && i < b.length; i++) {
    if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  }
  return a.length - b.length;
}

function dfs(c, start, remain, path, out) {
  if (remain === 0) {
    out.push(path.slice());
    return;
  }
  if (remain < 0) return;
  for (let i = start; i < c.length; i++) {
    path.push(c[i]);
    dfs(c, i, remain - c[i], path, out);
    path.pop();
  }
}

function combinationSum(candidates, target) {
  const out = [];
  dfs(candidates, 0, target, [], out);
  return out.sort(cmp);
}`,
      },
      {
        label: 'Sort, then break early',
        complexity: 'O(n^(t/m))',
        code: `function cmp(a, b) {
  for (let i = 0; i < a.length && i < b.length; i++) {
    if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  }
  return a.length - b.length;
}

function numCmp(x, y) {
  return x - y;
}

function dfs(c, start, remain, path, out) {
  if (remain === 0) {
    out.push(path.slice());
    return;
  }
  for (let i = start; i < c.length; i++) {
    if (c[i] > remain) break;
    path.push(c[i]);
    dfs(c, i, remain - c[i], path, out);
    path.pop();
  }
}

function combinationSum(candidates, target) {
  const c = candidates.slice().sort(numCmp);
  const out = [];
  dfs(c, 0, target, [], out);
  return out.sort(cmp);
}`,
      },
    ],
    scale: {
      sizes: [2, 5, 10, 15, 20],
      make: (n) => {
        const c: number[] = [];
        for (let i = 0; i < n; i++) c.push(100 + i);
        c.push(2, 3, 5);
        return JSON.stringify([c, 12]);
      },
    },
  },
  {
    id: 'combination-sum-ii',
    category: 'backtracking',
    lc: 'combination-sum-ii',
    n: 40,
    title: 'Combination Sum, Each Used Once',
    difficulty: 'Medium',
    tags: ['recursion', 'duplicates'],
    pattern: 'Sort + skip equal siblings',
    summary:
      'Numbers may repeat in the input but each position can be used at most once. Return every distinct group that adds up to the target.',
    hook: 'Sorted + move on after each pick + skip a value already tried at this level.',
    real: 'Matching a budget against a list of one-off invoices without reporting the same bundle twice.',
    input: '[[10, 1, 2, 7, 6, 1, 5], 8]',
    expected: '[[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]]',
    cases: [
      { input: '[[2, 5, 2, 1, 2], 5]', expected: '[[1, 2, 2], [5]]' },
      { input: '[[2], 1]', expected: '[]' },
      { input: '[[1, 1], 2]', expected: '[[1, 1]]' },
    ],
    solutions: [
      {
        label: 'Every subset, filter by sum, dedupe',
        complexity: 'O(n·2ⁿ)',
        code: `function cmp(a, b) {
  for (let i = 0; i < a.length && i < b.length; i++) {
    if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  }
  return a.length - b.length;
}

function numCmp(x, y) {
  return x - y;
}

function combinationSum2(candidates, target) {
  const a = candidates.slice().sort(numCmp);
  const seen = new Set();
  const out = [];
  for (let mask = 0; mask < (1 << a.length); mask++) {
    const cur = [];
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      if (mask & (1 << i)) {
        cur.push(a[i]);
        sum += a[i];
      }
    }
    if (sum !== target) continue;
    const key = cur.join(',');
    if (!seen.has(key)) {
      seen.add(key);
      out.push(cur);
    }
  }
  return out.sort(cmp);
}`,
      },
      {
        label: 'Sorted backtracking with pruning',
        complexity: 'O(2ⁿ)',
        code: `function cmp(a, b) {
  for (let i = 0; i < a.length && i < b.length; i++) {
    if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  }
  return a.length - b.length;
}

function numCmp(x, y) {
  return x - y;
}

function dfs(a, start, remain, path, out) {
  if (remain === 0) {
    out.push(path.slice());
    return;
  }
  for (let i = start; i < a.length; i++) {
    if (a[i] > remain) break;
    if (i > start && a[i] === a[i - 1]) continue;
    path.push(a[i]);
    dfs(a, i + 1, remain - a[i], path, out);
    path.pop();
  }
}

function combinationSum2(candidates, target) {
  const a = candidates.slice().sort(numCmp);
  const out = [];
  dfs(a, 0, target, [], out);
  return out.sort(cmp);
}`,
      },
    ],
    scale: {
      sizes: [6, 8, 10, 12, 13],
      make: (n) => {
        const c: number[] = [];
        for (let i = 1; i <= n; i++) c.push(i);
        return JSON.stringify([c, n]);
      },
    },
  },
  {
    id: 'generate-parentheses',
    category: 'backtracking',
    lc: 'generate-parentheses',
    n: 22,
    title: 'Generate Balanced Parentheses',
    difficulty: 'Medium',
    tags: ['recursion', 'strings'],
    pattern: 'Backtracking with counters',
    summary:
      'Produce every well-formed string made of n pairs of round brackets, sorted alphabetically.',
    hook: 'Open while you have some left; close only when more are open than closed.',
    real: 'Generating valid nested structures, for example test inputs for a bracket-aware parser.',
    input: '[3]',
    expected: '["((()))", "(()())", "(())()", "()(())", "()()()"]',
    cases: [
      { input: '[1]', expected: '["()"]' },
      { input: '[2]', expected: '["(())", "()()"]' },
    ],
    solutions: [
      {
        label: 'Build every bit string, keep the valid ones',
        complexity: 'O(n·4ⁿ)',
        code: `function isValid(s) {
  let bal = 0;
  for (let i = 0; i < s.length; i++) {
    bal += s[i] === '(' ? 1 : -1;
    if (bal < 0) return false;
  }
  return bal === 0;
}

function generateParenthesis(n) {
  const out = [];
  const total = 2 * n;
  for (let mask = 0; mask < (1 << total); mask++) {
    let s = '';
    for (let i = 0; i < total; i++) {
      s += (mask & (1 << i)) ? '(' : ')';
    }
    if (isValid(s)) out.push(s);
  }
  return out.sort();
}`,
      },
      {
        label: 'Backtrack with open/close counts',
        complexity: 'O(4ⁿ/√n)',
        code: `function dfs(open, close, n, cur, out) {
  if (cur.length === 2 * n) {
    out.push(cur);
    return;
  }
  if (open < n) {
    dfs(open + 1, close, n, cur + '(', out);
  }
  if (close < open) {
    dfs(open, close + 1, n, cur + ')', out);
  }
}

function generateParenthesis(n) {
  const out = [];
  dfs(0, 0, n, '', out);
  return out.sort();
}`,
      },
    ],
    scale: {
      sizes: [2, 3, 4, 5, 6],
      make: (n) => JSON.stringify([n]),
    },
  },
  {
    id: 'letter-combinations-of-a-phone-number',
    category: 'backtracking',
    lc: 'letter-combinations-of-a-phone-number',
    n: 17,
    title: 'Phone Keypad Words',
    difficulty: 'Medium',
    tags: ['recursion', 'strings'],
    pattern: 'Cartesian product by DFS',
    summary:
      'Each digit 2-9 on an old phone keypad maps to several letters. Return every letter string the digit string could spell, sorted.',
    hook: 'One level per digit, one branch per letter on that key.',
    real: 'T9 predictive text and dial-by-name features expand digit presses into candidate words.',
    input: '["23"]',
    expected: '["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]',
    cases: [
      { input: '[""]', expected: '[]' },
      { input: '["7"]', expected: '["p", "q", "r", "s"]' },
      {
        input: '["29"]',
        expected: '["aw", "ax", "ay", "az", "bw", "bx", "by", "bz", "cw", "cx", "cy", "cz"]',
      },
    ],
    solutions: [
      {
        label: 'Iterative expansion',
        complexity: 'O(4ⁿ·n)',
        code: `function letters(d) {
  const m = ['', '', 'abc', 'def', 'ghi', 'jkl', 'mno', 'pqrs', 'tuv', 'wxyz'];
  return m[d];
}

function letterCombinations(digits) {
  if (digits.length === 0) return [];
  let out = [''];
  for (let i = 0; i < digits.length; i++) {
    const chars = letters(digits[i]);
    const next = [];
    for (let j = 0; j < out.length; j++) {
      for (let k = 0; k < chars.length; k++) {
        next.push(out[j] + chars[k]);
      }
    }
    out = next;
  }
  return out.sort();
}`,
      },
      {
        label: 'Recursive DFS',
        complexity: 'O(4ⁿ·n)',
        code: `function letters(d) {
  const m = ['', '', 'abc', 'def', 'ghi', 'jkl', 'mno', 'pqrs', 'tuv', 'wxyz'];
  return m[d];
}

function dfs(digits, i, cur, out) {
  if (i === digits.length) {
    out.push(cur);
    return;
  }
  const chars = letters(digits[i]);
  for (let k = 0; k < chars.length; k++) {
    dfs(digits, i + 1, cur + chars[k], out);
  }
}

function letterCombinations(digits) {
  if (digits.length === 0) return [];
  const out = [];
  dfs(digits, 0, '', out);
  return out.sort();
}`,
      },
    ],
  },
  {
    id: 'palindrome-partitioning',
    category: 'backtracking',
    lc: 'palindrome-partitioning',
    n: 131,
    title: 'Palindrome Partitioning',
    difficulty: 'Medium',
    tags: ['recursion', 'dp', 'strings'],
    pattern: 'Backtracking + palindrome table',
    summary:
      'Cut a string into pieces so that every piece reads the same forwards and backwards. Return all ways, sorted.',
    hook: 'At each position try every palindromic first piece, then recurse on the rest.',
    real: 'Segmenting text into symmetric chunks resembles tokenizers that test candidate splits against a rule.',
    input: '["aab"]',
    expected: '[["a", "a", "b"], ["aa", "b"]]',
    cases: [
      { input: '["a"]', expected: '[["a"]]' },
      { input: '["aba"]', expected: '[["a", "b", "a"], ["aba"]]' },
      { input: '["ab"]', expected: '[["a", "b"]]' },
    ],
    solutions: [
      {
        label: 'Re-check each piece',
        complexity: 'O(n²·2ⁿ)',
        code: `function cmp(a, b) {
  for (let i = 0; i < a.length && i < b.length; i++) {
    if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  }
  return a.length - b.length;
}

function isPal(s, i, j) {
  while (i < j) {
    if (s[i] !== s[j]) return false;
    i++;
    j--;
  }
  return true;
}

function dfs(s, start, path, out) {
  if (start === s.length) {
    out.push(path.slice());
    return;
  }
  for (let end = start; end < s.length; end++) {
    if (!isPal(s, start, end)) continue;
    path.push(s.substring(start, end + 1));
    dfs(s, end + 1, path, out);
    path.pop();
  }
}

function partition(s) {
  const out = [];
  dfs(s, 0, [], out);
  return out.sort(cmp);
}`,
      },
      {
        label: 'Precomputed palindrome table',
        complexity: 'O(n·2ⁿ)',
        code: `function cmp(a, b) {
  for (let i = 0; i < a.length && i < b.length; i++) {
    if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  }
  return a.length - b.length;
}

function dfs(s, pal, start, path, out) {
  if (start === s.length) {
    out.push(path.slice());
    return;
  }
  for (let end = start; end < s.length; end++) {
    if (!pal[start][end]) continue;
    path.push(s.substring(start, end + 1));
    dfs(s, pal, end + 1, path, out);
    path.pop();
  }
}

function partition(s) {
  const n = s.length;
  const pal = [];
  for (let i = 0; i < n; i++) {
    pal.push(new Array(n).fill(false));
  }
  for (let i = n - 1; i >= 0; i--) {
    for (let j = i; j < n; j++) {
      if (s[i] === s[j] && (j - i < 2 || pal[i + 1][j - 1])) {
        pal[i][j] = true;
      }
    }
  }
  const out = [];
  dfs(s, pal, 0, [], out);
  return out.sort(cmp);
}`,
      },
    ],
    scale: {
      sizes: [4, 5, 6, 7, 8],
      make: (n) => JSON.stringify(['a'.repeat(n)]),
    },
  },
  {
    id: 'n-queens',
    category: 'backtracking',
    lc: 'n-queens',
    n: 51,
    title: 'N-Queens (Count Solutions)',
    difficulty: 'Hard',
    tags: ['recursion', 'bitmask'],
    pattern: 'Row-by-row placement',
    summary:
      'Place n queens on an n by n board so none attack each other. Return how many distinct placements exist.',
    hook: 'One queen per row; track taken columns and both diagonals.',
    real: 'Constraint solvers for scheduling and resource allocation prune partial assignments in just this way.',
    input: '[4]',
    expected: '2',
    cases: [
      { input: '[1]', expected: '1' },
      { input: '[2]', expected: '0' },
      { input: '[5]', expected: '10' },
      { input: '[6]', expected: '4' },
    ],
    solutions: [
      {
        label: 'Rescan earlier queens',
        complexity: 'O(n!)',
        code: `function safe(cols, r, c) {
  for (let i = 0; i < r; i++) {
    const d = cols[i] - c;
    if (d === 0 || d === r - i || d === i - r) return false;
  }
  return true;
}

function place(cols, r, n) {
  if (r === n) return 1;
  let count = 0;
  for (let c = 0; c < n; c++) {
    if (safe(cols, r, c)) {
      cols[r] = c;
      count += place(cols, r + 1, n);
    }
  }
  return count;
}

function totalNQueens(n) {
  return place(new Array(n).fill(-1), 0, n);
}`,
      },
      {
        label: 'Bitmask of attacked squares',
        complexity: 'O(n!)',
        code: `function place(cols, d1, d2, full) {
  if (cols === full) return 1;
  let count = 0;
  let avail = full & ~(cols | d1 | d2);
  while (avail) {
    const bit = avail & -avail;
    avail -= bit;
    count += place(cols | bit, ((d1 | bit) << 1) & full, (d2 | bit) >> 1, full);
  }
  return count;
}

function totalNQueens(n) {
  return place(0, 0, 0, (1 << n) - 1);
}`,
      },
    ],
    scale: {
      sizes: [4, 5, 6, 7, 8],
      make: (n) => JSON.stringify([n]),
    },
  },
  {
    id: 'word-search',
    category: 'backtracking',
    lc: 'word-search',
    n: 79,
    title: 'Word Search In A Grid',
    difficulty: 'Medium',
    tags: ['grid', 'dfs'],
    pattern: 'DFS with mark and unmark',
    summary:
      'Decide whether a word can be traced through a grid of letters by stepping up, down, left or right without reusing a cell.',
    hook: 'Mark the cell, try four neighbours, unmark on the way back.',
    real: 'Path matching on a grid shows up in puzzle solvers and in pattern search over tile maps.',
    input: '[[["A", "B", "C"], ["D", "E", "F"]], "ABEF"]',
    expected: 'true',
    cases: [
      { input: '[[["A", "B"], ["C", "D"]], "ABDC"]', expected: 'true' },
      { input: '[[["A", "B"], ["C", "D"]], "ABA"]', expected: 'false' },
      { input: '[[["A", "B"], ["C", "D"]], "ABCD"]', expected: 'false' },
      { input: '[[["A"]], "A"]', expected: 'true' },
    ],
    solutions: [
      {
        label: 'DFS with a separate visited grid',
        complexity: 'O(m·n·4^L)',
        code: `function dfs(board, word, r, c, k, visited) {
  if (k === word.length) return true;
  if (r < 0 || c < 0 || r >= board.length || c >= board[0].length) return false;
  if (visited[r][c] || board[r][c] !== word[k]) return false;
  visited[r][c] = true;
  const found =
    dfs(board, word, r + 1, c, k + 1, visited) ||
    dfs(board, word, r - 1, c, k + 1, visited) ||
    dfs(board, word, r, c + 1, k + 1, visited) ||
    dfs(board, word, r, c - 1, k + 1, visited);
  visited[r][c] = false;
  return found;
}

function exist(board, word) {
  const visited = [];
  for (let r = 0; r < board.length; r++) {
    visited.push(new Array(board[0].length).fill(false));
  }
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[0].length; c++) {
      if (dfs(board, word, r, c, 0, visited)) return true;
    }
  }
  return false;
}`,
      },
      {
        label: 'In-place marking + letter-count precheck',
        complexity: 'O(m·n·3^L)',
        code: `function dfs(board, word, r, c, k) {
  if (k === word.length) return true;
  if (r < 0 || c < 0 || r >= board.length || c >= board[0].length) return false;
  if (board[r][c] !== word[k]) return false;
  const ch = board[r][c];
  board[r][c] = '#';
  const found =
    dfs(board, word, r + 1, c, k + 1) ||
    dfs(board, word, r - 1, c, k + 1) ||
    dfs(board, word, r, c + 1, k + 1) ||
    dfs(board, word, r, c - 1, k + 1);
  board[r][c] = ch;
  return found;
}

function exist(board, word) {
  const have = {};
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[0].length; c++) {
      have[board[r][c]] = (have[board[r][c]] || 0) + 1;
    }
  }
  const need = {};
  for (let i = 0; i < word.length; i++) {
    need[word[i]] = (need[word[i]] || 0) + 1;
    if ((have[word[i]] || 0) < need[word[i]]) return false;
  }
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[0].length; c++) {
      if (dfs(board, word, r, c, 0)) return true;
    }
  }
  return false;
}`,
      },
    ],
    scale: {
      sizes: [2, 3, 4, 5],
      make: (n) => {
        const board: string[][] = [];
        for (let r = 0; r < n; r++) board.push(new Array(n).fill('A'));
        return JSON.stringify([board, 'AAAAAB']);
      },
    },
  },
  {
    id: 'restore-ip-addresses',
    category: 'backtracking',
    lc: 'restore-ip-addresses',
    n: 93,
    title: 'Restore IP Addresses',
    difficulty: 'Medium',
    tags: ['recursion', 'strings'],
    pattern: 'Backtracking with length pruning',
    summary:
      'A string of digits lost its dots. Insert three dots to form every valid IPv4 address (parts 0-255, no leading zeros), sorted.',
    hook: 'Four parts of 1-3 digits; bail out when the leftover length cannot fit.',
    real: 'Log parsers and network tools must recover structure from dotless or mangled address text.',
    input: '["25525511135"]',
    expected: '["255.255.11.135", "255.255.111.35"]',
    cases: [
      { input: '["0000"]', expected: '["0.0.0.0"]' },
      {
        input: '["101023"]',
        expected: '["1.0.10.23", "1.0.102.3", "10.1.0.23", "10.10.2.3", "101.0.2.3"]',
      },
      { input: '["1234567890123"]', expected: '[]' },
    ],
    solutions: [
      {
        label: 'Three nested cut-length loops',
        complexity: 'O(1)',
        code: `function validPart(s, i, len) {
  const p = s.substring(i, i + len);
  if (p.length !== len) return false;
  if (len > 1 && p[0] === '0') return false;
  return Number(p) <= 255;
}

function restoreIpAddresses(s) {
  const out = [];
  const n = s.length;
  for (let a = 1; a <= 3; a++) {
    for (let b = 1; b <= 3; b++) {
      for (let c = 1; c <= 3; c++) {
        const d = n - a - b - c;
        if (d < 1 || d > 3) continue;
        if (
          validPart(s, 0, a) &&
          validPart(s, a, b) &&
          validPart(s, a + b, c) &&
          validPart(s, a + b + c, d)
        ) {
          out.push(
            s.substring(0, a) + '.' + s.substring(a, a + b) + '.' +
              s.substring(a + b, a + b + c) + '.' + s.substring(a + b + c),
          );
        }
      }
    }
  }
  return out.sort();
}`,
      },
      {
        label: 'Recursive backtracking',
        complexity: 'O(1)',
        code: `function validPart(s, i, len) {
  const p = s.substring(i, i + len);
  if (p.length !== len) return false;
  if (len > 1 && p[0] === '0') return false;
  return Number(p) <= 255;
}

function dfs(s, i, parts, out) {
  const rem = s.length - i;
  const need = 4 - parts.length;
  if (need === 0) {
    if (rem === 0) out.push(parts.join('.'));
    return;
  }
  if (rem < need || rem > need * 3) return;
  for (let len = 1; len <= 3; len++) {
    if (!validPart(s, i, len)) continue;
    parts.push(s.substring(i, i + len));
    dfs(s, i + len, parts, out);
    parts.pop();
  }
}

function restoreIpAddresses(s) {
  const out = [];
  dfs(s, 0, [], out);
  return out.sort();
}`,
      },
    ],
  },
];
