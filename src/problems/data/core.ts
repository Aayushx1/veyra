import type { Problem } from '../types';

export const core: Problem[] = [
  {
    id: 'pair-sum',
    category: 'arrays',
    lc: 'two-sum',
    n: 1,
    tags: ['hash map'],
    title: 'Pair With Target Sum',
    difficulty: 'Easy',
    pattern: 'Hash map complement',
    summary: 'Return the indices of two numbers that add up to the target.',
    hook: 'Looking for a pair? Ask "have I already seen my partner?"',
    input: '[[2, 7, 11, 15], 9]',
    expected: '[0, 1]',
    cases: [
      { input: '[[3, 2, 4], 6]', expected: '[1, 2]' },
      { input: '[[1, 2], 99]', expected: '[]' },
    ],
    solutions: [
      {
        label: 'Brute force',
        complexity: 'O(n²)',
        code: `function pairSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return [];
}`,
      },
      {
        label: 'Hash map',
        complexity: 'O(n)',
        code: `function pairSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`,
      },
    ],
  },
  {
    id: 'sorted-pair',
    category: 'two-pointers',
    lc: 'two-sum-ii-input-array-is-sorted',
    n: 167,
    tags: ['sorted'],
    title: 'Pair In Sorted Array',
    difficulty: 'Easy',
    pattern: 'Two pointers',
    summary: 'In a sorted array, find the 0-based indices of two values that sum to the target.',
    hook: 'Sorted input lets two ends walk toward each other.',
    input: '[[1, 3, 4, 6, 8, 11], 10]',
    expected: '[2, 3]',
    cases: [
      { input: '[[1, 2, 3], 7]', expected: '[]' },
      { input: '[[2, 5], 7]', expected: '[0, 1]' },
    ],
    solutions: [
      {
        label: 'Check every pair',
        complexity: 'O(n²)',
        code: `function sortedPair(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return [];
}`,
      },
      {
        label: 'Two pointers',
        complexity: 'O(n)',
        code: `function sortedPair(nums, target) {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo < hi) {
    const sum = nums[lo] + nums[hi];
    if (sum === target) return [lo, hi];
    if (sum < target) lo++;
    else hi--;
  }
  return [];
}`,
      },
    ],
  },
  {
    id: 'max-window',
    category: 'sliding-window',
    lc: 'maximum-average-subarray-i',
    n: 643,
    tags: ['window'],
    title: 'Best Window Sum',
    difficulty: 'Easy',
    pattern: 'Sliding window',
    summary: 'Largest sum of any k consecutive numbers.',
    hook: 'Slide: add the new element, drop the old one. Never recompute.',
    input: '[[2, 1, 5, 1, 3, 2], 3]',
    expected: '9',
    cases: [
      { input: '[[1, 1, 1], 2]', expected: '2' },
      { input: '[[-1, -2, -3], 1]', expected: '-1' },
    ],
    solutions: [
      {
        label: 'Re-sum each window',
        complexity: 'O(n·k)',
        code: `function maxWindow(nums, k) {
  let best = -Infinity;
  for (let start = 0; start + k <= nums.length; start++) {
    let sum = 0;
    for (let i = start; i < start + k; i++) sum += nums[i];
    if (sum > best) best = sum;
  }
  return best;
}`,
      },
      {
        label: 'Sliding window',
        complexity: 'O(n)',
        code: `function maxWindow(nums, k) {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum;
  for (let i = k; i < nums.length; i++) {
    sum += nums[i] - nums[i - k];
    if (sum > best) best = sum;
  }
  return best;
}`,
      },
    ],
  },
  {
    id: 'has-duplicate',
    category: 'arrays',
    lc: 'contains-duplicate',
    n: 217,
    tags: ['hash set'],
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    pattern: 'Seen set',
    summary: 'Does any value appear at least twice?',
    hook: 'Membership questions want a Set, not a nested loop.',
    input: '[[4, 1, 7, 3, 1]]',
    expected: 'true',
    cases: [
      { input: '[[1, 2, 3]]', expected: 'false' },
      { input: '[[]]', expected: 'false' },
    ],
    solutions: [
      {
        label: 'Compare all pairs',
        complexity: 'O(n²)',
        code: `function hasDuplicate(nums) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] === nums[j]) return true;
    }
  }
  return false;
}`,
      },
      {
        label: 'Seen set',
        complexity: 'O(n)',
        code: `function hasDuplicate(nums) {
  const seen = new Set();
  for (const x of nums) {
    if (seen.has(x)) return true;
    seen.add(x);
  }
  return false;
}`,
      },
    ],
  },
  {
    id: 'valid-brackets',
    category: 'stack-queue',
    lc: 'valid-parentheses',
    n: 20,
    tags: ['stack', 'string'],
    title: 'Balanced Brackets',
    difficulty: 'Easy',
    pattern: 'Stack',
    summary: 'Are all (), [] and {} opened and closed in the right order?',
    hook: 'Most recent opener must close first: that is a stack.',
    input: '["{[()]}"]',
    expected: 'true',
    cases: [
      { input: '["(]"]', expected: 'false' },
      { input: '["(("]', expected: 'false' },
      { input: '[""]', expected: 'true' },
    ],
    solutions: [
      {
        label: 'Strip pairs repeatedly',
        complexity: 'O(n²)',
        code: `function balanced(s) {
  const chars = s.split('');
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i + 1 < chars.length; i++) {
      const pair = chars[i] + chars[i + 1];
      if (pair === '()' || pair === '[]' || pair === '{}') {
        chars.splice(i, 2);
        changed = true;
        break;
      }
    }
  }
  return chars.length === 0;
}`,
      },
      {
        label: 'Stack',
        complexity: 'O(n)',
        code: `function balanced(s) {
  const close = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  for (const ch of s) {
    if (ch in close) {
      if (stack.pop() !== close[ch]) return false;
    } else {
      stack.push(ch);
    }
  }
  return stack.length === 0;
}`,
      },
    ],
  },
  {
    id: 'search-sorted',
    category: 'binary-search',
    lc: 'binary-search',
    n: 704,
    tags: ['sorted'],
    title: 'Binary Search',
    difficulty: 'Easy',
    pattern: 'Binary search',
    summary: 'Index of target in a sorted array, or -1.',
    hook: 'Halve the search space every step: keep the half that can still hold it.',
    input: '[[1, 3, 5, 7, 9, 11, 13], 9]',
    expected: '4',
    cases: [
      { input: '[[1, 3, 5], 4]', expected: '-1' },
      { input: '[[], 1]', expected: '-1' },
    ],
    solutions: [
      {
        label: 'Linear scan',
        complexity: 'O(n)',
        code: `function search(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) return i;
  }
  return -1;
}`,
      },
      {
        label: 'Binary search',
        complexity: 'O(log n)',
        code: `function search(nums, target) {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
      },
    ],
  },
  {
    id: 'max-subarray',
    category: 'dp',
    lc: 'maximum-subarray',
    n: 53,
    tags: ['kadane'],
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    pattern: "Kadane's algorithm",
    summary: 'Largest sum of any contiguous subarray.',
    hook: 'At each element: extend the run, or restart here if the run hurts.',
    input: '[[-2, 1, -3, 4, -1, 2, 1, -5, 4]]',
    expected: '6',
    cases: [
      { input: '[[-3, -1, -2]]', expected: '-1' },
      { input: '[[5]]', expected: '5' },
    ],
    solutions: [
      {
        label: 'All subarrays',
        complexity: 'O(n²)',
        code: `function maxSubarray(nums) {
  let best = -Infinity;
  for (let i = 0; i < nums.length; i++) {
    let sum = 0;
    for (let j = i; j < nums.length; j++) {
      sum += nums[j];
      if (sum > best) best = sum;
    }
  }
  return best;
}`,
      },
      {
        label: 'Kadane',
        complexity: 'O(n)',
        code: `function maxSubarray(nums) {
  let run = nums[0];
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    run = Math.max(nums[i], run + nums[i]);
    best = Math.max(best, run);
  }
  return best;
}`,
      },
    ],
  },
  {
    id: 'fib-memo',
    category: 'dp',
    lc: 'fibonacci-number',
    n: 509,
    tags: ['recursion'],
    title: 'Fibonacci',
    difficulty: 'Easy',
    pattern: 'Dynamic programming',
    summary: 'The n-th Fibonacci number (fib(0)=0, fib(1)=1).',
    hook: 'Overlapping subproblems: remember answers or build bottom-up.',
    input: '[10]',
    expected: '55',
    cases: [
      { input: '[0]', expected: '0' },
      { input: '[1]', expected: '1' },
      { input: '[20]', expected: '6765' },
    ],
    solutions: [
      {
        label: 'Plain recursion',
        complexity: 'O(2ⁿ)',
        code: `function fib(n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}`,
      },
      {
        label: 'Bottom-up',
        complexity: 'O(n)',
        code: `function fib(n) {
  let a = 0;
  let b = 1;
  for (let i = 0; i < n; i++) {
    const next = a + b;
    a = b;
    b = next;
  }
  return a;
}`,
      },
    ],
  },
];
