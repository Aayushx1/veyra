import type { Problem } from '../types';

const range = (n: number, f: (i: number) => number) => Array.from({ length: n }, (_, i) => f(i));

export const binarySearch: Problem[] = [
  {
    id: 'search-insert-position',
    category: 'binary-search',
    lc: 'search-insert-position',
    n: 35,
    tags: ['sorted', 'lower bound'],
    title: 'Search Insert Position',
    difficulty: 'Easy',
    pattern: 'Lower bound',
    summary:
      'In a sorted list of distinct numbers, return the index of the target, or the index where it would have to be inserted to keep the order.',
    hook: 'Find the first slot whose value is not smaller than the target.',
    real: 'Ordered indexes and sorted logs use a lower-bound lookup to decide where a new record belongs.',
    input: '[[1, 3, 5, 6], 5]',
    expected: '2',
    cases: [
      { input: '[[1, 3, 5, 6], 2]', expected: '1' },
      { input: '[[1, 3, 5, 6], 7]', expected: '4' },
      { input: '[[1, 3, 5, 6], 0]', expected: '0' },
      { input: '[[], 3]', expected: '0' },
    ],
    solutions: [
      {
        label: 'Linear scan',
        complexity: 'O(n)',
        code: `function searchInsert(nums, target) {
  let i = 0;
  while (i < nums.length && nums[i] < target) i++;
  return i;
}`,
      },
      {
        label: 'Binary search',
        complexity: 'O(log n)',
        code: `function searchInsert(nums, target) {
  let lo = 0;
  let hi = nums.length;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`,
      },
    ],
    scale: {
      sizes: [4, 16, 64, 256, 1024],
      make: (n) => JSON.stringify([range(n, (i) => i * 2), n * 2 + 1]),
    },
  },
  {
    id: 'search-in-rotated-sorted-array',
    category: 'binary-search',
    lc: 'search-in-rotated-sorted-array',
    n: 33,
    tags: ['rotated', 'sorted'],
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    pattern: 'Binary search on the sorted half',
    summary:
      'A sorted list of distinct numbers was rotated at an unknown pivot. Return the index of the target, or -1.',
    hook: 'One half around mid is always sorted: check if the target lies in it, else go the other way.',
    real: 'Ring buffers and wrapped log files are sorted data with a seam, and lookups must cope with the wrap point.',
    input: '[[4, 5, 6, 7, 0, 1, 2], 0]',
    expected: '4',
    cases: [
      { input: '[[4, 5, 6, 7, 0, 1, 2], 3]', expected: '-1' },
      { input: '[[1], 0]', expected: '-1' },
      { input: '[[1], 1]', expected: '0' },
      { input: '[[3, 1], 1]', expected: '1' },
    ],
    solutions: [
      {
        label: 'Linear scan',
        complexity: 'O(n)',
        code: `function searchRotated(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) return i;
  }
  return -1;
}`,
      },
      {
        label: 'Binary search',
        complexity: 'O(log n)',
        code: `function searchRotated(nums, target) {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}`,
      },
    ],
    scale: {
      sizes: [4, 16, 64, 256, 1024],
      make: (n) => JSON.stringify([range(n, (i) => (i + n / 2) % n), -1]),
    },
  },
  {
    id: 'find-minimum-in-rotated-sorted-array',
    category: 'binary-search',
    lc: 'find-minimum-in-rotated-sorted-array',
    n: 153,
    tags: ['rotated', 'sorted'],
    title: 'Find Minimum in Rotated Sorted Array',
    difficulty: 'Medium',
    pattern: 'Compare mid with the right end',
    summary: 'A sorted list of distinct numbers has been rotated. Return its smallest element.',
    hook: 'If mid is bigger than the last element, the seam is to the right; otherwise it is at mid or left.',
    real: 'Finding where a circular buffer starts is the same seam search.',
    input: '[[3, 4, 5, 1, 2]]',
    expected: '1',
    cases: [
      { input: '[[4, 5, 6, 7, 0, 1, 2]]', expected: '0' },
      { input: '[[11, 13, 15, 17]]', expected: '11' },
      { input: '[[2, 1]]', expected: '1' },
      { input: '[[1]]', expected: '1' },
    ],
    solutions: [
      {
        label: 'Linear minimum',
        complexity: 'O(n)',
        code: `function findMin(nums) {
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] < best) best = nums[i];
  }
  return best;
}`,
      },
      {
        label: 'Binary search',
        complexity: 'O(log n)',
        code: `function findMin(nums) {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (nums[mid] > nums[hi]) lo = mid + 1;
    else hi = mid;
  }
  return nums[lo];
}`,
      },
    ],
    scale: {
      sizes: [4, 16, 64, 256, 1024],
      make: (n) => JSON.stringify([range(n, (i) => (i + n / 2) % n)]),
    },
  },
  {
    id: 'find-first-and-last-position-of-element-in-sorted-array',
    category: 'binary-search',
    lc: 'find-first-and-last-position-of-element-in-sorted-array',
    n: 34,
    tags: ['sorted', 'lower bound'],
    title: 'First and Last Position of a Value',
    difficulty: 'Medium',
    pattern: 'Two lower-bound searches',
    summary:
      'In a sorted list that may contain repeats, return the first and last index of the target, or [-1, -1] if it is absent.',
    hook: 'The last index of x is one before the first index of x + 1.',
    real: 'Range queries on a sorted index (all rows with this key) find both edges of the matching block.',
    input: '[[5, 7, 7, 8, 8, 10], 8]',
    expected: '[3, 4]',
    cases: [
      { input: '[[5, 7, 7, 8, 8, 10], 6]', expected: '[-1, -1]' },
      { input: '[[], 0]', expected: '[-1, -1]' },
      { input: '[[2, 2], 2]', expected: '[0, 1]' },
    ],
    solutions: [
      {
        label: 'Linear scan',
        complexity: 'O(n)',
        code: `function searchRange(nums, target) {
  let first = -1;
  let last = -1;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) {
      if (first === -1) first = i;
      last = i;
    }
  }
  return [first, last];
}`,
      },
      {
        label: 'Two lower bounds',
        complexity: 'O(log n)',
        code: `function lowerBound(nums, target) {
  let lo = 0;
  let hi = nums.length;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function searchRange(nums, target) {
  const first = lowerBound(nums, target);
  if (first === nums.length || nums[first] !== target) return [-1, -1];
  const last = lowerBound(nums, target + 1) - 1;
  return [first, last];
}`,
      },
    ],
    scale: {
      sizes: [4, 16, 64, 256, 1024],
      make: (n) => JSON.stringify([range(n, () => 7), 7]),
    },
  },
  {
    id: 'sqrtx',
    category: 'binary-search',
    lc: 'sqrtx',
    n: 69,
    tags: ['math', 'answer space'],
    title: 'Integer Square Root',
    difficulty: 'Easy',
    pattern: 'Binary search on the answer',
    summary:
      'Return the integer part of the square root of a non-negative integer, without using a built-in root function.',
    hook: 'Search for the biggest m with m*m not above x; squares only grow, so halving works.',
    real: 'Numeric libraries bracket a root by halving an interval when no closed form is allowed.',
    input: '[8]',
    expected: '2',
    cases: [
      { input: '[0]', expected: '0' },
      { input: '[1]', expected: '1' },
      { input: '[24]', expected: '4' },
      { input: '[1000000]', expected: '1000' },
    ],
    solutions: [
      {
        label: 'Count up',
        complexity: 'O(√x)',
        code: `function mySqrt(x) {
  let r = 0;
  while ((r + 1) * (r + 1) <= x) r++;
  return r;
}`,
      },
      {
        label: 'Binary search',
        complexity: 'O(log x)',
        code: `function mySqrt(x) {
  let lo = 0;
  let hi = x;
  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2);
    if (mid * mid <= x) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}`,
      },
    ],
    scale: {
      sizes: [4, 16, 64, 256, 1024],
      make: (n) => JSON.stringify([n * n]),
    },
  },
  {
    id: 'koko-eating-bananas',
    category: 'binary-search',
    lc: 'koko-eating-bananas',
    n: 875,
    tags: ['answer space'],
    title: 'Koko Eating Bananas',
    difficulty: 'Medium',
    pattern: 'Binary search on the answer',
    summary:
      'Piles of bananas must all be eaten within h hours, one pile per hour at most at a fixed speed. Find the slowest speed that still finishes in time.',
    hook: 'Feasibility is monotonic in speed, so binary search the speed and test it with a quick hour count.',
    real: 'Capacity planning asks for the minimum throughput that meets a deadline, found by testing candidate rates.',
    input: '[[3, 6, 7, 11], 8]',
    expected: '4',
    cases: [
      { input: '[[30, 11, 23, 4, 20], 5]', expected: '30' },
      { input: '[[30, 11, 23, 4, 20], 6]', expected: '23' },
      { input: '[[5], 5]', expected: '1' },
    ],
    solutions: [
      {
        label: 'Try speeds upward',
        complexity: 'O(n·max)',
        code: `function hoursNeeded(piles, speed) {
  let hours = 0;
  for (let i = 0; i < piles.length; i++) hours += Math.ceil(piles[i] / speed);
  return hours;
}

function minEatingSpeed(piles, h) {
  let speed = 1;
  while (hoursNeeded(piles, speed) > h) speed++;
  return speed;
}`,
      },
      {
        label: 'Binary search on speed',
        complexity: 'O(n log max)',
        code: `function hoursNeeded(piles, speed) {
  let hours = 0;
  for (let i = 0; i < piles.length; i++) hours += Math.ceil(piles[i] / speed);
  return hours;
}

function minEatingSpeed(piles, h) {
  let lo = 1;
  let hi = 1;
  for (let i = 0; i < piles.length; i++) {
    if (piles[i] > hi) hi = piles[i];
  }
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (hoursNeeded(piles, mid) <= h) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
      },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64, 128],
      make: (n) => JSON.stringify([range(n, () => n), n]),
    },
  },
  {
    id: 'capacity-to-ship-packages-within-d-days',
    category: 'binary-search',
    lc: 'capacity-to-ship-packages-within-d-days',
    n: 1011,
    tags: ['answer space', 'greedy check'],
    title: 'Ship Packages Within D Days',
    difficulty: 'Medium',
    pattern: 'Binary search on the answer',
    summary:
      'Packages must ship in the given order, one truck load per day. Find the smallest truck capacity that gets everything out within the allowed days.',
    hook: 'Capacity lies between the heaviest package and the total; test one in the middle greedily.',
    real: 'Batch schedulers size a worker or bucket to the smallest limit that still meets a deadline.',
    input: '[[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5]',
    expected: '15',
    cases: [
      { input: '[[3, 2, 2, 4, 1, 4], 3]', expected: '6' },
      { input: '[[1, 2, 3, 1, 1], 4]', expected: '3' },
      { input: '[[5], 1]', expected: '5' },
    ],
    solutions: [
      {
        label: 'Try capacities upward',
        complexity: 'O(n·sum)',
        code: `function daysNeeded(weights, cap) {
  let days = 1;
  let load = 0;
  for (let i = 0; i < weights.length; i++) {
    if (load + weights[i] > cap) {
      days++;
      load = 0;
    }
    load += weights[i];
  }
  return days;
}

function shipWithinDays(weights, days) {
  let cap = 0;
  for (let i = 0; i < weights.length; i++) {
    if (weights[i] > cap) cap = weights[i];
  }
  while (daysNeeded(weights, cap) > days) cap++;
  return cap;
}`,
      },
      {
        label: 'Binary search on capacity',
        complexity: 'O(n log sum)',
        code: `function daysNeeded(weights, cap) {
  let days = 1;
  let load = 0;
  for (let i = 0; i < weights.length; i++) {
    if (load + weights[i] > cap) {
      days++;
      load = 0;
    }
    load += weights[i];
  }
  return days;
}

function shipWithinDays(weights, days) {
  let lo = 0;
  let hi = 0;
  for (let i = 0; i < weights.length; i++) {
    if (weights[i] > lo) lo = weights[i];
    hi += weights[i];
  }
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (daysNeeded(weights, mid) <= days) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
      },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64, 128],
      make: (n) => JSON.stringify([range(n, () => 1), 1]),
    },
  },
  {
    id: 'find-peak-element',
    category: 'binary-search',
    lc: 'find-peak-element',
    n: 162,
    tags: ['slope'],
    title: 'Find Peak Element',
    difficulty: 'Medium',
    pattern: 'Follow the uphill slope',
    summary:
      'Return the index of an element strictly greater than both neighbours (the ends count as having minus infinity outside). The sample inputs here each have exactly one peak so the answer is unique.',
    hook: 'Compare mid with its right neighbour and always walk uphill; a peak must be waiting there.',
    real: 'Hill-climbing and tuning searches look for a local optimum by following the gradient sign.',
    input: '[[1, 2, 3, 1]]',
    expected: '2',
    cases: [
      { input: '[[1]]', expected: '0' },
      { input: '[[5, 4, 3]]', expected: '0' },
      { input: '[[1, 2, 3, 4]]', expected: '3' },
      { input: '[[1, 3, 5, 6, 4]]', expected: '3' },
    ],
    solutions: [
      {
        label: 'Linear scan',
        complexity: 'O(n)',
        code: `function findPeak(nums) {
  for (let i = 0; i < nums.length; i++) {
    const leftOk = i === 0 || nums[i - 1] < nums[i];
    const rightOk = i === nums.length - 1 || nums[i + 1] < nums[i];
    if (leftOk && rightOk) return i;
  }
  return -1;
}`,
      },
      {
        label: 'Binary search on slope',
        complexity: 'O(log n)',
        code: `function findPeak(nums) {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (nums[mid] < nums[mid + 1]) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`,
      },
    ],
    scale: {
      sizes: [4, 16, 64, 256, 1024],
      make: (n) => JSON.stringify([range(n, (i) => i)]),
    },
  },
  {
    id: 'search-a-2d-matrix',
    category: 'binary-search',
    lc: 'search-a-2d-matrix',
    n: 74,
    tags: ['matrix', 'flatten'],
    title: 'Search a 2D Matrix',
    difficulty: 'Medium',
    pattern: 'Binary search on a flattened index',
    summary:
      'Each row is sorted and each row starts above the previous row ends. Decide whether the target occurs anywhere in the grid.',
    hook: 'Treat the grid as one long sorted list: index k lives at row k div cols, column k mod cols.',
    real: 'Paged and tiled storage maps a flat sorted offset to a (page, slot) pair to keep lookups logarithmic.',
    input: '[[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3]',
    expected: 'true',
    cases: [
      { input: '[[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 13]', expected: 'false' },
      { input: '[[[1]], 1]', expected: 'true' },
      { input: '[[[1], [3]], 3]', expected: 'true' },
      { input: '[[], 1]', expected: 'false' },
    ],
    solutions: [
      {
        label: 'Check every cell',
        complexity: 'O(r·c)',
        code: `function searchMatrix(matrix, target) {
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c] === target) return true;
    }
  }
  return false;
}`,
      },
      {
        label: 'Binary search flattened',
        complexity: 'O(log(r·c))',
        code: `function searchMatrix(matrix, target) {
  if (matrix.length === 0) return false;
  const cols = matrix[0].length;
  let lo = 0;
  let hi = matrix.length * cols - 1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    const v = matrix[Math.floor(mid / cols)][mid % cols];
    if (v === target) return true;
    if (v < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}`,
      },
    ],
    scale: {
      sizes: [4, 16, 64, 256, 1024],
      make: (n) =>
        JSON.stringify([range(n, () => 0).map((_, r) => range(4, (c) => r * 4 + c)), -1]),
    },
  },
  {
    id: 'median-of-two-sorted-arrays',
    category: 'binary-search',
    lc: 'median-of-two-sorted-arrays',
    n: 4,
    tags: ['partition', 'sorted'],
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    pattern: 'Binary search on the partition',
    summary:
      'Two sorted lists are given. Return twice the median of all their values combined (the sum of the two middle values, or the single middle counted twice), so the answer stays an integer.',
    hook: 'Binary search how many items the short array gives to the left half; the rest is forced.',
    real: 'Distributed databases compute a combined median or percentile across sorted shards without merging them.',
    input: '[[1, 3], [2]]',
    expected: '4',
    cases: [
      { input: '[[1, 2], [3, 4]]', expected: '5' },
      { input: '[[], [1]]', expected: '2' },
      { input: '[[0, 0], [0, 0]]', expected: '0' },
      { input: '[[1, 3, 8, 9], [7, 11, 18, 19, 21, 25]]', expected: '20' },
    ],
    solutions: [
      {
        label: 'Merge then pick the middle',
        complexity: 'O(m + n)',
        code: `function medianDoubled(a, b) {
  const merged = [];
  let i = 0;
  let j = 0;
  while (i < a.length || j < b.length) {
    if (j >= b.length || (i < a.length && a[i] <= b[j])) {
      merged.push(a[i]);
      i++;
    } else {
      merged.push(b[j]);
      j++;
    }
  }
  const total = merged.length;
  const mid = Math.floor(total / 2);
  if (total % 2 === 1) return 2 * merged[mid];
  return merged[mid - 1] + merged[mid];
}`,
      },
      {
        label: 'Partition binary search',
        complexity: 'O(log(min(m, n)))',
        code: `function medianDoubled(a, b) {
  if (a.length > b.length) return medianDoubled(b, a);
  const m = a.length;
  const n = b.length;
  const half = Math.floor((m + n + 1) / 2);
  let lo = 0;
  let hi = m;
  while (lo <= hi) {
    const i = lo + Math.floor((hi - lo) / 2);
    const j = half - i;
    const aLeft = i === 0 ? -Infinity : a[i - 1];
    const aRight = i === m ? Infinity : a[i];
    const bLeft = j === 0 ? -Infinity : b[j - 1];
    const bRight = j === n ? Infinity : b[j];
    if (aLeft <= bRight && bLeft <= aRight) {
      const leftMax = Math.max(aLeft, bLeft);
      if ((m + n) % 2 === 1) return 2 * leftMax;
      return leftMax + Math.min(aRight, bRight);
    }
    if (aLeft > bRight) hi = i - 1;
    else lo = i + 1;
  }
  return 0;
}`,
      },
    ],
    scale: {
      sizes: [4, 16, 64, 256, 1024],
      make: (n) => JSON.stringify([range(n, (i) => i * 2), range(n, (i) => i * 2 + 1)]),
    },
  },
  {
    id: 'split-array-largest-sum',
    category: 'binary-search',
    lc: 'split-array-largest-sum',
    n: 410,
    tags: ['answer space', 'greedy check'],
    title: 'Split Array Largest Sum',
    difficulty: 'Hard',
    pattern: 'Binary search on the answer',
    summary:
      'Cut a list into k contiguous pieces so that the largest piece sum is as small as possible, and return that sum.',
    hook: 'Guess a ceiling for piece sums, greedily count pieces; too many means the ceiling is too low.',
    real: 'Load balancers splitting an ordered workload across k workers minimize the heaviest worker the same way.',
    input: '[[7, 2, 5, 10, 8], 2]',
    expected: '18',
    cases: [
      { input: '[[1, 2, 3, 4, 5], 2]', expected: '9' },
      { input: '[[1, 4, 4], 3]', expected: '4' },
      { input: '[[5], 1]', expected: '5' },
    ],
    solutions: [
      {
        label: 'Try ceilings upward',
        complexity: 'O(n·sum)',
        code: `function piecesNeeded(nums, cap) {
  let pieces = 1;
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    if (sum + nums[i] > cap) {
      pieces++;
      sum = 0;
    }
    sum += nums[i];
  }
  return pieces;
}

function splitArray(nums, k) {
  let cap = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > cap) cap = nums[i];
  }
  while (piecesNeeded(nums, cap) > k) cap++;
  return cap;
}`,
      },
      {
        label: 'Binary search on the ceiling',
        complexity: 'O(n log sum)',
        code: `function piecesNeeded(nums, cap) {
  let pieces = 1;
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    if (sum + nums[i] > cap) {
      pieces++;
      sum = 0;
    }
    sum += nums[i];
  }
  return pieces;
}

function splitArray(nums, k) {
  let lo = 0;
  let hi = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > lo) lo = nums[i];
    hi += nums[i];
  }
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (piecesNeeded(nums, mid) <= k) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
      },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64, 128],
      make: (n) => JSON.stringify([range(n, () => 1), 1]),
    },
  },
  {
    id: 'valid-perfect-square',
    category: 'binary-search',
    lc: 'valid-perfect-square',
    n: 367,
    tags: ['math', 'answer space'],
    title: 'Valid Perfect Square',
    difficulty: 'Easy',
    pattern: 'Binary search on the root',
    summary:
      'Decide whether a positive integer is the square of some integer, without a built-in root function.',
    hook: 'Search for a root candidate whose square equals the number; squares are monotonic.',
    real: 'Validating that a size or dimension is an exact power or square can be done by bracketing instead of floating-point math.',
    input: '[16]',
    expected: 'true',
    cases: [
      { input: '[14]', expected: 'false' },
      { input: '[1]', expected: 'true' },
      { input: '[808201]', expected: 'true' },
      { input: '[2]', expected: 'false' },
    ],
    solutions: [
      {
        label: 'Count up',
        complexity: 'O(√n)',
        code: `function isPerfectSquare(num) {
  let r = 1;
  while (r * r < num) r++;
  return r * r === num;
}`,
      },
      {
        label: 'Binary search',
        complexity: 'O(log n)',
        code: `function isPerfectSquare(num) {
  let lo = 1;
  let hi = num;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    const sq = mid * mid;
    if (sq === num) return true;
    if (sq < num) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}`,
      },
    ],
    scale: {
      sizes: [4, 16, 64, 256, 1024],
      make: (n) => JSON.stringify([n * n]),
    },
  },
  {
    id: 'find-k-closest-elements',
    category: 'binary-search',
    lc: 'find-k-closest-elements',
    n: 658,
    tags: ['sorted', 'window'],
    title: 'Find K Closest Elements',
    difficulty: 'Medium',
    pattern: 'Binary search on window start',
    summary:
      'From a sorted list, return the k values closest to x in ascending order. On equal distance the smaller value wins.',
    hook: 'The answer is a window of k; binary search its left edge by comparing the two values at its ends.',
    real: 'Nearest-neighbour lookups on a sorted key, such as the closest timestamps to a query time, return a contiguous window.',
    input: '[[1, 2, 3, 4, 5], 4, 3]',
    expected: '[1, 2, 3, 4]',
    cases: [
      { input: '[[1, 2, 3, 4, 5], 4, -1]', expected: '[1, 2, 3, 4]' },
      { input: '[[1, 3], 1, 2]', expected: '[1]' },
      { input: '[[1, 2, 3, 4, 5], 2, 10]', expected: '[4, 5]' },
    ],
    solutions: [
      {
        label: 'Shrink the window from both ends',
        complexity: 'O(n)',
        code: `function findClosest(arr, k, x) {
  let lo = 0;
  let hi = arr.length - 1;
  while (hi - lo + 1 > k) {
    if (x - arr[lo] <= arr[hi] - x) hi--;
    else lo++;
  }
  return arr.slice(lo, hi + 1);
}`,
      },
      {
        label: 'Binary search the left edge',
        complexity: 'O(log(n - k) + k)',
        code: `function findClosest(arr, k, x) {
  let lo = 0;
  let hi = arr.length - k;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (x - arr[mid] > arr[mid + k] - x) lo = mid + 1;
    else hi = mid;
  }
  return arr.slice(lo, lo + k);
}`,
      },
    ],
    scale: {
      sizes: [4, 16, 64, 256, 1024],
      make: (n) => JSON.stringify([range(n, (i) => i), 2, Math.floor(n / 2)]),
    },
  },
  {
    id: 'peak-index-in-a-mountain-array',
    category: 'binary-search',
    lc: 'peak-index-in-a-mountain-array',
    n: 852,
    tags: ['slope'],
    title: 'Peak Index in a Mountain Array',
    difficulty: 'Medium',
    pattern: 'Follow the uphill slope',
    summary:
      'A list strictly rises to a single top and then strictly falls. Return the index of that top.',
    hook: 'If the next value is higher you are still climbing, so the peak is to the right.',
    real: 'Unimodal curves, like cost versus batch size, are tuned by testing the slope and discarding half.',
    input: '[[0, 2, 1, 0]]',
    expected: '1',
    cases: [
      { input: '[[0, 10, 5, 2]]', expected: '1' },
      { input: '[[3, 4, 5, 1]]', expected: '2' },
      { input: '[[0, 1, 0]]', expected: '1' },
      { input: '[[24, 69, 100, 99, 79, 78, 67, 36, 26, 19]]', expected: '2' },
    ],
    solutions: [
      {
        label: 'Walk uphill',
        complexity: 'O(n)',
        code: `function peakIndex(arr) {
  let i = 0;
  while (arr[i] < arr[i + 1]) i++;
  return i;
}`,
      },
      {
        label: 'Binary search on slope',
        complexity: 'O(log n)',
        code: `function peakIndex(arr) {
  let lo = 0;
  let hi = arr.length - 1;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (arr[mid] < arr[mid + 1]) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`,
      },
    ],
    scale: {
      sizes: [4, 16, 64, 256, 1024],
      make: (n) => JSON.stringify([[...range(n - 1, (i) => i), 0]]),
    },
  },
  {
    id: 'single-element-in-a-sorted-array',
    category: 'binary-search',
    lc: 'single-element-in-a-sorted-array',
    n: 540,
    tags: ['sorted', 'parity'],
    title: 'Single Element in a Sorted Array',
    difficulty: 'Medium',
    pattern: 'Binary search on pair parity',
    summary:
      'In a sorted list every value appears twice except one that appears once. Return the lonely value.',
    hook: 'Before the loner, pairs start on even indices; after it they start on odd ones.',
    real: 'Parity checks on aligned pairs let you find the one corrupted or unmatched record in sorted replicated data.',
    input: '[[1, 1, 2, 3, 3, 4, 4, 8, 8]]',
    expected: '2',
    cases: [
      { input: '[[3, 3, 7, 7, 10, 11, 11]]', expected: '10' },
      { input: '[[5]]', expected: '5' },
      { input: '[[1, 2, 2]]', expected: '1' },
      { input: '[[1, 1, 2]]', expected: '2' },
    ],
    solutions: [
      {
        label: 'Scan pair by pair',
        complexity: 'O(n)',
        code: `function singleNonDuplicate(nums) {
  for (let i = 0; i < nums.length; i += 2) {
    if (i + 1 >= nums.length || nums[i] !== nums[i + 1]) return nums[i];
  }
  return -1;
}`,
      },
      {
        label: 'Binary search on even index',
        complexity: 'O(log n)',
        code: `function singleNonDuplicate(nums) {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo < hi) {
    let mid = Math.floor((lo + hi) / 2);
    if (mid % 2 === 1) mid--;
    if (nums[mid] === nums[mid + 1]) lo = mid + 2;
    else hi = mid;
  }
  return nums[lo];
}`,
      },
    ],
    scale: {
      sizes: [4, 16, 64, 256, 1024],
      make: (n) => JSON.stringify([[...range(n, (i) => Math.floor(i / 2)), Math.floor(n / 2)]]),
    },
  },
  {
    id: 'minimum-number-of-days-to-make-m-bouquets',
    category: 'binary-search',
    lc: 'minimum-number-of-days-to-make-m-bouquets',
    n: 1482,
    tags: ['answer space', 'greedy check'],
    title: 'Days to Make m Bouquets',
    difficulty: 'Medium',
    pattern: 'Binary search on the answer',
    summary:
      'Flower i blooms on a given day. A bouquet needs k adjacent bloomed flowers. Find the earliest day you can have m bouquets, or -1 if it is impossible.',
    hook: 'More days never hurts, so binary search the day and greedily count runs of k bloomed flowers.',
    real: 'Release planning asks for the earliest date at which enough contiguous resources are ready.',
    input: '[[1, 10, 3, 10, 2], 3, 1]',
    expected: '3',
    cases: [
      { input: '[[1, 10, 3, 10, 2], 3, 2]', expected: '-1' },
      { input: '[[7, 7, 7, 7, 12, 7, 7], 2, 3]', expected: '12' },
      { input: '[[1, 10, 3, 10, 2], 1, 1]', expected: '1' },
    ],
    solutions: [
      {
        label: 'Try each day upward',
        complexity: 'O(n·maxDay)',
        code: `function bouquetsOn(bloom, day, k) {
  let count = 0;
  let run = 0;
  for (let i = 0; i < bloom.length; i++) {
    if (bloom[i] <= day) {
      run++;
      if (run === k) {
        count++;
        run = 0;
      }
    } else {
      run = 0;
    }
  }
  return count;
}

function minDays(bloom, m, k) {
  if (m * k > bloom.length) return -1;
  let lo = bloom[0];
  let hi = bloom[0];
  for (let i = 0; i < bloom.length; i++) {
    if (bloom[i] < lo) lo = bloom[i];
    if (bloom[i] > hi) hi = bloom[i];
  }
  let day = lo;
  while (bouquetsOn(bloom, day, k) < m) day++;
  return day;
}`,
      },
      {
        label: 'Binary search on the day',
        complexity: 'O(n log maxDay)',
        code: `function bouquetsOn(bloom, day, k) {
  let count = 0;
  let run = 0;
  for (let i = 0; i < bloom.length; i++) {
    if (bloom[i] <= day) {
      run++;
      if (run === k) {
        count++;
        run = 0;
      }
    } else {
      run = 0;
    }
  }
  return count;
}

function minDays(bloom, m, k) {
  if (m * k > bloom.length) return -1;
  let lo = bloom[0];
  let hi = bloom[0];
  for (let i = 0; i < bloom.length; i++) {
    if (bloom[i] < lo) lo = bloom[i];
    if (bloom[i] > hi) hi = bloom[i];
  }
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (bouquetsOn(bloom, mid, k) >= m) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
      },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64, 128],
      make: (n) => JSON.stringify([range(n, (i) => i + 1), 1, n]),
    },
  },
];
