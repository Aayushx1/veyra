import type { Problem } from '../types';

const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);
const J = (v: unknown) => JSON.stringify(v);

const SUDOKU = [
  ['5', '3', '.', '.', '7', '.', '.', '.', '.'],
  ['6', '.', '.', '1', '9', '5', '.', '.', '.'],
  ['.', '9', '8', '.', '.', '.', '.', '6', '.'],
  ['8', '.', '.', '.', '6', '.', '.', '.', '3'],
  ['4', '.', '.', '8', '.', '3', '.', '.', '1'],
  ['7', '.', '.', '.', '2', '.', '.', '.', '6'],
  ['.', '6', '.', '.', '.', '.', '2', '8', '.'],
  ['.', '.', '.', '4', '1', '9', '.', '.', '5'],
  ['.', '.', '.', '.', '8', '.', '.', '7', '9'],
];
const SUDOKU_BAD = SUDOKU.map((r) => r.slice());
SUDOKU_BAD[0][0] = '8';
const SUDOKU_EMPTY = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => '.'));

export const arrays: Problem[] = [
  {
    id: 'contains-duplicate-ii',
    category: 'arrays',
    lc: 'contains-duplicate-ii',
    n: 219,
    tags: ['hash map', 'window'],
    title: 'Nearby Duplicate',
    difficulty: 'Easy',
    pattern: 'Hash map of last index',
    summary: 'Decide whether some value repeats at two positions that are at most k apart.',
    hook: 'Remember where you last saw each value, then compare distances.',
    real: 'Deduplicating events that arrive twice within a short time window.',
    input: '[[1, 2, 3, 1, 2, 3], 2]',
    expected: 'false',
    cases: [
      { input: '[[1, 0, 1, 1], 1]', expected: 'true' },
      { input: '[[1], 1]', expected: 'false' },
      { input: '[[5, 6, 7, 5], 3]', expected: 'true' },
    ],
    solutions: [
      {
        label: 'Look ahead k slots',
        complexity: 'O(n·k)',
        code: `function nearbyDuplicate(nums, k) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j <= i + k && j < nums.length; j++) {
      if (nums[i] === nums[j]) return true;
    }
  }
  return false;
}`,
      },
      {
        label: 'Last-seen map',
        complexity: 'O(n)',
        code: `function nearbyDuplicate(nums, k) {
  const last = new Map();
  for (let i = 0; i < nums.length; i++) {
    if (last.has(nums[i]) && i - last.get(nums[i]) <= k) return true;
    last.set(nums[i], i);
  }
  return false;
}`,
      },
    ],
    scale: { sizes: [4, 8, 16, 32, 64], make: (n) => J([range(n), Math.floor(n / 2)]) },
  },
  {
    id: 'valid-anagram',
    category: 'arrays',
    lc: 'valid-anagram',
    n: 242,
    tags: ['hash map', 'counting'],
    title: 'Anagram Check',
    difficulty: 'Easy',
    pattern: 'Frequency counting',
    summary: 'Tell whether one string is a rearrangement of the letters of another.',
    hook: 'Two words are anagrams exactly when their letter counts match.',
    real: 'Spell checkers and word games index words by their letter signature.',
    input: '["anagram", "nagaram"]',
    expected: 'true',
    cases: [
      { input: '["rat", "car"]', expected: 'false' },
      { input: '["", ""]', expected: 'true' },
      { input: '["a", "ab"]', expected: 'false' },
    ],
    solutions: [
      {
        label: 'Cross off letters',
        complexity: 'O(n²)',
        code: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const rest = t.split('');
  for (let i = 0; i < s.length; i++) {
    let found = -1;
    for (let j = 0; j < rest.length; j++) {
      if (rest[j] === s[i]) {
        found = j;
        break;
      }
    }
    if (found === -1) return false;
    rest.splice(found, 1);
  }
  return true;
}`,
      },
      {
        label: 'Count map',
        complexity: 'O(n)',
        code: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const counts = new Map();
  for (let i = 0; i < s.length; i++) {
    counts.set(s[i], (counts.get(s[i]) || 0) + 1);
  }
  for (let i = 0; i < t.length; i++) {
    if (!counts.get(t[i])) return false;
    counts.set(t[i], counts.get(t[i]) - 1);
  }
  return true;
}`,
      },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) => {
        const s = Array.from({ length: n }, (_, i) => String.fromCharCode(97 + (i % 26)));
        return J([s.join(''), s.slice().reverse().join('')]);
      },
    },
  },
  {
    id: 'group-anagrams',
    category: 'arrays',
    lc: 'group-anagrams',
    n: 49,
    tags: ['hash map', 'sorting'],
    title: 'Group Anagrams',
    difficulty: 'Medium',
    pattern: 'Canonical key grouping',
    summary:
      'Bucket words that are rearrangements of each other. Groups and members are returned in sorted order.',
    hook: 'Give every word a canonical key (sorted letters) and bucket by it.',
    real: 'Grouping near-identical records by a normalized fingerprint.',
    input: '[["eat", "tea", "tan", "ate", "nat", "bat"]]',
    expected: '[["ate", "eat", "tea"], ["bat"], ["nat", "tan"]]',
    cases: [
      { input: '[[""]]', expected: '[[""]]' },
      { input: '[["a"]]', expected: '[["a"]]' },
      { input: '[[]]', expected: '[]' },
    ],
    solutions: [
      {
        label: 'Scan existing groups',
        complexity: 'O(n²·k)',
        code: `function keyOf(w) {
  return w.split('').sort().join('');
}
function byFirst(a, b) {
  if (a[0] < b[0]) return -1;
  if (a[0] > b[0]) return 1;
  return 0;
}
function groupAnagrams(strs) {
  const keys = [];
  const groups = [];
  for (let i = 0; i < strs.length; i++) {
    const k = keyOf(strs[i]);
    let idx = -1;
    for (let g = 0; g < keys.length; g++) {
      if (keys[g] === k) {
        idx = g;
        break;
      }
    }
    if (idx === -1) {
      keys.push(k);
      groups.push([strs[i]]);
    } else {
      groups[idx].push(strs[i]);
    }
  }
  for (let g = 0; g < groups.length; g++) groups[g].sort();
  groups.sort(byFirst);
  return groups;
}`,
      },
      {
        label: 'Hash map by key',
        complexity: 'O(n·k log k)',
        code: `function keyOf(w) {
  return w.split('').sort().join('');
}
function byFirst(a, b) {
  if (a[0] < b[0]) return -1;
  if (a[0] > b[0]) return 1;
  return 0;
}
function groupAnagrams(strs) {
  const buckets = new Map();
  for (let i = 0; i < strs.length; i++) {
    const k = keyOf(strs[i]);
    if (!buckets.has(k)) buckets.set(k, []);
    buckets.get(k).push(strs[i]);
  }
  const groups = [];
  for (const g of buckets.values()) {
    g.sort();
    groups.push(g);
  }
  groups.sort(byFirst);
  return groups;
}`,
      },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) => J([Array.from({ length: n }, (_, i) => 'w' + (i * 7 + 1))]),
    },
  },
  {
    id: 'top-k-frequent-elements',
    category: 'arrays',
    lc: 'top-k-frequent-elements',
    n: 347,
    tags: ['hash map', 'bucket sort'],
    title: 'Top K Frequent',
    difficulty: 'Medium',
    pattern: 'Frequency buckets',
    summary: 'Return the k most common values, listed in ascending order.',
    hook: 'A count can never exceed n, so use counts as bucket indexes.',
    real: 'Trending-topic and heavy-hitter reports over a stream of events.',
    input: '[[1, 1, 1, 2, 2, 3], 2]',
    expected: '[1, 2]',
    cases: [
      { input: '[[1], 1]', expected: '[1]' },
      { input: '[[4, 4, 5, 5, 5, 6, 6, 6, 6], 2]', expected: '[5, 6]' },
      { input: '[[7, 8, 8], 1]', expected: '[8]' },
    ],
    solutions: [
      {
        label: 'Pick the max k times',
        complexity: 'O(n·k)',
        code: `function byValue(a, b) {
  return a - b;
}
function topK(nums, k) {
  const counts = new Map();
  for (let i = 0; i < nums.length; i++) {
    counts.set(nums[i], (counts.get(nums[i]) || 0) + 1);
  }
  const vals = [];
  const cnts = [];
  for (const v of counts.keys()) {
    vals.push(v);
    cnts.push(counts.get(v));
  }
  const res = [];
  for (let r = 0; r < k; r++) {
    let best = 0;
    for (let i = 1; i < cnts.length; i++) {
      if (cnts[i] > cnts[best]) best = i;
    }
    res.push(vals[best]);
    cnts[best] = -1;
  }
  res.sort(byValue);
  return res;
}`,
      },
      {
        label: 'Bucket by frequency',
        complexity: 'O(n)',
        code: `function byValue(a, b) {
  return a - b;
}
function topK(nums, k) {
  const counts = new Map();
  for (let i = 0; i < nums.length; i++) {
    counts.set(nums[i], (counts.get(nums[i]) || 0) + 1);
  }
  const buckets = [];
  for (let f = 0; f <= nums.length; f++) buckets.push([]);
  for (const v of counts.keys()) buckets[counts.get(v)].push(v);
  const res = [];
  for (let f = nums.length; f >= 1 && res.length < k; f--) {
    for (let i = 0; i < buckets[f].length && res.length < k; i++) {
      res.push(buckets[f][i]);
    }
  }
  res.sort(byValue);
  return res;
}`,
      },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) => J([range(n), Math.floor(n / 2)]),
    },
  },
  {
    id: 'product-of-array-except-self',
    category: 'arrays',
    lc: 'product-of-array-except-self',
    n: 238,
    tags: ['prefix', 'suffix'],
    title: 'Product Of Others',
    difficulty: 'Medium',
    pattern: 'Prefix and suffix products',
    summary: 'For every position, multiply all the other numbers together, without using division.',
    hook: 'Everything left of me times everything right of me.',
    real: 'Leave-one-out statistics, such as removing one term from a combined score.',
    input: '[[1, 2, 3, 4]]',
    expected: '[24, 12, 8, 6]',
    cases: [
      { input: '[[1, 0, 3, 4]]', expected: '[0, 12, 0, 0]' },
      { input: '[[2, 3]]', expected: '[3, 2]' },
      { input: '[[-1, 2, 3]]', expected: '[6, -3, -2]' },
      { input: '[[0, 0, 2]]', expected: '[0, 0, 0]' },
    ],
    solutions: [
      {
        label: 'Multiply the rest each time',
        complexity: 'O(n²)',
        code: `function productExceptSelf(nums) {
  const res = [];
  for (let i = 0; i < nums.length; i++) {
    let prod = 1;
    for (let j = 0; j < nums.length; j++) {
      if (j !== i) prod *= nums[j];
    }
    res.push(prod);
  }
  return res;
}`,
      },
      {
        label: 'Prefix then suffix',
        complexity: 'O(n)',
        code: `function productExceptSelf(nums) {
  const n = nums.length;
  const res = [];
  let left = 1;
  for (let i = 0; i < n; i++) {
    res.push(left);
    left *= nums[i];
  }
  let right = 1;
  for (let i = n - 1; i >= 0; i--) {
    res[i] *= right;
    right *= nums[i];
  }
  return res;
}`,
      },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) => J([Array.from({ length: n }, (_, i) => 1 + (i % 3))]),
    },
  },
  {
    id: 'majority-element',
    category: 'arrays',
    lc: 'majority-element',
    n: 169,
    tags: ['voting', 'counting'],
    title: 'Majority Element',
    difficulty: 'Easy',
    pattern: 'Boyer-Moore voting',
    summary: 'Find the value that appears in more than half of the positions.',
    hook: 'A true majority survives any pairing-off of different values.',
    real: 'Quorum and leader voting where one option holds over half the votes.',
    input: '[[2, 2, 1, 1, 1, 2, 2]]',
    expected: '2',
    cases: [
      { input: '[[3]]', expected: '3' },
      { input: '[[3, 2, 3]]', expected: '3' },
      { input: '[[1, 2, 2, 1, 1]]', expected: '1' },
    ],
    solutions: [
      {
        label: 'Count every value',
        complexity: 'O(n²)',
        code: `function majority(nums) {
  for (let i = 0; i < nums.length; i++) {
    let count = 0;
    for (let j = 0; j < nums.length; j++) {
      if (nums[j] === nums[i]) count++;
    }
    if (count > nums.length / 2) return nums[i];
  }
  return -1;
}`,
      },
      {
        label: 'Boyer-Moore vote',
        complexity: 'O(n)',
        code: `function majority(nums) {
  let candidate = nums[0];
  let votes = 0;
  for (let i = 0; i < nums.length; i++) {
    if (votes === 0) candidate = nums[i];
    if (nums[i] === candidate) votes++;
    else votes--;
  }
  return candidate;
}`,
      },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) =>
        J([Array.from({ length: n }, (_, i) => (i < Math.floor(n / 2) - 1 ? i + 10 : 7))]),
    },
  },
  {
    id: 'missing-number',
    category: 'arrays',
    lc: 'missing-number',
    n: 268,
    tags: ['math', 'sum'],
    title: 'Missing Number',
    difficulty: 'Easy',
    pattern: 'Expected sum minus actual sum',
    summary: 'Numbers 0 to n appear once each except one that is absent. Find it.',
    hook: 'The sum of 0..n is known, so the shortfall is the missing value.',
    real: 'Spotting a lost sequence number in a log or packet stream.',
    input: '[[3, 0, 1]]',
    expected: '2',
    cases: [
      { input: '[[0, 1]]', expected: '2' },
      { input: '[[1]]', expected: '0' },
      { input: '[[0]]', expected: '1' },
    ],
    solutions: [
      {
        label: 'Search for each value',
        complexity: 'O(n²)',
        code: `function missingNumber(nums) {
  for (let v = 0; v <= nums.length; v++) {
    let found = false;
    for (let i = 0; i < nums.length; i++) {
      if (nums[i] === v) {
        found = true;
        break;
      }
    }
    if (!found) return v;
  }
  return -1;
}`,
      },
      {
        label: 'Gauss sum',
        complexity: 'O(n)',
        code: `function missingNumber(nums) {
  const n = nums.length;
  let expected = (n * (n + 1)) / 2;
  for (let i = 0; i < n; i++) expected -= nums[i];
  return expected;
}`,
      },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) => J([Array.from({ length: n }, (_, i) => i)]),
    },
  },
  {
    id: 'move-zeroes',
    category: 'arrays',
    lc: 'move-zeroes',
    n: 283,
    tags: ['two pointers', 'in place'],
    title: 'Zeroes To The End',
    difficulty: 'Easy',
    pattern: 'Write pointer',
    summary: 'Push all zeros to the back while keeping the other numbers in their original order.',
    hook: 'Keep a write index; copy each non-zero forward, then fill zeros.',
    real: 'Compacting a buffer by sliding live entries over dead ones.',
    input: '[[0, 1, 0, 3, 12]]',
    expected: '[1, 3, 12, 0, 0]',
    cases: [
      { input: '[[0]]', expected: '[0]' },
      { input: '[[1, 2]]', expected: '[1, 2]' },
      { input: '[[]]', expected: '[]' },
      { input: '[[0, 0, 5]]', expected: '[5, 0, 0]' },
    ],
    solutions: [
      {
        label: 'Build a new array',
        complexity: 'O(n)',
        code: `function moveZeroes(nums) {
  const out = [];
  let zeros = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 0) zeros++;
    else out.push(nums[i]);
  }
  for (let z = 0; z < zeros; z++) out.push(0);
  return out;
}`,
      },
      {
        label: 'In-place write pointer',
        complexity: 'O(n)',
        code: `function moveZeroes(nums) {
  let w = 0;
  for (let r = 0; r < nums.length; r++) {
    if (nums[r] !== 0) {
      const tmp = nums[w];
      nums[w] = nums[r];
      nums[r] = tmp;
      w++;
    }
  }
  return nums;
}`,
      },
    ],
  },
  {
    id: 'remove-duplicates-from-sorted-array',
    category: 'arrays',
    lc: 'remove-duplicates-from-sorted-array',
    n: 26,
    tags: ['two pointers', 'sorted', 'in place'],
    title: 'Dedupe Sorted Array',
    difficulty: 'Easy',
    pattern: 'Write pointer on sorted data',
    summary: 'Keep one copy of each value from a sorted array and return the unique values.',
    hook: 'Equal values sit side by side, so compare with the last one kept.',
    real: 'Collapsing consecutive repeats when merging sorted logs.',
    input: '[[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]]',
    expected: '[0, 1, 2, 3, 4]',
    cases: [
      { input: '[[1, 1, 2]]', expected: '[1, 2]' },
      { input: '[[]]', expected: '[]' },
      { input: '[[5]]', expected: '[5]' },
      { input: '[[2, 2, 2]]', expected: '[2]' },
    ],
    solutions: [
      {
        label: 'Collect into a new array',
        complexity: 'O(n)',
        code: `function removeDuplicates(nums) {
  const out = [];
  for (let i = 0; i < nums.length; i++) {
    if (out.length === 0 || out[out.length - 1] !== nums[i]) out.push(nums[i]);
  }
  return out;
}`,
      },
      {
        label: 'In-place write pointer',
        complexity: 'O(n)',
        code: `function removeDuplicates(nums) {
  if (nums.length === 0) return [];
  let w = 1;
  for (let r = 1; r < nums.length; r++) {
    if (nums[r] !== nums[w - 1]) {
      nums[w] = nums[r];
      w++;
    }
  }
  return nums.slice(0, w);
}`,
      },
    ],
  },
  {
    id: 'rotate-array',
    category: 'arrays',
    lc: 'rotate-array',
    n: 189,
    tags: ['in place', 'reverse'],
    title: 'Rotate Array',
    difficulty: 'Medium',
    pattern: 'Three reversals',
    summary: 'Shift the array right by k places, wrapping the tail around to the front.',
    hook: 'Reverse everything, then reverse each of the two pieces.',
    real: 'Ring buffers and circular log files that wrap around.',
    input: '[[1, 2, 3, 4, 5, 6, 7], 3]',
    expected: '[5, 6, 7, 1, 2, 3, 4]',
    cases: [
      { input: '[[-1, -100, 3, 99], 2]', expected: '[3, 99, -1, -100]' },
      { input: '[[1], 5]', expected: '[1]' },
      { input: '[[1, 2], 0]', expected: '[1, 2]' },
      { input: '[[1, 2, 3], 4]', expected: '[3, 1, 2]' },
    ],
    solutions: [
      {
        label: 'Shift by one, k times',
        complexity: 'O(n·k)',
        code: `function rotate(nums, k) {
  const n = nums.length;
  const steps = k % n;
  for (let r = 0; r < steps; r++) {
    const last = nums[n - 1];
    for (let i = n - 1; i > 0; i--) nums[i] = nums[i - 1];
    nums[0] = last;
  }
  return nums;
}`,
      },
      {
        label: 'Reverse three times',
        complexity: 'O(n)',
        code: `function reverse(nums, lo, hi) {
  while (lo < hi) {
    const tmp = nums[lo];
    nums[lo] = nums[hi];
    nums[hi] = tmp;
    lo++;
    hi--;
  }
}
function rotate(nums, k) {
  const n = nums.length;
  const steps = k % n;
  reverse(nums, 0, n - 1);
  reverse(nums, 0, steps - 1);
  reverse(nums, steps, n - 1);
  return nums;
}`,
      },
    ],
    scale: { sizes: [4, 8, 16, 32, 64], make: (n) => J([range(n), n - 1]) },
  },
  {
    id: 'best-time-to-buy-and-sell-stock',
    category: 'arrays',
    lc: 'best-time-to-buy-and-sell-stock',
    n: 121,
    tags: ['running minimum'],
    title: 'Best Single Trade',
    difficulty: 'Easy',
    pattern: 'Track the running minimum',
    summary: 'Given daily prices, find the largest profit from one buy followed by a later sell.',
    hook: 'At each day the best buy is the cheapest price seen so far.',
    real: 'Computing maximum drawdown or best spread from a time series.',
    input: '[[7, 1, 5, 3, 6, 4]]',
    expected: '5',
    cases: [
      { input: '[[7, 6, 4, 3, 1]]', expected: '0' },
      { input: '[[1]]', expected: '0' },
      { input: '[[2, 4, 1]]', expected: '2' },
    ],
    solutions: [
      {
        label: 'Try every buy and sell',
        complexity: 'O(n²)',
        code: `function maxProfit(prices) {
  let best = 0;
  for (let i = 0; i < prices.length; i++) {
    for (let j = i + 1; j < prices.length; j++) {
      if (prices[j] - prices[i] > best) best = prices[j] - prices[i];
    }
  }
  return best;
}`,
      },
      {
        label: 'Running minimum',
        complexity: 'O(n)',
        code: `function maxProfit(prices) {
  let low = prices[0];
  let best = 0;
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] < low) low = prices[i];
    else if (prices[i] - low > best) best = prices[i] - low;
  }
  return best;
}`,
      },
    ],
    scale: { sizes: [4, 8, 16, 32, 64], make: (n) => J([range(n)]) },
  },
  {
    id: 'longest-consecutive-sequence',
    category: 'arrays',
    lc: 'longest-consecutive-sequence',
    n: 128,
    tags: ['hash set', 'sorting'],
    title: 'Longest Consecutive Run',
    difficulty: 'Medium',
    pattern: 'Hash set, start only at run beginnings',
    summary:
      'Find the length of the longest chain of values like 4, 5, 6 (order in the array does not matter).',
    hook: 'Only start counting from a number whose predecessor is missing.',
    real: 'Finding the longest unbroken range of IDs or timestamps in a set.',
    input: '[[100, 4, 200, 1, 3, 2]]',
    expected: '4',
    cases: [
      { input: '[[]]', expected: '0' },
      { input: '[[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]]', expected: '9' },
      { input: '[[1, 2, 0, 1]]', expected: '3' },
      { input: '[[9]]', expected: '1' },
    ],
    solutions: [
      {
        label: 'Sort then scan',
        complexity: 'O(n log n)',
        code: `function byValue(a, b) {
  return a - b;
}
function longestConsecutive(nums) {
  if (nums.length === 0) return 0;
  const sorted = nums.slice().sort(byValue);
  let best = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === sorted[i - 1]) continue;
    if (sorted[i] === sorted[i - 1] + 1) run++;
    else run = 1;
    if (run > best) best = run;
  }
  return best;
}`,
      },
      {
        label: 'Hash set',
        complexity: 'O(n)',
        code: `function longestConsecutive(nums) {
  const set = new Set(nums);
  let best = 0;
  for (const x of set) {
    if (!set.has(x - 1)) {
      let len = 1;
      while (set.has(x + len)) len++;
      if (len > best) best = len;
    }
  }
  return best;
}`,
      },
    ],
  },
  {
    id: 'subarray-sum-equals-k',
    category: 'arrays',
    lc: 'subarray-sum-equals-k',
    n: 560,
    tags: ['prefix sum', 'hash map'],
    title: 'Subarrays Summing To K',
    difficulty: 'Medium',
    pattern: 'Prefix sums in a hash map',
    summary: 'Count the contiguous stretches of the array whose total is exactly k.',
    hook: 'A stretch sums to k when two prefix sums differ by k.',
    real: 'Finding time ranges whose running totals hit a target, as in ledgers.',
    input: '[[1, 2, 3], 3]',
    expected: '2',
    cases: [
      { input: '[[1, 1, 1], 2]', expected: '2' },
      { input: '[[1, -1, 0], 0]', expected: '3' },
      { input: '[[5], 3]', expected: '0' },
    ],
    solutions: [
      {
        label: 'Extend from every start',
        complexity: 'O(n²)',
        code: `function subarraySum(nums, k) {
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    let sum = 0;
    for (let j = i; j < nums.length; j++) {
      sum += nums[j];
      if (sum === k) count++;
    }
  }
  return count;
}`,
      },
      {
        label: 'Prefix sum map',
        complexity: 'O(n)',
        code: `function subarraySum(nums, k) {
  const seen = new Map();
  seen.set(0, 1);
  let sum = 0;
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
    if (seen.has(sum - k)) count += seen.get(sum - k);
    seen.set(sum, (seen.get(sum) || 0) + 1);
  }
  return count;
}`,
      },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) => J([Array.from({ length: n }, () => 1), 3]),
    },
  },
  {
    id: 'find-all-numbers-disappeared-in-an-array',
    category: 'arrays',
    lc: 'find-all-numbers-disappeared-in-an-array',
    n: 448,
    tags: ['in place', 'index marking'],
    title: 'Disappeared Numbers',
    difficulty: 'Easy',
    pattern: 'Mark visited by negating at index',
    summary: 'Values are in 1..n and some repeat. List the values in that range that never appear.',
    hook: 'Use the array itself as a seen-table: flip the sign at each value index.',
    real: 'Reusing existing storage as a bitmap to save memory.',
    input: '[[4, 3, 2, 7, 8, 2, 3, 1]]',
    expected: '[5, 6]',
    cases: [
      { input: '[[1, 1]]', expected: '[2]' },
      { input: '[[1, 2, 3]]', expected: '[]' },
      { input: '[[1]]', expected: '[]' },
    ],
    solutions: [
      {
        label: 'Search for each value',
        complexity: 'O(n²)',
        code: `function findDisappeared(nums) {
  const res = [];
  for (let v = 1; v <= nums.length; v++) {
    let found = false;
    for (let i = 0; i < nums.length; i++) {
      if (nums[i] === v) {
        found = true;
        break;
      }
    }
    if (!found) res.push(v);
  }
  return res;
}`,
      },
      {
        label: 'Negate at index',
        complexity: 'O(n)',
        code: `function findDisappeared(nums) {
  for (let i = 0; i < nums.length; i++) {
    const idx = Math.abs(nums[i]) - 1;
    if (nums[idx] > 0) nums[idx] = -nums[idx];
  }
  const res = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > 0) res.push(i + 1);
  }
  return res;
}`,
      },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) => J([Array.from({ length: n }, () => 1)]),
    },
  },
  {
    id: 'find-the-duplicate-number',
    category: 'arrays',
    lc: 'find-the-duplicate-number',
    n: 287,
    tags: ['cycle detection', 'two pointers'],
    title: 'Find The Duplicate',
    difficulty: 'Medium',
    pattern: "Floyd's cycle detection",
    summary:
      'An array of n+1 values from 1..n holds one repeated value. Find it without changing the array.',
    hook: 'Treat each value as a pointer to an index; the repeat is where the cycle starts.',
    real: 'Detecting cycles in pointer chains, such as a corrupted linked structure.',
    input: '[[1, 3, 4, 2, 2]]',
    expected: '2',
    cases: [
      { input: '[[3, 1, 3, 4, 2]]', expected: '3' },
      { input: '[[1, 1]]', expected: '1' },
      { input: '[[2, 2, 2, 2, 2]]', expected: '2' },
    ],
    solutions: [
      {
        label: 'Compare every pair',
        complexity: 'O(n²)',
        code: `function findDuplicate(nums) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] === nums[j]) return nums[i];
    }
  }
  return -1;
}`,
      },
      {
        label: "Floyd's tortoise and hare",
        complexity: 'O(n)',
        code: `function findDuplicate(nums) {
  let slow = nums[0];
  let fast = nums[0];
  while (true) {
    slow = nums[slow];
    fast = nums[nums[fast]];
    if (slow === fast) break;
  }
  slow = nums[0];
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[fast];
  }
  return slow;
}`,
      },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) => J([[...range(n), n]]),
    },
  },
  {
    id: 'set-matrix-zeroes',
    category: 'arrays',
    lc: 'set-matrix-zeroes',
    n: 73,
    tags: ['matrix', 'flags'],
    title: 'Zero Out Rows And Columns',
    difficulty: 'Medium',
    pattern: 'Row and column flags',
    summary: 'Whenever a cell is zero, turn its entire row and column to zero.',
    hook: 'Record which rows and columns to clear first, then clear in a second pass.',
    real: 'Applying a deletion mask across both axes of a table.',
    input: '[[[1, 1, 1], [1, 0, 1], [1, 1, 1]]]',
    expected: '[[1, 0, 1], [0, 0, 0], [1, 0, 1]]',
    cases: [
      {
        input: '[[[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]]',
        expected: '[[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]]',
      },
      { input: '[[[1]]]', expected: '[[1]]' },
      { input: '[[[0]]]', expected: '[[0]]' },
    ],
    solutions: [
      {
        label: 'Clear on a copy',
        complexity: 'O(m·n·(m+n))',
        code: `function setZeroes(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;
  const out = [];
  for (let r = 0; r < m; r++) out.push(matrix[r].slice());
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (matrix[r][c] === 0) {
        for (let k = 0; k < n; k++) out[r][k] = 0;
        for (let k = 0; k < m; k++) out[k][c] = 0;
      }
    }
  }
  return out;
}`,
      },
      {
        label: 'Row and column flags',
        complexity: 'O(m·n)',
        code: `function setZeroes(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;
  const rowZero = [];
  const colZero = [];
  for (let r = 0; r < m; r++) rowZero.push(false);
  for (let c = 0; c < n; c++) colZero.push(false);
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (matrix[r][c] === 0) {
        rowZero[r] = true;
        colZero[c] = true;
      }
    }
  }
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (rowZero[r] || colZero[c]) matrix[r][c] = 0;
    }
  }
  return matrix;
}`,
      },
    ],
    scale: {
      sizes: [2, 4, 8, 16, 24],
      make: (n) =>
        J([
          Array.from({ length: n }, (_, r) =>
            Array.from({ length: n }, (_, c) => ((r + c) % 2 === 0 ? 0 : 1)),
          ),
        ]),
    },
  },
  {
    id: 'spiral-matrix',
    category: 'arrays',
    lc: 'spiral-matrix',
    n: 54,
    tags: ['matrix', 'simulation'],
    title: 'Spiral Order',
    difficulty: 'Medium',
    pattern: 'Shrinking boundaries',
    summary: 'List the matrix cells in clockwise spiral order, starting at the top-left corner.',
    hook: 'Walk the top row, right column, bottom row, left column, then shrink the box.',
    real: 'Tile and texture traversal orders in graphics and image processing.',
    input: '[[[1, 2, 3], [4, 5, 6], [7, 8, 9]]]',
    expected: '[1, 2, 3, 6, 9, 8, 7, 4, 5]',
    cases: [
      {
        input: '[[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]]',
        expected: '[1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]',
      },
      { input: '[[[1]]]', expected: '[1]' },
      { input: '[[[1], [2], [3]]]', expected: '[1, 2, 3]' },
      { input: '[[[1, 2], [3, 4]]]', expected: '[1, 2, 4, 3]' },
    ],
    solutions: [
      {
        label: 'Turn at visited cells',
        complexity: 'O(m·n)',
        code: `function spiralOrder(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;
  const seen = [];
  for (let r = 0; r < m; r++) {
    const row = [];
    for (let c = 0; c < n; c++) row.push(false);
    seen.push(row);
  }
  const dr = [0, 1, 0, -1];
  const dc = [1, 0, -1, 0];
  const res = [];
  let r = 0;
  let c = 0;
  let d = 0;
  for (let step = 0; step < m * n; step++) {
    res.push(matrix[r][c]);
    seen[r][c] = true;
    let nr = r + dr[d];
    let nc = c + dc[d];
    if (nr < 0 || nr >= m || nc < 0 || nc >= n || seen[nr][nc]) {
      d = (d + 1) % 4;
      nr = r + dr[d];
      nc = c + dc[d];
    }
    r = nr;
    c = nc;
  }
  return res;
}`,
      },
      {
        label: 'Shrink the boundaries',
        complexity: 'O(m·n)',
        code: `function spiralOrder(matrix) {
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;
  const res = [];
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) res.push(matrix[top][c]);
    top++;
    for (let r = top; r <= bottom; r++) res.push(matrix[r][right]);
    right--;
    if (top <= bottom) {
      for (let c = right; c >= left; c--) res.push(matrix[bottom][c]);
      bottom--;
    }
    if (left <= right) {
      for (let r = bottom; r >= top; r--) res.push(matrix[r][left]);
      left++;
    }
  }
  return res;
}`,
      },
    ],
  },
  {
    id: 'rotate-image',
    category: 'arrays',
    lc: 'rotate-image',
    n: 48,
    tags: ['matrix', 'in place'],
    title: 'Rotate Image',
    difficulty: 'Medium',
    pattern: 'Transpose then reverse rows',
    summary: 'Rotate a square grid 90 degrees clockwise.',
    hook: 'Clockwise turn = transpose, then flip each row.',
    real: 'Rotating a bitmap or game board by a quarter turn.',
    input: '[[[1, 2, 3], [4, 5, 6], [7, 8, 9]]]',
    expected: '[[7, 4, 1], [8, 5, 2], [9, 6, 3]]',
    cases: [
      { input: '[[[1]]]', expected: '[[1]]' },
      { input: '[[[1, 2], [3, 4]]]', expected: '[[3, 1], [4, 2]]' },
      {
        input: '[[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]]]',
        expected: '[[13, 9, 5, 1], [14, 10, 6, 2], [15, 11, 7, 3], [16, 12, 8, 4]]',
      },
    ],
    solutions: [
      {
        label: 'Copy into a new grid',
        complexity: 'O(n²)',
        code: `function rotateImage(matrix) {
  const n = matrix.length;
  const out = [];
  for (let r = 0; r < n; r++) {
    const row = [];
    for (let c = 0; c < n; c++) row.push(0);
    out.push(row);
  }
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) out[c][n - 1 - r] = matrix[r][c];
  }
  return out;
}`,
      },
      {
        label: 'Transpose and reverse',
        complexity: 'O(n²)',
        code: `function rotateImage(matrix) {
  const n = matrix.length;
  for (let r = 0; r < n; r++) {
    for (let c = r + 1; c < n; c++) {
      const tmp = matrix[r][c];
      matrix[r][c] = matrix[c][r];
      matrix[c][r] = tmp;
    }
  }
  for (let r = 0; r < n; r++) {
    let lo = 0;
    let hi = n - 1;
    while (lo < hi) {
      const tmp = matrix[r][lo];
      matrix[r][lo] = matrix[r][hi];
      matrix[r][hi] = tmp;
      lo++;
      hi--;
    }
  }
  return matrix;
}`,
      },
    ],
  },
  {
    id: 'valid-sudoku',
    category: 'arrays',
    lc: 'valid-sudoku',
    n: 36,
    tags: ['hash set', 'matrix'],
    title: 'Valid Sudoku',
    difficulty: 'Medium',
    pattern: 'Sets per row, column and box',
    summary:
      'Check that a partly filled 9x9 board has no repeated digit in any row, column or 3x3 box.',
    hook: 'Give every row, column and box its own set and test before adding.',
    real: 'Validating constraints on a form or spreadsheet as cells are filled in.',
    input: J([SUDOKU]),
    expected: 'true',
    cases: [
      { input: J([SUDOKU_BAD]), expected: 'false' },
      { input: J([SUDOKU_EMPTY]), expected: 'true' },
    ],
    solutions: [
      {
        label: 'Three separate passes',
        complexity: 'O(n²)',
        code: `function isValidSudoku(board) {
  for (let r = 0; r < 9; r++) {
    const seen = [];
    for (let c = 0; c < 9; c++) {
      const v = board[r][c];
      if (v === '.') continue;
      if (seen.includes(v)) return false;
      seen.push(v);
    }
  }
  for (let c = 0; c < 9; c++) {
    const seen = [];
    for (let r = 0; r < 9; r++) {
      const v = board[r][c];
      if (v === '.') continue;
      if (seen.includes(v)) return false;
      seen.push(v);
    }
  }
  for (let box = 0; box < 9; box++) {
    const seen = [];
    for (let k = 0; k < 9; k++) {
      const r = Math.floor(box / 3) * 3 + Math.floor(k / 3);
      const c = (box % 3) * 3 + (k % 3);
      const v = board[r][c];
      if (v === '.') continue;
      if (seen.includes(v)) return false;
      seen.push(v);
    }
  }
  return true;
}`,
      },
      {
        label: 'Single pass with sets',
        complexity: 'O(n²)',
        code: `function isValidSudoku(board) {
  const rows = [];
  const cols = [];
  const boxes = [];
  for (let i = 0; i < 9; i++) {
    rows.push(new Set());
    cols.push(new Set());
    boxes.push(new Set());
  }
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const v = board[r][c];
      if (v === '.') continue;
      const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
      if (rows[r].has(v) || cols[c].has(v) || boxes[b].has(v)) return false;
      rows[r].add(v);
      cols[c].add(v);
      boxes[b].add(v);
    }
  }
  return true;
}`,
      },
    ],
  },
  {
    id: 'intersection-of-two-arrays',
    category: 'arrays',
    lc: 'intersection-of-two-arrays',
    n: 349,
    tags: ['hash set'],
    title: 'Array Intersection',
    difficulty: 'Easy',
    pattern: 'Hash set membership',
    summary: 'List the distinct values present in both arrays, in ascending order.',
    hook: 'Put one side in a set and probe it with the other.',
    real: 'The core step of a database join or a search engine combining two posting lists.',
    input: '[[1, 2, 2, 1], [2, 2]]',
    expected: '[2]',
    cases: [
      { input: '[[4, 9, 5], [9, 4, 9, 8, 4]]', expected: '[4, 9]' },
      { input: '[[1], [2]]', expected: '[]' },
      { input: '[[], [1]]', expected: '[]' },
    ],
    solutions: [
      {
        label: 'Scan the other array',
        complexity: 'O(n·m)',
        code: `function byValue(a, b) {
  return a - b;
}
function intersection(a, b) {
  const out = [];
  for (let i = 0; i < a.length; i++) {
    let found = false;
    for (let j = 0; j < b.length; j++) {
      if (a[i] === b[j]) {
        found = true;
        break;
      }
    }
    if (found && !out.includes(a[i])) out.push(a[i]);
  }
  out.sort(byValue);
  return out;
}`,
      },
      {
        label: 'Set lookup',
        complexity: 'O(n + m)',
        code: `function byValue(a, b) {
  return a - b;
}
function intersection(a, b) {
  const inA = new Set(a);
  const out = new Set();
  for (let j = 0; j < b.length; j++) {
    if (inA.has(b[j])) out.add(b[j]);
  }
  const res = [];
  for (const v of out) res.push(v);
  res.sort(byValue);
  return res;
}`,
      },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) => J([range(n), range(n).map((x) => x + n)]),
    },
  },
  {
    id: 'pascals-triangle',
    category: 'arrays',
    lc: 'pascals-triangle',
    n: 118,
    tags: ['simulation', 'math'],
    title: "Pascal's Triangle",
    difficulty: 'Easy',
    pattern: 'Build each row from the previous',
    summary:
      'Produce the first n rows of the triangle where each entry is the sum of the two above it.',
    hook: 'Each row is the previous row added to a shifted copy of itself.',
    real: 'Binomial coefficients behind combinatorics and probability tables.',
    input: '[5]',
    expected: '[[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]',
    cases: [
      { input: '[1]', expected: '[[1]]' },
      { input: '[2]', expected: '[[1], [1, 1]]' },
      { input: '[0]', expected: '[]' },
      {
        input: '[6]',
        expected: '[[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1], [1, 5, 10, 10, 5, 1]]',
      },
    ],
    solutions: [
      {
        label: 'Binomial formula per cell',
        complexity: 'O(n³)',
        code: `function generate(numRows) {
  const rows = [];
  for (let r = 0; r < numRows; r++) {
    const row = [];
    for (let k = 0; k <= r; k++) {
      let c = 1;
      for (let i = 1; i <= k; i++) c = (c * (r - k + i)) / i;
      row.push(c);
    }
    rows.push(row);
  }
  return rows;
}`,
      },
      {
        label: 'Sum the row above',
        complexity: 'O(n²)',
        code: `function generate(numRows) {
  const rows = [];
  for (let r = 0; r < numRows; r++) {
    const row = [1];
    for (let k = 1; k < r; k++) row.push(rows[r - 1][k - 1] + rows[r - 1][k]);
    if (r > 0) row.push(1);
    rows.push(row);
  }
  return rows;
}`,
      },
    ],
    scale: { sizes: [4, 8, 12, 16, 20], make: (n) => J([n]) },
  },
  {
    id: 'plus-one',
    category: 'arrays',
    lc: 'plus-one',
    n: 66,
    tags: ['math', 'carry'],
    title: 'Plus One',
    difficulty: 'Easy',
    pattern: 'Carry from the last digit',
    summary: 'A number is stored as an array of digits. Return the digits of the number plus one.',
    hook: 'Only a run of trailing nines carries; the first non-nine stops it.',
    real: 'Incrementing arbitrary-precision counters and version numbers.',
    input: '[[1, 2, 9]]',
    expected: '[1, 3, 0]',
    cases: [
      { input: '[[9, 9]]', expected: '[1, 0, 0]' },
      { input: '[[0]]', expected: '[1]' },
      { input: '[[4, 3, 2, 1]]', expected: '[4, 3, 2, 2]' },
    ],
    solutions: [
      {
        label: 'Carry through every digit',
        complexity: 'O(n)',
        code: `function plusOne(digits) {
  let carry = 1;
  for (let i = digits.length - 1; i >= 0; i--) {
    const sum = digits[i] + carry;
    digits[i] = sum % 10;
    carry = Math.floor(sum / 10);
  }
  if (carry > 0) digits.unshift(carry);
  return digits;
}`,
      },
      {
        label: 'Stop at first non-nine',
        complexity: 'O(n)',
        code: `function plusOne(digits) {
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] < 9) {
      digits[i]++;
      return digits;
    }
    digits[i] = 0;
  }
  digits.unshift(1);
  return digits;
}`,
      },
    ],
  },
  {
    id: 'first-missing-positive',
    category: 'arrays',
    lc: 'first-missing-positive',
    n: 41,
    tags: ['in place', 'cyclic sort'],
    title: 'First Missing Positive',
    difficulty: 'Hard',
    pattern: 'Cyclic placement',
    summary: 'Find the smallest positive integer that is not in an unsorted array.',
    hook: 'Put each value v at index v - 1; the first slot that disagrees is the answer.',
    real: 'Allocating the lowest free ID or port number from a used set.',
    input: '[[3, 4, -1, 1]]',
    expected: '2',
    cases: [
      { input: '[[1, 2, 0]]', expected: '3' },
      { input: '[[7, 8, 9, 11, 12]]', expected: '1' },
      { input: '[[1]]', expected: '2' },
      { input: '[[2, 1]]', expected: '3' },
    ],
    solutions: [
      {
        label: 'Test 1, 2, 3 by scanning',
        complexity: 'O(n²)',
        code: `function firstMissingPositive(nums) {
  for (let v = 1; v <= nums.length + 1; v++) {
    let found = false;
    for (let i = 0; i < nums.length; i++) {
      if (nums[i] === v) {
        found = true;
        break;
      }
    }
    if (!found) return v;
  }
  return -1;
}`,
      },
      {
        label: 'Place values at their index',
        complexity: 'O(n)',
        code: `function firstMissingPositive(nums) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
      const j = nums[i] - 1;
      const tmp = nums[j];
      nums[j] = nums[i];
      nums[i] = tmp;
    }
  }
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) return i + 1;
  }
  return n + 1;
}`,
      },
    ],
    scale: { sizes: [4, 8, 16, 32, 64], make: (n) => J([range(n)]) },
  },
  {
    id: 'sort-colors',
    category: 'arrays',
    lc: 'sort-colors',
    n: 75,
    tags: ['two pointers', 'in place'],
    title: 'Sort Colors',
    difficulty: 'Medium',
    pattern: 'Dutch national flag',
    summary: 'Sort an array that only contains 0, 1 and 2, in a single pass if you can.',
    hook: 'Three regions: push 0s left, 2s right, and let 1s fall in the middle.',
    real: 'Three-way partitioning inside quicksort when many keys are equal.',
    input: '[[2, 0, 2, 1, 1, 0]]',
    expected: '[0, 0, 1, 1, 2, 2]',
    cases: [
      { input: '[[2, 0, 1]]', expected: '[0, 1, 2]' },
      { input: '[[0]]', expected: '[0]' },
      { input: '[[1, 1, 1]]', expected: '[1, 1, 1]' },
      { input: '[[2, 2, 0, 0]]', expected: '[0, 0, 2, 2]' },
    ],
    solutions: [
      {
        label: 'Count then overwrite',
        complexity: 'O(n)',
        code: `function sortColors(nums) {
  const counts = [0, 0, 0];
  for (let i = 0; i < nums.length; i++) counts[nums[i]]++;
  let w = 0;
  for (let color = 0; color < 3; color++) {
    for (let c = 0; c < counts[color]; c++) {
      nums[w] = color;
      w++;
    }
  }
  return nums;
}`,
      },
      {
        label: 'Three-way partition',
        complexity: 'O(n)',
        code: `function sortColors(nums) {
  let lo = 0;
  let mid = 0;
  let hi = nums.length - 1;
  while (mid <= hi) {
    if (nums[mid] === 0) {
      const tmp = nums[lo];
      nums[lo] = nums[mid];
      nums[mid] = tmp;
      lo++;
      mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      const tmp = nums[hi];
      nums[hi] = nums[mid];
      nums[mid] = tmp;
      hi--;
    }
  }
  return nums;
}`,
      },
    ],
  },
  {
    id: 'next-permutation',
    category: 'arrays',
    lc: 'next-permutation',
    n: 31,
    tags: ['in place', 'permutation'],
    title: 'Next Permutation',
    difficulty: 'Medium',
    pattern: 'Pivot, swap, reverse suffix',
    summary:
      'Rearrange the numbers into the next larger ordering, or the smallest ordering if already the largest.',
    hook: 'Find the last rise, swap in the next larger value, then make the tail ascending.',
    real: 'Stepping through orderings lexicographically, as in schedulers and test generators.',
    input: '[[1, 2, 3]]',
    expected: '[1, 3, 2]',
    cases: [
      { input: '[[3, 2, 1]]', expected: '[1, 2, 3]' },
      { input: '[[1, 1, 5]]', expected: '[1, 5, 1]' },
      { input: '[[1]]', expected: '[1]' },
      { input: '[[1, 3, 2]]', expected: '[2, 1, 3]' },
    ],
    solutions: [
      {
        label: 'Swap then sort the tail',
        complexity: 'O(n log n)',
        code: `function byValue(a, b) {
  return a - b;
}
function nextPermutation(nums) {
  const n = nums.length;
  let i = n - 2;
  while (i >= 0 && nums[i] >= nums[i + 1]) i--;
  if (i >= 0) {
    let best = -1;
    for (let k = i + 1; k < n; k++) {
      if (nums[k] > nums[i] && (best === -1 || nums[k] <= nums[best])) best = k;
    }
    const tmp = nums[i];
    nums[i] = nums[best];
    nums[best] = tmp;
  }
  const tail = nums.slice(i + 1).sort(byValue);
  for (let k = 0; k < tail.length; k++) nums[i + 1 + k] = tail[k];
  return nums;
}`,
      },
      {
        label: 'Swap then reverse the tail',
        complexity: 'O(n)',
        code: `function nextPermutation(nums) {
  const n = nums.length;
  let i = n - 2;
  while (i >= 0 && nums[i] >= nums[i + 1]) i--;
  if (i >= 0) {
    let j = n - 1;
    while (nums[j] <= nums[i]) j--;
    const tmp = nums[i];
    nums[i] = nums[j];
    nums[j] = tmp;
  }
  let lo = i + 1;
  let hi = n - 1;
  while (lo < hi) {
    const tmp = nums[lo];
    nums[lo] = nums[hi];
    nums[hi] = tmp;
    lo++;
    hi--;
  }
  return nums;
}`,
      },
    ],
  },
  {
    id: 'contiguous-array',
    category: 'arrays',
    lc: 'contiguous-array',
    n: 525,
    tags: ['prefix sum', 'hash map'],
    title: 'Balanced Binary Stretch',
    difficulty: 'Medium',
    pattern: 'Prefix balance in a hash map',
    summary: 'In an array of 0s and 1s, find the longest stretch containing equally many of each.',
    hook: 'Count 1 as +1 and 0 as -1; equal balances mean the stretch between sums to zero.',
    real: 'Finding the longest period where two event types were perfectly balanced.',
    input: '[[0, 1, 0]]',
    expected: '2',
    cases: [
      { input: '[[0, 1, 1, 0, 1, 1, 1, 0]]', expected: '4' },
      { input: '[[0]]', expected: '0' },
      { input: '[[0, 0, 1, 0, 0, 0, 1, 1]]', expected: '6' },
    ],
    solutions: [
      {
        label: 'Check every stretch',
        complexity: 'O(n²)',
        code: `function findMaxLength(nums) {
  let best = 0;
  for (let i = 0; i < nums.length; i++) {
    let balance = 0;
    for (let j = i; j < nums.length; j++) {
      balance += nums[j] === 1 ? 1 : -1;
      if (balance === 0 && j - i + 1 > best) best = j - i + 1;
    }
  }
  return best;
}`,
      },
      {
        label: 'First-seen balance map',
        complexity: 'O(n)',
        code: `function findMaxLength(nums) {
  const first = new Map();
  first.set(0, -1);
  let balance = 0;
  let best = 0;
  for (let i = 0; i < nums.length; i++) {
    balance += nums[i] === 1 ? 1 : -1;
    if (first.has(balance)) {
      if (i - first.get(balance) > best) best = i - first.get(balance);
    } else {
      first.set(balance, i);
    }
  }
  return best;
}`,
      },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) => J([Array.from({ length: n }, () => 0)]),
    },
  },
];
