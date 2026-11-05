import type { Problem } from '../types';

const wrap = (...args: unknown[]) => JSON.stringify(args);
const seq = (n: number, f: (i: number) => number) => Array.from({ length: n }, (_, i) => f(i));
const rep = (ch: string, n: number) => ch.repeat(n);

export const slidingWindow: Problem[] = [
  {
    id: 'longest-substring-without-repeating-characters',
    category: 'sliding-window',
    lc: 'longest-substring-without-repeating-characters',
    n: 3,
    title: 'Longest Substring With No Repeats',
    difficulty: 'Medium',
    tags: ['string', 'hash map'],
    pattern: 'Variable window with last-seen index',
    summary:
      'Return the length of the longest stretch of a string in which no character occurs twice.',
    hook: 'Grow the right edge; when a repeat appears, jump the left edge past its previous spot.',
    real: 'Finding the longest run of unique events in a stream, e.g. for deduplicating sessions.',
    input: '["abcabcbb"]',
    expected: '3',
    cases: [
      { input: '[""]', expected: '0' },
      { input: '["bbbb"]', expected: '1' },
      { input: '["pwwkew"]', expected: '3' },
      { input: '["abba"]', expected: '2' },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) =>
        wrap(
          seq(n, (i) => 200 + i)
            .map((c) => String.fromCharCode(c))
            .join(''),
        ),
    },
    solutions: [
      {
        label: 'Extend from every start',
        complexity: 'O(n²)',
        code: `function lengthOfLongestSubstring(s) {
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    const seen = new Set();
    for (let j = i; j < s.length; j++) {
      if (seen.has(s[j])) break;
      seen.add(s[j]);
      best = Math.max(best, j - i + 1);
    }
  }
  return best;
}`,
      },
      {
        label: 'Sliding window',
        complexity: 'O(n)',
        code: `function lengthOfLongestSubstring(s) {
  const last = new Map();
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    if (last.has(c) && last.get(c) >= left) left = last.get(c) + 1;
    last.set(c, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
      },
    ],
  },
  {
    id: 'minimum-size-subarray-sum',
    category: 'sliding-window',
    lc: 'minimum-size-subarray-sum',
    n: 209,
    title: 'Shortest Subarray Reaching Sum',
    difficulty: 'Medium',
    tags: ['positive numbers'],
    pattern: 'Variable window, shrink while valid',
    summary:
      'Given positive numbers and a target, find the length of the shortest contiguous piece whose sum is at least the target, or 0 if none exists.',
    hook: 'Expand until the sum is enough, then shrink as far as it still holds.',
    real: 'Finding the shortest time span in which traffic or spend crosses a threshold.',
    input: '[[2, 3, 1, 2, 4, 3], 7]',
    expected: '2',
    cases: [
      { input: '[[1, 1, 1], 11]', expected: '0' },
      { input: '[[7], 7]', expected: '1' },
      { input: '[[1, 4, 4], 4]', expected: '1' },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) =>
        wrap(
          seq(n, () => 1),
          n + 1,
        ),
    },
    solutions: [
      {
        label: 'Extend from every start',
        complexity: 'O(n²)',
        code: `function minSubArrayLen(nums, target) {
  let best = Infinity;
  for (let i = 0; i < nums.length; i++) {
    let sum = 0;
    for (let j = i; j < nums.length; j++) {
      sum += nums[j];
      if (sum >= target) {
        best = Math.min(best, j - i + 1);
        break;
      }
    }
  }
  return best === Infinity ? 0 : best;
}`,
      },
      {
        label: 'Sliding window',
        complexity: 'O(n)',
        code: `function minSubArrayLen(nums, target) {
  let best = Infinity;
  let left = 0;
  let sum = 0;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum >= target) {
      best = Math.min(best, right - left + 1);
      sum -= nums[left];
      left++;
    }
  }
  return best === Infinity ? 0 : best;
}`,
      },
    ],
  },
  {
    id: 'longest-repeating-character-replacement',
    category: 'sliding-window',
    lc: 'longest-repeating-character-replacement',
    n: 424,
    title: 'Longest Run After K Replacements',
    difficulty: 'Medium',
    tags: ['string', 'frequency'],
    pattern: 'Window valid while length - maxFreq <= k',
    summary:
      'You may overwrite up to k characters of an uppercase string. Return the longest stretch that can be made all one letter.',
    hook: 'A window works if everything except its most common letter can be replaced within budget.',
    real: 'Tolerating a few noisy samples when looking for the longest stable reading.',
    input: '["AABABBA", 1]',
    expected: '4',
    cases: [
      { input: '["ABAB", 2]', expected: '4' },
      { input: '["A", 0]', expected: '1' },
      { input: '["ABCDE", 1]', expected: '2' },
    ],
    scale: { sizes: [4, 8, 16, 32, 64], make: (n) => wrap(rep('A', n), 1) },
    solutions: [
      {
        label: 'Extend from every start',
        complexity: 'O(n²)',
        code: `function characterReplacement(s, k) {
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    const counts = new Map();
    let maxFreq = 0;
    for (let j = i; j < s.length; j++) {
      const c = s[j];
      counts.set(c, (counts.get(c) || 0) + 1);
      maxFreq = Math.max(maxFreq, counts.get(c));
      if (j - i + 1 - maxFreq > k) break;
      best = Math.max(best, j - i + 1);
    }
  }
  return best;
}`,
      },
      {
        label: 'Sliding window',
        complexity: 'O(n)',
        code: `function characterReplacement(s, k) {
  const counts = new Map();
  let left = 0;
  let maxFreq = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    counts.set(c, (counts.get(c) || 0) + 1);
    maxFreq = Math.max(maxFreq, counts.get(c));
    if (right - left + 1 - maxFreq > k) {
      counts.set(s[left], counts.get(s[left]) - 1);
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
      },
    ],
  },
  {
    id: 'permutation-in-string',
    category: 'sliding-window',
    lc: 'permutation-in-string',
    n: 567,
    title: 'Does A Permutation Appear',
    difficulty: 'Medium',
    tags: ['string', 'frequency'],
    pattern: 'Fixed window with letter counts',
    summary:
      'Given a short pattern and a longer text (lowercase letters), tell whether some rearrangement of the pattern appears as a contiguous piece of the text.',
    hook: 'Keep a window the pattern length; track how many needed letters are still missing.',
    real: 'Spotting scrambled tokens in a log stream by comparing letter-frequency signatures.',
    input: '["ab", "eidbaooo"]',
    expected: 'true',
    cases: [
      { input: '["ab", "eidboaoo"]', expected: 'false' },
      { input: '["abc", "ab"]', expected: 'false' },
      { input: '["a", "a"]', expected: 'true' },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) => wrap(rep('a', n / 2 - 1) + 'b', rep('a', n)),
    },
    solutions: [
      {
        label: 'Recount every window',
        complexity: 'O(n·m)',
        code: `function checkInclusion(s1, s2) {
  const m = s1.length;
  const need = [];
  for (let i = 0; i < 26; i++) need.push(0);
  for (let i = 0; i < m; i++) need[s1.charCodeAt(i) - 97]++;
  for (let i = 0; i + m <= s2.length; i++) {
    const tmp = need.slice();
    let ok = true;
    for (let j = 0; j < m; j++) {
      const idx = s2.charCodeAt(i + j) - 97;
      tmp[idx]--;
      if (tmp[idx] < 0) {
        ok = false;
        break;
      }
    }
    if (ok) return true;
  }
  return false;
}`,
      },
      {
        label: 'Sliding window',
        complexity: 'O(n)',
        code: `function checkInclusion(s1, s2) {
  const m = s1.length;
  const cnt = [];
  for (let i = 0; i < 26; i++) cnt.push(0);
  for (let i = 0; i < m; i++) cnt[s1.charCodeAt(i) - 97]++;
  let missing = m;
  for (let right = 0; right < s2.length; right++) {
    const add = s2.charCodeAt(right) - 97;
    cnt[add]--;
    if (cnt[add] >= 0) missing--;
    if (right >= m) {
      const drop = s2.charCodeAt(right - m) - 97;
      cnt[drop]++;
      if (cnt[drop] > 0) missing++;
    }
    if (missing === 0) return true;
  }
  return false;
}`,
      },
    ],
  },
  {
    id: 'minimum-window-substring',
    category: 'sliding-window',
    lc: 'minimum-window-substring',
    n: 76,
    title: 'Smallest Window Covering Letters',
    difficulty: 'Hard',
    tags: ['string', 'hash map'],
    pattern: 'Variable window with need counts',
    summary:
      'Find the shortest piece of the first string that contains every character of the second string (with multiplicity). Return it, or an empty string.',
    hook: 'Expand until covered, then shrink from the left while it stays covered.',
    real: 'Finding the shortest log excerpt containing every required event type.',
    input: '["ADOBECODEBANC", "ABC"]',
    expected: '"BANC"',
    cases: [
      { input: '["a", "a"]', expected: '"a"' },
      { input: '["a", "aa"]', expected: '""' },
      { input: '["ab", "b"]', expected: '"b"' },
    ],
    scale: { sizes: [4, 8, 16, 32, 64], make: (n) => wrap(rep('a', n), 'ab') },
    solutions: [
      {
        label: 'Extend from every start',
        complexity: 'O(n²)',
        code: `function minWindow(s, t) {
  let bestStart = 0;
  let bestLen = Infinity;
  for (let i = 0; i < s.length; i++) {
    const need = new Map();
    for (let k = 0; k < t.length; k++) need.set(t[k], (need.get(t[k]) || 0) + 1);
    let remaining = t.length;
    for (let j = i; j < s.length; j++) {
      const c = s[j];
      if (need.has(c)) {
        if (need.get(c) > 0) remaining--;
        need.set(c, need.get(c) - 1);
      }
      if (remaining === 0) {
        if (j - i + 1 < bestLen) {
          bestLen = j - i + 1;
          bestStart = i;
        }
        break;
      }
    }
  }
  return bestLen === Infinity ? "" : s.slice(bestStart, bestStart + bestLen);
}`,
      },
      {
        label: 'Sliding window',
        complexity: 'O(n + m)',
        code: `function minWindow(s, t) {
  const need = new Map();
  for (let k = 0; k < t.length; k++) need.set(t[k], (need.get(t[k]) || 0) + 1);
  let remaining = t.length;
  let left = 0;
  let bestStart = 0;
  let bestLen = Infinity;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    if (need.has(c)) {
      if (need.get(c) > 0) remaining--;
      need.set(c, need.get(c) - 1);
    }
    while (remaining === 0) {
      if (right - left + 1 < bestLen) {
        bestLen = right - left + 1;
        bestStart = left;
      }
      const d = s[left];
      if (need.has(d)) {
        need.set(d, need.get(d) + 1);
        if (need.get(d) > 0) remaining++;
      }
      left++;
    }
  }
  return bestLen === Infinity ? "" : s.slice(bestStart, bestStart + bestLen);
}`,
      },
    ],
  },
  {
    id: 'sliding-window-maximum',
    category: 'sliding-window',
    lc: 'sliding-window-maximum',
    n: 239,
    title: 'Maximum Of Every Window',
    difficulty: 'Hard',
    tags: ['deque', 'monotonic'],
    pattern: 'Monotonic deque of indices',
    summary:
      'For every window of k consecutive numbers, report the largest value in it, as a list.',
    hook: 'Keep a deque of candidates in decreasing order; the front is always the max.',
    real: 'Rolling peak metrics over a time window, such as max latency in the last minute.',
    input: '[[1, 3, -1, -3, 5, 3, 6, 7], 3]',
    expected: '[3, 3, 5, 5, 6, 7]',
    cases: [
      { input: '[[1], 1]', expected: '[1]' },
      { input: '[[9, 11], 2]', expected: '[11]' },
      { input: '[[4, 3, 2, 1], 2]', expected: '[4, 3, 2]' },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) =>
        wrap(
          seq(n, (i) => (i * 7) % 11),
          n / 2,
        ),
    },
    solutions: [
      {
        label: 'Scan each window',
        complexity: 'O(n·k)',
        code: `function maxSlidingWindow(nums, k) {
  const out = [];
  for (let i = 0; i + k <= nums.length; i++) {
    let best = nums[i];
    for (let j = i + 1; j < i + k; j++) {
      if (nums[j] > best) best = nums[j];
    }
    out.push(best);
  }
  return out;
}`,
      },
      {
        label: 'Monotonic deque',
        complexity: 'O(n)',
        code: `function maxSlidingWindow(nums, k) {
  const out = [];
  const dq = [];
  let head = 0;
  for (let i = 0; i < nums.length; i++) {
    while (dq.length > head && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();
    dq.push(i);
    if (dq[head] <= i - k) head++;
    if (i >= k - 1) out.push(nums[dq[head]]);
  }
  return out;
}`,
      },
    ],
  },
  {
    id: 'max-consecutive-ones-iii',
    category: 'sliding-window',
    lc: 'max-consecutive-ones-iii',
    n: 1004,
    title: 'Longest Ones With K Flips',
    difficulty: 'Medium',
    tags: ['binary array'],
    pattern: 'Variable window with a zero budget',
    summary:
      'In a 0/1 array you may flip at most k zeros to ones. Return the longest run of ones you can create.',
    hook: 'Find the longest window holding at most k zeros.',
    real: 'Longest healthy streak when a few failures are forgiven.',
    input: '[[1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2]',
    expected: '6',
    cases: [
      { input: '[[0, 0, 0], 0]', expected: '0' },
      { input: '[[1, 1], 0]', expected: '2' },
      {
        input: '[[0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1], 3]',
        expected: '10',
      },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) =>
        wrap(
          seq(n, () => 1),
          0,
        ),
    },
    solutions: [
      {
        label: 'Extend from every start',
        complexity: 'O(n²)',
        code: `function longestOnes(nums, k) {
  let best = 0;
  for (let i = 0; i < nums.length; i++) {
    let zeros = 0;
    for (let j = i; j < nums.length; j++) {
      if (nums[j] === 0) zeros++;
      if (zeros > k) break;
      best = Math.max(best, j - i + 1);
    }
  }
  return best;
}`,
      },
      {
        label: 'Sliding window',
        complexity: 'O(n)',
        code: `function longestOnes(nums, k) {
  let left = 0;
  let zeros = 0;
  let best = 0;
  for (let right = 0; right < nums.length; right++) {
    if (nums[right] === 0) zeros++;
    while (zeros > k) {
      if (nums[left] === 0) zeros--;
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
      },
    ],
  },
  {
    id: 'find-all-anagrams-in-a-string',
    category: 'sliding-window',
    lc: 'find-all-anagrams-in-a-string',
    n: 438,
    title: 'All Anagram Start Positions',
    difficulty: 'Medium',
    tags: ['string', 'frequency'],
    pattern: 'Fixed window with letter counts',
    summary:
      'Given a text and a pattern of lowercase letters, return every start index where a rearrangement of the pattern occurs in the text.',
    hook: 'Slide a pattern-sized window; update counts by one letter in, one letter out.',
    real: 'Scanning text for scrambled variants of a keyword using frequency fingerprints.',
    input: '["cbaebabacd", "abc"]',
    expected: '[0, 6]',
    cases: [
      { input: '["abab", "ab"]', expected: '[0, 1, 2]' },
      { input: '["a", "ab"]', expected: '[]' },
      { input: '["aaaa", "a"]', expected: '[0, 1, 2, 3]' },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) => wrap(rep('a', n), rep('a', n / 2 - 1) + 'b'),
    },
    solutions: [
      {
        label: 'Recount every window',
        complexity: 'O(n·m)',
        code: `function findAnagrams(s, p) {
  const m = p.length;
  const need = [];
  for (let i = 0; i < 26; i++) need.push(0);
  for (let i = 0; i < m; i++) need[p.charCodeAt(i) - 97]++;
  const out = [];
  for (let i = 0; i + m <= s.length; i++) {
    const tmp = need.slice();
    let ok = true;
    for (let j = 0; j < m; j++) {
      const idx = s.charCodeAt(i + j) - 97;
      tmp[idx]--;
      if (tmp[idx] < 0) {
        ok = false;
        break;
      }
    }
    if (ok) out.push(i);
  }
  return out;
}`,
      },
      {
        label: 'Sliding window',
        complexity: 'O(n)',
        code: `function findAnagrams(s, p) {
  const m = p.length;
  const cnt = [];
  for (let i = 0; i < 26; i++) cnt.push(0);
  for (let i = 0; i < m; i++) cnt[p.charCodeAt(i) - 97]++;
  let missing = m;
  const out = [];
  for (let right = 0; right < s.length; right++) {
    const add = s.charCodeAt(right) - 97;
    cnt[add]--;
    if (cnt[add] >= 0) missing--;
    if (right >= m) {
      const drop = s.charCodeAt(right - m) - 97;
      cnt[drop]++;
      if (cnt[drop] > 0) missing++;
    }
    if (missing === 0) out.push(right - m + 1);
  }
  return out;
}`,
      },
    ],
  },
  {
    id: 'subarray-product-less-than-k',
    category: 'sliding-window',
    lc: 'subarray-product-less-than-k',
    n: 713,
    title: 'Count Subarrays With Small Product',
    difficulty: 'Medium',
    tags: ['positive numbers', 'counting'],
    pattern: 'Variable window, count subarrays ending at right',
    summary:
      'Given positive integers, count the contiguous subarrays whose product is strictly less than k.',
    hook: 'Each right edge adds (window size) new subarrays; shrink by dividing when too big.',
    real: 'Counting valid time ranges when a multiplicative score must stay under a cap.',
    input: '[[10, 5, 2, 6], 100]',
    expected: '8',
    cases: [
      { input: '[[1, 2, 3], 0]', expected: '0' },
      { input: '[[1, 1, 1], 2]', expected: '6' },
      { input: '[[5], 5]', expected: '0' },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) =>
        wrap(
          seq(n, () => 1),
          2,
        ),
    },
    solutions: [
      {
        label: 'Extend from every start',
        complexity: 'O(n²)',
        code: `function numSubarrayProductLessThanK(nums, k) {
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    let prod = 1;
    for (let j = i; j < nums.length; j++) {
      prod *= nums[j];
      if (prod >= k) break;
      count++;
    }
  }
  return count;
}`,
      },
      {
        label: 'Sliding window',
        complexity: 'O(n)',
        code: `function numSubarrayProductLessThanK(nums, k) {
  if (k <= 1) return 0;
  let prod = 1;
  let left = 0;
  let count = 0;
  for (let right = 0; right < nums.length; right++) {
    prod *= nums[right];
    while (prod >= k) {
      prod /= nums[left];
      left++;
    }
    count += right - left + 1;
  }
  return count;
}`,
      },
    ],
  },
  {
    id: 'fruit-into-baskets',
    category: 'sliding-window',
    lc: 'fruit-into-baskets',
    n: 904,
    title: 'Two Baskets Of Fruit',
    difficulty: 'Medium',
    tags: ['hash map', 'at most k distinct'],
    pattern: 'Window with at most 2 distinct values',
    summary:
      'Walking along a row of trees you may carry only two kinds of fruit. Return the most trees you can pick from in a contiguous stretch.',
    hook: 'Longest window with at most two distinct values; evict a kind when its count hits zero.',
    real: 'Longest stretch of traffic served by a small cache holding only two entries.',
    input: '[[1, 2, 3, 2, 2]]',
    expected: '4',
    cases: [
      { input: '[[1, 2, 1]]', expected: '3' },
      { input: '[[0, 1, 2, 2]]', expected: '3' },
      { input: '[[]]', expected: '0' },
    ],
    scale: { sizes: [4, 8, 16, 32, 64], make: (n) => wrap(seq(n, (i) => i % 2)) },
    solutions: [
      {
        label: 'Extend from every start',
        complexity: 'O(n²)',
        code: `function totalFruit(fruits) {
  let best = 0;
  for (let i = 0; i < fruits.length; i++) {
    const kinds = new Set();
    for (let j = i; j < fruits.length; j++) {
      kinds.add(fruits[j]);
      if (kinds.size > 2) break;
      best = Math.max(best, j - i + 1);
    }
  }
  return best;
}`,
      },
      {
        label: 'Sliding window',
        complexity: 'O(n)',
        code: `function totalFruit(fruits) {
  const counts = new Map();
  let left = 0;
  let best = 0;
  for (let right = 0; right < fruits.length; right++) {
    counts.set(fruits[right], (counts.get(fruits[right]) || 0) + 1);
    while (counts.size > 2) {
      const f = fruits[left];
      counts.set(f, counts.get(f) - 1);
      if (counts.get(f) === 0) counts.delete(f);
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
      },
    ],
  },
  {
    id: 'longest-subarray-of-1s-after-deleting-one-element',
    category: 'sliding-window',
    lc: 'longest-subarray-of-1s-after-deleting-one-element',
    n: 1493,
    title: 'Longest Ones After One Deletion',
    difficulty: 'Medium',
    tags: ['binary array'],
    pattern: 'Window with at most one zero',
    summary:
      'You must delete exactly one element from a 0/1 array. Return the length of the longest run made only of ones afterwards.',
    hook: 'Longest window holding at most one zero, minus one for the deleted slot.',
    real: 'Longest uninterrupted streak when a single glitch can be dropped from the record.',
    input: '[[1, 1, 0, 1]]',
    expected: '3',
    cases: [
      { input: '[[0, 1, 1, 1, 0, 1, 1, 0, 1]]', expected: '5' },
      { input: '[[1, 1, 1]]', expected: '2' },
      { input: '[[0, 0]]', expected: '0' },
    ],
    scale: { sizes: [4, 8, 16, 32, 64], make: (n) => wrap(seq(n, () => 1)) },
    solutions: [
      {
        label: 'Extend from every start',
        complexity: 'O(n²)',
        code: `function longestSubarray(nums) {
  let best = 0;
  for (let i = 0; i < nums.length; i++) {
    let zeros = 0;
    for (let j = i; j < nums.length; j++) {
      if (nums[j] === 0) zeros++;
      if (zeros > 1) break;
      best = Math.max(best, j - i);
    }
  }
  return best;
}`,
      },
      {
        label: 'Sliding window',
        complexity: 'O(n)',
        code: `function longestSubarray(nums) {
  let left = 0;
  let zeros = 0;
  let best = 0;
  for (let right = 0; right < nums.length; right++) {
    if (nums[right] === 0) zeros++;
    while (zeros > 1) {
      if (nums[left] === 0) zeros--;
      left++;
    }
    best = Math.max(best, right - left);
  }
  return best;
}`,
      },
    ],
  },
  {
    id: 'grumpy-bookstore-owner',
    category: 'sliding-window',
    lc: 'grumpy-bookstore-owner',
    n: 1052,
    title: 'Grumpy Shop Owner',
    difficulty: 'Medium',
    tags: ['fixed window'],
    pattern: 'Fixed window maximizing recovered gain',
    summary:
      'Customers arrive each minute; on grumpy minutes they leave unhappy. A secret technique keeps the owner calm for one stretch of given length. Return the most satisfied customers possible.',
    hook: 'Always-satisfied base plus the best fixed window of customers who would have been lost.',
    real: 'Choosing the single best maintenance window to recover the most affected traffic.',
    input: '[[1, 0, 1, 2, 1, 1, 7, 5], [0, 1, 0, 1, 0, 1, 0, 1], 3]',
    expected: '16',
    cases: [
      { input: '[[1], [0], 1]', expected: '1' },
      { input: '[[4, 10, 10], [1, 1, 0], 2]', expected: '24' },
      { input: '[[3, 2], [1, 1], 1]', expected: '3' },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) =>
        wrap(
          seq(n, (i) => (i % 5) + 1),
          seq(n, (i) => i % 2),
          n / 2,
        ),
    },
    solutions: [
      {
        label: 'Recompute every window',
        complexity: 'O(n·k)',
        code: `function maxSatisfied(customers, grumpy, minutes) {
  let base = 0;
  for (let i = 0; i < customers.length; i++) {
    if (grumpy[i] === 0) base += customers[i];
  }
  let bestGain = 0;
  for (let start = 0; start + minutes <= customers.length; start++) {
    let gain = 0;
    for (let j = start; j < start + minutes; j++) {
      if (grumpy[j] === 1) gain += customers[j];
    }
    bestGain = Math.max(bestGain, gain);
  }
  return base + bestGain;
}`,
      },
      {
        label: 'Sliding window',
        complexity: 'O(n)',
        code: `function maxSatisfied(customers, grumpy, minutes) {
  let base = 0;
  let gain = 0;
  let bestGain = 0;
  for (let i = 0; i < customers.length; i++) {
    if (grumpy[i] === 0) base += customers[i];
    else gain += customers[i];
    if (i >= minutes && grumpy[i - minutes] === 1) gain -= customers[i - minutes];
    bestGain = Math.max(bestGain, gain);
  }
  return base + bestGain;
}`,
      },
    ],
  },
  {
    id: 'get-equal-substrings-within-budget',
    category: 'sliding-window',
    lc: 'get-equal-substrings-within-budget',
    n: 1208,
    title: 'Longest Convertible Substring',
    difficulty: 'Medium',
    tags: ['string', 'cost'],
    pattern: 'Variable window with a cost budget',
    summary:
      'Changing a letter costs its alphabet distance. Given two equal-length strings and a budget, find the longest aligned stretch of the first that can be turned into the second.',
    hook: 'Per-position cost array, then longest window whose total cost fits the budget.',
    real: 'Longest span of a record that can be reconciled with another within an edit budget.',
    input: '["abcd", "bcdf", 3]',
    expected: '3',
    cases: [
      { input: '["abcd", "cdef", 3]', expected: '1' },
      { input: '["abcd", "acde", 0]', expected: '1' },
      { input: '["a", "z", 25]', expected: '1' },
    ],
    scale: { sizes: [4, 8, 16, 32, 64], make: (n) => wrap(rep('a', n), rep('a', n), 0) },
    solutions: [
      {
        label: 'Extend from every start',
        complexity: 'O(n²)',
        code: `function equalSubstring(s, t, maxCost) {
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    let cost = 0;
    for (let j = i; j < s.length; j++) {
      cost += Math.abs(s.charCodeAt(j) - t.charCodeAt(j));
      if (cost > maxCost) break;
      best = Math.max(best, j - i + 1);
    }
  }
  return best;
}`,
      },
      {
        label: 'Sliding window',
        complexity: 'O(n)',
        code: `function equalSubstring(s, t, maxCost) {
  let left = 0;
  let cost = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    cost += Math.abs(s.charCodeAt(right) - t.charCodeAt(right));
    while (cost > maxCost) {
      cost -= Math.abs(s.charCodeAt(left) - t.charCodeAt(left));
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
      },
    ],
  },
  {
    id: 'number-of-substrings-containing-all-three-characters',
    category: 'sliding-window',
    lc: 'number-of-substrings-containing-all-three-characters',
    n: 1358,
    title: 'Substrings With a, b and c',
    difficulty: 'Medium',
    tags: ['string', 'counting'],
    pattern: 'Window; count all extensions once valid',
    summary:
      'For a string made only of a, b and c, count the substrings that contain at least one of each letter.',
    hook: 'Once a window is valid, every longer end also is: add n - right, then shrink.',
    real: 'Counting time ranges that include at least one event of every required type.',
    input: '["abcabc"]',
    expected: '10',
    cases: [
      { input: '["aaacb"]', expected: '3' },
      { input: '["abc"]', expected: '1' },
      { input: '["aaa"]', expected: '0' },
    ],
    scale: { sizes: [4, 8, 16, 32, 64], make: (n) => wrap(rep('a', n)) },
    solutions: [
      {
        label: 'Extend from every start',
        complexity: 'O(n²)',
        code: `function numberOfSubstrings(s) {
  const n = s.length;
  let count = 0;
  for (let i = 0; i < n; i++) {
    let a = false;
    let b = false;
    let c = false;
    for (let j = i; j < n; j++) {
      if (s[j] === "a") a = true;
      else if (s[j] === "b") b = true;
      else c = true;
      if (a && b && c) {
        count += n - j;
        break;
      }
    }
  }
  return count;
}`,
      },
      {
        label: 'Sliding window',
        complexity: 'O(n)',
        code: `function numberOfSubstrings(s) {
  const n = s.length;
  const cnt = [0, 0, 0];
  let left = 0;
  let count = 0;
  for (let right = 0; right < n; right++) {
    cnt[s.charCodeAt(right) - 97]++;
    while (cnt[0] > 0 && cnt[1] > 0 && cnt[2] > 0) {
      count += n - right;
      cnt[s.charCodeAt(left) - 97]--;
      left++;
    }
  }
  return count;
}`,
      },
    ],
  },
];
