import type { Problem } from '../types';

/** Small binary heap on a plain array, ordered by a "less" function (true = a belongs above b). */
const HEAP = `function heapPush(h, x, less) {
  h.push(x);
  let i = h.length - 1;
  while (i > 0) {
    const p = (i - 1) >> 1;
    if (!less(h[i], h[p])) break;
    const t = h[i];
    h[i] = h[p];
    h[p] = t;
    i = p;
  }
}

function heapPop(h, less) {
  const top = h[0];
  const last = h.pop();
  if (h.length > 0) {
    h[0] = last;
    let i = 0;
    while (true) {
      let s = i;
      const l = 2 * i + 1;
      const r = l + 1;
      if (l < h.length && less(h[l], h[s])) s = l;
      if (r < h.length && less(h[r], h[s])) s = r;
      if (s === i) break;
      const t = h[i];
      h[i] = h[s];
      h[s] = t;
      i = s;
    }
  }
  return top;
}

`;

export const heapGreedy: Problem[] = [
  {
    id: 'kth-largest-element-in-an-array',
    category: 'heap-greedy',
    lc: 'kth-largest-element-in-an-array',
    n: 215,
    title: 'Kth Largest Element in an Array',
    difficulty: 'Medium',
    tags: ['heap', 'top-k'],
    pattern: 'Min-heap of size k',
    summary:
      'Find the value that would sit at position k if the numbers were ranked from largest to smallest.',
    hook: 'Keep only the k biggest; the smallest of that club is the answer.',
    real: 'Leaderboards and monitoring dashboards keep a bounded top-k set instead of sorting the whole stream.',
    input: '[[3, 2, 1, 5, 6, 4], 2]',
    expected: '5',
    cases: [
      { input: '[[3, 2, 3, 1, 2, 4, 5, 5, 6], 4]', expected: '4' },
      { input: '[[7], 1]', expected: '7' },
    ],
    scale: {
      sizes: [50, 100, 200],
      make: (n) =>
        JSON.stringify([
          Array.from({ length: n }, (_, i) => ((i * 37) % 101) + i),
          Math.floor(n / 2),
        ]),
    },
    solutions: [
      {
        label: 'Remove the max k-1 times',
        complexity: 'O(n·k)',
        code: `function findKthLargest(nums, k) {
  const a = nums.slice();
  for (let round = 1; round < k; round++) {
    let best = 0;
    for (let i = 1; i < a.length; i++) {
      if (a[i] > a[best]) best = i;
    }
    a.splice(best, 1);
  }
  let top = a[0];
  for (let i = 1; i < a.length; i++) {
    if (a[i] > top) top = a[i];
  }
  return top;
}`,
      },
      {
        label: 'Min-heap of size k',
        complexity: 'O(n log k)',
        code:
          HEAP +
          `function smaller(a, b) {
  return a < b;
}

function findKthLargest(nums, k) {
  const heap = [];
  for (const x of nums) {
    heapPush(heap, x, smaller);
    if (heap.length > k) heapPop(heap, smaller);
  }
  return heap[0];
}`,
      },
    ],
  },
  {
    id: 'top-k-frequent-words',
    category: 'heap-greedy',
    lc: 'top-k-frequent-words',
    n: 692,
    title: 'Top K Frequent Words',
    difficulty: 'Medium',
    tags: ['heap', 'hash map', 'top-k'],
    pattern: 'Bounded heap with tie-break',
    summary: 'Return the k most common words, most frequent first, breaking ties alphabetically.',
    hook: 'The heap root is the worst word kept so far: low count, or later alphabetically on a tie.',
    real: 'Search suggestions and trending-term panels rank terms by count with a stable tie-break.',
    input: '[["i", "love", "leetcode", "i", "love", "coding"], 2]',
    expected: '["i", "love"]',
    cases: [
      {
        input: '[["the", "day", "is", "sunny", "the", "the", "the", "sunny", "is", "is"], 4]',
        expected: '["the", "is", "sunny", "day"]',
      },
      { input: '[["a"], 1]', expected: '["a"]' },
    ],
    solutions: [
      {
        label: 'Count, then sort everything',
        complexity: 'O(n log n)',
        code: `function topKFrequent(words, k) {
  const count = new Map();
  for (const w of words) count.set(w, (count.get(w) || 0) + 1);
  const entries = Array.from(count.entries());
  entries.sort((a, b) => {
    if (a[1] !== b[1]) return b[1] - a[1];
    return a[0] < b[0] ? -1 : 1;
  });
  const out = [];
  for (let i = 0; i < k && i < entries.length; i++) out.push(entries[i][0]);
  return out;
}`,
      },
      {
        label: 'Heap of size k',
        complexity: 'O(n log k)',
        code:
          HEAP +
          `function worse(a, b) {
  if (a[1] !== b[1]) return a[1] < b[1];
  return a[0] > b[0];
}

function topKFrequent(words, k) {
  const count = new Map();
  for (const w of words) count.set(w, (count.get(w) || 0) + 1);
  const heap = [];
  for (const [w, c] of count) {
    heapPush(heap, [w, c], worse);
    if (heap.length > k) heapPop(heap, worse);
  }
  const out = [];
  while (heap.length > 0) out.unshift(heapPop(heap, worse)[0]);
  return out;
}`,
      },
    ],
  },
  {
    id: 'last-stone-weight',
    category: 'heap-greedy',
    lc: 'last-stone-weight',
    n: 1046,
    title: 'Last Stone Weight',
    difficulty: 'Easy',
    tags: ['heap', 'simulation'],
    pattern: 'Max-heap simulation',
    summary:
      'Repeatedly smash the two heaviest stones together; report what weight, if any, remains at the end.',
    hook: 'Need the biggest thing again and again? That is a max-heap.',
    real: 'Schedulers that always serve the largest pending job use a priority queue rather than re-sorting.',
    input: '[[2, 7, 4, 1, 8, 1]]',
    expected: '1',
    cases: [
      { input: '[[1]]', expected: '1' },
      { input: '[[3, 3]]', expected: '0' },
      { input: '[[]]', expected: '0' },
    ],
    solutions: [
      {
        label: 'Re-sort every round',
        complexity: 'O(n² log n)',
        code: `function lastStoneWeight(stones) {
  const a = stones.slice();
  while (a.length > 1) {
    a.sort((x, y) => x - y);
    const y = a.pop();
    const x = a.pop();
    if (y !== x) a.push(y - x);
  }
  return a.length === 1 ? a[0] : 0;
}`,
      },
      {
        label: 'Max-heap',
        complexity: 'O(n log n)',
        code:
          HEAP +
          `function bigger(a, b) {
  return a > b;
}

function lastStoneWeight(stones) {
  const heap = [];
  for (const s of stones) heapPush(heap, s, bigger);
  while (heap.length > 1) {
    const y = heapPop(heap, bigger);
    const x = heapPop(heap, bigger);
    if (y !== x) heapPush(heap, y - x, bigger);
  }
  return heap.length === 1 ? heap[0] : 0;
}`,
      },
    ],
  },
  {
    id: 'k-closest-points-to-origin',
    category: 'heap-greedy',
    lc: 'k-closest-points-to-origin',
    n: 973,
    title: 'K Closest Points to Origin',
    difficulty: 'Medium',
    tags: ['heap', 'geometry', 'top-k'],
    pattern: 'Max-heap of size k',
    summary: 'Pick the k points nearest the origin, listed by distance, then x, then y.',
    hook: 'Keep a max-heap of the k nearest; the root is the farthest of them and gets evicted first.',
    real: 'Nearest-neighbour lookups in maps and recommendation services keep a small bounded candidate set.',
    input: '[[[3, 3], [5, -1], [-2, 4]], 2]',
    expected: '[[3, 3], [-2, 4]]',
    cases: [
      { input: '[[[0, 1], [1, 0]], 2]', expected: '[[0, 1], [1, 0]]' },
      { input: '[[[2, 2]], 1]', expected: '[[2, 2]]' },
    ],
    solutions: [
      {
        label: 'Sort all points',
        complexity: 'O(n log n)',
        code: `function kClosest(points, k) {
  const sorted = points.slice();
  sorted.sort((a, b) => {
    const da = a[0] * a[0] + a[1] * a[1];
    const db = b[0] * b[0] + b[1] * b[1];
    if (da !== db) return da - db;
    if (a[0] !== b[0]) return a[0] - b[0];
    return a[1] - b[1];
  });
  return sorted.slice(0, k);
}`,
      },
      {
        label: 'Max-heap of size k',
        complexity: 'O(n log k)',
        code:
          HEAP +
          `function closer(a, b) {
  const da = a[0] * a[0] + a[1] * a[1];
  const db = b[0] * b[0] + b[1] * b[1];
  if (da !== db) return da < db;
  if (a[0] !== b[0]) return a[0] < b[0];
  return a[1] < b[1];
}

function farther(a, b) {
  return closer(b, a);
}

function kClosest(points, k) {
  const heap = [];
  for (const p of points) {
    heapPush(heap, p, farther);
    if (heap.length > k) heapPop(heap, farther);
  }
  const out = [];
  while (heap.length > 0) out.unshift(heapPop(heap, farther));
  return out;
}`,
      },
    ],
  },
  {
    id: 'merge-intervals',
    category: 'heap-greedy',
    lc: 'merge-intervals',
    n: 56,
    title: 'Merge Intervals',
    difficulty: 'Medium',
    tags: ['intervals', 'sorting'],
    pattern: 'Sort by start, sweep',
    summary:
      'Combine every group of overlapping or touching ranges into one, and return the resulting ranges in order.',
    hook: 'Sort by start; each range either extends the last one or begins a new one.',
    real: 'Calendar apps and IP-range allow-lists collapse overlapping ranges into a minimal set.',
    input: '[[[1, 3], [2, 6], [8, 10], [15, 18]]]',
    expected: '[[1, 6], [8, 10], [15, 18]]',
    cases: [
      { input: '[[[1, 4], [4, 5]]]', expected: '[[1, 5]]' },
      { input: '[[[1, 4], [2, 3]]]', expected: '[[1, 4]]' },
      { input: '[[]]', expected: '[]' },
    ],
    solutions: [
      {
        label: 'Absorb into the result list',
        complexity: 'O(n²)',
        code: `function merge(intervals) {
  let res = [];
  for (const iv of intervals) {
    let cur = [iv[0], iv[1]];
    const rest = [];
    for (const r of res) {
      if (r[1] >= cur[0] && r[0] <= cur[1]) {
        cur = [Math.min(r[0], cur[0]), Math.max(r[1], cur[1])];
      } else {
        rest.push(r);
      }
    }
    rest.push(cur);
    res = rest;
  }
  res.sort((a, b) => a[0] - b[0]);
  return res;
}`,
      },
      {
        label: 'Sort then sweep',
        complexity: 'O(n log n)',
        code: `function merge(intervals) {
  const sorted = intervals.slice();
  sorted.sort((a, b) => a[0] - b[0]);
  const out = [];
  for (const iv of sorted) {
    if (out.length > 0 && iv[0] <= out[out.length - 1][1]) {
      const last = out[out.length - 1];
      last[1] = Math.max(last[1], iv[1]);
    } else {
      out.push([iv[0], iv[1]]);
    }
  }
  return out;
}`,
      },
    ],
  },
  {
    id: 'insert-interval',
    category: 'heap-greedy',
    lc: 'insert-interval',
    n: 57,
    title: 'Insert Interval',
    difficulty: 'Medium',
    tags: ['intervals'],
    pattern: 'Three-phase linear scan',
    summary:
      'Given sorted, non-overlapping ranges, add one more range and merge whatever it touches.',
    hook: 'Copy the ones fully before, fuse the ones that overlap, copy the ones fully after.',
    real: 'Booking systems slot a new reservation into an already sorted, merged timeline.',
    input: '[[[1, 3], [6, 9]], [2, 5]]',
    expected: '[[1, 5], [6, 9]]',
    cases: [
      { input: '[[], [5, 7]]', expected: '[[5, 7]]' },
      {
        input: '[[[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]]',
        expected: '[[1, 2], [3, 10], [12, 16]]',
      },
    ],
    solutions: [
      {
        label: 'Append, sort, merge',
        complexity: 'O(n log n)',
        code: `function insert(intervals, newInterval) {
  const all = intervals.slice();
  all.push(newInterval);
  all.sort((a, b) => a[0] - b[0]);
  const out = [];
  for (const iv of all) {
    if (out.length > 0 && iv[0] <= out[out.length - 1][1]) {
      const last = out[out.length - 1];
      last[1] = Math.max(last[1], iv[1]);
    } else {
      out.push([iv[0], iv[1]]);
    }
  }
  return out;
}`,
      },
      {
        label: 'One linear pass',
        complexity: 'O(n)',
        code: `function insert(intervals, newInterval) {
  const out = [];
  let i = 0;
  const n = intervals.length;
  while (i < n && intervals[i][1] < newInterval[0]) {
    out.push(intervals[i]);
    i++;
  }
  let cur = [newInterval[0], newInterval[1]];
  while (i < n && intervals[i][0] <= cur[1]) {
    cur = [Math.min(cur[0], intervals[i][0]), Math.max(cur[1], intervals[i][1])];
    i++;
  }
  out.push(cur);
  while (i < n) {
    out.push(intervals[i]);
    i++;
  }
  return out;
}`,
      },
    ],
  },
  {
    id: 'non-overlapping-intervals',
    category: 'heap-greedy',
    lc: 'non-overlapping-intervals',
    n: 435,
    title: 'Non-overlapping Intervals',
    difficulty: 'Medium',
    tags: ['intervals', 'greedy'],
    pattern: 'Earliest end time first',
    summary:
      'Count the fewest ranges to delete so that the remaining ones do not overlap (touching ends are fine).',
    hook: 'Keep the range that ends earliest; it leaves the most room for the rest.',
    real: 'Job schedulers pick the maximum set of non-conflicting tasks for a single worker.',
    input: '[[[1, 2], [2, 3], [3, 4], [1, 3]]]',
    expected: '1',
    cases: [
      { input: '[[[1, 2], [1, 2], [1, 2]]]', expected: '2' },
      { input: '[[[1, 2], [2, 3]]]', expected: '0' },
      { input: '[[]]', expected: '0' },
    ],
    solutions: [
      {
        label: 'Longest chain DP',
        complexity: 'O(n²)',
        code: `function eraseOverlapIntervals(intervals) {
  const a = intervals.slice();
  a.sort((x, y) => x[0] - y[0] || x[1] - y[1]);
  const dp = [];
  let best = 0;
  for (let i = 0; i < a.length; i++) {
    dp.push(1);
    for (let j = 0; j < i; j++) {
      if (a[j][1] <= a[i][0] && dp[j] + 1 > dp[i]) dp[i] = dp[j] + 1;
    }
    if (dp[i] > best) best = dp[i];
  }
  return a.length - best;
}`,
      },
      {
        label: 'Greedy by end',
        complexity: 'O(n log n)',
        code: `function eraseOverlapIntervals(intervals) {
  const a = intervals.slice();
  a.sort((x, y) => x[1] - y[1]);
  let removed = 0;
  let end = -Infinity;
  for (const iv of a) {
    if (iv[0] >= end) {
      end = iv[1];
    } else {
      removed++;
    }
  }
  return removed;
}`,
      },
    ],
  },
  {
    id: 'meeting-rooms',
    category: 'heap-greedy',
    lc: 'meeting-rooms',
    n: 252,
    title: 'Meeting Rooms',
    difficulty: 'Easy',
    tags: ['intervals', 'sorting'],
    pattern: 'Sort and compare neighbours',
    summary: 'Decide whether one person could attend every meeting without any two overlapping.',
    hook: 'After sorting by start, only adjacent meetings can clash.',
    real: 'Calendar tools flag double-booking by checking each event against the next one.',
    input: '[[[0, 30], [5, 10], [15, 20]]]',
    expected: 'false',
    cases: [
      { input: '[[[7, 10], [2, 4]]]', expected: 'true' },
      { input: '[[[1, 2], [2, 3]]]', expected: 'true' },
      { input: '[[]]', expected: 'true' },
    ],
    solutions: [
      {
        label: 'Compare every pair',
        complexity: 'O(n²)',
        code: `function canAttendMeetings(intervals) {
  for (let i = 0; i < intervals.length; i++) {
    for (let j = i + 1; j < intervals.length; j++) {
      const a = intervals[i];
      const b = intervals[j];
      if (a[0] < b[1] && b[0] < a[1]) return false;
    }
  }
  return true;
}`,
      },
      {
        label: 'Sort by start',
        complexity: 'O(n log n)',
        code: `function canAttendMeetings(intervals) {
  const a = intervals.slice();
  a.sort((x, y) => x[0] - y[0]);
  for (let i = 1; i < a.length; i++) {
    if (a[i][0] < a[i - 1][1]) return false;
  }
  return true;
}`,
      },
    ],
  },
  {
    id: 'meeting-rooms-ii',
    category: 'heap-greedy',
    lc: 'meeting-rooms-ii',
    n: 253,
    title: 'Meeting Rooms II',
    difficulty: 'Medium',
    tags: ['intervals', 'heap'],
    pattern: 'Min-heap of end times',
    summary: 'Work out the smallest number of rooms that lets every meeting happen as scheduled.',
    hook: 'Keep each busy room is end time in a min-heap; reuse the room that frees up first.',
    real: 'Cloud schedulers estimate how many machines are needed to run overlapping jobs.',
    input: '[[[0, 30], [5, 10], [15, 20]]]',
    expected: '2',
    cases: [
      { input: '[[[7, 10], [2, 4]]]', expected: '1' },
      { input: '[[[1, 5], [2, 6], [3, 7], [5, 8]]]', expected: '3' },
      { input: '[[]]', expected: '0' },
    ],
    solutions: [
      {
        label: 'Count overlaps at each start',
        complexity: 'O(n²)',
        code: `function minMeetingRooms(intervals) {
  let best = 0;
  for (const m of intervals) {
    let live = 0;
    for (const o of intervals) {
      if (o[0] <= m[0] && m[0] < o[1]) live++;
    }
    if (live > best) best = live;
  }
  return best;
}`,
      },
      {
        label: 'Min-heap of end times',
        complexity: 'O(n log n)',
        code:
          HEAP +
          `function earlier(a, b) {
  return a < b;
}

function minMeetingRooms(intervals) {
  const a = intervals.slice();
  a.sort((x, y) => x[0] - y[0]);
  const ends = [];
  for (const m of a) {
    if (ends.length > 0 && ends[0] <= m[0]) heapPop(ends, earlier);
    heapPush(ends, m[1], earlier);
  }
  return ends.length;
}`,
      },
    ],
  },
  {
    id: 'task-scheduler',
    category: 'heap-greedy',
    lc: 'task-scheduler',
    n: 621,
    title: 'Task Scheduler',
    difficulty: 'Medium',
    tags: ['greedy', 'counting'],
    pattern: 'Most frequent task sets the frame',
    summary:
      'Tasks are single letters; equal letters must be at least n slots apart. Return the minimum total time, idle slots included.',
    hook: 'The busiest task builds the frame; other tasks fill its gaps.',
    real: 'Rate-limited API clients space out calls to the same endpoint while interleaving others.',
    input: '[["A", "A", "A", "B", "B", "B"], 2]',
    expected: '8',
    cases: [
      { input: '[["A", "A", "A", "B", "B", "B"], 0]', expected: '6' },
      {
        input: '[["A", "A", "A", "A", "A", "A", "B", "C", "D", "E", "F", "G"], 2]',
        expected: '16',
      },
      { input: '[[], 2]', expected: '0' },
    ],
    solutions: [
      {
        label: 'Simulate each time slot',
        complexity: 'O(T·k)',
        code: `function leastInterval(tasks, n) {
  const left = {};
  const ready = {};
  for (const t of tasks) {
    left[t] = (left[t] || 0) + 1;
    ready[t] = 0;
  }
  const keys = Object.keys(left);
  let remaining = tasks.length;
  let time = 0;
  while (remaining > 0) {
    let pick = null;
    for (const k of keys) {
      if (left[k] > 0 && ready[k] <= time && (pick === null || left[k] > left[pick])) pick = k;
    }
    if (pick !== null) {
      left[pick]--;
      ready[pick] = time + n + 1;
      remaining--;
    }
    time++;
  }
  return time;
}`,
      },
      {
        label: 'Frame formula',
        complexity: 'O(n)',
        code: `function leastInterval(tasks, n) {
  const count = {};
  let maxCount = 0;
  for (const t of tasks) {
    count[t] = (count[t] || 0) + 1;
    if (count[t] > maxCount) maxCount = count[t];
  }
  let ties = 0;
  for (const k of Object.keys(count)) {
    if (count[k] === maxCount) ties++;
  }
  const frame = (maxCount - 1) * (n + 1) + ties;
  return Math.max(frame, tasks.length);
}`,
      },
    ],
  },
  {
    id: 'find-median-from-data-stream',
    category: 'heap-greedy',
    lc: 'find-median-from-data-stream',
    n: 295,
    title: 'Find Median from Data Stream',
    difficulty: 'Hard',
    tags: ['heap', 'design', 'two heaps'],
    pattern: 'Two heaps',
    summary:
      'Numbers arrive one at a time. After each arrival report the median, doubled so it stays an integer.',
    hook: 'A max-heap holds the lower half and a min-heap the upper half; the medians sit at the roots.',
    real: 'Monitoring systems track a live median latency without storing a sorted copy of every sample.',
    input: '[[5, 15, 1, 3]]',
    expected: '[10, 20, 10, 8]',
    cases: [
      { input: '[[2, 2]]', expected: '[4, 4]' },
      { input: '[[-1, -2, -3]]', expected: '[-2, -3, -4]' },
      { input: '[[]]', expected: '[]' },
    ],
    solutions: [
      {
        label: 'Insert into a sorted list',
        complexity: 'O(n²)',
        code: `function runningMedians(nums) {
  const sorted = [];
  const out = [];
  for (const x of nums) {
    let pos = 0;
    while (pos < sorted.length && sorted[pos] < x) pos++;
    sorted.splice(pos, 0, x);
    const m = sorted.length;
    if (m % 2 === 1) out.push(2 * sorted[(m - 1) / 2]);
    else out.push(sorted[m / 2 - 1] + sorted[m / 2]);
  }
  return out;
}`,
      },
      {
        label: 'Two heaps',
        complexity: 'O(n log n)',
        code:
          HEAP +
          `function lower(a, b) {
  return a < b;
}

function higher(a, b) {
  return a > b;
}

function runningMedians(nums) {
  const lo = [];
  const hi = [];
  const out = [];
  for (const x of nums) {
    heapPush(lo, x, higher);
    heapPush(hi, heapPop(lo, higher), lower);
    if (hi.length > lo.length) heapPush(lo, heapPop(hi, lower), higher);
    if (lo.length > hi.length) out.push(2 * lo[0]);
    else out.push(lo[0] + hi[0]);
  }
  return out;
}`,
      },
    ],
  },
  {
    id: 'reorganize-string',
    category: 'heap-greedy',
    lc: 'reorganize-string',
    n: 767,
    title: 'Reorganize String',
    difficulty: 'Medium',
    tags: ['greedy', 'counting', 'string'],
    pattern: 'Greedy with feasibility check',
    summary:
      'Rearrange the letters so no two equal letters touch. Return the alphabetically smallest such result, or an empty string if none exists.',
    hook: 'Take the smallest allowed letter, unless one letter is so common it must be placed right now.',
    real: 'Playlist and ad shufflers spread repeated items apart so the same one never plays back to back.',
    input: '["aab"]',
    expected: '"aba"',
    cases: [
      { input: '["aaab"]', expected: '""' },
      { input: '["a"]', expected: '"a"' },
      { input: '["vvvlo"]', expected: '"vlvov"' },
      { input: '["aabb"]', expected: '"abab"' },
    ],
    solutions: [
      {
        label: 'Try letters, test feasibility',
        complexity: 'O(26²·n)',
        code: `function feasible(cnt, m, last) {
  for (let c = 0; c < 26; c++) {
    if (cnt[c] * 2 > m + 1) return false;
    if (c === last && cnt[c] * 2 > m) return false;
  }
  return true;
}

function reorganizeString(s) {
  const cnt = new Array(26).fill(0);
  for (const ch of s) cnt[ch.charCodeAt(0) - 97]++;
  if (!feasible(cnt, s.length, -1)) return "";
  let out = "";
  let last = -1;
  for (let m = s.length; m > 0; m--) {
    let picked = -1;
    for (let c = 0; c < 26 && picked === -1; c++) {
      if (cnt[c] === 0 || c === last) continue;
      cnt[c]--;
      if (feasible(cnt, m - 1, c)) picked = c;
      else cnt[c]++;
    }
    if (picked === -1) return "";
    out += String.fromCharCode(97 + picked);
    last = picked;
  }
  return out;
}`,
      },
      {
        label: 'Smallest letter unless forced',
        complexity: 'O(26·n)',
        code: `function reorganizeString(s) {
  const cnt = new Array(26).fill(0);
  for (const ch of s) cnt[ch.charCodeAt(0) - 97]++;
  for (let c = 0; c < 26; c++) {
    if (cnt[c] * 2 > s.length + 1) return "";
  }
  let out = "";
  let last = -1;
  for (let m = s.length; m > 0; m--) {
    let pick = -1;
    if (m % 2 === 1) {
      for (let c = 0; c < 26; c++) {
        if (cnt[c] * 2 === m + 1) pick = c;
      }
    }
    for (let c = 0; c < 26 && pick === -1; c++) {
      if (cnt[c] > 0 && c !== last) pick = c;
    }
    cnt[pick]--;
    out += String.fromCharCode(97 + pick);
    last = pick;
  }
  return out;
}`,
      },
    ],
  },
  {
    id: 'assign-cookies',
    category: 'heap-greedy',
    lc: 'assign-cookies',
    n: 455,
    title: 'Assign Cookies',
    difficulty: 'Easy',
    tags: ['greedy', 'two pointers'],
    pattern: 'Sort and match smallest fit',
    summary:
      'Each child needs a cookie at least as big as their greed value. Give out cookies to satisfy as many children as possible.',
    hook: 'Serve the least greedy child with the smallest cookie that works.',
    real: 'Resource allocators match requests to the tightest-fitting free block.',
    input: '[[1, 2, 3], [1, 1]]',
    expected: '1',
    cases: [
      { input: '[[1, 2], [1, 2, 3]]', expected: '2' },
      { input: '[[], [1]]', expected: '0' },
      { input: '[[5], [1, 2]]', expected: '0' },
    ],
    solutions: [
      {
        label: 'Scan for best cookie per child',
        complexity: 'O(n·m)',
        code: `function findContentChildren(g, s) {
  const kids = g.slice();
  kids.sort((a, b) => a - b);
  const used = new Array(s.length).fill(false);
  let count = 0;
  for (const need of kids) {
    let best = -1;
    for (let j = 0; j < s.length; j++) {
      if (!used[j] && s[j] >= need && (best === -1 || s[j] < s[best])) best = j;
    }
    if (best !== -1) {
      used[best] = true;
      count++;
    }
  }
  return count;
}`,
      },
      {
        label: 'Sort both, two pointers',
        complexity: 'O(n log n + m log m)',
        code: `function findContentChildren(g, s) {
  const kids = g.slice();
  const cookies = s.slice();
  kids.sort((a, b) => a - b);
  cookies.sort((a, b) => a - b);
  let i = 0;
  for (let j = 0; j < cookies.length && i < kids.length; j++) {
    if (cookies[j] >= kids[i]) i++;
  }
  return i;
}`,
      },
    ],
  },
  {
    id: 'lemonade-change',
    category: 'heap-greedy',
    lc: 'lemonade-change',
    n: 860,
    title: 'Lemonade Change',
    difficulty: 'Easy',
    tags: ['greedy', 'simulation'],
    pattern: 'Greedy change-making',
    summary:
      'Drinks cost 5. Customers pay with 5, 10 or 20 in order; decide whether you can always give correct change.',
    hook: 'For a 20, spend the 10 first; fives are the scarce resource.',
    real: 'Cash-handling logic in vending machines decides which coins to dispense so it does not run out.',
    input: '[[5, 5, 5, 10, 20]]',
    expected: 'true',
    cases: [
      { input: '[[5, 5, 10, 10, 20]]', expected: 'false' },
      { input: '[[10]]', expected: 'false' },
      { input: '[[]]', expected: 'true' },
    ],
    solutions: [
      {
        label: 'Keep a wallet list',
        complexity: 'O(n²)',
        code: `function lemonadeChange(bills) {
  const wallet = [];
  for (const b of bills) {
    if (b === 5) {
      wallet.push(5);
    } else if (b === 10) {
      const i5 = wallet.indexOf(5);
      if (i5 < 0) return false;
      wallet.splice(i5, 1);
      wallet.push(10);
    } else {
      const i10 = wallet.indexOf(10);
      const i5 = wallet.indexOf(5);
      if (i10 >= 0 && i5 >= 0) {
        wallet.splice(i10, 1);
        wallet.splice(wallet.indexOf(5), 1);
      } else {
        let fives = 0;
        for (const w of wallet) {
          if (w === 5) fives++;
        }
        if (fives < 3) return false;
        for (let r = 0; r < 3; r++) wallet.splice(wallet.indexOf(5), 1);
      }
      wallet.push(20);
    }
  }
  return true;
}`,
      },
      {
        label: 'Count fives and tens',
        complexity: 'O(n)',
        code: `function lemonadeChange(bills) {
  let fives = 0;
  let tens = 0;
  for (const b of bills) {
    if (b === 5) {
      fives++;
    } else if (b === 10) {
      if (fives === 0) return false;
      fives--;
      tens++;
    } else if (tens > 0 && fives > 0) {
      tens--;
      fives--;
    } else if (fives >= 3) {
      fives -= 3;
    } else {
      return false;
    }
  }
  return true;
}`,
      },
    ],
  },
  {
    id: 'gas-station',
    category: 'heap-greedy',
    lc: 'gas-station',
    n: 134,
    title: 'Gas Station',
    difficulty: 'Medium',
    tags: ['greedy', 'circular'],
    pattern: 'Running surplus with reset',
    summary:
      'Stations on a ring each give some fuel and each leg costs some fuel. Find the starting station that completes the loop, or -1.',
    hook: 'If the tank goes negative, no start up to here works, so restart after this point.',
    real: 'Delivery-route planners pick a start point so a vehicle never runs out of charge along a loop.',
    input: '[[1, 2, 3, 4, 5], [3, 4, 5, 1, 2]]',
    expected: '3',
    cases: [
      { input: '[[2, 3, 4], [3, 4, 3]]', expected: '-1' },
      { input: '[[5], [4]]', expected: '0' },
      { input: '[[5, 1, 2, 3, 4], [4, 4, 1, 5, 1]]', expected: '4' },
    ],
    solutions: [
      {
        label: 'Try every start',
        complexity: 'O(n²)',
        code: `function canCompleteCircuit(gas, cost) {
  const n = gas.length;
  for (let start = 0; start < n; start++) {
    let tank = 0;
    let ok = true;
    for (let step = 0; step < n; step++) {
      const i = (start + step) % n;
      tank += gas[i] - cost[i];
      if (tank < 0) {
        ok = false;
        break;
      }
    }
    if (ok) return start;
  }
  return -1;
}`,
      },
      {
        label: 'Single pass',
        complexity: 'O(n)',
        code: `function canCompleteCircuit(gas, cost) {
  let total = 0;
  let tank = 0;
  let start = 0;
  for (let i = 0; i < gas.length; i++) {
    const d = gas[i] - cost[i];
    total += d;
    tank += d;
    if (tank < 0) {
      start = i + 1;
      tank = 0;
    }
  }
  return total >= 0 ? start : -1;
}`,
      },
    ],
  },
  {
    id: 'partition-labels',
    category: 'heap-greedy',
    lc: 'partition-labels',
    n: 763,
    title: 'Partition Labels',
    difficulty: 'Medium',
    tags: ['greedy', 'string', 'two pointers'],
    pattern: 'Extend to last occurrence',
    summary:
      'Cut a string into as many pieces as possible so that each letter appears in only one piece. Return the piece lengths.',
    hook: 'Track the furthest last-occurrence seen; cut when you reach it.',
    real: 'Sharding a log so that all events for one key stay in a single chunk.',
    input: '["ababcbacadefegdehijhklij"]',
    expected: '[9, 7, 8]',
    cases: [
      { input: '["a"]', expected: '[1]' },
      { input: '["eccbbbbdec"]', expected: '[10]' },
      { input: '["abc"]', expected: '[1, 1, 1]' },
      { input: '[""]', expected: '[]' },
    ],
    solutions: [
      {
        label: 'Rescan for last occurrence',
        complexity: 'O(n²)',
        code: `function partitionLabels(s) {
  const out = [];
  let start = 0;
  let end = 0;
  for (let i = 0; i < s.length; i++) {
    let j = s.length - 1;
    while (s[j] !== s[i]) j--;
    if (j > end) end = j;
    if (i === end) {
      out.push(end - start + 1);
      start = i + 1;
      end = i + 1;
    }
  }
  return out;
}`,
      },
      {
        label: 'Precompute last index',
        complexity: 'O(n)',
        code: `function partitionLabels(s) {
  const last = new Map();
  for (let i = 0; i < s.length; i++) last.set(s[i], i);
  const out = [];
  let start = 0;
  let end = 0;
  for (let i = 0; i < s.length; i++) {
    end = Math.max(end, last.get(s[i]));
    if (i === end) {
      out.push(end - start + 1);
      start = i + 1;
    }
  }
  return out;
}`,
      },
    ],
  },
  {
    id: 'minimum-number-of-arrows-to-burst-balloons',
    category: 'heap-greedy',
    lc: 'minimum-number-of-arrows-to-burst-balloons',
    n: 452,
    title: 'Minimum Number of Arrows to Burst Balloons',
    difficulty: 'Medium',
    tags: ['intervals', 'greedy'],
    pattern: 'Shoot at the earliest end',
    summary:
      'Balloons are horizontal ranges; one vertical arrow pops every balloon whose range contains its x. Find the fewest arrows.',
    hook: 'Aim at the earliest ending balloon edge; it pops everything overlapping that point.',
    real: 'Choosing the fewest checkpoints that cover a set of time windows.',
    input: '[[[10, 16], [2, 8], [1, 6], [7, 12]]]',
    expected: '2',
    cases: [
      { input: '[[[1, 2], [3, 4], [5, 6], [7, 8]]]', expected: '4' },
      { input: '[[[1, 2], [2, 3], [3, 4], [4, 5]]]', expected: '2' },
      { input: '[[]]', expected: '0' },
    ],
    solutions: [
      {
        label: 'Repeatedly shoot the earliest end',
        complexity: 'O(n²)',
        code: `function findMinArrowShots(points) {
  const popped = new Array(points.length).fill(false);
  let arrows = 0;
  while (true) {
    let pick = -1;
    for (let i = 0; i < points.length; i++) {
      if (!popped[i] && (pick === -1 || points[i][1] < points[pick][1])) pick = i;
    }
    if (pick === -1) break;
    const x = points[pick][1];
    arrows++;
    for (let i = 0; i < points.length; i++) {
      if (points[i][0] <= x && x <= points[i][1]) popped[i] = true;
    }
  }
  return arrows;
}`,
      },
      {
        label: 'Sort by end, sweep',
        complexity: 'O(n log n)',
        code: `function findMinArrowShots(points) {
  const a = points.slice();
  a.sort((p, q) => p[1] - q[1]);
  let arrows = 0;
  let x = -Infinity;
  for (const b of a) {
    if (b[0] > x) {
      arrows++;
      x = b[1];
    }
  }
  return arrows;
}`,
      },
    ],
  },
  {
    id: 'queue-reconstruction-by-height',
    category: 'heap-greedy',
    lc: 'queue-reconstruction-by-height',
    n: 406,
    title: 'Queue Reconstruction by Height',
    difficulty: 'Medium',
    tags: ['greedy', 'sorting'],
    pattern: 'Tallest first, insert at index k',
    summary:
      'Each person is [height, count of people in front who are at least as tall]. Rebuild a queue that satisfies everyone.',
    hook: 'Place the tall ones first; shorter people never disturb their counts, so insert at index k.',
    real: 'Layout engines place high-priority items first and slot lower-priority ones around them.',
    input: '[[[7, 0], [4, 4], [7, 1], [5, 0], [6, 1], [5, 2]]]',
    expected: '[[5, 0], [7, 0], [5, 2], [6, 1], [4, 4], [7, 1]]',
    cases: [
      {
        input: '[[[6, 0], [5, 0], [4, 0], [3, 2], [2, 2], [1, 4]]]',
        expected: '[[4, 0], [5, 0], [2, 2], [3, 2], [1, 4], [6, 0]]',
      },
      { input: '[[[1, 0]]]', expected: '[[1, 0]]' },
      { input: '[[]]', expected: '[]' },
    ],
    solutions: [
      {
        label: 'Shortest first into empty slots',
        complexity: 'O(n²)',
        code: `function reconstructQueue(people) {
  const a = people.slice();
  a.sort((p, q) => p[0] - q[0] || q[1] - p[1]);
  const res = new Array(a.length).fill(null);
  for (const p of a) {
    let empty = 0;
    for (let i = 0; i < res.length; i++) {
      if (res[i] === null) {
        if (empty === p[1]) {
          res[i] = p;
          break;
        }
        empty++;
      }
    }
  }
  return res;
}`,
      },
      {
        label: 'Tallest first, insert at k',
        complexity: 'O(n²)',
        code: `function reconstructQueue(people) {
  const a = people.slice();
  a.sort((p, q) => q[0] - p[0] || p[1] - q[1]);
  const res = [];
  for (const p of a) res.splice(p[1], 0, p);
  return res;
}`,
      },
    ],
  },
  {
    id: 'hand-of-straights',
    category: 'heap-greedy',
    lc: 'hand-of-straights',
    n: 846,
    title: 'Hand of Straights',
    difficulty: 'Medium',
    tags: ['heap', 'greedy', 'hash map'],
    pattern: 'Always start from the smallest card',
    summary:
      'Can the cards be split into groups of a given size, each group made of consecutive values?',
    hook: 'The smallest remaining card can only start a group, so build upward from it.',
    real: 'Packing sequential items, like consecutive sequence numbers, into fixed-size batches.',
    input: '[[1, 2, 3, 6, 2, 3, 4, 7, 8], 3]',
    expected: 'true',
    cases: [
      { input: '[[1, 2, 3, 4, 5], 4]', expected: 'false' },
      { input: '[[1, 1, 2, 2, 3, 3], 3]', expected: 'true' },
      { input: '[[], 3]', expected: 'true' },
    ],
    solutions: [
      {
        label: 'Sort, scan for each next card',
        complexity: 'O(n²)',
        code: `function isNStraightHand(hand, groupSize) {
  const n = hand.length;
  if (n % groupSize !== 0) return false;
  const a = hand.slice();
  a.sort((x, y) => x - y);
  const used = new Array(n).fill(false);
  for (let i = 0; i < n; i++) {
    if (used[i]) continue;
    used[i] = true;
    let next = a[i] + 1;
    let len = 1;
    for (let j = i + 1; j < n && len < groupSize; j++) {
      if (!used[j] && a[j] === next) {
        used[j] = true;
        next++;
        len++;
      }
    }
    if (len < groupSize) return false;
  }
  return true;
}`,
      },
      {
        label: 'Counts plus min-heap',
        complexity: 'O(n log n)',
        code:
          HEAP +
          `function smaller(a, b) {
  return a < b;
}

function isNStraightHand(hand, groupSize) {
  if (hand.length % groupSize !== 0) return false;
  const count = new Map();
  const heap = [];
  for (const c of hand) {
    if (!count.has(c)) heapPush(heap, c, smaller);
    count.set(c, (count.get(c) || 0) + 1);
  }
  while (heap.length > 0) {
    const first = heap[0];
    for (let v = first; v < first + groupSize; v++) {
      const c = count.get(v);
      if (!c) return false;
      count.set(v, c - 1);
      if (c - 1 === 0) {
        if (v !== heap[0]) return false;
        heapPop(heap, smaller);
      }
    }
  }
  return true;
}`,
      },
    ],
  },
  {
    id: 'car-pooling',
    category: 'heap-greedy',
    lc: 'car-pooling',
    n: 1094,
    title: 'Car Pooling',
    difficulty: 'Medium',
    tags: ['heap', 'intervals', 'sorting'],
    pattern: 'Sweep with min-heap of drop-offs',
    summary:
      'Trips are [passengers, pickup, dropoff]. Decide whether a car with the given capacity can serve them all.',
    hook: 'Sort by pickup; before boarding, drop everyone whose stop has been reached.',
    real: 'Ride-sharing and bus planners check that load never exceeds capacity along a route.',
    input: '[[[2, 1, 5], [3, 3, 7]], 4]',
    expected: 'false',
    cases: [
      { input: '[[[2, 1, 5], [3, 5, 7]], 3]', expected: 'true' },
      { input: '[[[3, 2, 7], [3, 7, 9], [8, 3, 9]], 11]', expected: 'true' },
      { input: '[[], 1]', expected: 'true' },
    ],
    solutions: [
      {
        label: 'Load at every pickup',
        complexity: 'O(n²)',
        code: `function carPooling(trips, capacity) {
  for (const t of trips) {
    let load = 0;
    for (const o of trips) {
      if (o[1] <= t[1] && t[1] < o[2]) load += o[0];
    }
    if (load > capacity) return false;
  }
  return true;
}`,
      },
      {
        label: 'Sort and drop-off heap',
        complexity: 'O(n log n)',
        code:
          HEAP +
          `function earlierStop(a, b) {
  return a[0] < b[0];
}

function carPooling(trips, capacity) {
  const a = trips.slice();
  a.sort((x, y) => x[1] - y[1]);
  const heap = [];
  let load = 0;
  for (const t of a) {
    while (heap.length > 0 && heap[0][0] <= t[1]) {
      load -= heapPop(heap, earlierStop)[1];
    }
    load += t[0];
    heapPush(heap, [t[2], t[0]], earlierStop);
    if (load > capacity) return false;
  }
  return true;
}`,
      },
    ],
  },
  {
    id: 'minimum-cost-to-connect-sticks',
    category: 'heap-greedy',
    lc: 'minimum-cost-to-connect-sticks',
    n: 1167,
    title: 'Minimum Cost to Connect Sticks',
    difficulty: 'Medium',
    tags: ['heap', 'greedy'],
    pattern: 'Merge two smallest repeatedly',
    summary:
      'Joining two sticks costs the sum of their lengths. Find the cheapest way to end up with a single stick.',
    hook: 'Always join the two shortest; pay small sums early so they are not re-paid many times.',
    real: 'Huffman coding and optimal file-merge plans combine the two cheapest pieces first.',
    input: '[[2, 4, 3]]',
    expected: '14',
    cases: [
      { input: '[[1, 8, 3, 5]]', expected: '30' },
      { input: '[[5]]', expected: '0' },
      { input: '[[]]', expected: '0' },
    ],
    scale: {
      sizes: [50, 100, 200],
      make: (n) => JSON.stringify([Array.from({ length: n }, (_, i) => ((i * 31) % 47) + 1)]),
    },
    solutions: [
      {
        label: 'Scan for the two smallest',
        complexity: 'O(n²)',
        code: `function takeMin(a) {
  let best = 0;
  for (let i = 1; i < a.length; i++) {
    if (a[i] < a[best]) best = i;
  }
  return a.splice(best, 1)[0];
}

function connectSticks(sticks) {
  const a = sticks.slice();
  let cost = 0;
  while (a.length > 1) {
    const x = takeMin(a);
    const y = takeMin(a);
    cost += x + y;
    a.push(x + y);
  }
  return cost;
}`,
      },
      {
        label: 'Min-heap',
        complexity: 'O(n log n)',
        code:
          HEAP +
          `function smaller(a, b) {
  return a < b;
}

function connectSticks(sticks) {
  const heap = [];
  for (const s of sticks) heapPush(heap, s, smaller);
  let cost = 0;
  while (heap.length > 1) {
    const x = heapPop(heap, smaller);
    const y = heapPop(heap, smaller);
    cost += x + y;
    heapPush(heap, x + y, smaller);
  }
  return cost;
}`,
      },
    ],
  },
  {
    id: 'maximum-units-on-a-truck',
    category: 'heap-greedy',
    lc: 'maximum-units-on-a-truck',
    n: 1710,
    title: 'Maximum Units on a Truck',
    difficulty: 'Easy',
    tags: ['greedy', 'sorting'],
    pattern: 'Best value per box first',
    summary:
      'Box types are [count, units per box]. Fill a truck with a limited number of boxes to carry the most units.',
    hook: 'Fill the truck with the most valuable boxes first.',
    real: 'Loading logistics pick the highest-value items per slot until capacity runs out.',
    input: '[[[1, 3], [2, 2], [3, 1]], 4]',
    expected: '8',
    cases: [
      { input: '[[[5, 10], [2, 5], [4, 7], [3, 9]], 10]', expected: '91' },
      { input: '[[], 5]', expected: '0' },
      { input: '[[[1, 1]], 5]', expected: '1' },
    ],
    solutions: [
      {
        label: 'Repeatedly pick the best type',
        complexity: 'O(n²)',
        code: `function maximumUnits(boxTypes, truckSize) {
  const used = new Array(boxTypes.length).fill(false);
  let room = truckSize;
  let units = 0;
  while (room > 0) {
    let best = -1;
    for (let i = 0; i < boxTypes.length; i++) {
      if (!used[i] && (best === -1 || boxTypes[i][1] > boxTypes[best][1])) best = i;
    }
    if (best === -1) break;
    used[best] = true;
    const take = Math.min(room, boxTypes[best][0]);
    units += take * boxTypes[best][1];
    room -= take;
  }
  return units;
}`,
      },
      {
        label: 'Sort by units',
        complexity: 'O(n log n)',
        code: `function maximumUnits(boxTypes, truckSize) {
  const a = boxTypes.slice();
  a.sort((p, q) => q[1] - p[1]);
  let room = truckSize;
  let units = 0;
  for (const b of a) {
    if (room === 0) break;
    const take = Math.min(room, b[0]);
    units += take * b[1];
    room -= take;
  }
  return units;
}`,
      },
    ],
  },
  {
    id: 'two-city-scheduling',
    category: 'heap-greedy',
    lc: 'two-city-scheduling',
    n: 1029,
    title: 'Two City Scheduling',
    difficulty: 'Medium',
    tags: ['greedy', 'sorting'],
    pattern: 'Sort by cost difference',
    summary:
      'Send half the people to city A and half to city B, with a cost for each choice. Find the cheapest total.',
    hook: 'Sort by how much cheaper A is than B; the extremes go to their natural city.',
    real: 'Splitting workloads between two data centers by comparing the relative cost of each placement.',
    input: '[[[10, 20], [30, 200], [400, 50], [30, 20]]]',
    expected: '110',
    cases: [
      {
        input: '[[[259, 770], [448, 54], [926, 667], [184, 139], [840, 118], [577, 469]]]',
        expected: '1859',
      },
      { input: '[[[1, 2], [3, 1]]]', expected: '2' },
      { input: '[[]]', expected: '0' },
    ],
    solutions: [
      {
        label: 'Try every split',
        complexity: 'O(2ⁿ)',
        code: `function go(costs, i, a, b) {
  if (i === costs.length) return 0;
  let best = Infinity;
  if (a > 0) best = Math.min(best, costs[i][0] + go(costs, i + 1, a - 1, b));
  if (b > 0) best = Math.min(best, costs[i][1] + go(costs, i + 1, a, b - 1));
  return best;
}

function twoCitySchedCost(costs) {
  const half = costs.length / 2;
  return go(costs, 0, half, half);
}`,
      },
      {
        label: 'Sort by difference',
        complexity: 'O(n log n)',
        code: `function twoCitySchedCost(costs) {
  const a = costs.slice();
  a.sort((p, q) => p[0] - p[1] - (q[0] - q[1]));
  const half = a.length / 2;
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += i < half ? a[i][0] : a[i][1];
  }
  return total;
}`,
      },
    ],
  },
  {
    id: 'merge-k-sorted-arrays',
    category: 'heap-greedy',
    title: 'Merge K Sorted Arrays',
    difficulty: 'Medium',
    tags: ['heap', 'merge'],
    pattern: 'K-way merge with min-heap',
    summary: 'Combine several already-sorted arrays into a single sorted array.',
    hook: 'The heap holds one candidate per array; pop the smallest, then refill from its array.',
    real: 'Databases merge sorted runs from disk, and log aggregators merge sorted streams from many servers.',
    input: '[[[1, 4, 5], [1, 3, 4], [2, 6]]]',
    expected: '[1, 1, 2, 3, 4, 4, 5, 6]',
    cases: [
      { input: '[[]]', expected: '[]' },
      { input: '[[[], [1]]]', expected: '[1]' },
      { input: '[[[5], [1], [3]]]', expected: '[1, 3, 5]' },
    ],
    scale: {
      sizes: [1, 2, 4],
      make: (n) =>
        JSON.stringify([
          Array.from({ length: 200 }, (_, a) => Array.from({ length: n }, (_, j) => j * 200 + a)),
        ]),
    },
    solutions: [
      {
        label: 'Scan every head each step',
        complexity: 'O(N·k)',
        code: `function mergeKSorted(arrays) {
  const pos = new Array(arrays.length).fill(0);
  const out = [];
  while (true) {
    let pick = -1;
    for (let i = 0; i < arrays.length; i++) {
      if (pos[i] < arrays[i].length && (pick === -1 || arrays[i][pos[i]] < arrays[pick][pos[pick]])) pick = i;
    }
    if (pick === -1) break;
    out.push(arrays[pick][pos[pick]]);
    pos[pick]++;
  }
  return out;
}`,
      },
      {
        label: 'Min-heap of heads',
        complexity: 'O(N log k)',
        code:
          HEAP +
          `function headFirst(a, b) {
  if (a[0] !== b[0]) return a[0] < b[0];
  return a[1] < b[1];
}

function mergeKSorted(arrays) {
  const heap = [];
  for (let i = 0; i < arrays.length; i++) {
    if (arrays[i].length > 0) heapPush(heap, [arrays[i][0], i, 0], headFirst);
  }
  const out = [];
  while (heap.length > 0) {
    const top = heapPop(heap, headFirst);
    out.push(top[0]);
    const next = top[2] + 1;
    if (next < arrays[top[1]].length) heapPush(heap, [arrays[top[1]][next], top[1], next], headFirst);
  }
  return out;
}`,
      },
    ],
  },
];
