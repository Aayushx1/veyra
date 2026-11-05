import type { Problem } from '../types';

const wrap = (...args: unknown[]) => JSON.stringify(args);
const seq = (n: number, f: (i: number) => number) => Array.from({ length: n }, (_, i) => f(i));

export const twoPointers: Problem[] = [
  {
    id: '3sum',
    category: 'two-pointers',
    lc: '3sum',
    n: 15,
    title: 'Triplets That Sum To Zero',
    difficulty: 'Medium',
    tags: ['sorting', 'dedupe'],
    pattern: 'Sort + fix one, two pointers',
    summary:
      'Find every unique set of three numbers in the list that adds up to zero. Report each triplet in ascending order, and list the triplets in sorted order.',
    hook: 'Sort, pin one number, then squeeze the rest with two pointers; skip repeats.',
    real: 'Reconciling ledgers: finding three entries that cancel out uses the same sorted-sweep trick.',
    input: '[[-1, 0, 1, 2, -1, -4]]',
    expected: '[[-1, -1, 2], [-1, 0, 1]]',
    cases: [
      { input: '[[0, 0, 0, 0]]', expected: '[[0, 0, 0]]' },
      { input: '[[1, 2]]', expected: '[]' },
      { input: '[[-2, 0, 1, 1, 2]]', expected: '[[-2, 0, 2], [-2, 1, 1]]' },
    ],
    scale: { sizes: [4, 8, 16, 32, 64], make: (n) => wrap(seq(n, (i) => i + 1)) },
    solutions: [
      {
        label: 'Triple loop',
        complexity: 'O(n³)',
        code: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const out = [];
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    for (let j = i + 1; j < n; j++) {
      if (j > i + 1 && nums[j] === nums[j - 1]) continue;
      for (let k = j + 1; k < n; k++) {
        if (k > j + 1 && nums[k] === nums[k - 1]) continue;
        if (nums[i] + nums[j] + nums[k] === 0) out.push([nums[i], nums[j], nums[k]]);
      }
    }
  }
  return out;
}`,
      },
      {
        label: 'Sort + two pointers',
        complexity: 'O(n²)',
        code: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const out = [];
  const n = nums.length;
  for (let i = 0; i < n - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let lo = i + 1;
    let hi = n - 1;
    while (lo < hi) {
      const sum = nums[i] + nums[lo] + nums[hi];
      if (sum === 0) {
        out.push([nums[i], nums[lo], nums[hi]]);
        lo++;
        while (lo < hi && nums[lo] === nums[lo - 1]) lo++;
      } else if (sum < 0) lo++;
      else hi--;
    }
  }
  return out;
}`,
      },
    ],
  },
  {
    id: '3sum-closest',
    category: 'two-pointers',
    lc: '3sum-closest',
    n: 16,
    title: 'Triplet Closest To Target',
    difficulty: 'Medium',
    tags: ['sorting'],
    pattern: 'Sort + fix one, two pointers',
    summary:
      'Pick three numbers whose sum lands as near as possible to a target, and return that sum.',
    hook: 'Same squeeze as 3Sum, but track the best distance instead of hunting for zero.',
    real: 'Picking the three components whose combined cost or weight best fits a budget.',
    input: '[[-1, 2, 1, -4], 1]',
    expected: '2',
    cases: [
      { input: '[[0, 0, 0], 1]', expected: '0' },
      { input: '[[1, 1, 1, 0], -100]', expected: '2' },
      { input: '[[4, 0, 5, -5, 3, 3, 0, -4, -5], -2]', expected: '-2' },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) =>
        wrap(
          seq(n, (i) => i + 1),
          100000,
        ),
    },
    solutions: [
      {
        label: 'Try every triple',
        complexity: 'O(n³)',
        code: `function threeSumClosest(nums, target) {
  let best = nums[0] + nums[1] + nums[2];
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      for (let k = j + 1; k < nums.length; k++) {
        const sum = nums[i] + nums[j] + nums[k];
        if (Math.abs(sum - target) < Math.abs(best - target)) best = sum;
      }
    }
  }
  return best;
}`,
      },
      {
        label: 'Sort + two pointers',
        complexity: 'O(n²)',
        code: `function threeSumClosest(nums, target) {
  nums.sort((a, b) => a - b);
  let best = nums[0] + nums[1] + nums[2];
  for (let i = 0; i < nums.length - 2; i++) {
    let lo = i + 1;
    let hi = nums.length - 1;
    while (lo < hi) {
      const sum = nums[i] + nums[lo] + nums[hi];
      if (Math.abs(sum - target) < Math.abs(best - target)) best = sum;
      if (sum === target) return sum;
      if (sum < target) lo++;
      else hi--;
    }
  }
  return best;
}`,
      },
    ],
  },
  {
    id: 'container-with-most-water',
    category: 'two-pointers',
    lc: 'container-with-most-water',
    n: 11,
    title: 'Container With Most Water',
    difficulty: 'Medium',
    tags: ['greedy'],
    pattern: 'Converging pointers, move the shorter side',
    summary:
      'Vertical lines stand at each index with given heights. Choose two lines so that the rectangle between them (width times the shorter height) is as large as possible.',
    hook: 'The shorter wall limits the area, so only moving it can ever help.',
    real: 'Maximizing capacity between two bounding resources, such as the widest span a bottleneck allows.',
    input: '[[1, 8, 6, 2, 5, 4, 8, 3, 7]]',
    expected: '49',
    cases: [
      { input: '[[1, 1]]', expected: '1' },
      { input: '[[4, 3, 2, 1, 4]]', expected: '16' },
      { input: '[[1, 2, 1]]', expected: '2' },
    ],
    scale: { sizes: [4, 8, 16, 32, 64], make: (n) => wrap(seq(n, (i) => ((i * 7) % 13) + 1)) },
    solutions: [
      {
        label: 'All pairs',
        complexity: 'O(n²)',
        code: `function maxArea(height) {
  let best = 0;
  for (let i = 0; i < height.length; i++) {
    for (let j = i + 1; j < height.length; j++) {
      const area = (j - i) * Math.min(height[i], height[j]);
      if (area > best) best = area;
    }
  }
  return best;
}`,
      },
      {
        label: 'Two pointers',
        complexity: 'O(n)',
        code: `function maxArea(height) {
  let lo = 0;
  let hi = height.length - 1;
  let best = 0;
  while (lo < hi) {
    const area = (hi - lo) * Math.min(height[lo], height[hi]);
    if (area > best) best = area;
    if (height[lo] < height[hi]) lo++;
    else hi--;
  }
  return best;
}`,
      },
    ],
  },
  {
    id: 'trapping-rain-water',
    category: 'two-pointers',
    lc: 'trapping-rain-water',
    n: 42,
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    tags: ['elevation map'],
    pattern: 'Two pointers with running maxima',
    summary:
      'Given bar heights of an elevation map, compute how many units of water remain trapped between the bars after rain.',
    hook: 'Water above a bar = min(tallest left, tallest right) - its height; walk in from the lower side.',
    real: 'Estimating buffer or reservoir capacity from a profile of peaks and valleys.',
    input: '[[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]]',
    expected: '6',
    cases: [
      { input: '[[4, 2, 0, 3, 2, 5]]', expected: '9' },
      { input: '[[]]', expected: '0' },
      { input: '[[3]]', expected: '0' },
    ],
    scale: { sizes: [4, 8, 16, 32, 64], make: (n) => wrap(seq(n, (i) => ((i * 5) % 9) + 1)) },
    solutions: [
      {
        label: 'Scan both sides per bar',
        complexity: 'O(n²)',
        code: `function trap(height) {
  let total = 0;
  for (let i = 0; i < height.length; i++) {
    let left = 0;
    for (let j = 0; j <= i; j++) {
      if (height[j] > left) left = height[j];
    }
    let right = 0;
    for (let j = i; j < height.length; j++) {
      if (height[j] > right) right = height[j];
    }
    total += Math.min(left, right) - height[i];
  }
  return total;
}`,
      },
      {
        label: 'Two pointers',
        complexity: 'O(n)',
        code: `function trap(height) {
  let lo = 0;
  let hi = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let total = 0;
  while (lo < hi) {
    if (height[lo] < height[hi]) {
      if (height[lo] >= leftMax) leftMax = height[lo];
      else total += leftMax - height[lo];
      lo++;
    } else {
      if (height[hi] >= rightMax) rightMax = height[hi];
      else total += rightMax - height[hi];
      hi--;
    }
  }
  return total;
}`,
      },
    ],
  },
  {
    id: 'remove-element',
    category: 'two-pointers',
    lc: 'remove-element',
    n: 27,
    title: 'Remove Element In Place',
    difficulty: 'Easy',
    tags: ['in-place'],
    pattern: 'Read/write pointers',
    summary:
      'Delete every occurrence of a value from the array in place, keeping the other items in order. Return the kept prefix.',
    hook: 'One pointer reads everything; the other writes only what survives.',
    real: 'Compacting a buffer in place while dropping unwanted records.',
    input: '[[3, 2, 2, 3], 3]',
    expected: '[2, 2]',
    cases: [
      { input: '[[], 5]', expected: '[]' },
      { input: '[[0, 1, 2, 2, 3, 0, 4, 2], 2]', expected: '[0, 1, 3, 0, 4]' },
      { input: '[[1, 1], 1]', expected: '[]' },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) =>
        wrap(
          seq(n, () => 1),
          1,
        ),
    },
    solutions: [
      {
        label: 'Shift left on every hit',
        complexity: 'O(n²)',
        code: `function removeElement(nums, val) {
  let len = nums.length;
  let i = 0;
  while (i < len) {
    if (nums[i] === val) {
      for (let j = i; j < len - 1; j++) nums[j] = nums[j + 1];
      len--;
    } else {
      i++;
    }
  }
  return nums.slice(0, len);
}`,
      },
      {
        label: 'Read/write pointers',
        complexity: 'O(n)',
        code: `function removeElement(nums, val) {
  let write = 0;
  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== val) {
      nums[write] = nums[read];
      write++;
    }
  }
  return nums.slice(0, write);
}`,
      },
    ],
  },
  {
    id: 'merge-sorted-array',
    category: 'two-pointers',
    lc: 'merge-sorted-array',
    n: 88,
    title: 'Merge Into The First Array',
    difficulty: 'Easy',
    tags: ['sorted', 'in-place'],
    pattern: 'Merge from the back',
    summary:
      'The first array has m sorted values followed by spare room; the second has n sorted values. Merge them into the first array, sorted, and return it.',
    hook: 'Fill from the largest end so nothing unread gets overwritten.',
    real: 'Merging a sorted batch into a preallocated sorted buffer without extra memory.',
    input: '[[1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3]',
    expected: '[1, 2, 2, 3, 5, 6]',
    cases: [
      { input: '[[1], 1, [], 0]', expected: '[1]' },
      { input: '[[0], 0, [1], 1]', expected: '[1]' },
      { input: '[[4, 5, 6, 0, 0, 0], 3, [1, 2, 3], 3]', expected: '[1, 2, 3, 4, 5, 6]' },
    ],
    solutions: [
      {
        label: 'Copy then sort',
        complexity: 'O((m+n) log(m+n))',
        code: `function merge(nums1, m, nums2, n) {
  for (let i = 0; i < n; i++) {
    nums1[m + i] = nums2[i];
  }
  nums1.sort((a, b) => a - b);
  return nums1;
}`,
      },
      {
        label: 'Merge from the back',
        complexity: 'O(m+n)',
        code: `function merge(nums1, m, nums2, n) {
  let i = m - 1;
  let j = n - 1;
  let w = m + n - 1;
  while (j >= 0) {
    if (i >= 0 && nums1[i] > nums2[j]) {
      nums1[w] = nums1[i];
      i--;
    } else {
      nums1[w] = nums2[j];
      j--;
    }
    w--;
  }
  return nums1;
}`,
      },
    ],
  },
  {
    id: 'squares-of-a-sorted-array',
    category: 'two-pointers',
    lc: 'squares-of-a-sorted-array',
    n: 977,
    title: 'Sorted Squares',
    difficulty: 'Easy',
    tags: ['sorted'],
    pattern: 'Converging pointers, fill from the back',
    summary:
      'Given a sorted list that may contain negatives, return the squares of its values in sorted order.',
    hook: 'The biggest square is always at one of the two ends.',
    real: 'Ordering values by magnitude when they are stored sorted by sign-aware value.',
    input: '[[-4, -1, 0, 3, 10]]',
    expected: '[0, 1, 9, 16, 100]',
    cases: [
      { input: '[[-7, -3, 2, 3, 11]]', expected: '[4, 9, 9, 49, 121]' },
      { input: '[[5]]', expected: '[25]' },
      { input: '[[-3, -2, -1]]', expected: '[1, 4, 9]' },
    ],
    solutions: [
      {
        label: 'Square then sort',
        complexity: 'O(n log n)',
        code: `function sortedSquares(nums) {
  const out = [];
  for (let i = 0; i < nums.length; i++) {
    out.push(nums[i] * nums[i]);
  }
  out.sort((a, b) => a - b);
  return out;
}`,
      },
      {
        label: 'Two pointers',
        complexity: 'O(n)',
        code: `function sortedSquares(nums) {
  const out = [];
  for (let i = 0; i < nums.length; i++) out.push(0);
  let lo = 0;
  let hi = nums.length - 1;
  for (let w = nums.length - 1; w >= 0; w--) {
    if (Math.abs(nums[lo]) > Math.abs(nums[hi])) {
      out[w] = nums[lo] * nums[lo];
      lo++;
    } else {
      out[w] = nums[hi] * nums[hi];
      hi--;
    }
  }
  return out;
}`,
      },
    ],
  },
  {
    id: 'boats-to-save-people',
    category: 'two-pointers',
    lc: 'boats-to-save-people',
    n: 881,
    title: 'Rescue Boats',
    difficulty: 'Medium',
    tags: ['greedy', 'sorting'],
    pattern: 'Sort + pair heaviest with lightest',
    summary:
      'Each boat carries at most two people and has a weight limit. Given every person weight, find the fewest boats needed.',
    hook: 'If the lightest cannot ride with the heaviest, the heaviest rides alone.',
    real: 'Bin packing with pairs, such as bundling two jobs per worker under a capacity cap.',
    input: '[[3, 2, 2, 1], 3]',
    expected: '3',
    cases: [
      { input: '[[3, 5, 3, 4], 5]', expected: '4' },
      { input: '[[1, 2], 3]', expected: '1' },
      { input: '[[], 10]', expected: '0' },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) =>
        wrap(
          seq(n, (i) => (i % 5) + 1),
          6,
        ),
    },
    solutions: [
      {
        label: 'Heaviest finds a partner by scanning',
        complexity: 'O(n²)',
        code: `function numRescueBoats(people, limit) {
  people.sort((a, b) => a - b);
  const used = [];
  for (let i = 0; i < people.length; i++) used.push(false);
  let boats = 0;
  for (let i = people.length - 1; i >= 0; i--) {
    if (used[i]) continue;
    used[i] = true;
    boats++;
    for (let j = i - 1; j >= 0; j--) {
      if (!used[j] && people[i] + people[j] <= limit) {
        used[j] = true;
        break;
      }
    }
  }
  return boats;
}`,
      },
      {
        label: 'Sort + two pointers',
        complexity: 'O(n log n)',
        code: `function numRescueBoats(people, limit) {
  people.sort((a, b) => a - b);
  let lo = 0;
  let hi = people.length - 1;
  let boats = 0;
  while (lo <= hi) {
    if (people[lo] + people[hi] <= limit) lo++;
    hi--;
    boats++;
  }
  return boats;
}`,
      },
    ],
  },
  {
    id: 'happy-number',
    category: 'two-pointers',
    lc: 'happy-number',
    n: 202,
    title: 'Happy Number',
    difficulty: 'Easy',
    tags: ['cycle detection', 'math'],
    pattern: 'Fast/slow pointers on a number sequence',
    summary:
      'Repeatedly replace a number with the sum of the squares of its digits. Decide whether the process reaches 1 or loops forever.',
    hook: 'A sequence that either hits 1 or cycles is a cycle-detection problem.',
    real: 'Detecting a state machine or iterative process that has fallen into a loop.',
    input: '[19]',
    expected: 'true',
    cases: [
      { input: '[2]', expected: 'false' },
      { input: '[1]', expected: 'true' },
      { input: '[7]', expected: 'true' },
    ],
    solutions: [
      {
        label: 'Remember seen values',
        complexity: 'O(log n)',
        code: `function digitSquares(x) {
  let sum = 0;
  while (x > 0) {
    const d = x % 10;
    sum += d * d;
    x = Math.floor(x / 10);
  }
  return sum;
}

function isHappy(n) {
  const seen = new Set();
  while (n !== 1 && !seen.has(n)) {
    seen.add(n);
    n = digitSquares(n);
  }
  return n === 1;
}`,
      },
      {
        label: 'Fast and slow pointers',
        complexity: 'O(log n)',
        code: `function digitSquares(x) {
  let sum = 0;
  while (x > 0) {
    const d = x % 10;
    sum += d * d;
    x = Math.floor(x / 10);
  }
  return sum;
}

function isHappy(n) {
  let slow = n;
  let fast = digitSquares(n);
  while (fast !== 1 && slow !== fast) {
    slow = digitSquares(slow);
    fast = digitSquares(digitSquares(fast));
  }
  return fast === 1;
}`,
      },
    ],
  },
  {
    id: '4sum',
    category: 'two-pointers',
    lc: '4sum',
    n: 18,
    title: 'Quadruplets With Target Sum',
    difficulty: 'Medium',
    tags: ['sorting', 'dedupe'],
    pattern: 'Sort + two fixed, two pointers',
    summary:
      'Find all unique groups of four numbers that add up to a target. Return each group ascending and the groups in sorted order.',
    hook: 'Fix two numbers, squeeze the other two; skip duplicates at every level.',
    real: 'Matching combinations of four line items to a total during reconciliation.',
    input: '[[1, 0, -1, 0, -2, 2], 0]',
    expected: '[[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]]',
    cases: [
      { input: '[[2, 2, 2, 2, 2], 8]', expected: '[[2, 2, 2, 2]]' },
      { input: '[[1], 1]', expected: '[]' },
      { input: '[[1, 2, 3, 4], 10]', expected: '[[1, 2, 3, 4]]' },
    ],
    scale: {
      sizes: [4, 8, 16, 24, 32],
      make: (n) =>
        wrap(
          seq(n, (i) => i + 1),
          100000,
        ),
    },
    solutions: [
      {
        label: 'Four nested loops',
        complexity: 'O(n⁴)',
        code: `function fourSum(nums, target) {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  const out = [];
  for (let a = 0; a < n; a++) {
    if (a > 0 && nums[a] === nums[a - 1]) continue;
    for (let b = a + 1; b < n; b++) {
      if (b > a + 1 && nums[b] === nums[b - 1]) continue;
      for (let c = b + 1; c < n; c++) {
        if (c > b + 1 && nums[c] === nums[c - 1]) continue;
        for (let d = c + 1; d < n; d++) {
          if (d > c + 1 && nums[d] === nums[d - 1]) continue;
          if (nums[a] + nums[b] + nums[c] + nums[d] === target) {
            out.push([nums[a], nums[b], nums[c], nums[d]]);
          }
        }
      }
    }
  }
  return out;
}`,
      },
      {
        label: 'Sort + two pointers',
        complexity: 'O(n³)',
        code: `function fourSum(nums, target) {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  const out = [];
  for (let a = 0; a < n - 3; a++) {
    if (a > 0 && nums[a] === nums[a - 1]) continue;
    for (let b = a + 1; b < n - 2; b++) {
      if (b > a + 1 && nums[b] === nums[b - 1]) continue;
      let lo = b + 1;
      let hi = n - 1;
      while (lo < hi) {
        const sum = nums[a] + nums[b] + nums[lo] + nums[hi];
        if (sum === target) {
          out.push([nums[a], nums[b], nums[lo], nums[hi]]);
          lo++;
          while (lo < hi && nums[lo] === nums[lo - 1]) lo++;
        } else if (sum < target) lo++;
        else hi--;
      }
    }
  }
  return out;
}`,
      },
    ],
  },
  {
    id: 'intersection-of-two-arrays-ii',
    category: 'two-pointers',
    lc: 'intersection-of-two-arrays-ii',
    n: 350,
    title: 'Intersection With Duplicates',
    difficulty: 'Easy',
    tags: ['sorting', 'multiset'],
    pattern: 'Sort both, walk together',
    summary:
      'Return the multiset intersection of two lists: each value appears as many times as it shows up in both. Give the result in ascending order.',
    hook: 'Sorted lists: advance whichever pointer is behind; equal means take it.',
    real: 'Joining two sorted record streams, like a merge join in a database.',
    input: '[[1, 2, 2, 1], [2, 2]]',
    expected: '[2, 2]',
    cases: [
      { input: '[[4, 9, 5], [9, 4, 9, 8, 4]]', expected: '[4, 9]' },
      { input: '[[1], [2]]', expected: '[]' },
      { input: '[[], [1]]', expected: '[]' },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) =>
        wrap(
          seq(n, (i) => i % 5),
          seq(n, (i) => (i * 3) % 7),
        ),
    },
    solutions: [
      {
        label: 'Search the other list',
        complexity: 'O(n·m)',
        code: `function intersect(nums1, nums2) {
  const used = [];
  for (let i = 0; i < nums2.length; i++) used.push(false);
  const out = [];
  for (let i = 0; i < nums1.length; i++) {
    for (let j = 0; j < nums2.length; j++) {
      if (!used[j] && nums2[j] === nums1[i]) {
        used[j] = true;
        out.push(nums1[i]);
        break;
      }
    }
  }
  out.sort((a, b) => a - b);
  return out;
}`,
      },
      {
        label: 'Sort + two pointers',
        complexity: 'O(n log n + m log m)',
        code: `function intersect(nums1, nums2) {
  nums1.sort((a, b) => a - b);
  nums2.sort((a, b) => a - b);
  const out = [];
  let i = 0;
  let j = 0;
  while (i < nums1.length && j < nums2.length) {
    if (nums1[i] === nums2[j]) {
      out.push(nums1[i]);
      i++;
      j++;
    } else if (nums1[i] < nums2[j]) i++;
    else j++;
  }
  return out;
}`,
      },
    ],
  },
  {
    id: 'sum-of-square-numbers',
    category: 'two-pointers',
    lc: 'sum-of-square-numbers',
    n: 633,
    title: 'Sum Of Two Squares',
    difficulty: 'Medium',
    tags: ['math'],
    pattern: 'Converging pointers on a value range',
    summary:
      'Decide whether a non-negative integer can be written as a squared integer plus another squared integer.',
    hook: 'Let a start at 0 and b at sqrt(c); too big shrinks b, too small grows a.',
    real: 'Searching a one-dimensional range from both ends instead of enumerating all pairs.',
    input: '[5]',
    expected: 'true',
    cases: [
      { input: '[3]', expected: 'false' },
      { input: '[0]', expected: 'true' },
      { input: '[2]', expected: 'true' },
      { input: '[999]', expected: 'false' },
    ],
    scale: { sizes: [8, 64, 512, 2048], make: (n) => wrap(4 * n + 3) },
    solutions: [
      {
        label: 'Try every pair (a, b)',
        complexity: 'O(c)',
        code: `function judgeSquareSum(c) {
  for (let a = 0; a * a <= c; a++) {
    for (let b = 0; b * b <= c; b++) {
      if (a * a + b * b === c) return true;
    }
  }
  return false;
}`,
      },
      {
        label: 'Two pointers',
        complexity: 'O(√c)',
        code: `function judgeSquareSum(c) {
  let lo = 0;
  let hi = Math.floor(Math.sqrt(c));
  while (lo <= hi) {
    const sum = lo * lo + hi * hi;
    if (sum === c) return true;
    if (sum < c) lo++;
    else hi--;
  }
  return false;
}`,
      },
    ],
  },
  {
    id: 'remove-duplicates-from-sorted-array-ii',
    category: 'two-pointers',
    lc: 'remove-duplicates-from-sorted-array-ii',
    n: 80,
    title: 'Keep At Most Two Of Each',
    difficulty: 'Medium',
    tags: ['in-place', 'sorted'],
    pattern: 'Read/write pointers with lookback',
    summary:
      'In a sorted array, allow each value to stay at most twice. Compact the array in place and return the kept prefix.',
    hook: 'Keep an item unless it equals the one two slots behind the write pointer.',
    real: 'Rate-limiting style dedupe: retain at most two entries per key in sorted logs.',
    input: '[[1, 1, 1, 2, 2, 3]]',
    expected: '[1, 1, 2, 2, 3]',
    cases: [
      { input: '[[0, 0, 1, 1, 1, 1, 2, 3, 3]]', expected: '[0, 0, 1, 1, 2, 3, 3]' },
      { input: '[[]]', expected: '[]' },
      { input: '[[7]]', expected: '[7]' },
    ],
    scale: { sizes: [4, 8, 16, 32, 64], make: (n) => wrap(seq(n, () => 1)) },
    solutions: [
      {
        label: 'Shift left on every extra',
        complexity: 'O(n²)',
        code: `function removeDuplicates(nums) {
  let len = nums.length;
  let i = 2;
  while (i < len) {
    if (nums[i] === nums[i - 2]) {
      for (let j = i; j < len - 1; j++) nums[j] = nums[j + 1];
      len--;
    } else {
      i++;
    }
  }
  return nums.slice(0, len);
}`,
      },
      {
        label: 'Read/write pointers',
        complexity: 'O(n)',
        code: `function removeDuplicates(nums) {
  let write = 0;
  for (let read = 0; read < nums.length; read++) {
    if (write < 2 || nums[read] !== nums[write - 2]) {
      nums[write] = nums[read];
      write++;
    }
  }
  return nums.slice(0, write);
}`,
      },
    ],
  },
  {
    id: 'valid-triangle-number',
    category: 'two-pointers',
    lc: 'valid-triangle-number',
    n: 611,
    title: 'Count Valid Triangles',
    difficulty: 'Medium',
    tags: ['sorting', 'counting'],
    pattern: 'Sort + fix longest side, two pointers',
    summary:
      'Count the triples of values from the array that could be the side lengths of a non-degenerate triangle.',
    hook: 'Sorted, fix the longest side; if small + mid beats it, everything between works too.',
    real: 'Counting feasible combinations under a pairwise-sum constraint without enumerating them.',
    input: '[[2, 2, 3, 4]]',
    expected: '3',
    cases: [
      { input: '[[4, 2, 3, 4]]', expected: '4' },
      { input: '[[1, 1]]', expected: '0' },
      { input: '[[0, 0, 0]]', expected: '0' },
    ],
    scale: { sizes: [4, 8, 16, 32, 64], make: (n) => wrap(seq(n, () => 5)) },
    solutions: [
      {
        label: 'Check every triple',
        complexity: 'O(n³)',
        code: `function triangleNumber(nums) {
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      for (let k = j + 1; k < nums.length; k++) {
        const a = nums[i];
        const b = nums[j];
        const c = nums[k];
        if (a + b > c && a + c > b && b + c > a) count++;
      }
    }
  }
  return count;
}`,
      },
      {
        label: 'Sort + two pointers',
        complexity: 'O(n²)',
        code: `function triangleNumber(nums) {
  nums.sort((a, b) => a - b);
  let count = 0;
  for (let k = nums.length - 1; k >= 2; k--) {
    let lo = 0;
    let hi = k - 1;
    while (lo < hi) {
      if (nums[lo] + nums[hi] > nums[k]) {
        count += hi - lo;
        hi--;
      } else {
        lo++;
      }
    }
  }
  return count;
}`,
      },
    ],
  },
  {
    id: 'max-number-of-k-sum-pairs',
    category: 'two-pointers',
    lc: 'max-number-of-k-sum-pairs',
    n: 1679,
    title: 'Max Pairs Summing To K',
    difficulty: 'Medium',
    tags: ['hash map', 'counting'],
    pattern: 'Pair matching with counts',
    summary:
      'Repeatedly remove two numbers that add up to k. Return the largest number of such removals possible.',
    hook: 'Each number either finds an unused partner or waits to be one.',
    real: 'Matching complementary orders, like buy and sell requests that net to a fixed price.',
    input: '[[1, 2, 3, 4], 5]',
    expected: '2',
    cases: [
      { input: '[[3, 1, 3, 4, 3], 6]', expected: '1' },
      { input: '[[], 5]', expected: '0' },
      { input: '[[2, 2, 2, 2], 4]', expected: '2' },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) =>
        wrap(
          seq(n, (i) => i + 1),
          100000,
        ),
    },
    solutions: [
      {
        label: 'Search for an unused partner',
        complexity: 'O(n²)',
        code: `function maxOperations(nums, k) {
  const used = [];
  for (let i = 0; i < nums.length; i++) used.push(false);
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    if (used[i]) continue;
    for (let j = i + 1; j < nums.length; j++) {
      if (!used[j] && nums[i] + nums[j] === k) {
        used[i] = true;
        used[j] = true;
        count++;
        break;
      }
    }
  }
  return count;
}`,
      },
      {
        label: 'Count map',
        complexity: 'O(n)',
        code: `function maxOperations(nums, k) {
  const waiting = new Map();
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    const need = k - nums[i];
    if ((waiting.get(need) || 0) > 0) {
      waiting.set(need, waiting.get(need) - 1);
      count++;
    } else {
      waiting.set(nums[i], (waiting.get(nums[i]) || 0) + 1);
    }
  }
  return count;
}`,
      },
    ],
  },
  {
    id: 'shortest-unsorted-continuous-subarray',
    category: 'two-pointers',
    lc: 'shortest-unsorted-continuous-subarray',
    n: 581,
    title: 'Shortest Subarray To Sort',
    difficulty: 'Medium',
    tags: ['monotonic'],
    pattern: 'Scan from both ends with running max/min',
    summary:
      'Find the length of the shortest contiguous stretch which, if sorted, would make the whole array sorted ascending.',
    hook: 'The right edge is the last spot below a running max; the left edge is the last spot above a running min from the right.',
    real: 'Locating the minimal region to re-sort or re-index after an almost-sorted batch is appended.',
    input: '[[2, 6, 4, 8, 10, 9, 15]]',
    expected: '5',
    cases: [
      { input: '[[1, 2, 3, 4]]', expected: '0' },
      { input: '[[1]]', expected: '0' },
      { input: '[[2, 1]]', expected: '2' },
      { input: '[[1, 3, 2, 2, 2]]', expected: '4' },
    ],
    scale: { sizes: [4, 8, 16, 32, 64], make: (n) => wrap(seq(n, (i) => n - i)) },
    solutions: [
      {
        label: 'Find out-of-order pairs',
        complexity: 'O(n²)',
        code: `function findUnsortedSubarray(nums) {
  let left = nums.length;
  let right = -1;
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] > nums[j]) {
        left = Math.min(left, i);
        right = Math.max(right, j);
      }
    }
  }
  return right < 0 ? 0 : right - left + 1;
}`,
      },
      {
        label: 'Two directional scans',
        complexity: 'O(n)',
        code: `function findUnsortedSubarray(nums) {
  const n = nums.length;
  let right = -1;
  let left = n;
  let max = -Infinity;
  for (let i = 0; i < n; i++) {
    if (nums[i] < max) right = i;
    else max = nums[i];
  }
  let min = Infinity;
  for (let i = n - 1; i >= 0; i--) {
    if (nums[i] > min) left = i;
    else min = nums[i];
  }
  return right < 0 ? 0 : right - left + 1;
}`,
      },
    ],
  },
];
